# Mapa de datos personales Blueprint 5

| Flujo | Datos | Destino | Consentimiento/propósito | Estado |
|---|---|---|---|---|
| Diagnóstico público | nombre, empresa, contacto, sector, problema, resultado, canal y referencias públicas | `/api/inquiries`; CRM/Resend solo si están configurados | responder y calificar la solicitud | Implementado; no enviar documentos sensibles |
| Postulación de especialistas | nombre, correo, categoría, experiencia, disponibilidad y enlace profesional público opcional | `/api/specialist-applications`; CRM de especialistas solo si está configurado | evaluar incorporación a la Red de Especialistas | Implementado; sin documentos sensibles ni archivos adjuntos |
| WhatsApp | referencia, empresa y resumen limitado del problema | `wa.me` después de acción del usuario | confirmar el canal | Implementado; el usuario decide abrirlo |
| Zoho/Resend | contenido de la solicitud | buzón institucional | notificación y respuesta | Resend pendiente de credenciales/prueba |
| CRM | solicitud y referencia | RCP CRM server-side | seguimiento comercial | Pendiente de cierre de seguridad y E2E |
| Preferencias | tema, volumen/posición de música y consentimiento | almacenamiento local | funcionamiento | Implementado |
| Analítica | eventos técnicos permitidos | PostHog si se aprueba | analítica consentida | Denegada y no conectada |
| Errores | stack y contexto técnico redactado | Sentry si se aprueba | seguridad y estabilidad | No conectado |
| Portal | identidad, roles, documentos y proyectos | producto autenticado separado | prestación contratada | Fuera del sitio público; pendiente |

Prohibido: PII en URL, sitemap, analítica, logs, nombres de archivo, monitor de disponibilidad o errores sin redacción. La retención final debe ser aprobada por Legal y Operaciones.
