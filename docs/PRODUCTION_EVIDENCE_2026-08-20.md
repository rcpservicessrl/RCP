# Evidencia operativa RCP Services 6.0-RC2 — 2026-08-20

## Web pública

- Deployment Vercel productivo: `dpl_BQXiwU5Qg4Xa6WJcUhK8T2KqzfgA`.
- Estado: `Ready`; aliases `rcp.services` y `www.rcp.services` activos.
- `GET /api/health`: HTTP 200, versión `6.0.0-rc.2`, modo `email`.
- `robots.txt`: HTTP 200, indexable y con sitemap.
- `sitemap.xml`: HTTP 200 con URLs públicas.
- `/portal`: HTTP 200 y `noindex`.
- `www.rcp.services`: redirección 308 de un solo salto.
- Formulario público y postulación: entradas inválidas rechazadas con HTTP 400
  antes de cualquier entrega; no se enviaron datos reales durante esta
  verificación.
- Producción tiene variables server-side para Resend, Turnstile, destinatarios
  y modo de entrega. Los valores permanecen cifrados en Vercel.
- El HTML público conserva la promesa principal, los tres pilares y Pulso; no
  expone CRM interno, asuntos legales, e-CF ni estados no comerciales.

## CRM

- PR de bandeja de solicitudes fusionado: `rcpservicessrl/crm#12`.
- PR de concesiones del outbox fusionado: `rcpservicessrl/crm#14`.
- PR de guarda del proyecto Supabase y deriva del ledger fusionado:
  `rcpservicessrl/crm#15` (merge `3c19d1e`).
- CI confirmó secret scan, replay aislado de migraciones, tests, auditoría,
  TypeScript, lint y build.
- El CRM sigue en `SECURITY-HOLD` operativo: su proyecto Vercel no tiene aún
  variables de producción ni se ha cambiado DNS. El transporte Hub permanece
  desactivado (`RCP_HUB_EVENTS_ENABLED=false`).
- `039_outbox_leases.sql` impide que un trabajador vencido complete una fila
  reasignada; los intentos agotados pasan a `dead`.

## Delivery Hub

- PR funcional fusionado: `rcp-delivery-hub#1`.
- PR documental del contrato/outbox fusionado: `rcp-delivery-hub#2`.
- Evidencia del Preview sintético fusionada: `rcp-delivery-hub#3`
  (merge `ec4d5a2`).
- TypeScript, 14 pruebas Vitest, lint, build Next y verificadores SQL locales
  de esquema, contratos, RLS, gates y leases pasan.
- El Hub tiene un Preview privado en Vercel, sin dominio público: `dpl_3UGrKrFQMC4vJDfqWNMJ5EXF16MH`.
  `GET /api/health` confirma `environment=preview`, `dataMode=synthetic`,
  `externalUsers=false`, `crmEvents=disabled` y `outboundEvents=disabled`.
  `robots.txt` y el HTML están marcados como no indexables. No hay usuarios
  externos ni datos reales.

## Decisiones que permanecen pendientes

- Activación del Meta Business Agent/WhatsApp para `+1 829 806 8092`:
  pendiente por decisión expresa; no se modificó la app WhatsApp Business ni
  su catálogo.
- Apertura externa del Hub: requiere Supabase Pro separado, respaldo,
  revisión contractual, MFA privilegiado y prueba RLS entre dos
  organizaciones.
- Migración del CRM a Vercel: requiere cargar credenciales server-side
  separadas, rotación/re-cifrado y prueba de restauración antes de activar
  `crm.rcp.services`.
- Sentry, PostHog y UptimeRobot permanecen diferidos hasta definir propietario,
  retención y alertas; no son requisitos para la web pública actual.

La web está operativa. El ecosistema completo no se declara abierto a clientes
ni especialistas mientras los gates de CRM, Hub y Meta permanezcan pendientes.
