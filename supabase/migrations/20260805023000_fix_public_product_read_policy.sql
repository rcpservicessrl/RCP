-- Public product reads must never execute an authenticated-only helper.
-- Splitting policies by role avoids PostgreSQL evaluating is_rcp_admin() for anon.

BEGIN;

DROP POLICY IF EXISTS productos_public_read ON public.productos;
DROP POLICY IF EXISTS productos_authenticated_read ON public.productos;

CREATE POLICY productos_public_read
ON public.productos
FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY productos_authenticated_read
ON public.productos
FOR SELECT
TO authenticated
USING (is_active = true OR public.is_rcp_admin());

COMMIT;
