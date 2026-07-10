-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Fase 4: Migración para Expansión de Tienda
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. Ampliación de Tabla: productos
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.productos 
  ADD COLUMN IF NOT EXISTS precio_inicial NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS precio_recurrente NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS frecuencia_recurrente TEXT,
  ADD COLUMN IF NOT EXISTS imagenes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS especificaciones JSONB DEFAULT '{}';

-- ───────────────────────────────────────────────────────────────────────
-- 2. Creación de Tabla: cupones
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cupones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descuento_porcentaje NUMERIC CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
  descuento_monto NUMERIC CHECK (descuento_monto >= 0),
  fecha_expiracion TIMESTAMPTZ,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para velocidad de búsqueda en checkout y cupones activos
CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON public.cupones (codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_activo ON public.cupones (activo) WHERE activo = true;

-- ───────────────────────────────────────────────────────────────────────
-- 3. Hardening RLS: productos
-- ───────────────────────────────────────────────────────────────────────
-- Permitir que administradores vean productos inactivos y lectura pública para el resto
DROP POLICY IF EXISTS "productos_public_read" ON public.productos;
CREATE POLICY "productos_public_read" ON public.productos
  FOR SELECT USING (is_active = true OR (auth.email() IS NOT NULL AND public.is_rcp_admin()));

-- Políticas de escritura basadas en permisos RBAC (tienda.write)
DROP POLICY IF EXISTS "productos_admin_write" ON public.productos;
CREATE POLICY "productos_admin_write" ON public.productos
  FOR ALL
  TO authenticated
  USING (public.has_permission(auth.email(), 'tienda.write'))
  WITH CHECK (public.has_permission(auth.email(), 'tienda.write'));

-- ───────────────────────────────────────────────────────────────────────
-- 4. Hardening RLS: cupones
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.cupones ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede consultar cupones vigentes y activos
DROP POLICY IF EXISTS "cupones_public_read" ON public.cupones;
CREATE POLICY "cupones_public_read" ON public.cupones
  FOR SELECT
  USING (activo = true AND (fecha_expiracion IS NULL OR fecha_expiracion > now()));

-- Escritura restringida: sólo administradores/editores con tienda.write
DROP POLICY IF EXISTS "cupones_admin_write" ON public.cupones;
CREATE POLICY "cupones_admin_write" ON public.cupones
  FOR ALL
  TO authenticated
  USING (public.has_permission(auth.email(), 'tienda.write'))
  WITH CHECK (public.has_permission(auth.email(), 'tienda.write'));

-- ───────────────────────────────────────────────────────────────────────
-- 5. Creación de Bucket de Storage y Políticas RLS
-- ───────────────────────────────────────────────────────────────────────
-- Asegurar que existe el bucket público 'productos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Lectura Pública en Storage
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects
  FOR SELECT USING (bucket_id = 'productos');

-- Políticas de Escritura Admin en Storage (restringido a media.write)
DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
CREATE POLICY "Admin Storage Insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'productos' AND public.has_permission(auth.email(), 'media.write'));

DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
CREATE POLICY "Admin Storage Update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'productos' AND public.has_permission(auth.email(), 'media.write'))
  WITH CHECK (bucket_id = 'productos' AND public.has_permission(auth.email(), 'media.write'));

DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
CREATE POLICY "Admin Storage Delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'productos' AND public.has_permission(auth.email(), 'media.write'));

COMMIT;
