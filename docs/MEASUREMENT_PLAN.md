# Plan de medición

## Objetivos

1. Solicitudes calificadas: apertura de WhatsApp desde cotización validada.
2. Descubrimiento: uso de filtros, búsqueda y selección de SKU.
3. Diagnóstico: inicio y finalización, sin enviar respuestas ni PII.
4. Operación: disponibilidad de catálogo y errores de rutas críticas.

## Eventos propuestos

`catalog_view`, `catalog_search`, `item_select`, `quote_start`, `quote_whatsapp_open`, `diagnostic_start`, `diagnostic_complete`, `contact_submit_error`. No enviar nombre, correo, teléfono, texto libre, RNC, dirección ni SKU confidencial a GA4.

## Gobernanza

Analítica denegada por defecto; propietario Marketing, revisión Privacidad. Cada evento requiere propósito, parámetros permitidos, retención y prueba de consentimiento antes de activarse.
