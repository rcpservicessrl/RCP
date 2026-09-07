# Candidato de publicación web — 2026-09-07

La reconstrucción local está compilada y sus pruebas automatizadas pasan. Todavía no se ha desplegado este candidato ni se ha completado su UAT en navegador.

## Identificación reproducible

- Repositorio de trabajo: `C:\RCP\.worktrees\rcp-visual-3-2`.
- Rama: `codex/rcp-human-customer-journey`.
- Base publicada: `31963b673fb43ccd3f18480824f7cf385acbfd26`.
- Build Next local: `c_Gl2sIXKIHORaotEMLbA`.
- Huella SHA-256 de los 54 archivos de implementación modificados: `82679f910264e9e8b2db04e160568fd73c2f787a977e587efcff418a1b63811a`.
- `WEB_RELEASE_ARTIFACTS_2026-09-07.json` contiene las rutas, tamaños y hashes individuales del código y arte afectados, junto con cinco archivos de identificación del build.
- El commit que incorpora este documento fija el candidato. El build corresponde a sus archivos de implementación; los documentos de evidencia se añadieron después de compilar.

El resultado es un build Next en `.next`. No se creó un paquete Vercel `.vercel/output`; no debe tratarse como un artefacto Vercel precompilado.

## Alcance comprobado

- Catálogo: 31 servicios con 31 imágenes distintas por ruta y SHA-256. Se añadieron 18 ilustraciones 2.5D; permanecen las 14 originales.
- Portada: escena natural de una comerciante y sus asesores. Las otras 20 fotografías siguen disponibles para colocación editorial.
- Pulso: cabeza oficial de RCP en la burbuja.
- Mapa SVG: tres prioridades con activación por ratón y teclado, pasos orientativos, estimación y enlace que conserva el servicio.
- Precios: cinco estimaciones con alcance, periodicidad y exclusiones. No son precios de checkout ni ejecutan cobros.
- Catálogo sin resultados: acción para restablecer búsqueda y filtros.

## Verificación realizada

| Comprobación | Resultado |
| --- | --- |
| `pnpm run typecheck`, Node con heap máximo de 768 MB | Aprobada |
| Suite completa, ejecución secuencial | 59 aprobadas, 0 fallidas |
| `pnpm run build`, Next 16.3.3 | Aprobada, 65/65 páginas generadas |
| `pnpm audit --prod --audit-level high` | Sin vulnerabilidades conocidas |
| Ilustraciones adicionales | 18 WebP de 640 × 640, alpha comprobado, 48,368–85,478 bytes cada uno |
| Revisión de cambios y archivos sensibles | Sin variables ni credenciales incluidas |
| Publicación de este candidato | No realizada |

Para limitar trabajadores durante el build se usó `CIRCLE_NODE_TOTAL=2`; el código instalado en `next/dist/server/config-shared.js` calcula un trabajador con ese valor. También se limitaron `RAYON_NUM_THREADS=2` y `UV_THREADPOOL_SIZE=2`. No se modificó la configuración del producto para esta validación.

## Estado remoto consultado

Vercel confirma el proyecto `prj_ic8foNHimMF3FVAHz4yLx2ZgcaDr`, equipo `team_FrUB7sn8QI4Gl3EEN8Io7TfF`, Node 24 y deployment productivo READY `dpl_2PX45Wg8uPyXtA65oo3G77Aap5uB`, construido desde la base publicada anterior. Su URL es `rcp-services-fd88ehh1c-rcp-services.vercel.app`.

Los alias `rcp.services`, `www.rcp.services` y `rcp-services-staging.vercel.app` apuntan a ese mismo deployment. Por ello, el alias que contiene “staging” no demuestra separación respecto a producción.

La consulta del equipo devuelve plan Hobby. El runbook histórico presupone Pro y un corte desde Astro; esas instrucciones no describen íntegramente el estado actual. Este pase continúa el desarrollo y prepara evidencia sin modificar planes, DNS, variables, proveedores ni datos.

El intento de consultar `/api/health` mediante la herramienta web no devolvió una respuesta utilizable. No se cuenta como una prueba HTTP ni de disponibilidad.

## Pendiente antes de afirmar aceptación o promoción

- Recorridos en 390 × 844, 768 × 1024 y 1440 × 900, ES/EN y claro/oscuro: portada, precios, 31 tarjetas, selección, limpieza de filtros, Pulso y mapa SVG con teclado.
- Continuidad desde cada prioridad y precio hasta `/diagnostico` y `/en/diagnosis`, conservación de selección y recuperación de errores.
- UAT de la versión Preview exacta, con `noindex` y contexto Preview comprobados; no reutilizar el alias productivo de staging como prueba de aislamiento.
- Respuestas HTTP de `/`, `/en`, `/catalogo`, `/en/catalog`, `/soluciones-tecnologicas`, `/nosotros`, `/api/health`, sitemap, robots y redirecciones.
- Prueba controlada de formularios con confirmación real del proveedor. Las pruebas automatizadas existentes verifican contratos, pero no acreditan entrega de correo ni conexión operativa con CRM.
- Verificar el SHA de la versión desplegada y conservar el deployment estable anterior como destino de reversión. No se ensayó una reversión en remoto.

La publicación web no habilita CRM, Hub, Portal ni integraciones operativas pendientes.
