# Arquitectura compartida RCP Services

Actualizado: 2026-10-11. La integración visual y la reparación se documentan en `docs/LATEST_VISUAL_RECOVERY_2026-10-11.md`; la conciliación de backend conserva su verificación del 2026-09-08.

## Identidad de este producto

- Producto corporativo: sitio y portal `https://rcp.services`.
- Fuente integrada para la próxima publicación: rama `master` del repositorio `rcpservicessrl/RCP`, preparada en `C:\RCP\.worktrees\rcp-aurora-demo-link`. La propuesta visual aprobada se recupera del manifiesto del 10 de octubre en `rcp-visual-3-2`, que se conserva como evidencia.
- Publicación: Next.js en Vercel. La reparación de PR 30 está publicada como `dpl_CxEzRuCkJEhd3kPHsaSdK1bsQk5d`; recuperó la carga pero requiere la integración visual descrita arriba.
- Supabase corporativo: `wpfovxgbennpgydbellw`. Metadatos y ledger remotos confirmados el 2026-09-08: datos corporativos en `rcp_services`, CRM en `crm` y namespaces de Superapp. Los formularios Next actuales utilizan proveedores desde el servidor.
- Organización: `RCP Services` (`boydxqiomfluciojjmvl`).

## Regla operativa

Este sitio pertenece al pool corporativo. No incorporar tablas de clientes en
ese pool. Antes de cambiar vínculos, esquema o migraciones, resolver la autoridad
en RCP Matrix y verificar la configuración vigente; cualquier cambio requiere
una ventana de compatibilidad, inventario de consumidores, pruebas de
Auth/formularios/portal y rollback.

El proyecto `ietytetmsksqpvbotjes` es el pool de clientes y no reemplaza este
backend. Toda decisión de migración o vinculación se coordina con RCP Matrix.

## Conciliación de esquema verificada el 2026-09-08

La referencia a `public` del 2026-07-31 era histórica. El ledger remoto contiene
`20260810160000_rcp_services_schema_hardening` y la inspección de funciones y
políticas confirma `rcp_services` y `crm`. La corrección de permisos registrada
como `20260908200940_corporate_security_boundary_hardening` se aplicó desde
Matrix sobre objetos verificados, sin reproducir las migraciones históricas
del CRM ni del libro separado RCP-To-Do. Ver [auditoría y evidencia de Matrix](../../RCP%20Services/RCP-Matrix/docs/security/2026-09-08/AUDIT.md).

Esta conciliación identifica esquemas existentes; no autoriza ejecutar
snippets de `public` ni declara conciliada toda la historia de migraciones.

## Referencia histórica

La versión del 2026-07-31 identificaba `C:\RCP\RCP Services\Sitio-Web` como
checkout canónico y GitHub Pages como publicación. Describe el sitio anterior;
no representa la fuente ni el destino de la publicación Next.js verificada.
