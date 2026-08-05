# Mapa de datos personales

| Flujo | Datos | Destino | Base operativa | Estado |
|---|---|---|---|---|
| Contacto | nombre, correo, teléfono, empresa, mensaje | WhatsApp o Zoho Mail, según el canal elegido | solicitud del usuario | No persiste en el sitio; Zoho conserva el correo recibido |
| Cotización | nombre, empresa, correo, teléfono, alcance, SKU | WhatsApp iniciado por usuario o Zoho Mail | consentimiento explícito | No persiste en el sitio; retención operativa de consulta: hasta 24 meses |
| Diagnóstico | respuestas y score local | navegador | autoevaluación | PII/envío remoto eliminados |
| Portal | credenciales, perfil, documentos | Supabase Auth/Storage | servicio contratado | RLS verificado; falta prueba E2E por rol |
| Analítica | eventos técnicos y navegación, sin campos de contacto | Google Analytics 4 administrado por RCP | consentimiento | Denegado por defecto; publicidad y personalización denegadas |
| Preferencias | idioma, tema, favoritos, consentimiento | almacenamiento local | funcionamiento | Documentado en política de cookies |

Nunca registrar PII en URL, analítica, logs de consola o nombres de archivo. La retención definitiva requiere aprobación legal/operativa.
