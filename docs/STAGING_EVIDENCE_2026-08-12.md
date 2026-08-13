# Evidencia de staging y candidato productivo RCP Services 6.0-RC2 — 2026-08-13

## Identidad del candidato

- Rama: `codex/rcp-next-blueprint-5`.
- SHA probado: `a316c8306fb5767500ab516738a39da26418c7ae`.
- Pull request: `rcpservicessrl/RCP#7`.
- Runtime: Vercel, Node.js 24.x y Next.js 16.3.0.
- Staging aislado: proyecto `rcp-services-staging`, deployment `dpl_37QznB332LnmoDE1JfK5b9NA3iku` y `https://staging.rcp.services`.
- Candidato productivo: proyecto `rcp-services-web`, deployment `dpl_GUR3A6NuLWaNrbo3u2R4DYFSYh3a`.
- Dominio comercial `rcp.services`: continúa sirviendo GitHub Pages hasta ejecutar el cambio controlado de Route 53.

## Controles comprobados

- TypeScript, 44 pruebas de contrato y build remoto de Vercel concluyeron correctamente.
- Staging responde `GET /api/health` con HTTP 200 y conserva `noindex`, `Disallow: /` y canonicales de staging.
- El candidato productivo responde `GET /api/health` con HTTP 200, versión `6.0.0-rc.2` y modo de entrega `email`.
- El candidato productivo publica `robots.txt` indexable, canonicales y sitemap bajo `https://rcp.services`.
- Turnstile está activo en el proyecto productivo: una solicitud completa sin token fue rechazada con `human_verification_failed`.
- Resend y Turnstile fueron validados de extremo a extremo en el mismo proyecto proveedor antes de asignarlo a producción: referencias `RCP-EVAL-E31D9E4444` y `RCP-TAL-D09160E623`, ambas entregadas al buzón controlado.
- El WAF limita los formularios públicos a ocho solicitudes por diez minutos, por IP, y fue probado con rechazo HTTP 403 en la novena solicitud.
- Los alias HTML históricos comprobados responden con un solo 308 hacia su destino final; `cleanUrls` permanece desactivado para evitar dobles saltos.
- Axe auditó las 44 rutas del sitemap en claro y oscuro: 88 ejecuciones, cero errores HTTP, cero incidencias críticas y cero serias. Las ocho rutas principales también se comprobaron a 390×844 y 1440×900.
- La inspección responsive previa cubrió 390×844, 768×1024, 1280×720 y 1440×900 sin desbordamiento horizontal ni recortes de Pulso o logotipos.
- El correo alternativo de especialistas apunta a `info@rcp.services`; no quedan referencias activas al buzón inexistente anterior.

## Fronteras de los entornos

- Producción conserva las variables proveedoras verificadas de Resend y Turnstile.
- Staging utiliza configuración independiente, sin claves proveedoras, y mantiene los formularios en fallo seguro.
- `www.rcp.services` está configurado en Vercel como redirección 308 hacia `rcp.services`.
- Route 53 sigue siendo autoritativo. Solo los registros web apex y `www` están dentro del corte; MX, TXT, Zoho y demás subdominios quedan fuera.

## Compuertas abiertas

- Aplicar el cambio exacto de Route 53 hacia el destino recomendado por Vercel y confirmar la emisión del certificado.
- Ejecutar UAT posterior al corte: acceso público, redirección `www`, SEO/AEO, evaluación y postulación con referencia entregada.
- Observar 60 minutos y registrar los controles de 24 horas, 7 días y 30 días.
- Sentry, PostHog y UptimeRobot continúan sin activación externa hasta definir cuentas, propietarios, retención y alertas.

## Decisión

El candidato está aprobado técnicamente para el corte controlado. GitHub Pages y la exportación completa de Route 53 permanecen disponibles como rollback.
