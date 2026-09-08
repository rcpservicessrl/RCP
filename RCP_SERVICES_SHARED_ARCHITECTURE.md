# Arquitectura compartida RCP Services

Actualizado: 2026-09-08. Estado de publicación sustentado en la evidencia del 2026-09-08.

## Identidad de este producto

- Producto corporativo: sitio y portal `https://rcp.services`.
- Fuente de la publicación vigente: `C:\RCP\.worktrees\rcp-visual-3-2`, rama `codex/rcp-human-customer-journey`. Consultar [el registro de publicación](docs/WEB_PUBLICATION_2026-09-08.md) para el SHA y deployment exactos.
- Publicación: Next.js en Vercel, verificada en `https://rcp.services` y `www` el 2026-09-08.
- Supabase corporativo: `wpfovxgbennpgydbellw`. El esquema tiene una discrepancia documental descrita abajo; esta revisión no cambia su configuración.
- Organización: `RCP Services` (`boydxqiomfluciojjmvl`).

## Regla operativa

Este sitio pertenece al pool corporativo. No incorporar tablas de clientes en
ese pool. Antes de cambiar vínculos, esquema o migraciones, resolver la autoridad
en RCP Matrix y verificar la configuración vigente; cualquier cambio requiere
una ventana de compatibilidad, inventario de consumidores, pruebas de
Auth/formularios/portal y rollback.

El proyecto `ietytetmsksqpvbotjes` es el pool de clientes y no reemplaza este
backend. Toda decisión de migración o vinculación se coordina con RCP Matrix.

## Discrepancia de esquema pendiente de conciliación

`AGENTS.md` y la versión del 2026-07-31 de este documento describen `public`.
El checkpoint del 2026-08-10 de `.neural_state.md` declara una migración a
`rcp_services` y remite su evidencia a `RCP-Matrix/supabase/corporate/`.
La publicación Next.js del 2026-09-08 no verifica el esquema remoto ni sustituye
esa evidencia. No escoger un esquema ni ejecutar una migración por inferencia
de estos documentos: consultar primero el [proceso de continuidad de Matrix](../../RCP%20Services/RCP-Matrix/knowledge/continuity/README.md)
y el inventario corporativo vigente.

## Referencia histórica

La versión del 2026-07-31 identificaba `C:\RCP\RCP Services\Sitio-Web` como
checkout canónico y GitHub Pages como publicación. Describe el sitio anterior;
no representa la fuente ni el destino de la publicación Next.js verificada.
