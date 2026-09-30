---
id: sitio-web-social-search-20260930
project: sitio-web
status: current
recorded_at: 2026-09-30T04:33:00-04:00
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

El bloqueo de automatización se resolvió para esta tarea usando el control soportado de la extensión de Chrome en el perfil RCP mediante `cua_repl`. El método nativo de Windows había fallado al identificar la URL con suficiente confianza; no se alteró esa protección ni se ha demostrado reparado ese método. La consola de Bing quedó en blanco después de verificar; una recarga recuperó la página y permitió registrar el sitemap.

## Límites y próximo paso

La configuración pública, las verificaciones HTTPS y los envíos de sitemap a Google y Bing están completados. La propiedad de dominio de Google permanece sin verificar en la cuenta RCP; no se necesita para el sitemap y los informes de la propiedad HTTPS confirmada. No se ampliaron permisos de DNS, no se crearon nuevas credenciales OAuth y no se extrajeron cookies. La alternativa gcloud quedó descartada por su respuesta `403` de scopes insuficientes.

El único seguimiento pendiente es revisar los resultados de rastreo, indexación y exclusiones cuando los proveedores terminen de procesar. No reenviar el mismo sitemap mientras esté en Processing ni repetir el POST de IndexNow recibido. La presencia en resultados, citas de IA y posiciones no están garantizadas por el envío. No hay una nueva publicación de código pendiente derivada de estas acciones en las consolas.

Referencias públicas: [IndexNow](https://www.indexnow.org/documentation), [rastreadores de Amazon](https://developer.amazon.com/en/amazonbot), [YepBot](https://yep.com/yepbot/), [Naver Yeti](https://searchadvisor.naver.com/guide/seo-basic-firewall), [SeznamBot](https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/) y [Yandex](https://yandex.com/support/webmaster/en/robot-workings/user-agent).
