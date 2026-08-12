# Registro de riesgos Blueprint 5

| ID | Riesgo | Impacto | Control | Estado |
|---|---|---:|---|---|
| R5-001 | Corte sin acceso/backup DNS | Crítico | exportación y aprobación obligatorias | Abierto externo |
| R5-002 | Solicitud aceptada pero no registrada | Alto | respuesta `recorded`, WhatsApp y prueba E2E | Mitigado local; integración pendiente |
| R5-003 | Spam al endpoint | Alto | honeypot, límites y validación | Rate limit/WAF pendiente |
| R5-004 | Portal confundido con producto listo | Alto | placeholder noindex y límites visibles | Destino/Auth pendiente |
| R5-005 | Políticas sin dictamen legal | Alto | borrador prudente y fuentes oficiales | Revisión humana pendiente |
| R5-006 | Analítica/errores reciben PII | Alto | no conectados; plan sin texto libre | Activación condicionada |
| R5-007 | Metadata Astro reaparece | Medio | archivo fuera de `public/` y prueba CI | Controlado |
| R5-008 | Menú móvil recortado por contenedor | Medio | portal a `document.body` y prueba 390 × 844 | Cerrado |
| R5-009 | Selección perdida entre catálogo y diagnóstico | Alto | normalización server-side y prueba CI | Cerrado |
| R5-010 | OpenNext falla en Windows por symlink | Medio | pnpm hoisted y bundle verificado | Cerrado |
| R5-011 | Publicación automática al destino anterior | Crítico | workflow Pages sustituido por deploy manual | Controlado; requiere ambiente protegido |
| R5-012 | Claims, casos o precios no aprobados | Alto | catálogo sin precios y registro editorial | Aprobación comercial pendiente |

Rollback inmediato ante exposición de datos, 5xx sostenido, formulario sin salida, identidad incorrecta, autenticación rota o contenido legal/comercial no aprobado.
