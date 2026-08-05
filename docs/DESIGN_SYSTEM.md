# Sistema de diseño web

## Fundamentos

| Token | Valor | Uso |
|---|---:|---|
| Acento principal | `#FCB53F` | CTA, foco, datos destacados |
| Fondo principal | `#000000` | Superficie institucional |
| Texto principal | `#FEFEFE` | Lectura sobre fondo oscuro |
| Éxito | `#A8CF45` | Confirmación no ambigua |
| Apoyo cálido | `#C58F6A` | Acentos secundarios limitados |
| Tipografía | Montserrat | Interfaz y contenido |

## Componentes base

- Botón primario: una acción principal por bloque, texto explícito y foco visible.
- Botón secundario: borde y contraste suficientes; no competir con el primario.
- Tarjeta: título, contenido breve y estado accesible; evitar información solo por color.
- Formulario: etiqueta persistente, `autocomplete`, validación nativa y estado `aria-live`.
- Modal/panel: cierre por botón y Escape, foco controlado y fondo no interactivo.
- Navegación: objetivo táctil mínimo de 44×44 px y estado activo perceptible.

## Reglas de responsive y accesibilidad

Puntos de revisión: 390, 768, 1024 y 1440 px. Ningún control flotante puede tapar una CTA, banner de consentimiento o contenido crítico. Objetivo: WCAG 2.2 AA; contraste de texto normal 4.5:1, foco visible, navegación por teclado, reducción de movimiento y semántica HTML antes que ARIA adicional.

## Criterio de aceptación

Cada componente debe tener estados normal, hover, foco, disabled, loading, error y éxito cuando corresponda; además de captura visual móvil/escritorio y prueba de teclado.
