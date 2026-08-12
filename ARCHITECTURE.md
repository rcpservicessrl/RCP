# Arquitectura web RCP Services 6.0-RC2

## Decisión

La web pública usa Next.js 16 App Router, TypeScript y Vercel Pro. Route 53 continúa como DNS autoritativo. Cloudflare/OpenNext se conserva como alternativa probada, pero no participa en el corte RC2.

Astro/GitHub Pages continúa como producción y rollback hasta completar staging, UAT, entrega real del formulario y autorización de corte.

## Frontera del producto

La web comercial explica, orienta, permite buscar contenido y capta solicitudes. No es CRM, Delivery Hub, checkout, marketplace, sistema contable ni emisor e-CF.

- Web pública: contenido, catálogo filtrado, búsqueda, evaluación inicial y postulación manual.
- CRM: contactos, empresas, bandeja, embudo, responsables y traspaso al Hub.
- Delivery Hub: diagnósticos, proyectos, especialistas, entregables, QA, aceptación, soporte y auditoría.
- Matrix: evidencia técnica y releases aprobados.

Ningún sistema escribe directamente en el esquema de otro.

## Renderizado y contenido

- Server Components y HTML estático por defecto.
- Client Components solo para preferencias, búsqueda, música, Pulso, exploradores y formularios.
- El contenido público se deriva de `CommercialState` y nunca de listas sin filtrar.
- `TechnicalMaturity`, `regulated` y `requiresProfessionalReview` no conceden disponibilidad comercial.
- Canonicales, `hreflang`, sitemap, JSON-LD, `llms.txt` e índice descargable comparten la misma política pública.

## Seguridad y captación

El navegador nunca recibe claves de Resend, tokens CRM, HMAC ni `service_role`.

Flujo piloto:

`navegador -> Turnstile/honeypot/rate limit -> API Next -> Resend -> Zoho`

Flujo posterior:

`navegador -> API Next -> contrato HMAC/idempotente -> CRM`

La respuesta estable es `recorded`, `reference`, `duplicate`, `contactId`, `opportunityId` y `stage`. No se hace doble escritura entre correo y CRM.

## Datos y observabilidad

- PostHog solo en la web pública, con consentimiento y sin PII ni texto libre.
- Sentry sin campos del formulario y con ambientes separados.
- `/api/health` es el objetivo de UptimeRobot.
- El Hub requiere un proyecto Supabase Pro separado antes de usuarios externos.
- Las aplicaciones cliente y la información corporativa permanecen aisladas.

## Pulso y marca

Pulso usa únicamente tres imágenes transparentes aprobadas y protegidas por hash. No se recorta, deforma ni genera en runtime. Las animaciones afectan al contenedor y respetan `prefers-reduced-motion`.

## Entrega

- PR obligatorio y checks con Node 24.
- Preview y Production separados en Vercel.
- Staging lleva `noindex` mediante `RCP_DEPLOYMENT_ENV`/`VERCEL_ENV`.
- El corte cambia únicamente apex y `www`; MX, TXT, Zoho y otros subdominios quedan intactos.
- GitHub Pages permanece como rollback durante 30 días.

Los criterios y procedimientos completos viven en `docs/RC2_OPERATIONS_AND_GOVERNANCE.md`, `docs/STAGING_RUNBOOK.md`, `docs/DEPLOYMENT_RUNBOOK.md` y `docs/ROLLBACK_PLAN.md`.
