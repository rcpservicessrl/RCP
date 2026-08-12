# Plan de migración SEO/AEO

1. Congelar SHA, sitemap y métricas disponibles de la producción Astro.
2. Aplicar `REDIRECT_MAP.csv` en el Worker y verificar 307/308.
3. Conservar `/`, `/servicios`, `/diagnostico`, `/nosotros`, `/media`, `/carreras` y legales.
4. Sustituir `/tienda` por `/catalogo`; retirar dashboard, onboarding y propuesta de inversión del sitio público.
5. Publicar canonicales, hreflang, JSON-LD, sitemap, robots y `llms.txt` del mismo build.
6. Después del corte, inspeccionar rutas críticas, 404, cobertura, Core Web Vitals y solicitudes durante 30 días.
7. Si una ruta pierde señal crítica o devuelve errores, usar el rollback del Worker/DNS; no improvisar redirecciones múltiples.
