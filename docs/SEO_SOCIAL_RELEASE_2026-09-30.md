---
id: sitio-web-social-search-20260930
project: sitio-web
status: partial
recorded_at: 2026-09-30T03:35:00-04:00
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

La revisión visual del 2026-09-29 mostró la propiedad de dominio `rcp.services` activa en Google Search Console, con 40 páginas indexadas y 18 sin indexar. Es una instantánea anterior, no una comprobación actual de sitemap, exclusiones o Core Web Vitals.

## Límites y próximo paso

Quedan por comprobar el sitemap registrado y los motivos de exclusión en Google Search Console, y la verificación/sitemap de Bing Webmaster Tools. La credencial de gcloud existente respondió `403` por scopes insuficientes para Search Console; no se extrajeron cookies del navegador ni se modificaron permisos para eludir ese resultado. El control de navegador/Windows presentó fallos de conexión y de identificación de URL en los intentos anteriores.

Retomar mediante las consolas con la sesión RCP o mediante OAuth con scope `webmasters`, verificar los resultados visibles, evitar un sitemap duplicado y actualizar esta nota con el resultado. Una autorización pendiente del proveedor requiere la intervención del titular; la aprobación general no sustituye ese paso.

Referencias públicas: [IndexNow](https://www.indexnow.org/documentation), [rastreadores de Amazon](https://developer.amazon.com/en/amazonbot), [YepBot](https://yep.com/yepbot/), [Naver Yeti](https://searchadvisor.naver.com/guide/seo-basic-firewall), [SeznamBot](https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/) y [Yandex](https://yandex.com/support/webmaster/en/robot-workings/user-agent).
