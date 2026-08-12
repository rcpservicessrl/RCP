# Monitoreo posterior al lanzamiento web

| Ventana | Control | Acción |
|---|---|---|
| 0–60 min | Vercel 5xx, health, consola, rutas, formulario y correo | rollback ante pérdida de solicitudes, PII o error crítico |
| 24 h | 404, duplicados, Resend/Zoho, consentimiento, DNS/TLS | investigar toda pérdida o entrega doble |
| 7 días | Search Console, Core Web Vitals, búsquedas y conversión | corrección priorizada con propietario |
| 30 días | SEO/AEO, accesibilidad, claims, dependencias, costos y rollback Astro | revisión ejecutiva y retiro controlado de GitHub Pages |

Monitores mínimos: UptimeRobot para `/api/health`, `/`, `/catalogo` y `/diagnostico`; Vercel para runtime/5xx; Sentry sin PII; PostHog solo tras consentimiento; conciliación diaria de referencias Resend/Zoho durante la primera semana.

Cada alerta requiere severidad, canal, horario, propietario y suplente.
