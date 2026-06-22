-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services - Supabase RLS Hardening
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- NOTA: La tabla 'clientes' ya debe existir antes de ejecutar esto
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Habilitar RLS en la tabla clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (si las hay) para recrear limpiamente
DROP POLICY IF EXISTS "Clientes: lectura propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: actualización propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: inserción anónima desde web" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: acceso admin total" ON public.clientes;
DROP POLICY IF EXISTS "Allow public insert for bookings" ON public.clientes;

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

-- ═══════════════════════════════════════════════════════════════════════
-- FUNCIÓN RPC: verificar_existencia_cliente
-- ═══════════════════════════════════════════════════════════════════════
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

GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ═══════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes (email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes (status);
