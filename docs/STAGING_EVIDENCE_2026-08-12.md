# Evidencia de staging y producción RCP Services 6.0-RC2 — 2026-08-13

## Identidad del candidato

- Rama publicada: `master`.
- SHA de `master`: `f09d63c44d280bb7dd3bebb76251f8fd5712e2fc`.
- Pull request aprobado y fusionado: `rcpservicessrl/RCP#7`.
- Runtime: Vercel, Node.js 24.x y Next.js 16.3.0.
- Staging aislado: proyecto `rcp-services-staging`, deployment `dpl_37QznB332LnmoDE1JfK5b9NA3iku` y `https://staging.rcp.services`.
- Producción Git-integrada: proyecto `rcp-services-web`, deployment `dpl_gWMfNKFbuVVguvWDjUK9XxRmHBea` y `https://rcp.services`.
- Deployment productivo manual conservado como respaldo inmediato: `dpl_GUR3A6NuLWaNrbo3u2R4DYFSYh3a`.

## Controles comprobados

- TypeScript, 44 pruebas de contrato y build remoto de Vercel concluyeron correctamente.
- Staging responde `GET /api/health` con HTTP 200 y conserva `noindex`, `Disallow: /` y canonicales de staging.
- Producción responde `GET /api/health` con HTTP 200, versión `6.0.0-rc.2` y modo de entrega `email`.
- Producción publica `robots.txt` indexable, canonicales y sitemap bajo `https://rcp.services`.
- Turnstile está activo en el proyecto productivo: una solicitud completa sin token fue rechazada con `human_verification_failed`.
- Resend y Turnstile fueron validados de extremo a extremo en el mismo proyecto proveedor antes de asignarlo a producción: referencias `RCP-EVAL-E31D9E4444` y `RCP-TAL-D09160E623`, ambas entregadas al buzón controlado.
- El WAF limita los formularios públicos a ocho solicitudes por diez minutos, por IP, y fue probado con rechazo HTTP 403 en la novena solicitud.
- Los alias HTML históricos comprobados responden con un solo 308 hacia su destino final; `cleanUrls` permanece desactivado para evitar dobles saltos.
- Axe auditó las 44 rutas del sitemap en claro y oscuro: 88 ejecuciones, cero errores HTTP, cero incidencias críticas y cero serias. Las ocho rutas principales también se comprobaron a 390×844 y 1440×900.
- La inspección responsive previa cubrió 390×844, 768×1024, 1280×720 y 1440×900 sin desbordamiento horizontal ni recortes de Pulso o logotipos.
- El correo alternativo de especialistas apunta a `info@rcp.services`; no quedan referencias activas al buzón inexistente anterior.
- La UAT posterior al corte recorrió las 44 URLs del sitemap: 44 HTTP 200, 44 canonicales válidas, 44 pares `hreflang` ES/EN y ninguna ruta indexable marcada `noindex`.
- `www.rcp.services` redirige con un solo 308 al dominio principal. Los cuatro alias históricos comprobados también responden con un único 308.
- La Evaluación Inicial pública generó `RCP-EVAL-B24D9052F1` y la postulación sintética generó `RCP-TAL-454DA5FF21`; Resend confirmó ambas como `Delivered` hacia `info@rcp.services`.
- Búsqueda, rutas por necesidad, pestañas de pilares, tema, música, guía de Pulso y navegación ES/EN funcionaron sobre el dominio público. La consola del navegador no registró errores ni advertencias durante esta UAT.

## Fronteras de los entornos

- Producción conserva las variables proveedoras verificadas de Resend y Turnstile.
- Staging utiliza configuración independiente, sin claves proveedoras, y mantiene los formularios en fallo seguro.
- `www.rcp.services` está configurado en Vercel como redirección 308 hacia `rcp.services`.
- Route 53 sigue siendo autoritativo. Solo los registros web apex y `www` están dentro del corte; MX, TXT, Zoho y demás subdominios quedan fuera.
- El cambio de Route 53 `/change/C09814322R7CM229047AU` quedó `INSYNC`; apex y `www` apuntan a Vercel con TTL de 60 segundos.
- La exportación previa, el lote de corte y el rollback exacto están en `C:\RCP\backups\rcp-services-web`.

## Seguimiento posterior al corte

- Mantener GitHub Pages y la etiqueta inmutable `rollback-astro-20260813` durante 30 días como rollback.
- Registrar los controles de 60 minutos, 24 horas, 7 días y 30 días sin alterar MX, TXT, Zoho ni otros subdominios.
- Sentry, PostHog y UptimeRobot continúan sin activación externa hasta definir cuentas, propietarios, retención y alertas.

## Decisión

La web Next.js 6.0-RC2 está activa en producción y superó la UAT inmediata posterior al corte. GitHub Pages, la etiqueta Astro y la exportación completa de Route 53 permanecen disponibles como rollback.
