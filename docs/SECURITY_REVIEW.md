# Revisión de seguridad web RCP Services 6.0-RC2

Fecha: 2026-08-12.

## Verificado localmente

- APIs con límite de 24 KB, tipo JSON, validación, allowlists, honeypot, consentimiento y `no-store`.
- Resend/CRM únicamente del lado servidor; sin tokens privilegiados en `NEXT_PUBLIC_*`.
- Éxito solo después de confirmación y referencia del proveedor.
- HMAC SHA-256, timestamp e `Idempotency-Key` en modo CRM.
- CSP, HSTS, `nosniff`, referrer, permisos, COOP y bloqueo de frames.
- Portal y rutas operativas fuera de sitemap; staging bloqueado por robots/noindex.
- Catálogo público filtrado; sin precios, pagos ni autoridad económica del navegador.
- Pulso y logos aprobados, completos y protegidos por hash.
- 42/42 pruebas, TypeScript, build Next/Node 24 y auditoría productiva sin vulnerabilidades conocidas.
- Rutas clave verificadas sin overflow, imágenes rotas ni errores de consola.

## Pendientes bloqueantes

- Rate limit distribuido/WAF y Turnstile real.
- Entrega Resend→Zoho e idempotencia real.
- Cierre del `SECURITY-HOLD` del CRM antes del modo `crm`.
- Sentry/PostHog configurados y probados sin PII.
- CI del commit final, staging, accesibilidad automatizada y revisión legal.

## Dictamen

Apto para preview local y preparación de staging con datos sintéticos. No autoriza corte DNS, datos sensibles, modo CRM, usuarios del Hub ni producción hasta cerrar los gates.
