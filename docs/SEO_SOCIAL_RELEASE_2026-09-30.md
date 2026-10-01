---
id: sitio-web-social-search-20260930
project: sitio-web
status: current
recorded_at: 2026-10-01T02:26:40-04:00
source_refs:
  - daeeff4cb21e6ab8e869eaf2c6655643b787f2d2
  - 77e697c85b13a0bd767fb9f9e53fc8bbe5e5e658
  - 24df54a7b5d2bb755dfa9a6c249e4d1a83d13a97
validation:
  - GitHub Actions 36594438585 passed for daeeff4
  - GitHub Actions 36683224401 passed for 77e697c
  - GitHub Actions 36683871875 passed for 24df54a
  - 50 public canonical routes returned HTTP 200 on 2026-09-30
  - IndexNow returned HTTP 202 for 50 updated URLs on 2026-09-30
  - Google verified the HTTPS URL-prefix property using the published HTML tag on 2026-09-30
  - Google sitemap reported Correcto and 50 discovered pages on 2026-09-30
  - Bing verified the published HTML tag and registered the sitemap as Processing on 2026-09-30
  - Google URL Inspection confirmed the homepage indexed with matching canonical and successful smartphone crawl on 2026-09-30
  - Google live URL test confirmed the published homepage available and indexable on 2026-09-30
  - Bing accepted a technical SEO/GEO scan limited to the public sitemap and 50 pages on 2026-09-30
  - Bing sitemap Success with 50 discovered URLs, zero sitemap errors and warnings on 2026-10-01
  - Bing technical scan Completed for 50 pages with zero errors and 38 image-alt warnings on 2026-10-01
  - Public HTML audit of 50 pages found 340 img elements and zero missing alt attributes on 2026-10-01
supersedes: []
superseded_by: null
owner: RCP Services
---

# Publicación de redes sociales y descubrimiento

## Problema y decisión

Se incorporaron los canales oficiales y se completó la configuración pública de descubrimiento sin duplicar el footer, los datos estructurados ni el sitemap existentes. La aprobación del usuario cubre la publicación, la reversión y los envíos a buscadores. IndexNow se usa para avisar de las URLs modificadas; su respuesta no demuestra indexación ni posición en resultados.

## Cambios publicados

- Footer compartido con Instagram `https://www.instagram.com/rcp.services_`, Facebook `https://www.facebook.com/rcp.servicessrl`, LinkedIn `https://www.linkedin.com/company/rcp-services/` y Threads `https://www.threads.com/@rcp.services_`.
- Teléfono clicable y WhatsApp al `+1-829-806-8092`; en móvil el acceso durante el consentimiento no cubre el contenido principal.
- Meta description, entidades Organization/ProfessionalService/WebSite, `sameAs`, metadatos de verificación de Google y Bing, 50 rutas canónicas con alternates ES/EN y `llms.txt` vigente.
- Reglas específicas para rastreadores de búsqueda e IA, incluidos los participantes de IndexNow; rutas internas excluidas. Amazonbot permanece bloqueado por su uso posible en entrenamiento, mientras Amzn-SearchBot y Amzn-User tienen reglas públicas específicas.
- Clave pública de IndexNow en `/d92c040e3313fcc417122ccdd7145d68.txt`. Es una prueba pública de control del dominio, no una credencial de cuenta.

## Evidencia

