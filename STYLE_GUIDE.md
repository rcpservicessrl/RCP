# 🐆 RCP Services - Manual de Estilo de Diseño y Código (v13)

Este manual de estilo sirve como la fuente única de verdad para el diseño visual, la arquitectura de interfaces, y los estándares de desarrollo de código de la plataforma web de **RCP Services SRL**. Su propósito es guiar a todos los diseñadores, copywriters y desarrolladores para mantener una estética unificada, responsive y premium.

---

## 🎨 1. Sistema de Colores (Paleta Cromática)

La paleta cromática de RCP Services está optimizada para transmitir **soberanía, blindaje institucional y velocidad estratégica**. Combina tonos de oro ámbar con grises profundos glassmórficos y fondos puros.

### Colores Clave (Hex & HSL)

*   **Amarillo Oro/Acento (`--accent`)**:
    *   **HEX**: `#FCB53F`
    *   **HSL**: `hsl(38, 97%, 61%)`
    *   **Uso**: Botones primarios (CTAs), textos destacados, estados activos, y bordes interactivos.
*   **Negro Fondo Absoluto (`--black`)**:
    *   **HEX**: `#0C0C0D`
    *   **HSL**: `hsl(240, 6%, 5%)`
    *   **Uso**: Fondo principal de la web (modo oscuro).
*   **Gris Profundo Primario (`--black-2` / `--card-bg`)**:
    *   **HEX**: `#151517`
    *   **HSL**: `hsl(240, 5%, 9%)`
    *   **Uso**: Tarjetas (cards), secciones alternativas de fondo, y barras de navegación secundarias.
*   **Gris Claro de Texto (`--text` / `--text-muted`)**:
    *   **Texto Principal**: `#EAEAEA` (`hsl(0, 0%, 92%)`)
    *   **Texto Muted**: `#8E8F94` (`hsl(230, 2%, 57%)`)

### Estándar CSS de Variables de Tema (`styles.css`)

```css
:root {
  --font: 'Montserrat', 'Bahnschrift', sans-serif;
  --accent: #FCB53F;
  --accent-dark: #e59e2b;
  --black: #0c0c0d;
  --black-2: #151517;
  --black-3: #1a1a1c;
  --card-bg: rgba(21, 21, 23, 0.7);
  --card-border: rgba(255, 255, 255, 0.08);
  --text: #eaeaea;
  --text-muted: #8e8f94;
  --radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Modo Claro Dinámico */
[data-theme="light"] {
  --black: #f5f5f7;
  --black-2: #ffffff;
  --black-3: #f0f0f2;
  --card-bg: rgba(255, 255, 255, 0.85);
  --card-border: rgba(0, 0, 0, 0.08);
  --text: #1a1a1c;
  --text-muted: #6e6e73;
  --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
}
```

---

## ✍️ 2. Tipografía y Jerarquía Visual

*   **Tipografía de Encabezados y Títulos**: **Bahnschrift** (estilo condensado) o **Montserrat** (pesos 700 y 800) para un impacto audaz y moderno.
*   **Tipografía de Cuerpo**: **Montserrat** (pesos 400 y 500) para una lectura fluida.
*   **Jerarquía Estándar de Tamaños**:
    *   `h1` (Títulos Hero): `clamp(2.5rem, 5vw, 3.8rem)`
    *   `h2` (Títulos de Sección): `clamp(1.8rem, 3.5vw, 2.6rem)`
    *   `h3` (Subtítulos/Tarjetas): `1.3rem - 1.5rem`
    *   `p` (Cuerpo de texto): `0.95rem - 1.05rem`
    *   `small` (Etiquetas/Tooltips): `0.8rem`

---

## 📱 3. Responsive & Layouts (Grid y Flexbox)

*   **Puntos de Quiebre (Breakpoints)**:
    *   **Desktop Extra Ancho**: `1440px`
    *   **Desktop Estándar**: `1150px` (aquí se activa el menú móvil hamburguesa)
    *   **Tablet**: `768px` (los grids de 3 columnas pasan a 1 o 2 columnas)
    *   **Móvil**: `480px`
*   **Regla de Oro en Grids**: Usar `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` para garantizar adaptabilidad automática antes de recurrir a media queries.
*   **Márgenes de Contenedor**:
    *   Usar la clase `.container` con un ancho máximo de `1200px` y `padding: 0 24px` laterales.
    *   Márgenes entre secciones: `margin-bottom: clamp(60px, 8vw, 100px)`.

---

## 🏢 4. Reglas de Interfaz (UI) y UX Premium

1.  **Glassmorphism Coherente**:
    *   Todas las tarjetas y headers flotantes deben usar `background: var(--card-bg)` combinado con `backdrop-filter: blur(12px)` y `border: 1px solid var(--card-border)`. Esto da profundidad y elegancia premium.
2.  **Transiciones y Micro-animaciones**:
    *   Todos los botones y enlaces interactivos deben tener `transition: var(--transition)`.
    *   Utilizar la clase `.animate-on-scroll` en conjunto con el observador de intersección en JavaScript para efectos de fundido ascendente (`fade-up`) en scrolls.
3.  **Logos Dinámicos (`.theme-logo`)**:
    *   Cualquier imagen con el logo de la empresa sensible al fondo debe llevar la clase `.theme-logo`.
    *   El motor del tema en `script.js` se encargará de cambiar automáticamente el atributo `src` entre `Logo RCP  fondo negro.png` (modo oscuro) y `Logo RCP Services.png` (modo claro).

---

## 💻 5. Estándares de Código y Desarrollo

1.  **Cero Estilos Inline**:
    *   Prohibido usar el atributo `style="..."` directamente en el código HTML. Todos los estilos deben estar estructurados en clases y definidos en `styles.css`.
2.  **Internacionalización (i18n)**:
    *   Ningún texto de marketing o interfaz debe estar hardcodeado en los HTMLs principales.
    *   Utilizar el atributo `data-i18n="clave-de-traduccion"` en las etiquetas HTML y sincronizar las claves correspondientes en los diccionarios `translations.es` y `translations.en` de `script.js`.
3.  **Scroll Seguro en Móvil**:
    *   Al abrir el menú móvil hamburguesa, se añade la clase `.menu-open` al `body` para bloquear el scroll de fondo (`overflow: hidden`).
    *   El contenedor del menú móvil `.nav-links.open` debe usar `z-index: 2100` y `overflow-y: auto` para permitir al usuario desplazarse libremente entre los enlaces en pantallas pequeñas de forma scroll-safe.
