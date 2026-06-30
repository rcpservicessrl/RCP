-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Sesión 2: Eliminar admin fantasma
-- Ejecutar en: Supabase Dashboard > SQL Editor
--   (después de 04_cleanup_graveyard.sql)
--
-- Problema:
--   El email 'admin@rcp.services' fue seeded en user_roles como super_admin,
--   pero NO tiene un usuario real en auth.users. Es un artefacto del legacy
--   frontend que hardcodeaba credenciales. Cualquiera que conociera ese email
--   podía explotar el fallback del portal para obtener rol super_admin.
--
-- Solución:
--   Eliminar 'admin@rcp.services' de user_roles. El único super_admin real
--   es 'rcpservicessrl@gmail.com' (usuario registrado en Supabase Auth).
--
-- Resultado esperado:
--   Solo 'rcpservicessrl@gmail.com' con rol super_admin en user_roles.
--   Cualquier intento de login con 'admin@rcp.services' fallará en
--   Supabase Auth (no existe) y el RPC get_user_role devolvería 'client'.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- Auditar la eliminación antes de ejecutarla
INSERT INTO public.rbac_audit_log (actor_email, target_email, entity, action, payload)
VALUES (
  'rcpservicessrl@gmail.com',
  'admin@rcp.services',
  'user_role',
  'revoke',
  jsonb_build_object(
    'reason', 'Phantom admin: no auth.users entry. Security hardening Session 2.',
    'role_slug', 'super_admin'
  )
);

-- Eliminar el admin fantasma
DELETE FROM public.user_roles
WHERE email = 'admin@rcp.services';

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
--
--   SELECT email, r.slug FROM public.user_roles ur
--   JOIN public.roles r ON r.id = ur.role_id
--   WHERE r.slug IN ('super_admin', 'admin')
--   ORDER BY ur.granted_at;
--     -- Debe retornar SOLO: rcpservicessrl@gmail.com | super_admin
--
--   SELECT public.effective_role('admin@rcp.services');
--     -- Debe retornar: 'client'
--
--   SELECT public.effective_role('rcpservicessrl@gmail.com');
--     -- Debe retornar: 'super_admin'
-- ═══════════════════════════════════════════════════════════════════════
