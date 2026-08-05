# Monitoreo posterior al lanzamiento

| Ventana | Control | Umbral/acción |
|---|---|---|
| 0–60 min | HTTP, build, consola, catálogo, formularios | Error crítico: rollback |
| 24 h | 404, errores JS, Supabase, leads, consentimiento | Investigar cualquier caída o PII inesperada |
| 7 días | Search Console, CWV, conversiones, abandono | Abrir correcciones priorizadas |
| 30 días | SEO, rendimiento, claims, dependencias | Revisión ejecutiva y plan siguiente |

Propietarios requeridos: ingeniería (sitio/CI), operaciones (catálogo), comercial (cotizaciones/precios), privacidad/legal (políticas/consentimiento), marketing (SEO/GA4) y soporte (Zoho Mail). Los accesos de DNS, Search Console y alertas aún no están verificados. Odoo y pagos en línea no forman parte del alcance actual.
