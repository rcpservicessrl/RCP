# Smoke de accesibilidad web — 2026-08-20

Ruta auditada: `https://rcp.services/`  
Superficie: navegador con DOM accesible y logs de consola, sin enviar formularios.

- `lang="es-DO"`, título presente y un `h1`.
- `main`, `header`, `nav` y `footer` presentes.
- 8 imágenes; 0 imágenes sin atributo `alt`.
- Radios y combobox del formulario aparecen con nombres accesibles en el DOM
  (incluidos sus textos de orientación).
- Sin overlay de error de Next.js y 0 errores de consola capturados.
- Sin overflow horizontal en el viewport auditado.
- El honeypot y los campos técnicos de Turnstile son controles ocultos; no se
  consideran campos de interacción del usuario.
- Lighthouse 13.4.1 con axe-core 4.13.0 obtuvo 100/100 en accesibilidad en
  `https://rcp.services/`; no quedaron auditorías binarias fallidas.
- La advertencia semántica de `tabpanel` sobre elementos `article` fue corregida
  en el PR `#19` (`fix(a11y): use valid tabpanel semantics`) y pasó los checks CI.

El resultado automatizado pasó. La revisión manual de teclado, contraste,
lectores de pantalla y movimiento reducido permanece como gate humano separado.
