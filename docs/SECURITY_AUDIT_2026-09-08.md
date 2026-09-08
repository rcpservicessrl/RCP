# Auditoría estricta de seguridad — RCP Services

**Fecha:** 2026-09-08 (America/Santo_Domingo)  
**Alcance:** web Next/Vercel, APIs públicas, formularios, bundles publicados, Cloud Functions heredadas, Supabase documentado, stack IA privado y dependencias.  
**Método:** revisión estática dirigida, pruebas HTTP/DOM de solo lectura y validación local del build. No se enviaron formularios reales ni se imprimieron secretos.

## Dictamen

La publicación que estaba activa antes de este cambio no cumplía un corte estricto: los formularios mostraban únicamente campos Turnstile ocultos, no un widget visible ni token; la protección podía quedar desactivada por configuración. También tenía CSP con `unsafe-inline` para scripts, limitación de solicitudes sólo en memoria y una cadena de dependencia de OpenNext con `qs` vulnerable.

El código corregido queda listo para publicar y pasa las pruebas locales. La publicación productiva debe verificarse de nuevo porque Vercel muestra los valores cifrados sin revelar si las claves Turnstile están realmente llenas. Si falta la clave pública, la nueva versión bloqueará el envío en producción de forma segura hasta corregir la variable.

## Evidencia observada antes de corregir

- `https://rcp.services/diagnostico` y `/especialistas/postular` devolvían `200`, pero el DOM contenía sólo `turnstileToken` y `cf-turnstile-response` vacíos; no había iframe de Turnstile.
- La CSP pública era `script-src 'self' 'unsafe-inline' ...`; HSTS era sólo `max-age=31536000`.
- Los bundles públicos no contenían indicadores de `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, tokens CRM, `service_role`, Gemini ni Odoo.
- El código archivado Astro todavía contenía dos claves Supabase publishable literales; no se encontró una clave `service_role` en el alcance.
- `GET /api/inquiries` y `GET /api/specialist-applications` respondían `405` y `Cache-Control: no-store`.
- Los endpoints heredados `rcpChat` y `rcpLead` documentados en GCP devolvieron `404`; su código queda tratado como superficie heredada no acreditada, no como runtime productivo confirmado.
- `pnpm audit --prod --audit-level low` no encontró vulnerabilidades. El audit general sí encontró `qs` vulnerable dentro de la cadena de desarrollo OpenNext/Express.

## Hallazgos corregidos

| Severidad | Hallazgo | Corrección aplicada |
|---|---|---|
| Alta | Turnstile no se renderizaba en la publicación y la API podía aceptar sin verificación si la variable estaba ausente. | Producción exige Turnstile y falla cerrado si falta secreto o token; el formulario muestra el estado de configuración. |
| Alta | Formularios anónimos aceptaban solicitudes cross-site y la IP usaba el primer valor manipulable de `X-Forwarded-For`. | Validación de `Origin`/Fetch Metadata y uso del último salto observado para el límite local. |
| Alta | El stack IA privado exponía puertos en todas las interfaces y tenía `sk-rcp-local-dev` como clave conocida. | Puertos ligados a `127.0.0.1`, clave obligatoria por entorno y configuración LiteLLM desde variable. |
| Alta | Cloud Function heredada imprimía prefijos de claves Gemini y datos de prospectos en logs, devolvía errores upstream crudos y reflejaba orígenes localhost. | Logs sin PII/secretos, errores genéricos, CORS explícito y localhost sólo mediante opt-in; webhook n8n exige HTTPS y host permitido. |
| Media | La CSP permitía scripts inline; el tema y JSON-LD dependían de ello. | Middleware con nonce por solicitud, JSON-LD con nonce y eliminación de `unsafe-inline` de `script-src`. |
| Media | `RCP_CRM_INGEST_URL` podía dirigir datos de prospectos a un host arbitrario. | CRM exige HTTPS y `RCP_CRM_ALLOWED_HOSTS`; se rechazan hosts locales, IP privadas y credenciales embebidas. |
| Media | El enlace de WhatsApp incluía parte del problema escrito por la persona. | El handoff sólo contiene referencia y empresa; el texto sensible no viaja en URL, historial ni referrer. |
| Media | `qs` vulnerable en la ruta de herramientas OpenNext/Express. | Override de workspace a `qs 6.16.0`; `pnpm audit` queda limpio. |
| Baja | Health check heredado tenía una clave Supabase publishable por defecto y un usuario Odoo por defecto. | Ambos valores ahora son obligatorios por entorno y no existen defaults de credencial/identidad. |
| Baja | Los snapshots Astro archivados conservaban claves Supabase publishable en el código. | Se retiraron las literales; el snapshot sólo acepta `globalThis.RCP_PUBLIC_SUPABASE_KEY` inyectada al restaurarlo. |

## Límites que aún requieren verificación autorizada

1. El limitador de solicitudes sigue siendo por instancia en memoria. Debe complementarse con Vercel Firewall/Cloudflare WAF o un almacén distribuido antes de tráfico de abuso a escala.
2. Se debe comprobar en Vercel que `RCP_REQUIRE_TURNSTILE=true`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY` tienen valores reales, y luego repetir una prueba controlada sin enviar datos personales.
3. No se acreditó la entrega real de Resend/CRM ni la configuración de RLS del proyecto Supabase. La documentación mantiene una discrepancia entre el esquema `public` y `rcp_services`; no se ejecutó SQL remoto ni se cambió el proveedor.
4. Las Cloud Functions heredadas están en `404` en sus URLs documentadas. Si se vuelven a desplegar, deben conservar las nuevas variables de host permitido y una revisión de IAM/secret manager.
5. Cloudflare inyectaba un beacon bloqueado por CSP en la publicación anterior. Se mantuvo bloqueado por defecto para no autorizar analítica externa no declarada; la decisión de habilitarlo debe hacerse en el proveedor y en la política de privacidad.

## Validación del cambio

- `pnpm typecheck` — correcto.
- `pnpm test` — **63/63** correctas.
- `pnpm build` — correcto, con middleware nonce compilado.
- `pnpm audit --audit-level low` y `pnpm audit --prod --audit-level low` — sin vulnerabilidades conocidas.
- `py -3 -m compileall -q cloud_function` — correcto.
- `docker compose ... config --quiet` para IA privada — correcto con clave de auditoría efímera.
- Build local servido: CSP con nonce distinto por respuesta, HSTS con `includeSubDomains`, formularios sin errores de consola; API de producción simulada respondió `human_verification_failed` sin credenciales Turnstile, como exige el cierre seguro.
