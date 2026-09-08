# Despliegue web RCP Services 6.0-RC2

Este runbook no autoriza pagos, cambios DNS ni envío de secretos. El corte solo ocurre después de UAT aprobado.

## Publicaciones posteriores al corte de septiembre

El dominio ya usa Next.js/Vercel. Para una corrección del sitio existente, prevalece el flujo comprobado en [WEB_PUBLICATION_2026-09-07.md](WEB_PUBLICATION_2026-09-07.md):

1. Revisar el diff autorizado, ejecutar TypeScript y las pruebas vigentes, y registrar el commit exacto.
2. Exportar ese commit con `git archive` a un directorio de entrega, sin archivos locales ni credenciales, y registrar su SHA-256.
3. Usar el proyecto y equipo indicados en el registro. Construir con `vercel deploy --prod --skip-domain`, conservando `RCP_DEPLOYMENT_ENV=production` en compilación y ejecución.
4. Esperar `READY` y aceptar el artefacto exacto: rutas, SVG, imágenes, encuadre responsive, contexto de formularios y ausencia de errores de ejecución. Mantener la protección del deployment; usar únicamente el acceso oficial autorizado.
5. Promover ese deployment con `vercel promote`, verificar aliases y repetir las comprobaciones en `rcp.services` y `www`. Registrar el deployment previo para reversión.

Este flujo no necesita volver a cambiar DNS, contratar un plan, rotar credenciales ni habilitar CRM. Los apartados de corte y gates anteriores que siguen abajo se conservan como referencia histórica; no deben reejecutarse automáticamente para publicar una corrección.

## Referencia histórica del corte inicial

Las secciones de preview, producción Vercel y corte Route 53 que siguen describen el corte inicial de RC2. El dominio ya fue promovido; no se debe repetir ese corte ni cambiar DNS para una corrección posterior. El baseline vigente es TypeScript y 59 pruebas aprobadas, documentado en `WEB_PUBLICATION_2026-09-07.md`.

## Verificación local

Con Node 24:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm run build
pnpm audit --prod --audit-level high
```

Registrar SHA, el baseline vigente de pruebas (59 en la publicación del 2026-09-07), build y auditoría.

## Vercel Preview

1. Vincular al proyecto correcto del equipo RCP.
2. Configurar variables Preview sin reutilizar secretos de Production.
3. Confirmar `RCP_DEPLOYMENT_ENV=preview`.
4. Ejecutar `vercel pull --yes --environment=preview`.
5. Ejecutar `vercel build` y `vercel deploy --prebuilt`.
6. Asociar `staging.rcp.services` solo después de verificar el deployment.
7. Ejecutar `STAGING_RUNBOOK.md` y guardar evidencia.

## Producción Vercel

1. Confirmar plan Pro, PR aprobado, checks obligatorios y SHA exacto.
2. Configurar Production con secretos rotados y de mínimo alcance.
3. Ejecutar `vercel pull --yes --environment=production` y `vercel build --prod`.
4. Publicar con `vercel deploy --prebuilt --prod` y registrar deployment ID.
5. Verificar usando la URL de Vercel antes de tocar DNS.

## Corte Route 53

1. Exportar la zona completa y registrar el destino Astro actual.
2. Reducir TTL con anticipación.
3. Cambiar únicamente apex y `www` a los valores asignados por Vercel.
4. Verificar TLS, redirección `www`/apex, canonicales y entrega del formulario.
5. Observar a los 60 minutos, 24 horas, 7 días y 30 días.
6. Mantener Astro/GitHub Pages como rollback durante 30 días.

## CRM y Hub

El despliegue web no habilita el modo `crm` ni `hub.rcp.services`. Esos cambios tienen gates independientes. El modo cambia a CRM solo después de probar HMAC, idempotencia, aislamiento, backup/restauración y secretos rotados.

## Rollback

Seguir `ROLLBACK_PLAN.md`. Nunca eliminar el deployment anterior ni modificar registros de correo durante la reversión.
