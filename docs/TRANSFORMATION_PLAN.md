# Plan de transformación

## Entrega 1 - Estabilización

- Bloquear checkout vacío y payloads manipulados.
- Ocultar métodos de pago no operativos y retirar mensajes falsos de éxito.
- Retirar fallback comercial de precios.
- Corregir superposición móvil de widgets.
- Clasificar/retirar claims y testimonios no verificados.
- Aplicar `noindex` a contenido interno pendiente.
- Añadir tests, verificación de rutas y gates CI.

Salida: sitio honesto y no cobrable hasta que exista autoridad servidor.

## Entrega 2 - Catálogo central

- Modelo versionado de producto/servicio/precio.
- Estados borrador, revisión, publicación y vigencia.
- RPC/endpoint de cotización y orden idempotente.
- Auditoría de cambios y permisos.
- Migración reproducible en staging con conteos y rollback.

## Entrega 3 - Sistema de diseño

- Tokens oficiales completos.
- Componentes accesibles, estados y movimiento reducido.
- Inventario de iconos/ilustraciones y activos permitidos.
- Eliminación progresiva de emojis decorativos.

## Entrega 4 - Web pública

- Portada narrativa y claims verificables.
- Arquitectura de soluciones/servicios sin páginas vacías.
- Recursos con autoría, fechas y fuentes.
- Diagnóstico con metodología aprobada y contenido server-rendered.

## Entrega 5 - Tienda y cotización

- Página por producto cuando exista contenido real.
- Imágenes oficiales/licenciadas y alt text.
- Carrito por SKU/cantidad.
- Checkout sandbox con validación servidor, webhooks e idempotencia.

## Entrega 6 - Portal y administración

- RBAC completo y pruebas de autorización.
- Gestión de catálogo, contenido, SEO, leads, órdenes y auditoría.
- Recuperación, sesiones, exportación e historial.

## Entrega 7 - Lanzamiento

- Staging representativo.
- Backup y prueba de restauración.
- SEO/redirects, accesibilidad, rendimiento y seguridad.
- PR revisado, ventana de cambio, smoke tests y monitoreo.

## Gates obligatorios

1. Build, unitarias, integración y E2E críticos.
2. Ningún secreto ni dato personal en Git/logs.
3. Precio servidor y pagos sandbox verificados.
4. RLS/RBAC probados con usuario permitido y denegado.
5. Legal/claims aprobados por propietario.
6. Lighthouse y teclado en rutas clave.
7. Rollback probado y responsable asignado.
