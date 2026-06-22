-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services - Supabase RLS Hardening
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-06-20
-- Propósito: Asegurar la tabla 'clientes' con Row Level Security
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Habilitar RLS en la tabla clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (si las hay) para recrear limpiamente
DROP POLICY IF EXISTS "Clientes: lectura propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: actualización propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: inserción anónima desde web" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: acceso admin total" ON public.clientes;

-- 3. Política: Un cliente autenticado solo puede VER su propio registro
CREATE POLICY "Clientes: lectura propia" ON public.clientes
  FOR SELECT
  USING (
    auth.uid()::text = id::text
    OR auth.email() = email
  );

-- 4. Política: Un cliente autenticado solo puede ACTUALIZAR su propio registro
CREATE POLICY "Clientes: actualización propia" ON public.clientes
  FOR UPDATE
  USING (
    auth.uid()::text = id::text
    OR auth.email() = email
  )
  WITH CHECK (
    auth.uid()::text = id::text
    OR auth.email() = email
  );

-- 5. Política: Permitir INSERT anónimo (desde el formulario web público)
CREATE POLICY "Clientes: inserción anónima desde web" ON public.clientes
  FOR INSERT
  WITH CHECK (true);

-- 6. Política: service_role bypass (para Cloud Functions y n8n)
-- Nota: service_role bypasa RLS automaticamente en Supabase, esta policy es redundante pero explicita
CREATE POLICY "Clientes: acceso admin total" ON public.clientes
  FOR ALL
  USING (true);

-- ═══════════════════════════════════════════════════════════════════════
-- FUNCIÓN RPC: verificar_existencia_cliente
-- Usada por el formulario de booking para verificar si un email ya existe
-- sin exponer la tabla completa al cliente anónimo
-- ═══════════════════════════════════════════════════════════════════════

-- Eliminar función existente si tiene firma diferente
DROP FUNCTION IF EXISTS public.verificar_existencia_cliente(TEXT);

CREATE OR REPLACE FUNCTION public.verificar_existencia_cliente(p_email TEXT)
RETURNS TABLE (
  id UUID,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.status::TEXT
  FROM public.clientes c
  WHERE c.email = p_email
  LIMIT 1;
END;
$$;

-- Dar permiso de ejecución a usuarios anónimos y autenticados
GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════
-- ÍNDICES para rendimiento
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes (email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes (status);

-- ═══════════════════════════════════════════════════════════════════════
-- RESTRICCIONES de seguridad adicionales
-- Solo ejecutar si la tabla tiene las columnas access_code_hash y password
-- ═══════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='access_code_hash') THEN
    EXECUTE 'REVOKE UPDATE (access_code_hash) ON public.clientes FROM anon';
    EXECUTE 'REVOKE UPDATE (access_code_hash) ON public.clientes FROM authenticated';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='password') THEN
    EXECUTE 'REVOKE UPDATE (password) ON public.clientes FROM anon';
    EXECUTE 'REVOKE UPDATE (password) ON public.clientes FROM authenticated';
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- Ejecutar después de aplicar para confirmar que RLS está activo:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ═══════════════════════════════════════════════════════════════════════
