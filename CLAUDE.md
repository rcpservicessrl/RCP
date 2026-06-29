# RCP Services — Memoria del proyecto

> Fuente de verdad para sesiones futuras. Actualizar al final de cada bloque de trabajo.

## Ubicación
- **Repo local:** `C:\RCP\RCP Services\Sitio-Web` (fuera de OneDrive desde 2026-06-29)
- **Documentación/vault:** `C:\RCP\RCP Services\`
- **Stack:** HTML/JS estático + Supabase (Postgres + RLS + RPC) + Cloud Functions (Python, Firebase) + Odoo Online (XML-RPC) + n8n.

## Arquitectura de archivos
```
dashboard.html        — panel cliente/admin (KPIs, charts, trámites, pagos, marketing)
portal.html           — login/registro, deriva rol vía RPC get_user_role
cloud_function/
  main.py             — endpoints rcpChat (Gemini) + rcpLead (n8n→Supabase→Odoo)
  odoo_sync.py        — XML-RPC a Odoo Online con timeouts duros
supabase/snippets/
  productos_schema.sql     — productos, ordenes, orden_items, producto_avances (+ seed catálogo)
  01_security_hardening.sql— RLS clientes, is_rcp_admin(), get_user_role(), verificar_existencia_cliente()
  02_rbac_schema.sql       — 5 tablas RBAC (roles, permissions, role_permissions, user_roles, rbac_audit_log)
  03_real_metrics_schema.sql— marketing_metrics, client_tramites, RPC dashboard_overview()
```

## Estado de seguridad (Fases 1–3 completadas)

### Fase 1 — Endurecimiento crítico
- **1A portal.html:** sin credenciales admin hardcodeadas, Firebase/Supabase desde env, sesiones con expiración, sin datos sensibles en localStorage.
- **1B SQL:** RLS estricto en `clientes` (SELECT/INSERT/UPDATE/DELETE admin-or-self), DROP columna `password`, RPC `get_user_role`, `is_rcp_admin`, `verificar_existencia_cliente`.
- **1C Cloud Functions:** rate limiting **conectado de verdad** (antes era código muerto) en rcpChat y rcpLead con 429+Retry-After; validación de longitud de mensaje (≤2000) y email; Odoo XML-RPC con `_TimeoutTransport` (connect 8s / request 15s).

### Fase 2 — RBAC
- 5 tablas RBAC. Roles por prioridad: `super_admin`(100) > `admin`(80) > `editor`(60) > `client`(40) > `viewer`(20).
- 14 permisos en 7 módulos (clientes, facturacion, tienda, media, dashboard, admin, rbac).
- Funciones: `has_role(email, slug)`, `has_permission(email, slug)`, `effective_role(email)`.
- `is_rcp_admin()` y `get_user_role()` refactorizados para consultar `user_roles` (antes emails hardcoded).
- `dashboard.html`: rol resuelto vía RPC `get_user_role` al inicio de `initializeDashboard()`; `director@miempresa.com` hardcoded eliminado.
- Audit log automático vía trigger `trg_audit_user_role`.

### Fase 3 — Datos reales (sin simulaciones)
- Nuevas tablas: `marketing_metrics` (cliente×periodo mensual), `client_tramites` (ONAPI/Cámara/DGII con % y descripción dinámica).
- **RPC `dashboard_overview(p_email, p_global)`** consolida en 1 llamada: KPIs, `chart_data` (ventas mensuales reales de `ordenes` paid, 7 puntos), `pagos` (mapeo de ordenes paid), `tramites`, `marketing` (último periodo), `erp_synced` (proxy: odoo_sale_order_id presente).
- `dashboard.html`:
  - Vista cliente y vista global admin cargan vía RPC (no más `defaultMetrics` en ceros ni lectura directa de `clientes`).
  - `renderMarketing(m)` pinta el panel de ads desde `marketing_metrics`; CPL/ROAS/conversión **calculados**. Si no hay datos → "—".
  - Trámites: barras, badges **y descripciones** se actualizan desde `client.tramites[]` (fallback a columnas legacy).
  - Badge ERP refleja `erp_synced` real (no siempre "Online").
  - **Eliminado:** `chart_data` sintético al insertar cliente, fila `pagos` con `Math.random`, `simClient` del localStorage con curva inventada, defaults HTML falsos (`RD$ 480,000`, `4.2x`...), texto CTR hardcodeado, label "(Simulación)".
  - Al insertar cliente: se crean filas en `client_tramites` con los % ingresados.

## Pendiente / fuera de alcance
- Importación automática de Meta/Google Ads a `marketing_metrics` (lo haría n8n; tabla lista).
- Granularidad semanal para el SVG de tendencia CPL (hoy placeholder).
- No se eliminaron columnas legacy `clientes.tramite_*` (compatibilidad).

## Verificación rápida
- `node -e "...parse script blocks..."` para validar JS de dashboard.html.
- Cada `.sql` tiene bloque "VERIFICACIÓN POST-EJECUCIÓN" con smoke tests.
- Orden de aplicación SQL: productos → 01 → 02 → 03.

## Convenciones
- Idempotente: `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`.
- SECURITY DEFINER en RPC que necesitan bypassar RLS de catálogos.
- Mensajes al usuario en ES/EN vía objeto `t` y `isEN`.
