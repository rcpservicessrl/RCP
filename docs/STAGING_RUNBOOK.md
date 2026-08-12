# Runbook de staging RCP Services 6.0-RC2

## Objetivo

Validar la aplicación Next en Vercel sin modificar `rcp.services`, datos productivos ni autenticación externa.

## Preparación

1. Vincular el repositorio al proyecto Vercel de RCP y confirmar que pertenece al equipo autorizado.
2. Usar Node 24 y los comandos declarados en el repositorio.
3. Configurar Preview y Production por separado.
4. Definir en staging `RCP_DEPLOYMENT_ENV=preview` y `NEXT_PUBLIC_SITE_URL=https://staging.rcp.services`.
5. Mantener `RCP_INTAKE_DELIVERY_MODE=email` durante el piloto.
6. Usar direcciones controladas y nunca datos reales de clientes en pruebas.
7. Verificar que `robots.txt` bloquea todo y que las páginas incluyen `noindex`.

## UAT

- 390×844, 768×1024, 1280×720 y 1440×900.
- ES/EN, claro/oscuro, música, búsqueda, Pulso, menú y cursor con mouse.
- Portada, tres pilares, catálogo, seis soluciones, glosario, evaluación, especialistas, e-CF y legales.
- Evaluación y postulación entregadas una sola vez con referencia del proveedor.
- WhatsApp disponible cuando falle el canal principal, sin afirmar que el registro fue exitoso.
- Redirects 308 de un salto; alias fuera de sitemap, canonicales y `hreflang`.
- JSON-LD, sitemap, robots, `llms.txt`, índice de catálogo y 404.
- CSP, HSTS, ausencia de secretos en bundles, consola limpia y `/api/health`.
- Auditoría de accesibilidad sin errores críticos o serios.

## Evidencia

Registrar SHA, URL/deployment ID, fecha, responsable, dimensiones, navegador, referencia de formulario, hallazgos y decisión. Staging solo se aprueba si el correo llegó al buzón controlado y la referencia coincide.

## Prohibiciones

No cambiar DNS, habilitar `/portal`, activar usuarios externos, usar `service_role` en navegador ni apuntar el formulario al CRM mientras continúe el `SECURITY-HOLD`.
