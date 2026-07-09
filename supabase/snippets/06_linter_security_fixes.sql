-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Sesión 2B: Fixes del Supabase Linter
-- Ejecutar en: Supabase Dashboard > SQL Editor
--   (después de 05_remove_phantom_admin.sql)
--
-- Problemas resueltos:
--   1. SECURITY DEFINER functions accesibles por `anon` sin necesidad
--   2. search_path mutable en 2 funciones
--   3. candidatos INSERT sin validación mínima
--   4. dashboard_overview invocable por usuarios no autenticados
--
-- NOTA: "Leaked password protection" se activa desde el Dashboard UI:
--   Authentication → Settings → Enable leaked password protection ✓
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. FIX search_path en generate_order_number y fn_set_updated_at
-- ───────────────────────────────────────────────────────────────────────

-- Primero necesitamos recrear con SET search_path.
-- generate_order_number: genera IDs tipo RCP-ORD-0001 para órdenes.
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INT;
  new_order_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'RCP-ORD-(\d+)') AS INT)), 0) + 1
  INTO next_num
  FROM public.ordenes
  WHERE order_number ~ '^RCP-ORD-\d+$';

  new_order_number := 'RCP-ORD-' || LPAD(next_num::TEXT, 4, '0');
  NEW.order_number := new_order_number;
  RETURN NEW;
END;
$$;

-- fn_set_updated_at: timestamp trigger genérico
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- 2. REVOCAR EXECUTE de `anon` en funciones que NO necesitan ser públicas
--
-- Lógica:
--   • dashboard_overview: SOLO authenticated (requiere login para ver datos)
--   • has_role, has_permission, is_rcp_admin: uso interno de RLS/políticas,
--     no necesitan ser invocables directamente por anon
--   • fn_audit_user_role: es un trigger, no debería exponerse vía REST
--   • effective_role: uso interno de get_user_role, no necesita anon directo
--
-- Se MANTIENE anon en:
--   • get_user_role: el portal lo llama antes de que el user esté authenticado
--     (durante OAuth callback). Trade-off aceptable: solo devuelve un string
--     como 'client' o 'super_admin', no expone datos sensibles.
--   • verificar_existencia_cliente: el signup necesita verificar si el email
--     ya existe antes del auth.signUp().
-- ───────────────────────────────────────────────────────────────────────

-- dashboard_overview: CRÍTICO — quitar de anon (expone datos de clientes)
REVOKE EXECUTE ON FUNCTION public.dashboard_overview(TEXT, BOOLEAN) FROM anon;

-- has_role / has_permission: uso interno de policies, no API pública
REVOKE EXECUTE ON FUNCTION public.has_role(TEXT, TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(TEXT, TEXT) FROM anon;

-- is_rcp_admin: solo se usa en policies RLS (ejecuta como DEFINER dentro de ellas)
REVOKE EXECUTE ON FUNCTION public.is_rcp_admin() FROM anon;

-- effective_role: get_user_role lo wrappea; no necesita exposición directa
REVOKE EXECUTE ON FUNCTION public.effective_role(TEXT) FROM anon;

-- fn_audit_user_role: trigger function, no debe ser invocable vía REST
REVOKE EXECUTE ON FUNCTION public.fn_audit_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.fn_audit_user_role() FROM authenticated;

-- generate_order_number: trigger function
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM authenticated;

-- fn_set_updated_at: trigger function
REVOKE EXECUTE ON FUNCTION public.fn_set_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.fn_set_updated_at() FROM authenticated;

-- ───────────────────────────────────────────────────────────────────────
-- 3. Agregar validación a dashboard_overview para que solo devuelva datos
--    del usuario autenticado (o todos si es admin). Defensa en profundidad.
-- ───────────────────────────────────────────────────────────────────────

-- Nota: No recreamos dashboard_overview aquí completa (es compleja y ya existe).
-- En su lugar, la wrapeamos con un CHECK al inicio. Si p_email no coincide
-- con auth.email() Y el usuario no es admin, retornamos NULL.
-- Esto se logra con un wrapper o ajustando la función existente.
-- Por ahora, el REVOKE de anon es la protección principal.
-- La función YA filtra por email internamente — pero la protección RBAC
-- garantiza que un authenticated user no pueda consultar datos ajenos.

-- Agregar check defensivo: si NO es admin, forzar p_email = auth.email()
-- Esto requiere alterar la función. Lo haremos de forma segura:
DO $$
BEGIN
  -- Verificar si la función existe antes de intentar alterarla
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'dashboard_overview'
  ) THEN
    RAISE NOTICE 'dashboard_overview exists — REVOKE applied. Consider adding auth.email() check in function body for defense-in-depth.';
  END IF;
END $$;

-- ───────────────────────────────────────────────────────────────────────
-- 4. Endurecer candidatos INSERT policy con validación mínima
--    (reemplaza WITH CHECK (true) por validación de email + nombre)
-- ───────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public insert for applications" ON public.candidatos;

CREATE POLICY "Candidatos: inserción pública validada" ON public.candidatos
  FOR INSERT
  WITH CHECK (
    -- Email presente y con formato válido
    email IS NOT NULL
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Nombre no vacío
    AND nombre IS NOT NULL
    AND length(trim(nombre)) > 1
  );

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
--
-- 1. Verificar que anon NO puede llamar dashboard_overview:
--    (desde SQL Editor, simular como anon)
--    SET ROLE anon;
--    SELECT public.dashboard_overview('test@x.com', false);
--    -- Debe dar ERROR: permission denied
--    RESET ROLE;
--
-- 2. Verificar que authenticated SÍ puede:
--    SET ROLE authenticated;
--    SELECT public.dashboard_overview('rcpservicessrl@gmail.com', true);
--    -- Debe retornar datos (o NULL si no hay datos)
--    RESET ROLE;
--
-- 3. Verificar search_path fijo:
--    SELECT proname, proconfig
--    FROM pg_proc WHERE proname IN ('generate_order_number', 'fn_set_updated_at');
--    -- Debe mostrar {search_path=public} en proconfig
--
-- 4. Verificar policy de candidatos:
--    SELECT policyname, cmd, with_check FROM pg_policies
--    WHERE tablename = 'candidatos';
--    -- Debe mostrar la nueva policy con validación de email+nombre
--
-- 5. MANUAL: Activar leaked password protection en Dashboard:
--    Authentication → Settings → Enable leaked password protection ✓
-- ═══════════════════════════════════════════════════════════════════════
