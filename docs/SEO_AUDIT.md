# Auditoría SEO/AEO Blueprint 5

Fecha: 2026-08-11.

## Verificado localmente

- Metadata global y por ruta, canonicales y alternates ES/EN.
- `lang` dinámico correcto: `es-DO` y `en-US`.
- JSON-LD Organization/ProfessionalService, WebSite e ItemList donde aplica.
- Sitemap generado con 24 rutas públicas; todas respondieron HTTP 200.
- Robots excluye APIs, Portal, checkout y rutas internas.
- `llms.txt` y `catalog-index.json` reflejan Blueprint 5.
- `/tienda` redirige a `/catalogo`; dashboard/onboarding a Portal.
- Metadata estática Astro archivada fuera de `public/` para evitar colisiones.
- Contenido esencial renderizado en HTML y embeds externos solo por acción.

## Pendientes del entorno

- Search Console, cobertura, Core Web Vitals y datos reales después del corte.
- Imagen social 1.91:1 dedicada si Marca aprueba una composición adicional; mientras tanto se usa el logo oficial con dimensiones reales.
- URLs individuales para recursos editoriales futuros cuando exista contenido y propietario.
- Revisión periódica de claims, `lastModified`, enlaces y 404.
