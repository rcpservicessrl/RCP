-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Fase 4: Limpieza del cementerio (graveyard cleanup)
-- Ejecutar en: Supabase Dashboard > SQL Editor
--   (después de 01, 02, 03)
--
-- Este script elimina policies huérfanas/duplicadas/peligrosas y una función
-- RPC obsoleta que coleccionaron en la DB con el tiempo. Es DESTRUCTIVO pero
-- idempotente (DROP ... IF EXISTS).
--
-- Problemas que resuelve:
--   1. `clientes` tenía 17 policies (debería tener 4). Las peligrosas:
--      - "Allow all operations with anon key" (qual=true, with_check=true)
--        → anulaba TODO el RLS. Cualquiera en internet podía CRUD de clientes.
--      - "Enable anonymous inserts for leads" (with_check=true)
--        → insert anónimo sin validación.
--      - "Enable anonymous select/updates" durante registro.
--      - Duplicadas con emails hardcoded (director@miempresa.com...).
--      - 2 con encoding corrupto (Ã³).
--   2. `login_cliente_seguro(p_email, p_password)` — concedida a PUBLIC/anon,
--      SECURITY DEFINER, remanente del auth pre-Supabase. No referenciada en
--      ningún archivo del repo. Vulnerabilidad activa.
--
-- CONSERVA: las 4 policies de 01_security_hardening.sql (admin-or-self).
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. DROP de las 13 policies sobrantes en `clientes`
--    Conservamos SOLO las 4 de 01_security_hardening.sql:
--      "Clientes: lectura propia o admin"          (SELECT)
--      "Clientes: inserción validada"              (INSERT)
--      "Clientes: actualización propia o admin"    (UPDATE)
--      "Clientes: eliminación propia o admin"      (DELETE)
-- ───────────────────────────────────────────────────────────────────────

-- 🔴 CRÍTICA: anulaba todo el RLS (qual=true, with_check=true)
DROP POLICY IF EXISTS "Allow all operations with anon key" ON public.clientes;

-- 🔴 insert anónimo sin validación
DROP POLICY IF EXISTS "Enable anonymous inserts for leads" ON public.clientes;

-- 🟡 acceso anónimo select/update durante registro
DROP POLICY IF EXISTS "Enable anonymous select restricted" ON public.clientes;
DROP POLICY IF EXISTS "Enable anonymous updates during registration" ON public.clientes;

-- 🟡 duplicadas con emails hardcoded (ya reemplazadas por RBAC is_rcp_admin)
DROP POLICY IF EXISTS "Admins have full CRUD access" ON public.clientes;
DROP POLICY IF EXISTS "Admins have full access" ON public.clientes;

-- 🟡 duplicadas de lectura propia (reemplazadas por "Clientes: lectura propia o admin")
DROP POLICY IF EXISTS "Clients can read own data" ON public.clientes;
DROP POLICY IF EXISTS "Clients can select own record" ON public.clientes;

-- 🟡 duplicadas de actualización propia (reemplazadas por "Clientes: actualización propia o admin")
DROP POLICY IF EXISTS "Clients can update own profile" ON public.clientes;
DROP POLICY IF EXISTS "Clients can update own record" ON public.clientes;

-- 🟡 versiones con encoding corrupto (duplicados de las 4 buenas)
-- Estos nombres contienen caracteres mojibake (Ã³ en lugar de ó). Se dropean
-- usando el string literal exacto que devuelve pg_policies. NOTA: PostgreSQL
-- compara el nombre por valor, así que el mojibake debe coincidir byte a byte.
-- Si el DROP de estos fallara, no es crítico (las 4 buenas igual conviven),
-- pero conviene limpiarlos.
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='clientes'
      AND policyname LIKE 'Clientes:%'      -- nombres en español (incluye mojibake)
      AND policyname !~* 'lectura propia o admin|inserci.n validada|actualizaci.n propia o admin|eliminaci.n propia o admin'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clientes', p.policyname);
    RAISE NOTICE 'Dropped legacy/mojibake policy: %', p.policyname;
  END LOOP;
END $$;

-- ───────────────────────────────────────────────────────────────────────
-- 2. DROP de la función RPC obsoleta y vulnerable
--    login_cliente_seguro(p_email, p_password) aceptaba password en texto
--    plano, era SECURITY DEFINER y estaba concedida a PUBLIC/anon. Remanente
--    del auth pre-Supabase. No referenciada en ningún archivo del repo.
-- ───────────────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.login_cliente_seguro(TEXT, TEXT);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
--
--   -- `clientes` debe tener EXACTAMENTE 4 policies:
--   SELECT policyname, cmd FROM pg_policies
--   WHERE schemaname='public' AND tablename='clientes'
--   ORDER BY cmd;
--     -- Esperado:
--     --   Clientes: actualización propia o admin  UPDATE
--     --   Clientes: eliminación propia o admin    DELETE
--     --   Clientes: inserción validada            INSERT
--     --   Clientes: lectura propia o admin        SELECT
--
--   -- Conteo total de policies por tabla (clientes debe ser 4):
--   SELECT tablename, COUNT(*) FROM pg_policies
--   WHERE schemaname='public' GROUP BY tablename ORDER BY COUNT(*) DESC;
--
--   -- login_cliente_seguro ya NO debe aparecer:
--   SELECT proname FROM pg_proc
--   WHERE proname='login_cliente_seguro';
--     -- Esperado: 0 filas
-- ═══════════════════════════════════════════════════════════════════════
