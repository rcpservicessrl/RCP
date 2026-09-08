---
id: web-visual-audit-20260908
project: rcp-services-web
status: partial
recorded_at: 2026-09-08T03:02:21.6621306-04:00
source_refs:
  - a592929d8a207f2af9cde41bf6cb2f5ae40856c2
  - components/editorial-intro.tsx
  - components/editorial-intro.module.css
validation:
  - Public browser and five HTTP probes passed on 2026-09-08.
  - Local TypeScript and 59 existing tests passed.
  - Local responsive checks passed at 1280, 768 and 390 pixels.
supersedes: []
superseded_by: null
owner: RCP Services
---

# Auditoría visual breve — 8 de septiembre de 2026

La web pública conserva el estado publicado documentado en [WEB_PUBLICATION_2026-09-07.md](WEB_PUBLICATION_2026-09-07.md). Esta revisión deja una corrección local sin commit ni despliegue.

## Hallazgo y corrección

Las fotografías verticales de «Explorar mi negocio» se recortaban en marcos de altura fija. En escritorio, la foto de empresas de servicios cortaba dos rostros y ocultaba la mesa. Las dos imágenes declaraban dimensiones horizontales que no correspondían a sus archivos de 1000 × 1250 px.

Se ajustaron los marcos a 3:2 en todos los tamaños y se definió el encuadre de cada escena: comercio al 65 % vertical y equipo hacia abajo. Se corrigieron las dimensiones intrínsecas. La captura local muestra a las tres personas y sus herramientas de trabajo. El cambio es compartido por ES y EN; la revisión visual se realizó en ES.

## Evidencia

- Los tres SVG de marca comprobados son XML válido con raíz SVG y viewBox; no contienen imágenes raster incrustadas. El dominio devuelve HTTP 200 y `image/svg+xml` para los tres.
- El mapa SVG público se dibuja correctamente en escritorio. «Atraer» actualiza el estado y conserva `sitios-web` en la solicitud. Espacio activa «Dar continuidad» y conserva `redes-community`. A 390 px, los tres controles miden al menos 44 px de alto y no hay desbordamiento horizontal.
- Los dos destinos de «Explorar mi negocio» devuelven HTTP 200.
- Ambas fotos corregidas cargan; revisión visual local en escritorio y móvil. A 1280, 768 y 390 px, desbordamiento horizontal medido: 0 px.
- TypeScript, 59 pruebas existentes y `git diff --check`: aprobados. No se ejecutó un build de publicación ni se enviaron formularios.
- Evidencia y hashes de los archivos modificados: `C:/RCP/.artifacts/web-visual-audit-20260908/verification.json`.
- Captura: `C:/RCP/.artifacts/web-visual-audit-20260908/sectors-desktop-after.png`.

## Pendientes

- Publicar la corrección local y comprobar el mismo encuadre en el dominio después de la publicación.
- Conciliar el encabezado histórico del README raíz: todavía dice que el dominio sigue en Astro/GitHub Pages, contrario al registro de publicación vigente.
- La entrega real de formularios y la integración CRM continúan fuera de esta auditoría visual; no se acredita recepción de correo.
- El refresco AST de Graphify advirtió extracción parcial en 23 archivos Astro históricos. Esto limita ese índice; no es un fallo observado en las páginas Next revisadas.
