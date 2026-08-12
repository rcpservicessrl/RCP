# Operaciones, datos y gobierno — RC2

## Fronteras de datos

| Sistema | Autoridad | Datos permitidos | Datos prohibidos |
|---|---|---|---|
| Web pública | contenido comercial filtrado y estado temporal del formulario | catálogo público, consentimiento, referencia de entrega | expedientes, credenciales, documentos sensibles, datos de clientes del Hub |
| CRM | relación comercial interna de RCP | contactos, empresas, conversación, oportunidad, evaluación, responsable, etiquetas | ejecución contractual detallada, entregables completos, contabilidad general |
| Delivery Hub | ejecución contractual | proyectos, hitos, tareas vinculadas, especialistas, presupuesto referenciado, evidencia, QA, aceptación, riesgos y cambios | marketing masivo, chat general, emisión e-CF, contabilidad completa |
| RCP Matrix | trabajo técnico | alcance técnico aprobado, commits, releases, evidencia y rollback | contactos comerciales, cobros, expedientes profesionales |

Cada aplicación tiene esquema, credenciales, RLS, almacenamiento y backups propios. `service_role` nunca llega al navegador. El proyecto corporativo no recibe tablas de clientes del Hub.

## Matriz RBAC/RLS del Hub

| Capacidad | Dirección | Coordinación | Pilar/QA/Finanzas/Tecnología | Cliente | Especialista |
|---|---:|---:|---:|---:|---:|
| Ver organización y engagement asignado | todo RCP autorizado | asignados | asignados por función | propia organización | órdenes asignadas |
| Aprobar propuesta/cambio/cierre | sí | preparar | recomendar según función | aceptar/rechazar lo propio | no |
| Asignar especialista | sí | sí | responsable de pilar propone | no | no |
| Ver presupuesto y margen | sí | resumen autorizado | finanzas; otros por necesidad | compromiso/cobro propio, sin margen | pago autorizado propio |
| Cargar evidencia | sí | sí | sí | comentarios/aceptación | tarea asignada |
| Administrar miembros y acceso | dirección/tecnología | invitaciones acotadas | no | contacto administrador propio | no |
| Exportar o revocar | sí | según organización | tecnología/privacidad | solicitud propia | solicitud propia |

RLS exige membresía activa por organización y rol. Ninguna política confía solo en metadata mutable. Las pruebas usan dos organizaciones, dos clientes y dos especialistas para demostrar negaciones cruzadas. Roles privilegiados requieren MFA al abrirse externamente.

## Privacidad, retención y subprocesadores

- Solicitudes no convertidas: revisión a los 90 días y eliminación o anonimización a los 180 días, salvo obligación documentada.
- Postulaciones no activadas: revisión a los 180 días y eliminación a los 365 días, salvo consentimiento vigente o requisito legal.
- Proyectos: conservar contrato, aceptación, facturación referenciada y evidencia mínima según obligación aplicable; separar archivos operativos que puedan eliminarse antes.
- Logs técnicos: 30 días por defecto, sin PII ni texto libre.
- Eventos analíticos públicos: consentimiento previo, identificadores seudónimos y sin datos de contacto.
- Solicitudes de acceso, corrección, exportación o eliminación: registrar identidad verificada, alcance, responsable, decisión y fecha.

Subprocesadores previstos: Vercel (web/runtime), Supabase (base/Auth/Storage), Resend (entrega de correo), Zoho Mail (buzón corporativo), Sentry (errores sin PII), PostHog (analítica pública con consentimiento), Cloudflare Turnstile (protección antiabuso), UptimeRobot (disponibilidad), GitHub (código/CI) y AWS Route 53 (DNS). Cada activación requiere propietario, región/transferencia, datos tratados, retención, DPA/condiciones y plan de salida.

## Onboarding y offboarding

