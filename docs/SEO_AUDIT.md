# Auditoría SEO técnica

Fecha: 2026-08-05

## Confirmado

- `BaseLayout.astro` genera `title`, descripción, canonical, robots, Open Graph, Twitter Card y datos estructurados.
- `robots.txt` y `sitemap.xml` existen.
- Las rutas de portal y cotización son `noindex`.
- La propuesta de inversión estaba indexable; se corrigió a `noindex, nofollow, noarchive`.

## Brechas

- Sitemap manual desactualizado y sin páginas legales.
- No hay Search Console verificable desde el repositorio.
- Algunas afirmaciones comerciales carecían de fuente; las de mayor riesgo se retiraron de inicio.
- No existe flujo editorial con estados borrador/revisión/aprobado/publicado.
- Canonical de páginas privadas debe mantenerse fuera de señales de indexación mediante `noindex` y exclusión del sitemap.

## Prioridad

1. Generar sitemap desde rutas públicas aprobadas.
2. Probar canonical/robots/JSON-LD en CI.
3. Registrar propietario, fuente y fecha de revisión de cada claim.
4. Verificar Search Console y monitorear cobertura después del lanzamiento.
