-- Emergency rollback for 20260805023000_fix_public_product_read_policy.sql.
-- Note: restoring the former policy also restores its anonymous 401 defect.
BEGIN;
DROP POLICY IF EXISTS productos_public_read ON public.productos;
DROP POLICY IF EXISTS productos_authenticated_read ON public.productos;
CREATE POLICY productos_public_read
ON public.productos
FOR SELECT
USING (is_active = true OR (auth.email() IS NOT NULL AND public.is_rcp_admin()));
COMMIT;
