---
id: web-visual-audit-20260908
project: rcp-services-web
status: verified
recorded_at: 2026-09-08T03:25:33-04:00
source_refs:
  - a85ece2a3b6dede3752fc71f82a7b95a9af532b6
  - components/editorial-intro.tsx
  - components/editorial-intro.module.css
  - components/specialist-application-form.tsx
validation:
  - Public HTTP and browser verification passed on 2026-09-08 after deployment.
  - Public sector-image checks passed at 1280 and 390 pixels.
  - TypeScript, 60 tests, production build, and production audit passed locally or in the accepted Vercel build.
supersedes: []
superseded_by: null
owner: RCP Services
---

# Auditoría visual breve — 8 de septiembre de 2026

La corrección está publicada en `https://rcp.services` desde el deployment
`dpl_wAVmuN8Ux5xmffeizgwQDf34KNgL`, con fuente `a85ece2a3b6dede3752fc71f82a7b95a9af532b6`.
El registro operativo completo está en [WEB_PUBLICATION_2026-09-08.md](WEB_PUBLICATION_2026-09-08.md).

## Hallazgo y corrección

Las fotografías verticales de «Explorar mi negocio» se recortaban en marcos de
altura fija. En escritorio, la foto de empresas de servicios cortaba dos rostros
y ocultaba la mesa. Las imágenes también declaraban dimensiones horizontales que
no correspondían a sus fuentes verticales.

Se ajustaron los marcos a una relación 3:2 en todos los tamaños, se definió el
encuadre de cada escena (comercio al 65 % vertical y equipo hacia abajo) y se
corrigieron las dimensiones intrínsecas. La corrección funciona en español e
inglés.

También se corrigió la clave de idempotencia del formulario de especialistas:
los reintentos conservan la clave mientras el contenido no cambie y generan una
nueva cuando cambia el contenido o la entrega termina correctamente.

## Evidencia pública

- Los tres SVG de marca son XML válido con raíz SVG y `viewBox`; no contienen
  imágenes raster incrustadas. El dominio devuelve HTTP 200 y `image/svg+xml`.
- El mapa SVG se dibuja correctamente en escritorio y móvil. «Atraer» conserva
  `aria-pressed=true` y el destino mantiene `sitios-web` en la solicitud. No hay
  desbordamiento horizontal y los controles móviles cumplen el tamaño táctil.
- Las dos rutas de «Explorar mi negocio» devuelven HTTP 200.
- Las dos imágenes públicas cargan con relación 3:2 a 1280 y 390 px, con sus
  enlaces correctos.
- La verificación pública comprobó ES/EN, catálogo con 31 imágenes distintas,
  `/api/health`, `www` y ausencia de errores de página. No se enviaron formularios.
- Evidencia: `C:/RCP/.artifacts/web-visual-audit-20260908/public-final/public-results.json`,
  `C:/RCP/.artifacts/web-visual-audit-20260908/public-sectors-results.json` y
  `C:/RCP/.artifacts/web-visual-audit-20260908/public-svg-results.json`.

## Límites de evidencia

- Las variables de entrega de correo están configuradas en Production, pero no se
  hizo un envío sintético ni se acreditó la recepción en Zoho; hacerlo requiere
  una sesión autorizada del proveedor o del buzón. La API sí conserva el contrato
  de confirmar éxito sólo cuando el proveedor devuelve una referencia.
- Graphify todavía informa cinco archivos Astro históricos con extracción parcial.
  El sitio ejecutable actual es Next.js; el aviso limita el índice de código
  archivado y no produjo errores en las páginas públicas verificadas.
