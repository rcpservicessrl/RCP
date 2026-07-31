# Nodo: Experiencia visual responsive RCP Services

## Decisión

La experiencia pública de `https://rcp.services` debe priorizar exploración
visual progresiva, legibilidad y acciones claras. La densidad no se resuelve
eliminando contenido indexable: se organiza mediante tabs, carruseles
horizontales, FAQ desplegable y jerarquía semántica.

## Autoridad visual

- Sistema rector:
  `../01 - Identidad y Estrategia/Marca/RCP_Services_Sistema_Visual_Agente_v1.0.md`.
- Guía operativa del sitio: `STYLE_GUIDE.md`.
- Logo oscuro: `public/logo_rcp_fondo_oscuro.svg`.
- Logo claro: `public/logo_rcp_fondo_claro.svg`.
- Símbolo: `public/logo_rcp_simbolo.svg`.
- Negro canónico de todo trazo y masa oscura del logo: `#000000` opaco.

## Apariciones verificadas

1. Header y footer compartidos por `BaseLayout.astro`.
2. Cuatro estados de acceso en `portal.astro`.
3. Sidebar del dashboard.
4. Símbolo ambiental de la portada.
5. Favicon, PWA, Open Graph y JSON-LD.

## Reglas técnicas

- Header: `190–220 px` en escritorio, `176–192 px` en tablet y `138–176 px`
  en móvil.
- Footer: `220–275 px`.
- Portal: `190–260 px`.
- Dashboard: máximo `210 px`.
- Nunca deformar la relación de aspecto.
- No introducir `#201E1E`, `#373435`, `#0000` ni otro negro alternativo en el
  maestro, el jaguar o sus derivados.
- No usar nombres históricos en código activo.
- No debe existir overflow horizontal en `1440×900`, `768×1024` o `390×844`.
- El tour rápido se omite en móvil para reducir competencia visual.
- Las colecciones extensas usan `scroll-snap` móvil y mantienen el texto en el
  HTML.

## Evidencia de validación

- Astro genera 15 rutas estáticas.
- Las rutas públicas compartidas contienen el logo oficial en header y footer.
- Portal carga el logo oficial en sus cuatro estados.
- Dashboard compila el logo oficial con ancho máximo de `210 px`.
- El script global protege los controles de navegación opcionales para no fallar
  en dashboard ni en otras vistas sin header público.
- Los layouts cargan una URL versionada del script global para evitar que un
  service worker anterior entregue código obsoleto en el primer acceso.
- Los logos, la hoja de estilos y el manifiesto usan la versión de recurso
  `1.0.2-black`; los scripts que alternan variantes usan
  `34-pure-black-brand`, y el service worker `v34`, para retirar inmediatamente
  copias grisáceas almacenadas en caché.
- La portada conserva canonical, meta description, Open Graph y JSON-LD
  Organization, WebSite y FAQPage.
