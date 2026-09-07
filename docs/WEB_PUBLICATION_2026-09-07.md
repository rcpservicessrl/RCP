# Publicación web RCP Services — 2026-09-07

Estado: **publicado y verificado en https://rcp.services**, con `www` operativo. Este documento sustituye el estado operativo de `WEB_HANDOFF_2026-09-07.md`, que se conserva como historial.

## Fuente exacta y destino

- Repositorio: `C:\RCP\.worktrees\rcp-visual-3-2`, rama `codex/rcp-human-customer-journey`.
- SHA de implementación: `c182d8c3e27ad21f0cf8f28c36a1551c29a9cba4`.
- Deployment de producción: `dpl_8hSiy9t9L7LRWcu9rmwFM58B9ku2`.
- Artefacto: `https://rcp-services-6skadp76e-rcp-services.vercel.app`.
- Proyecto Vercel: `prj_ic8foNHimMF3FVAHz4yLx2ZgcaDr`, equipo `team_FrUB7sn8QI4Gl3EEN8Io7TfF`.
- Fuente exportada mediante `git archive`; SHA-256 del tar: `8fe6dea9e3f0f6ce0bb800473e7bf0b8052e12d60c1ce5800db4593adf2cea3a`.
- Build con `RCP_DEPLOYMENT_ENV=production` en compilación y ejecución, `--prod --skip-domain`. La aceptación se realiza sobre el artefacto que se promoverá, sin reconstruirlo.
- La documentación y actualización del grafo posteriores a ese SHA no cambian el código desplegado.

## Cambios conservados y corregidos

- 31 servicios con 31 imágenes 2.5D distintas; 18 ilustraciones nuevas y originales conservados. Las fotografías naturales acompañan la portada y las secciones de negocio.
- Cabeza oficial del leopardo en Pulso, guía de precios estimados con alcance y exclusiones, navegación bilingüe y selección de servicios.
- El mapa usa botones nativos sobre un SVG decorativo. Cambia ruta y precio, anuncia el resultado y conserva el servicio hasta el formulario.
- Se corrigieron los parámetros singulares de mapa y precios: el formulario valida `servicios`/`services`; se verifica su campo `selectedServices`.
- Se excluyeron los controles del mapa de la regla genérica de movimiento que alteraba su posición. El CSS compilado agrupa esa regla con `:is()`, elevando su especificidad. El centrado con `translate` permanece independiente de los efectos `transform`.
- El sello rotado de portada se desplazó 15 px hacia dentro en tableta: se eliminó el desbordamiento de 4.57 px observado a 768 px, manteniendo escritorio y móvil.

## Evidencia

- TypeScript y 59 pruebas automatizadas aprobados en el SHA final; build remoto READY.
- Aceptación del artefacto: 34 comprobaciones HTTP y 15 recorridos de navegador aprobados. Se probaron mapas ES/EN de portada y servicios, ratón/táctil, Enter/Espacio, movimiento reducido, objetivos de 44 px en reposo y ausencia de desbordamiento en 1440, 768 y 390 px. Catálogo: 31 imágenes diferentes; enlaces del mapa y precios conservan el servicio validado por el formulario. Cero errores JavaScript no capturados.
- Verificación posterior en dominio público, sin credenciales: 9 comprobaciones HTTP más `www`, hashes de imágenes, mapa de portada e interior en móvil y contexto del formulario, 31 imágenes de catálogo distintas y cero errores JavaScript. La API oficial de aliases confirma el deployment final en `rcp.services`.
- El HTML público no contiene `noindex`; el grupo `User-agent: *` permite rastreo. Cloudflare agrega restricciones para bots concretos a `robots.txt`; no son un bloqueo global y no se modificaron.
- Resultados de aceptación del artefacto: `C:\RCP\.artifacts\web-release-c182d8c-20260907\production\`.
- Sondas públicas posteriores a la promoción: `C:\RCP\.artifacts\web-release-c182d8c-20260907\public\`.
- Scripts, capturas, pruebas y manifiesto de fuente: `C:\RCP\.artifacts\web-release-c182d8c-20260907\`.
- `before-promotion.json`, `after-promotion.json` y `production-aliases.json` conservan el estado remoto. El listado resumido de deployment puede omitir aliases; para el dominio prevalece la comprobación de la API específica de aliases.
- Las pruebas de navegador bloquean métodos distintos de GET/HEAD. No envían consultas ni mensajes ni crean registros empresariales.
- El acceso de pruebas al artefacto protegido usó el bypass oficial de Vercel en archivos temporales privados. Esos enlaces y cookies se eliminaron después de la comprobación; no forman parte del repositorio ni de esta evidencia.

## Reversión

Deployment anterior verificado READY: `dpl_2PX45Wg8uPyXtA65oo3G77Aap5uB`, fuente `31963b673fb43ccd3f18480824f7cf385acbfd26`, URL `https://rcp-services-fd88ehh1c-rcp-services.vercel.app`.

Si una comprobación posterior requiere reversión, promover ese deployment mediante `vercel promote dpl_2PX45Wg8uPyXtA65oo3G77Aap5uB --yes --scope rcp-services`, confirmar aliases en Vercel y comprobar `https://rcp.services`. El artefacto anterior está disponible; no se ejecutó una reversión de producción como prueba.

No promover los candidatos descartados `dpl_3ZLbxwMZXr5twn9CXeMs43ANC1a9`, `dpl_HQH9wb53XJZbqtinwcLQ4xGhYKzG` ni `dpl_CeLBevqy3cVbC5Ef2cbxeZ54ZaF6`: preceden a las correcciones finales.

## Trabajo que permanece separado

- La captación informa `deliveryMode=email`. No se acredita integración operativa con CRM ni recepción de correo; no se enviaron formularios a contactos reales.
- Los precios publicados son estimaciones con condiciones, sin ejecución de cobros.
- El alias `rcp-services-staging.vercel.app` pertenece al mismo proyecto productivo; no acredita un entorno de staging aislado.
- La superaplicación corporativa, identidad, persistencia y proveedores tienen evidencia propia en `C:\RCP\RCP-SUPERAPP-CONTINUIDAD-2026-09-07.md`; esta publicación no declara completadas esas integraciones.
