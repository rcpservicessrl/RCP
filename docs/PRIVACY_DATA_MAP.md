# Mapa de datos personales

| Flujo | Datos | Destino | Base operativa | Estado |
|---|---|---|---|---|
| Contacto | nombre, correo, teléfono, empresa, mensaje | Google Cloud/Odoo | solicitud del usuario | Requiere rate limit y revisión de retención |
| Cotización | nombre, empresa, correo, teléfono, alcance, SKU | WhatsApp iniciado por usuario | consentimiento explícito | No persiste en el sitio |
| Diagnóstico | respuestas y score local | navegador | autoevaluación | PII/envío remoto eliminados |
| Portal | credenciales, perfil, documentos | Supabase Auth/Storage | servicio contratado | RLS verificado; falta prueba E2E por rol |
| Analítica | eventos técnicos y navegación | GA4 | consentimiento | Denegado por defecto |
| Preferencias | idioma, tema, favoritos, consentimiento | almacenamiento local | funcionamiento | Documentado en política de cookies |

Nunca registrar PII en URL, analítica, logs de consola o nombres de archivo. La retención definitiva requiere aprobación legal/operativa.
