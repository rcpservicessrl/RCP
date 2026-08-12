# Auditoría del estado actual

> Archivo histórico del sitio Astro al 2026-08-05. Para el candidato Blueprint 5 consulta `docs/README.md` y `VERIFICATION_REPORT_2026-08-11.md`.

Fecha: 2026-08-05  
Rama auditada: `codex/rcp-platform-transformation` desde `06dd37c`  
Producción: `https://rcp.services`  
Estado: descubrimiento completado; estabilización en progreso.

## Resumen ejecutivo

El sitio compila y GitHub Pages sirve 15 rutas, pero el comercio no puede considerarse listo para cobros. La tienda mezcla Supabase con un catálogo estático de respaldo, el checkout acepta artículos y precios desde la URL, calcula descuentos en el navegador y no posee una autoridad de precio del servidor. CardNet está desactivado y PayPal no procesa pagos reales, aunque la interfaz los anuncia como operativos.

La identidad visual vigente está documentada y el logo vectorial correcto existe. Sin embargo, el sitio mezcla el jaguar oficial con emojis, activos heredados y afirmaciones comerciales no trazables. Las páginas privadas principales usan `noindex`, pero la propuesta de inversión permanece pública e indexable. GitHub Pages no aplica las cabeceras declaradas en `vercel.json`.

## Stack verificado

- Astro 5.18.2, JavaScript/TypeScript y CSS.
- Build estático mediante `astro build`.
- npm y lockfile; Node 20 en CI, Node 22 local.
- GitHub Actions y GitHub Pages como hosting canónico.
- Supabase corporativo `wpfovxgbennpgydbellw`, esquema `public`.
- Cloud Function HTTP para captación de leads y sincronización con Odoo.
- Google Analytics 4 condicionado por el banner de cookies.
- No existen scripts de test, lint o typecheck en `package.json`.

## Revalidación de la auditoría base

| # | Hallazgo | Estado | Evidencia | Impacto | Prioridad | Recomendación |
|---:|---|---|---|---|---|---|
| 1 | Productos genéricos o RD$0 | Confirmado | `public/tienda.js:79-153`; producción muestra Diagnóstico 360 a RD$0 | Catálogo no confiable | P0 | Eliminar fallback comercial y representar lo gratuito explícitamente |
| 2 | Checkout con RD$0 | Confirmado | `src/pages/checkout.astro:275-351`; botón habilitado en producción | Pedido inválido y UX engañosa | P0 | Bloquear checkout vacío y todo total no positivo |
| 3 | Precios contradictorios | Confirmado | portada, `public/tienda.js` y `src/pages/checkout.astro:236-245` | Riesgo comercial | P0 | Fuente única versionada |
| 4 | Precios codificados en varios componentes | Confirmado | `public/tienda.js:80-153`; `src/pages/checkout.astro:236-245` | Drift inevitable | P0 | Retirar precios del cliente como autoridad |
| 5 | Diagnóstico dependiente del cliente | Confirmado | `src/pages/diagnostico.astro:70-207` | Metodología opaca y frágil | P1 | Renderizar metodología y dimensiones en HTML |
| 6 | Diagnóstico interpretable por buscadores | Parcialmente confirmado | solo título y primera pregunta están en HTML de producción | Cobertura semántica incompleta | P1 | Publicar explicación y metodología en servidor |
| 7 | Áreas privadas indexables | Parcialmente descartado | portal, dashboard, onboarding y checkout tienen `noindex`; propuesta de inversión no | Riesgo de exposición interna | P0 | Clasificar propuesta y aplicar control/noindex |
| 8 | Formularios sin consentimiento claro | Confirmado | portada, portal, checkout, carreras y diagnóstico | Privacidad y cumplimiento | P0 | Consentimiento específico y enlaces legales |
| 9 | Estadísticas/resultados sin fuentes trazables | Confirmado | `src/pages/index.astro:102,162,411-441` | Riesgo reputacional | P0 | Retirar o marcar hasta verificar |
| 10 | Referencias legales actualizadas | No verificable | no hay revisión jurídica fechada ni páginas legales | Riesgo legal | P0 | Validación profesional y páginas legales |
| 11 | Media concentra contenido sin URL individual | Confirmado | `src/pages/media.astro` | SEO/AIO limitado | P2 | Migrar recursos valiosos a URL propia |
| 12 | Portada con exceso de módulos | Confirmado | 13 bloques más widgets superpuestos | Jerarquía y rendimiento | P1 | Narrativa editorial y reducción de ruido |
| 13 | Dashboard controla información clave | Parcialmente confirmado | CRUD de productos, cupones y clientes; no controla contenido/SEO | Administración incompleta | P1 | Expandir por contratos y permisos |
| 14 | Productos e imágenes desconectados | Confirmado | fallback emoji; activo `rcp-mascot-official-views.png` vacío | Marca y conversión | P1 | Inventario de activos y fallos explícitos |
| 15 | Rutas/CTA inconsistentes | Parcialmente confirmado | proveedores anunciados pero desactivados/simulados | Confianza | P0 | Ajustar copy al estado real |
| 16 | Datos de demostración visibles | Confirmado | testimonios no trazables y métricas de ejemplo | Publicación engañosa | P0 | Retirar hasta evidencia y consentimiento |
| 17 | Precio validado por servidor | Confirmado como ausente | `custom_items` proviene de query string | Manipulación de importe | P0 | Endpoint/RPC server-side de cotización/orden |
| 18 | Cliente puede manipular importes | Confirmado | `src/pages/checkout.astro:229-248` | Integridad comercial | P0 | Enviar solo SKU/cantidad; recalcular en servidor |
| 19 | Duplicación web/dashboard/base | Confirmado | Supabase + fallback estático + paquetes hardcoded | Drift y errores | P0 | Catálogo central con publicación versionada |
| 20 | Datos públicos coinciden con documentos oficiales | Parcialmente confirmado | marca vigente sí; precios, claims y “leopardo” no | Inconsistencia institucional | P0 | Registro de afirmaciones y propietarios |

## Evidencia de ejecución

- `npm run build`: correcto, 15 páginas generadas.
- `npm audit --omit=dev`: 4 vulnerabilidades altas y 1 baja; el arreglo total requiere Astro 7.
- Supabase: proyecto `ACTIVE_HEALTHY`; inspección remota solo de metadatos.
- GitHub Pages: `built`, HTTPS obligatorio, despliegue por workflow desde `master`.
- Producción: portada, tienda, checkout, diagnóstico y portal respondieron HTTP 200.
- DOCX corporativos: texto extraído; QA visual no disponible porque LibreOffice no está instalado.

## Límites de esta fase

- No se consultaron registros personales ni datos comerciales individuales.
- No se ejecutaron escrituras remotas, migraciones, rotaciones, DNS ni despliegues.
- No se validó jurídicamente ninguna afirmación o documento legal.
