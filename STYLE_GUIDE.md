# Guía visual del sitio RCP Services

Fuente normativa:
`../01 - Identidad y Estrategia/Marca/RCP_Services_Sistema_Visual_Agente_v1.0.md`.

## Logo

- Fondo claro: `/logo_rcp_fondo_claro.svg`.
- Fondo oscuro: `/logo_rcp_fondo_oscuro.svg`.
- Metadatos y referencia maestra: `/logo_rcp_master_vectorial.svg`.

No utilizar los PNG históricos `Logo RCP*.png` en código nuevo.

## Sistema

- Ámbar Jaguar: `#FCB53F`.
- Negro Puro RCP: `#000000`.
- Blanco Técnico: `#FEFEFE`.
- Verde Resultado: `#A8CF45`.
- Marrón Orgánico: `#C58F6A`.
- Tipografía: Montserrat, con Arial o Aptos de respaldo.

La interfaz puede usar fondos claros u oscuros. Los recursos ilustrados deben
seguir el cartoon corporativo premium 2.5D y nunca reconstruir el jaguar.

Todo trazo o masa negra del logo y del jaguar usa exclusivamente `#000000`
opaco. No se admiten `#201E1E`, `#373435`, grises oscuros ni `#0000`, ya que
este último es negro transparente en CSS/SVG.

## Experiencia web responsive

### Escala mínima del logo

- Header de escritorio: ancho visual de `190–220 px`.
- Header de tablet: ancho visual de `176–192 px`.
- Header móvil: ancho visual de `138–176 px`, según el viewport.
- Footer: ancho visual de `220–275 px`.
- Portal: ancho visual de `190–260 px`.
- Dashboard: máximo de `210 px` dentro del sidebar.

El logo siempre conserva su relación de aspecto. No se debe volver a controlar
su tamaño únicamente mediante `height` ni reducirlo para compensar una
navegación saturada; en tablet y móvil se colapsa la navegación.

### Jerarquía y densidad

- Cada sección debe comunicar una idea principal, una prueba visual y una
  acción clara.
- Los párrafos de introducción no deben superar aproximadamente `58ch`.
- En móvil, las colecciones de tarjetas se presentan mediante carruseles
  horizontales con `scroll-snap`; el contenido permanece en el DOM para SEO.
- Las preguntas frecuentes usan `details/summary` para conservar contenido
  indexable sin presentar bloques extensos de texto al primer vistazo.
- El símbolo oficial puede funcionar como apoyo ambiental; no se reconstruye,
  deforma ni compite con el logotipo.
- Los elementos flotantes se reducen en móvil. El tour se oculta y los widgets
  secundarios ceden prioridad al aviso de cookies.

### Breakpoints verificados

- Escritorio: `1440 × 900`.
- Tablet: `768 × 1024`.
- Móvil: `390 × 844`.
- Ninguno de estos breakpoints puede producir desbordamiento horizontal.

### SEO y accesibilidad

- Mantener exactamente un `h1` descriptivo por página.
- Conservar `title`, meta description, canonical, Open Graph y JSON-LD.
- Todo logo visible usa `alt="RCP Services"`; el símbolo puramente decorativo
  usa `alt=""` y `aria-hidden="true"`.
- Las mejoras visuales no deben ocultar el contenido principal a buscadores ni
  depender de JavaScript para mostrar la información esencial.
