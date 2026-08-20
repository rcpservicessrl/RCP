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

Este resultado es un smoke automatizado, no sustituye una auditoría WCAG
completa de contraste, teclado, lectores de pantalla y movimiento reducido. La
casilla de auditoría completa permanece abierta hasta ejecutarla con una
herramienta especializada en el entorno de CI.
