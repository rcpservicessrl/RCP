-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Fase 2: Esquema RBAC (Role-Based Access Control)
-- Ejecutar en: Supabase Dashboard > SQL Editor
--   (después de 01_security_hardening.sql)
--
-- Este script crea 5 tablas RBAC y refactoriza is_rcp_admin() / get_user_role()
-- para que consulten user_roles en lugar de emails hardcoded.
--
-- Tablas creadas:
--   1. roles              — catálogo de roles (super_admin, admin, editor, client, viewer)
--   2. permissions        — catálogo de permisos por módulo
--   3. role_permissions   — matriz rol × permiso (N:N)
--   4. user_roles         — asignación usuario → rol (con granted_by / granted_at)
--   5. rbac_audit_log     — historial de cambios de rol/permiso (auditoría)
--
-- Roles y prioridad (mayor = más poder):
--   super_admin (100) — acceso total, gestiona otros admins
--   admin        (80) — gestión operativa completa (clientes, dashboard, facturación)
--   editor       (60) — edición de catálogo/tienda/media, sin gestión financiera
--   client       (40) — solo su propio dashboard/portal
--   viewer       (20) — solo lectura global (reuniones de junta, reportes)
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. TABLA: roles
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roles (
  id          SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  description TEXT,
  priority    SMALLINT    NOT NULL DEFAULT 0,
  is_system   BOOLEAN     NOT NULL DEFAULT FALSE,  -- TRUE = rol base, no eliminable
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed de roles (idempotente)
INSERT INTO public.roles (slug, name, description, priority, is_system) VALUES
  ('super_admin', 'Super Administrador', 'Acceso total, gestiona otros administradores y configuración global.', 100, TRUE),
  ('admin',       'Administrador',       'Gestión operativa: clientes, dashboard, facturación, reportes.',       80, TRUE),
  ('editor',      'Editor',              'Edición de catálogo de tienda, media y contenido público.',             60, TRUE),
  ('client',      'Cliente',             'Acceso a su propio portal y dashboard. Solo ve sus datos.',             40, TRUE),
  ('viewer',      'Observador',          'Solo lectura global: reportes, KPIs y vistas de junta directiva.',      20, TRUE)
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      priority    = EXCLUDED.priority;

-- ───────────────────────────────────────────────────────────────────────
-- 2. TABLA: permissions
--    Módulos: clientes, facturacion, tienda, media, dashboard, admin, rbac
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.permissions (
  id          SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        TEXT    NOT NULL UNIQUE,          -- ej. "clientes.read", "facturacion.write"
  name        TEXT    NOT NULL,
  module      TEXT    NOT NULL,                  -- agrupación lógica
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions (module);

-- Seed de permisos
INSERT INTO public.permissions (slug, name, module, description) VALUES
  -- clientes
  ('clientes.read',         'Ver clientes',          'clientes',   'Listar y consultar clientes.'),
  ('clientes.write',        'Crear/editar clientes', 'clientes',   'Crear y actualizar registros de clientes.'),
  ('clientes.delete',       'Eliminar clientes',     'clientes',   'Eliminar registros de clientes.'),
  -- facturacion
  ('facturacion.read',      'Ver facturación',       'facturacion','Consultar transacciones e impuestos.'),
  ('facturacion.write',     'Emitir/gestionar facturas','facturacion','Crear y editar facturas.'),
  -- tienda
  ('tienda.read',           'Ver catálogo tienda',   'tienda',     'Consultar productos y catálogo público.'),
  ('tienda.write',          'Editar catálogo tienda','tienda',     'Crear, editar y eliminar productos.'),
  ('tienda.orders',         'Gestionar pedidos',     'tienda',     'Ver y procesar pedidos.'),
  -- media
  ('media.read',            'Ver medios',            'media',      'Consultar galería y assets.'),
  ('media.write',           'Subir/editar medios',   'media',      'Subir, reemplazar y eliminar assets.'),
  -- dashboard
  ('dashboard.read',        'Ver dashboard',         'dashboard',  'Acceso a métricas y KPIs.'),
  ('dashboard.admin_view',  'Vista global admin',    'dashboard',  'Ver datos agregados de todos los clientes.'),
  -- admin
  ('admin.access',          'Acceso panel admin',    'admin',      'Acceder a la interfaz de administración.'),
  -- rbac
  ('rbac.manage',           'Gestionar RBAC',        'rbac',       'Asignar roles y permisos a usuarios.')
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      module      = EXCLUDED.module,
      description = EXCLUDED.description;

-- ───────────────────────────────────────────────────────────────────────
-- 3. TABLA: role_permissions (matriz N:N)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       SMALLINT    NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id SMALLINT    NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Matriz rol × permiso
-- super_admin: todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug = 'super_admin'
ON CONFLICT DO NOTHING;

-- admin: todo excepto rbac.manage
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug = 'admin' AND p.slug <> 'rbac.manage'
ON CONFLICT DO NOTHING;

-- editor: tienda + media (read/write) + dashboard.read
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug = 'editor'
  AND p.slug IN (
    'tienda.read','tienda.write','tienda.orders',
    'media.read','media.write',
    'dashboard.read'
  )
ON CONFLICT DO NOTHING;

-- client: solo su propio dashboard/portal
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug = 'client'
  AND p.slug IN ('dashboard.read','tienda.read','media.read')
ON CONFLICT DO NOTHING;

-- viewer: solo lectura global + dashboard.admin_view
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug = 'viewer'
  AND p.slug IN (
    'dashboard.read','dashboard.admin_view',
    'clientes.read','facturacion.read',
    'tienda.read','media.read'
  )
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 4. TABLA: user_roles
--    Vincula un usuario (por email, y opcionalmente auth.uid) a un rol.
--    Un usuario puede tener varios roles; el de mayor priority prevalece.
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      TEXT        NOT NULL,
  user_uid   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  role_id    SMALLINT    NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  granted_by TEXT,                          -- email del admin que otorgó el rol
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  notes      TEXT,
  UNIQUE (email, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_email    ON public.user_roles (email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_uid ON public.user_roles (user_uid) WHERE user_uid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_active   ON public.user_roles (is_active);

-- Seed: los admins hardcoded de la Fase 1 ahora viven aquí como datos
INSERT INTO public.user_roles (email, role_id, granted_by, notes)
SELECT 'admin@rcp.services', r.id, 'system', 'Migrado desde Fase 1 (is_rcp_admin)'
FROM public.roles r WHERE r.slug = 'super_admin'
ON CONFLICT (email, role_id) DO NOTHING;

INSERT INTO public.user_roles (email, role_id, granted_by, notes)
SELECT 'rcpservicessrl@gmail.com', r.id, 'system', 'Migrado desde Fase 1 (is_rcp_admin)'
FROM public.roles r WHERE r.slug = 'super_admin'
ON CONFLICT (email, role_id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 5. TABLA: rbac_audit_log
--    Bitácora inmutable de cambios de rol/permiso (quién, qué, cuándo).
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rbac_audit_log (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_email TEXT        NOT NULL,           -- quien realizó la acción
  target_email TEXT,                          -- sobre qué usuario (si aplica)
  entity      TEXT        NOT NULL,           -- 'user_role' | 'role_permission' | 'role'
  action      TEXT        NOT NULL,           -- 'grant' | 'revoke' | 'create' | 'update' | 'delete'
  payload     JSONB,                          -- snapshot del cambio
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rbac_audit_target ON public.rbac_audit_log (target_email);
CREATE INDEX IF NOT EXISTS idx_rbac_audit_actor  ON public.rbac_audit_log (actor_email);

-- ───────────────────────────────────────────────────────────────────────
-- 6. TRIGGER: auditar INSERT/UPDATE/DELETE en user_roles
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_audit_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor TEXT := COALESCE(auth.email() , current_setting('app.actor_email', true), 'system');
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.rbac_audit_log (actor_email, target_email, entity, action, payload)
    VALUES (v_actor, NEW.email, 'user_role', 'grant',
            jsonb_build_object('role_id', NEW.role_id, 'is_active', NEW.is_active));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.rbac_audit_log (actor_email, target_email, entity, action, payload)
    VALUES (v_actor, NEW.email, 'user_role', 'update',
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.rbac_audit_log (actor_email, target_email, entity, action, payload)
    VALUES (v_actor, OLD.email, 'user_role', 'revoke',
            jsonb_build_object('role_id', OLD.role_id));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_user_role ON public.user_roles;
CREATE TRIGGER trg_audit_user_role
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_user_role();

-- ───────────────────────────────────────────────────────────────────────
-- 7-bis. FUNCIONES RBAC (deben existir ANTES de las políticas RLS que
--        las referencian). SECURITY DEFINER para bypasear RLS de catálogos.
-- ───────────────────────────────────────────────────────────────────────

-- has_role(p_email, p_slug) → ¿el usuario tiene (al menos) este rol?
CREATE OR REPLACE FUNCTION public.has_role(p_email TEXT, p_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.email = p_email
      AND ur.is_active = TRUE
      AND r.slug = p_slug
  );
$$;

-- has_permission(p_email, p_slug) → ¿el usuario tiene este permiso vía algún rol?
CREATE OR REPLACE FUNCTION public.has_permission(p_email TEXT, p_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p       ON p.id = rp.permission_id
    WHERE ur.email = p_email
      AND ur.is_active = TRUE
      AND p.slug = p_slug
  );
$$;

-- effective_role(p_email) → el rol activo de mayor prioridad (o 'client' default)
CREATE OR REPLACE FUNCTION public.effective_role(p_email TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT r.slug
     FROM public.user_roles ur
     JOIN public.roles r ON r.id = ur.role_id
     WHERE ur.email = p_email AND ur.is_active = TRUE
     ORDER BY r.priority DESC
     LIMIT 1),
    'client'
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_role(TEXT, TEXT)        TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(TEXT, TEXT)  TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.effective_role(TEXT)        TO authenticated, anon;

-- ───────────────────────────────────────────────────────────────────────
-- 7. RLS en las tablas RBAC
--    Solo super_admin (y quien tenga rbac.manage) puede escribir en RBAC.
--    Lectura: cualquier usuario autenticado puede ver su propio rol y los
--    permisos/roles del catálogo (para que la UI pueda decidir qué mostrar).
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_audit_log    ENABLE ROW LEVEL SECURITY;

-- Catálogos: lectura pública para clientes anónimos del portal (get_user_role
-- los consulta), escritura solo desde service_role (migraciones).
DROP POLICY IF EXISTS "Roles: lectura publica" ON public.roles;
CREATE POLICY "Roles: lectura publica" ON public.roles
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Permissions: lectura publica" ON public.permissions;
CREATE POLICY "Permissions: lectura publica" ON public.permissions
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Role_permissions: lectura publica" ON public.role_permissions;
CREATE POLICY "Role_permissions: lectura publica" ON public.role_permissions
  FOR SELECT USING (TRUE);

-- user_roles: lectura — el propio usuario ve SUS filas; quien tiene
-- dashboard.admin_view o rbac.manage ve todas.
DROP POLICY IF EXISTS "User_roles: lectura propia o autorizada" ON public.user_roles;
CREATE POLICY "User_roles: lectura propia o autorizada" ON public.user_roles
  FOR SELECT USING (
    email = auth.email()
    OR public.has_permission(auth.email(), 'dashboard.admin_view')
    OR public.has_permission(auth.email(), 'rbac.manage')
  );

-- user_roles: escritura — solo quien tiene rbac.manage (super_admin).
DROP POLICY IF EXISTS "User_roles: escritura rbac.manage" ON public.user_roles;
CREATE POLICY "User_roles: escritura rbac.manage" ON public.user_roles
  FOR ALL USING (public.has_permission(auth.email(), 'rbac.manage'))
  WITH CHECK (public.has_permission(auth.email(), 'rbac.manage'));

-- audit_log: solo super_admin / rbac.manage puede leer; nadie escribe vía RLS
-- (las inserciones las hace el trigger SECURITY DEFINER).
DROP POLICY IF EXISTS "Rbac_audit: lectura rbac.manage" ON public.rbac_audit_log;
CREATE POLICY "Rbac_audit: lectura rbac.manage" ON public.rbac_audit_log
  FOR SELECT USING (public.has_permission(auth.email(), 'rbac.manage'));

-- ───────────────────────────────────────────────────────────────────────
-- 8. REFACTORIZAR is_rcp_admin() y get_user_role() de la Fase 1
--    Ahora consultan RBAC en lugar de emails hardcoded. Conservan fallback
--    defensivo por si la tabla user_roles estuviera vacía.
--    (Las funciones has_role/has_permission/effective_role se definen en la
--     sección 7-bis, ANTES de las políticas RLS que las referencian.)
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_rcp_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    public.has_role(auth.email(), 'super_admin')
    OR public.has_role(auth.email(), 'admin'),
    FALSE
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_rcp_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_rcp_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_role(p_email TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.effective_role(p_email);
$$;
REVOKE EXECUTE ON FUNCTION public.get_user_role(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO authenticated, anon;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
--
--   SELECT slug, name, priority FROM public.roles ORDER BY priority DESC;
--     -- Debe retornar 5 roles (super_admin..viewer)
--
--   SELECT r.slug, COUNT(p.slug) AS perms
--   FROM public.roles r JOIN public.role_permissions rp ON rp.role_id=r.id
--   JOIN public.permissions p ON p.id=rp.permission_id
--   GROUP BY r.slug ORDER BY r.priority DESC;
--     -- super_admin = 14 perms, admin = 13, editor = 6, client = 3, viewer = 6
--
--   SELECT email, r.slug FROM public.user_roles ur
--   JOIN public.roles r ON r.id=ur.role_id ORDER BY ur.granted_at;
--     -- admin@rcp.services y rcpservicessrl@gmail.com como super_admin
--
--   SELECT public.effective_role('admin@rcp.services');   -- 'super_admin'
--   SELECT public.effective_role('nadie@x.com');          -- 'client'
--   SELECT public.has_permission('admin@rcp.services','rbac.manage'); -- true
-- ═══════════════════════════════════════════════════════════════════════
