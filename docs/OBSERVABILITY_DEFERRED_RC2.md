# Observabilidad diferida formalmente — RC2

Fecha: 2026-08-20  
Propietario: Tecnología RCP Services

La web pública y los pilotos continúan operativos sin activar estos
subprocesadores. La decisión es deliberada: no se enviarán datos de contacto,
texto libre, WhatsApp ni contenido de formularios a una herramienta de
observabilidad antes de cerrar el mapa de datos y sus responsables.

## Sentry

Estado: diferido. Se activará cuando exista un proyecto con retención definida,
DSN separado por Preview/Production, filtros de PII probados y responsable de
respuesta. El healthcheck y los logs de Vercel son la evidencia temporal.

## PostHog

Estado: diferido. No se registra analítica de negocio durante RC2. La futura
activación exigirá consentimiento, eventos allowlistados y exclusión explícita
de nombres, teléfonos, correos, texto libre y referencias de solicitudes.

## UptimeRobot

Estado: diferido hasta aprobar staging y escalamiento. Las sondas previstas
son únicamente:

- `https://rcp.services/api/health` (web pública);
- `https://crm.rcp.services/api/health?probe=liveness` (cuando exista DNS y
  producción CRM);
- health del Hub solo después de Supabase Pro y apertura externa.

## Criterio de salida

Cada herramienta se habilita solo con propietario, retención, alertas,
consentimiento cuando corresponda, prueba sin PII y exportación/retirada
documentadas. Este diferimiento no autoriza activar el CRM o el Hub externo.
