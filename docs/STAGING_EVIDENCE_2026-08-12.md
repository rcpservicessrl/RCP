# Evidencia de staging RCP Services 6.0-RC2 — 2026-08-12

## Identidad del candidato

- Rama: `codex/rcp-next-blueprint-5`.
- SHA probado: `3fc6e2529bea8f47f90ea293193b363db4820d06`.
- Pull request: `rcpservicessrl/RCP#7` (borrador).
- Proyecto: `rcp-services-staging`.
- Runtime: Vercel, Node.js 24.x, Next.js 16.3.0.
- Deployment: `dpl_EJUC9ZaWDbzZt86SkNfqgTUcscuo`.
- URL canónica de UAT: `https://staging.rcp.services`.
- Dominio comercial `rcp.services`: sin cambios; continúa en GitHub Pages.

## Controles comprobados

- El despliegue remoto terminó en estado `READY` y fue asignado únicamente a `staging.rcp.services`.
- `GET /api/health`: HTTP 200, `ok=true`, versión `6.0.0-rc.2` y modo de entrega `email`.
- Inicio: HTTP 200, promesa aprobada visible y enlace de Portal ausente de la navegación.
- Staging incluye `<meta name="robots" content="noindex, nofollow">` y `robots.txt` devuelve `Disallow: /`.
- CSP y HSTS están presentes.
- `/quienes-somos` responde 308 hacia `/nosotros`.
- Sitemap usa el host de staging y excluye `/portal` y los alias históricos.
- La inspección interactiva remota comprobó 1280×720 y 390×844 sin desbordamiento horizontal.
- El formulario sintético, sin proveedor configurado, respondió HTTP 503 con `accepted=false`, `recorded=false` y `email_delivery_not_confirmed`; no afirmó una entrega inexistente.
- Los checks de GitHub `validate` y los dos checks de Vercel concluyeron correctamente.

## Compuertas abiertas

- La organización de Vercel continúa en plan Hobby. El dominio comercial no se cortará hasta activar el plan comercial aprobado.
- No existen todavía variables de Resend ni Turnstile en el proyecto. El formulario permanece en fallo seguro y no está aprobado para producción.
- Falta UAT de entrega real a un buzón controlado, con referencia coincidente e idempotencia verificada.
- Sentry, PostHog y UptimeRobot permanecen sin credenciales ni activación externa.
- El pull request no debe fusionarse ni el DNS de `rcp.services` cambiarse hasta cerrar las compuertas anteriores y aprobar el corte.

## Decisión

El candidato queda publicado para UAT técnica y visual en staging. No está autorizado para el corte del dominio comercial.
