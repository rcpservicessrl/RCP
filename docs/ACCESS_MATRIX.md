# Matriz de accesos RCP Services 6.0-RC2

Fecha: 2026-08-12. Este documento registra capacidad, nunca valores de credenciales.

| Sistema | Acceso verificado | Uso mínimo | Estado/gate |
|---|---|---|---|
| Worktree local | lectura/escritura | implementación y QA | disponible |
| Git/GitHub remoto | lectura y cuenta accesible | rama, PR y CI | falta reconciliar, push y protección de `main` |
| Vercel | cuenta y CLI accesibles | staging y web productiva | falta confirmar equipo Pro, proyecto y variables |
| Route 53 | autoridad vigente conocida | apex/`www` y rollback | no cambiar hasta exportar zona y aprobar UAT |
| Cloudflare | no autenticado | alternativa/OpenNext; Turnstile por credencial separada | Workers/DNS fuera del corte RC2 |
| Supabase corporativo | contexto existente; sin cambios remotos en esta entrega | CRM bajo esquema `crm` | proyecto gratuito ocupado; backup/restore y hold pendientes |
| Supabase Hub | no existe proyecto remoto | Hub local y futuro Pro | usuarios externos bloqueados |
| RCP CRM | repositorio local disponible | ingestión y operación interna | `SECURITY-HOLD` |
| Resend | sin credencial verificada | entrega server-side | bloquea UAT real del formulario |
| Zoho Mail | canal institucional declarado | recepción y respuesta | falta entrega Resend→Zoho de esta versión |
| Sentry/PostHog | no configurados | error sin PII / analítica consentida | activación pendiente de mapa de datos |
| UptimeRobot | no configurado | disponibilidad | crear tras staging estable |
| Revisión contractual | responsable no acreditado | políticas y apertura del Hub | bloquea servicios legales y usuarios externos |

Los secretos viven en Preview/Production o en el proveedor correspondiente, con mínimo alcance y propietario. Nunca se versionan ni se copian al navegador.
