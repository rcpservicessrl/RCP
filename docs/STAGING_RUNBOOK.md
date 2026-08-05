# Runbook de staging

## Propósito

Staging permite validar cambios sin modificar `rcp.services`, DNS ni GitHub Pages. La producción canónica sigue siendo GitHub Pages desde `master`.

## Entorno actual

- Proyecto Vercel: `rcp-services-staging`.
- URL de staging: `https://rcp-services-staging.vercel.app`.
- Variable pública de compilación: `PUBLIC_DEPLOYMENT_ENV=staging`.
- Comportamiento: aviso visible de staging y `noindex, nofollow, noarchive`.

## Flujo de trabajo

1. Implementar cambios en una rama y abrir PR.
2. Validar CI y desplegar esa revisión al proyecto de staging.
3. Ejecutar UAT en staging: navegación, móvil, catálogo, cotización por WhatsApp/correo, consentimiento analítico y enlaces legales.
4. Registrar el resultado y aprobar el PR.
5. Fusionar a `master`. GitHub Pages ejecuta el despliegue de producción.
6. Ejecutar smoke test de producción y monitorear durante 60 minutos.

## Límites de seguridad

- No conectar el dominio `rcp.services` a Vercel.
- No usar `vercel --prod` como mecanismo de producción del sitio.
- No guardar tokens, credenciales de Zoho, GA4 o Supabase en el repositorio.
- Mantener datos de prueba sintéticos; la cotización no persiste datos en el sitio.

## Rollback

Staging se reemplaza con un nuevo despliegue de la rama validada. La reversión de producción sigue `docs/ROLLBACK_PLAN.md` y se realiza desde GitHub, no desde Vercel.
