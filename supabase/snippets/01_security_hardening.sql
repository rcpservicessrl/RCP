-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Fase 1B: Endurecimiento de Seguridad
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Este script:
--   1. Reemplaza el peligroso WITH CHECK (true) con validación real
--   2. Agrega política DELETE faltante
--   3. Habilita acceso admin vía función is_admin() (verifica email en auth)
--   4. Crea la función RPC get_user_role() que usa el portal.html
--   5. Crea la función RPC is_rcp_admin() para uso en políticas RLS
--   6. Elimina la columna password de clientes (las passwords viven en auth.users)
--
-- PRE-REQUISITO: Crear el usuario admin@rcp.services en:
--   Supabase Dashboard > Authentication > Users > Add user
--   (marcar "Auto Confirm User")
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 0. Asegurar que RLS está activado
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- ───────────────────────────────────────────────────────────────────────
-- 1. Función helper: ¿es admin de RCP?
--    Verifica si el email del usuario autenticado está en la lista de admins.
--    Esta lista se mueve a la tabla user_roles en la Fase 2 (02_rbac_schema.sql).
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_rcp_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    auth.email() IN ('admin@rcp.services', 'rcpservicessrl@gmail.com'),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_rcp_admin() TO authenticated;

-- ───────────────────────────────────────────────────────────────────────
-- 2. Función RPC: get_user_role(p_email)
--    Retorna el rol del usuario. Usada por portal.html y dashboard.html.
--    En la Fase 2 consulta la tabla user_roles; por ahora usa is_rcp_admin().
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_role(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Fase 2: intentar leer desde la tabla user_roles si existe
  BEGIN
    SELECT r.slug INTO v_role
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.email = p_email
    ORDER BY r.priority DESC
    LIMIT 1;
  EXCEPTION WHEN undefined_table THEN
    v_role := NULL;
  END;

  IF v_role IS NOT NULL THEN
    RETURN v_role;
  END IF;

  -- Fallback Fase 1: verificar por email
  IF p_email IN ('admin@rcp.services', 'rcpservicessrl@gmail.com') THEN
    RETURN 'super_admin';
  END IF;

  RETURN 'client';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO authenticated;

-- ───────────────────────────────────────────────────────────────────────
-- 3. Eliminar TODAS las políticas existentes para recrear de forma limpia
--    (incluye los nombres nuevos que crea este mismo script, para idempotencia)
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Clientes: lectura propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: actualización propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: inserción anónima desde web" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: eliminación propia" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: acceso admin total" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: inserción admin" ON public.clientes;
DROP POLICY IF EXISTS "Allow public insert for bookings" ON public.clientes;
-- Nombres creados por este script (para re-ejecuciones seguras):
DROP POLICY IF EXISTS "Clientes: lectura propia o admin" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: inserción validada" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: actualización propia o admin" ON public.clientes;
DROP POLICY IF EXISTS "Clientes: eliminación propia o admin" ON public.clientes;

-- ───────────────────────────────────────────────────────────────────────
-- 4. Política SELECT: cliente ve SU registro; admin ve TODOS
-- ───────────────────────────────────────────────────────────────────────
CREATE POLICY "Clientes: lectura propia o admin" ON public.clientes
  FOR SELECT
  USING (
    public.is_rcp_admin()
    OR auth.uid()::text = id::text
    OR auth.email() = email
  );

-- ───────────────────────────────────────────────────────────────────────
-- 5. Política INSERT: validación REAL (reemplaza el peligroso WITH CHECK (true))
--    Un usuario puede insertar SU propio registro.
--    Un admin puede insertar cualquier registro.
--    Validación: email debe estar presente y con formato válido.
-- ───────────────────────────────────────────────────────────────────────
CREATE POLICY "Clientes: inserción validada" ON public.clientes
  FOR INSERT
  WITH CHECK (
    public.is_rcp_admin()
    OR (
      email IS NOT NULL
      AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
      AND (
        auth.email() = email
        OR auth.uid() IS NULL  -- registro público inicial (booking/landing)
      )
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 6. Política UPDATE: cliente actualiza SU registro; admin actualiza TODOS
-- ───────────────────────────────────────────────────────────────────────
CREATE POLICY "Clientes: actualización propia o admin" ON public.clientes
  FOR UPDATE
  USING (
    public.is_rcp_admin()
    OR auth.uid()::text = id::text
    OR auth.email() = email
  )
  WITH CHECK (
    public.is_rcp_admin()
    OR auth.uid()::text = id::text
    OR auth.email() = email
  );

-- ───────────────────────────────────────────────────────────────────────
-- 7. Política DELETE: cliente elimina SU registro; admin elimina TODOS
--    (Política que FALTABA completamente en la versión anterior)
-- ───────────────────────────────────────────────────────────────────────
CREATE POLICY "Clientes: eliminación propia o admin" ON public.clientes
  FOR DELETE
  USING (
    public.is_rcp_admin()
    OR auth.uid()::text = id::text
    OR auth.email() = email
  );

-- ───────────────────────────────────────────────────────────────────────
-- 8. Eliminar la columna password de clientes (si existe)
--    Las passwords ahora viven en auth.users (bcrypt, gestionado por Supabase).
--    Esto es seguro porque:
--      - auth.users.password_hash almacena el bcrypt
--      - clientes.password ya no se consulta (portal.html usa signInWithPassword)
-- ───────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'clientes'
      AND column_name = 'password'
  ) THEN
    ALTER TABLE public.clientes DROP COLUMN password;
    RAISE NOTICE 'Columna password eliminada de clientes (migrada a auth.users).';
  ELSE
    RAISE NOTICE 'La columna password no existe en clientes (ya migrada).';
  END IF;
END $$;

-- ───────────────────────────────────────────────────────────────────────
-- 9. Mantener la función verificar_existencia_cliente (compatible)
-- ───────────────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.verificar_existencia_cliente(TEXT);

CREATE OR REPLACE FUNCTION public.verificar_existencia_cliente(p_email TEXT)
RETURNS TABLE (
  id UUID,
  status TEXT,
  owner_name TEXT,
  company_name TEXT,
  access_code TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.status::TEXT, c.owner_name, c.company_name, c.access_code
  FROM public.clientes c
  WHERE c.email = p_email
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verificar_existencia_cliente(TEXT) TO authenticated;

-- ───────────────────────────────────────────────────────────────────────
-- 10. Índices para rendimiento
-- ───────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes (email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes (status);

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
-- Ejecuta estas queries en el SQL Editor para confirmar que todo quedó bien:
--
--   SELECT proname FROM pg_proc WHERE proname IN
--     ('is_rcp_admin', 'get_user_role', 'verificar_existencia_cliente');
--     -- Debe retornar 3 filas
--
--   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'clientes'
--   ORDER BY cmd;
--     -- Debe mostrar: SELECT, INSERT, UPDATE, DELETE (4 políticas)
--
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'clientes' AND column_name = 'password';
--     -- Debe retornar 0 filas (columna eliminada)
-- ═══════════════════════════════════════════════════════════════════════
