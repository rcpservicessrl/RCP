# Mapa del repositorio

## Autoridad

- Checkout canónico: `C:\RCP\RCP Services\Sitio-Web`.
- Remoto: `rcpservicessrl/RCP`.
- Producción: GitHub Pages en `https://rcp.services`.
- Base corporativa: Supabase `wpfovxgbennpgydbellw.public`.
- Autoridad transversal: `C:\RCP\RCP Services\RCP-Matrix`.
- Autoridad visual: `C:\RCP\RCP Services\01 - Identidad y Estrategia\Marca`.

## Estructura

| Ruta | Responsabilidad | Estado |
|---|---|---|
| `src/pages` | 15 rutas Astro | Activa |
| `src/components` | cabecera, pie y widgets globales | Activa |
| `src/layouts/BaseLayout.astro` | metadatos, scripts y layout global | Crítica |
| `src/styles` | tokens, base y dashboard | Activa |
| `src/data/i18n` | traducciones ES/EN | Duplicada con `public/scripts` |
| `public/tienda.js` | catálogo, filtros, carrito y redirección a checkout | Crítica; deuda alta |
| `public/scripts/dashboard.js` | portal/admin CRUD | Crítica; monolito |
| `public/script.js` | widgets, formularios, chat e integraciones | Crítica; monolito |
| `supabase/snippets` | SQL histórico y migraciones manuales | Debe convertirse en migraciones versionadas |
| `cloud_function` | lead webhook, Odoo y health checks | Externo al hosting estático |
| `.github/workflows/deploy.yml` | build y despliegue a Pages | Producción |
| `knowledge_graph`, `graphify-out`, `.neural_bridge` | contexto neuronal | Activo |
| `marketing` | campañas históricas | No normativo para la marca vigente |
| `dist`, `node_modules`, `tmp` | artefactos generados/locales | No editar como fuente |

## Flujo actual crítico

`Supabase productos -> public/tienda.js -> query string custom_items -> checkout.astro -> cálculo cliente -> Cloud Function/Supabase clientes`.

El contrato está roto porque el navegador transporta nombre, importe y descuentos como autoridad. La arquitectura objetivo debe transportar identificadores y cantidades; el servidor/RPC debe resolver versión, vigencia, moneda e importe.