Cliente: oportunidad aprobada → revisión contractual → organización → invitación nominal → aceptación y MFA cuando aplique → acceso mínimo → proyecto y responsables → revisión periódica. Al salir: cerrar cambios, exportar lo acordado, revocar sesiones/tokens, transferir activos, eliminar accesos de terceros y registrar retención.

Especialista: solicitud básica → revisión manual → conflicto/credenciales proporcionales → relación documentada → invitación por orden → acceso mínimo con vencimiento. Al terminar: aceptar evidencia, revocar cuentas/secretos, recuperar activos, confirmar destrucción o retención y registrar cierre. No se reutiliza acceso entre proyectos.

## Backup, restauración e incidentes

- CRM gratuito: backup lógico cifrado diario fuera del proyecto y prueba mensual de restauración aislada.
- Hub local: migraciones versionadas y datos sintéticos regenerables; ningún dato real.
- Hub Pro: backup diario del proveedor, backup lógico cifrado, RPO/RTO aprobados y restauración probada antes de abrir.
- Cada backup registra SHA, fecha, alcance, cifrado, ubicación, responsable y prueba de restauración.

Incidente: detectar → clasificar → contener → conservar evidencia → revocar/rotar → recuperar → validar → comunicar según contrato/ley → postmortem. Nunca se borra evidencia para “limpiar” un incidente. Exposición de datos, autorización rota o formulario que pierde solicitudes obliga rollback o cierre temporal.

## Despliegue y rollback web

1. PR con TypeScript, tests, build Node 24, auditoría y revisión.
2. Preview/staging Vercel con `RCP_DEPLOYMENT_ENV=staging` y `noindex` global.
3. UAT en 390×844, 768×1024, 1280×720 y 1440×900; ES/EN, temas, búsqueda, música, Pulso, formularios, redirects, sitemap, JSON-LD y accesibilidad.
4. Registrar SHA, deployment, variables no secretas y exportación de Route 53.
5. Reducir TTL y cambiar solo apex/`www`; no tocar MX, TXT, Zoho ni otros subdominios.
6. Observar 60 minutos, 24 horas, 7 días y 30 días.
7. Ante 5xx, pérdida de solicitudes, exposición o contenido incorrecto, restaurar DNS a Astro y promover el último deployment estable.

## Inventario de herramientas

| Necesidad | Herramienta | Propietario | Costo objetivo | Salida |
|---|---|---|---|---|
| Código/CI | GitHub | Tecnología | incluido | mirror Git + export de issues/PR |
| Web | Vercel Pro | Tecnología | plan pagado aprobado | Next portable; Cloudflare/OpenNext validado |
| DNS | AWS Route 53 | Dirección/Tecnología | actual | export de zona y cambio de NS controlado |
| Datos/Auth/Storage | Supabase | Tecnología | CRM free piloto; Hub Pro antes de abrir | dump SQL, objetos y usuarios según contrato |
| Correo operativo | Zoho Mail + Resend | Operaciones | mínimo viable | export de buzón y cambio de proveedor/API |
| Antiabuso | Turnstile | Tecnología | gratuito | desactivar claves y sustituir verificador |
| Errores | Sentry | Tecnología | gratuito inicial | export de eventos/reglas; retirar SDK |
| Analítica web | PostHog | Publicidad/Tecnología | gratuito inicial | export de eventos; retirar snippet |
| Monitoreo | UptimeRobot | Tecnología | gratuito inicial | export de monitores/contactos |

No aplican de inicio Clerk, Pinecone, Odoo, n8n ni réplicas de Asana, Notion o Slack: Supabase Auth, los módulos propios y las herramientas existentes cubren el alcance aprobado. Una herramienta nueva requiere necesidad, dueño, datos, costo total, riesgo y salida.

## Gates no negociables

- Web: entrega de formulario comprobada, rollback listo y cero contradicciones públicas.
- CRM: `SECURITY-HOLD` cerrado, migraciones reconciliadas, secretos rotados, aislamiento y restauración probados.
- Hub externo: Supabase Pro separado, contrato revisado, MFA, backups y RLS entre organizaciones aprobados.
