# Modelo de amenazas web RCP Services 6.0-RC2

## Activos y límites

Activos: marca/Pulso, contenido aprobado, solicitudes y consentimiento, secretos de proveedor, DNS y deployments.

Límites: `navegador -> Vercel/Next -> Resend o CRM`; `repositorio -> CI protegida -> Vercel`; `Hub y CRM -> Supabase separado por esquema/proyecto`. El navegador no decide precio, rol, aceptación ni estado operativo.

| Amenaza | Control implementado | Gate pendiente |
|---|---|---|
| spam/payload abusivo | 24 KB, validación, honeypot, Turnstile opcional, bucket local | rate limit distribuido/WAF en staging |
| duplicado/replay | `Idempotency-Key`, timestamp y HMAC hacia CRM | restricción y prueba remota concurrente |
| fuga de PII | formulario mínimo, `no-store`, PostHog/Sentry sin texto libre | configuración y prueba de redacción |
| robo de secretos | server-only, `.env` ignorado, CSP | secretos Vercel por entorno y rotación |
| XSS/clickjacking | React escaping, CSP, `frame-ancestors`, `nosniff` | verificar headers en staging |
| contenido no aprobado | estados comerciales y filtros comunes | revisión del SHA exacto |
| SEO contaminado | legado fuera de `public`, alias 308 fuera de sitemap | Search Console tras corte |
| marca alterada | hashes, allowlist y `object-fit: contain` | aprobación explícita para nuevas poses |
| Portal prematuro | fuera de navegación y `noindex` | Hub Pro, invitación, MFA y RLS |
| despliegue accidental | workflow manual y ambientes separados | protección `main`, revisores y Pro confirmados |

No se usa el rate limit en memoria como único control de producción distribuida.
