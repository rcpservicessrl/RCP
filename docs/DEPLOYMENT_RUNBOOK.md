# Despliegue web RCP Services 6.0-RC2

Este runbook no autoriza pagos, cambios DNS ni envío de secretos. El corte solo ocurre después de UAT aprobado.

## Verificación local

Con Node 24:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm run build
pnpm audit --prod --audit-level high
```

Registrar SHA, 42/42 pruebas o el baseline vigente, build y auditoría.

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