Los workflows [36594438585](https://github.com/rcpservicessrl/RCP/actions/runs/36594438585), [36683224401](https://github.com/rcpservicessrl/RCP/actions/runs/36683224401) y [36683871875](https://github.com/rcpservicessrl/RCP/actions/runs/36683871875) completaron las comprobaciones de compilación, pruebas, salud y navegación en escritorio/móvil. Las tres pruebas locales de AEO/GEO también pasaron para la corrección de robots.

Vercel confirmó `dpl_TvyL3GmsG7VfZ4AHPEMcmCt8Wuwz` como Ready/Production en `rcp.services`. El despliegue previo `dpl_2bee836CYQTofXa2wG1SszPX7PZt` es la referencia de reversión del último workflow.

Antes del único POST a `https://api.indexnow.org/indexnow`, se comprobó la clave pública, el sitemap, las reglas de rastreo y HTTP 200 en las 50 URLs. La respuesta fue HTTP 202: recibido, con posible validación de clave pendiente. Evidencia local: `C:/RCP/.artifacts/site-social-seo-20260929/indexnow-submission.json`. No se repitió el envío.

La nota inicial recogía una instantánea del 2026-09-29 con 40 páginas indexadas y 18 sin indexar. No se usa como prueba de la propiedad vigente: el 2026-09-30 la cuenta RCP mostró la propiedad de dominio `rcp.services` sin verificar. La propiedad HTTPS `https://rcp.services/` se verificó automáticamente mediante la etiqueta HTML ya publicada y es la propiedad confirmada para los siguientes resultados.

Google Search Console aceptó `/sitemap.xml` el 2026-09-30, con estado **Correcto**, última lectura del mismo día y **50 páginas descubiertas**. Los informes de indexación y rendimiento muestran «Se están procesando los datos; vuelve a comprobar esta sección mañana». Las secciones Acciones manuales y Problemas de seguridad mostraron «No se ha detectado ningún problema». Core Web Vitals todavía carece de datos suficientes; no se atribuye una puntuación de campo.

Bing Webmaster Tools verificó `https://rcp.services/` mediante la etiqueta HTML publicada. El sitemap `https://rcp.services/sitemap.xml` quedó registrado el 2026-09-30 como **Processing**, con un sitemap conocido, cero errores y cero advertencias reportados en ese momento. Esto demuestra el envío y el acceso a la consola; todavía no demuestra rastreo ni indexación.

Evidencias locales: `C:/RCP/.artifacts/site-social-seo-20260929/google-sitemap-success.png`, `google-index-processing.png` y `bing-sitemap-submitted.png` en el mismo directorio. No contienen credenciales y no se publican en el repositorio.

### Comprobación posterior de indexación y análisis técnico

La inspección individual de `https://rcp.services/` confirmó **La URL está en Google** y **La página está indexada**. El último rastreo fue el 2026-09-30 a las 04:30:31 con el robot para smartphones: rastreo permitido, obtención correcta e indexación permitida. La canónica declarada y la seleccionada por Google coinciden con la URL inspeccionada. Este resultado corresponde a la portada; no demuestra que las 50 páginas estén indexadas. El informe agregado de exclusiones continúa procesándose.

La prueba en tiempo real del 2026-09-30 a las 04:48 confirmó **La URL está disponible para Google** y **La página se puede indexar**. No se solicitó de nuevo la indexación de una portada ya indexada y rastreada ese mismo día. Evidencias: `google-home-indexed.png` y `google-home-live-test.png` en el directorio local anterior.

Bing aceptó el análisis **RCP public SEO GEO audit 2026-09-30**, limitado a `https://rcp.services/sitemap.xml` y 50 páginas. Pasó de **Queued** a **Processing**. Para ese análisis puntual de URLs públicas se autorizó ignorar robots.txt; las reglas publicadas del sitio permanecen vigentes. Se desactivaron los correos del análisis y no se incluyeron subdominios ni rutas privadas. Todavía no hay totales de errores o advertencias del análisis; los guiones no se interpretan como cero. Evidencia local: `bing-site-scan-queued.png`.

Las recomendaciones de Bing mostraron **No data available**. El informe **AI Performance** para Microsoft Copilots and Partners mostró cero citas y ninguna fila entre el 2026-06-29 y el 2026-09-28; la consola aclara que presenta una muestra que puede cambiar con el procesamiento. No se atribuye este resultado a otros buscadores de IA ni se presenta como una garantía de ausencia de citas. Evidencia local: `bing-ai-performance.png`.

El bloqueo de automatización se resolvió para esta tarea usando el control soportado de la extensión de Chrome en el perfil RCP mediante `cua_repl`. El método nativo de Windows había fallado al identificar la URL con suficiente confianza; no se alteró esa protección ni se ha demostrado reparado ese método. La consola de Bing quedó en blanco después de verificar; una recarga recuperó la página y permitió registrar el sitemap.

### Resultados confirmados el 2026-10-01

Bing muestra el sitemap en **Success**, con última lectura del 2026-09-30, **50 URLs descubiertas**, cero errores y cero advertencias de sitemap. Evidencia local: `bing-sitemap-success-20261001.png` en el directorio anterior. El descubrimiento no demuestra indexación completa.

El análisis `d0243c42-e718-4360-97f3-7d4dffb99f48` está **Completed**, con **50 páginas revisadas, cero errores y 38 advertencias**. Todas las advertencias pertenecen a una categoría: `SEO013_ImgAltExists_Failed`, «Alt attribute for images is missing». Evidencias: `bing-site-scan-completed-20261001.png` y `bing-alt-warning-20261001.txt`.

La comprobación del HTML público de las 50 URLs del sitemap encontró **340 elementos img y cero atributos alt ausentes**. Los valores vacíos se corresponden con fotografías ambientales, ilustraciones repetidas junto a su texto, símbolos de marca y avatares decorativos. `ProductArtwork` los envuelve con `aria-hidden`; `Pulso` usa una figura oculta o una leyenda; el botón de ayuda ya tiene nombre accesible. La inspección del DOM renderizado de `/en/contact` confirmó los atributos en producción. Evidencia reproducible: `audit-public-image-alt.py` y `public-image-alt-audit-20261001.json` en el directorio local anterior.

Se conservan los valores `alt=""` de las imágenes decorativas: [W3C WAI](https://www.w3.org/WAI/tutorials/images/decorative/) indica que permiten omitir contenido redundante en lectores de pantalla. La advertencia automática se clasifica como diferencia de criterio del escáner, no como un atributo ausente demostrado. No se añaden descripciones redundantes para eliminar una advertencia de SEO. Las 38 advertencias siguen visibles en el informe de Bing y esta clasificación no equivale a una certificación integral de accesibilidad.

La cuenta RCP y la propiedad HTTPS correcta de Google volvieron a consultarse el 2026-10-01: el informe agregado de indexación aún muestra «Se están procesando los datos; vuelve a comprobar esta sección mañana». Evidencia: `google-index-processing-20261001.png`. El acceso por Chrome se recuperó al obtener el inventario actual y vincular las pestañas ya abiertas después de los intentos que agotaron el tiempo; no se atribuye una reparación del método nativo de Windows.

## Límites y próximo paso

La configuración pública, las verificaciones HTTPS y los envíos de sitemap a Google y Bing están completados. La propiedad de dominio de Google permanece sin verificar en la cuenta RCP; no se necesita para el sitemap y los informes de la propiedad HTTPS confirmada. No se ampliaron permisos de DNS, no se crearon nuevas credenciales OAuth y no se extrajeron cookies. La alternativa gcloud quedó descartada por su respuesta `403` de scopes insuficientes.

El seguimiento pendiente es revisar el informe agregado de exclusiones de Google cuando termine de procesar. El sitemap y el análisis técnico de Bing ya terminaron; sus advertencias se revisaron contra el HTML publicado y el criterio de W3C. La indexación de la portada está confirmada; la cobertura completa todavía no. No repetir el POST de IndexNow recibido ni los envíos de sitemap aceptados sin cambios nuevos. La presencia en resultados, citas de IA y posiciones no están garantizadas por el envío. No hay una nueva publicación de código pendiente derivada de estas acciones en las consolas.

Referencias públicas: [IndexNow](https://www.indexnow.org/documentation), [rastreadores de Amazon](https://developer.amazon.com/en/amazonbot), [YepBot](https://yep.com/yepbot/), [Naver Yeti](https://searchadvisor.naver.com/guide/seo-basic-firewall), [SeznamBot](https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/) y [Yandex](https://yandex.com/support/webmaster/en/robot-workings/user-agent).
