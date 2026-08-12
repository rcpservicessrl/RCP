# Plan de medición Blueprint 5

## Objetivos

1. Entender qué necesidades llevan a una solicitud calificada.
2. Detectar fricción en búsqueda, catálogo, idioma y diagnóstico.
3. Vigilar disponibilidad y errores sin convertir la analítica en un repositorio de datos personales.

## Eventos permitidos

| Evento | Parámetros permitidos |
|---|---|
| `catalog_view` | idioma, pilar o filtro |
| `catalog_search` | solo longitud y cantidad de resultados; nunca el texto |
| `item_select` | ID público del catálogo y posición |
| `diagnosis_start` | idioma y cantidad de referencias |
| `diagnosis_complete` | idioma, canal elegido y estado técnico; sin referencia |
| `search_open` | idioma y contexto de ruta |
| `pulso_guide_open` | idioma y contexto de ruta |
| `contact_submit_error` | código técnico normalizado, nunca texto libre |

## Prohibido

Nombre, empresa, correo, teléfono, WhatsApp, RNC, cédula, dirección, texto del problema, resultado esperado, referencia, contratos, documentos o identificadores internos.

## Gobernanza

La analítica permanece denegada por defecto. PostHog solo puede cargarse tras consentimiento analítico y aprobación del mapa de datos. Los mismos límites aplican a cualquier sustituto. Sentry es observabilidad técnica, pero debe aplicar redacción equivalente y no capturar cuerpos de `/api/inquiries`.
