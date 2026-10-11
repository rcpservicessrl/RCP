---
id: site-demo-showcase-20261011
project: published-web
status: current
recorded_at: 2026-10-11T04:35:00-04:00
source_refs:
  - repository: rcpservicessrl/RCP
    path: components/demo-overview.tsx
    revision: 667322bac904611ce6aaa41d1ae181b089f2da18
validation:
  - local: Next.js 16.3.8 production build; passed
  - local: TypeScript and 56 tests; passed
  - local: production dependency audit; zero vulnerabilities
  - local: mobile, tablet, desktop, light and dark themes, ES/EN navigation; passed
  - remote: GitHub validate and Vercel preview checks; passed
  - remote: production workflow 38124487244 on 667322b; passed
  - remote: anonymous home, /demo and /en/demo HTTP 200; passed
  - remote: public /demo opened in browser with correct CTA and simulation limits; passed
supersedes: []
superseded_by: null
owner: RCP Services
---

# Presentación de la demo abierta

La portada incorpora un botón hacia `/demo`; `/en/demo` ofrece la presentación
en inglés. Ambas páginas enlazan https://mercado-aurora-demo.vercel.app/ y
explican que el comercio, los registros, la consulta RNC y la facturación
electrónica son ficticios. El sistema demo está en español, no contacta DGII y
no emite documentos fiscales válidos. Cada pestaña mantiene su propia prueba.

Las tarjetas describen ventas, inventario, caja, contabilidad, comprobantes,
administración, exportación y reinicio. Se reutilizan el shell editorial y los
colores del tema vigente; las rutas están incluidas en el sitemap ES/EN.

La implementación parte de `origin/master` 31963b6 en un worktree del mismo
repositorio: `C:\RCP\.worktrees\rcp-aurora-demo-link`. El checkout histórico
Astro contiene cambios ajenos y no es la fuente de este despliegue Next.js.

Next.js se actualiza a 16.3.8 y `source-map-js` a 1.2.2 para corregir los avisos
de seguridad de las dependencias productivas. El lockfile conserva pnpm 11.16.0
y Node 24. La auditoría final informa cero vulnerabilidades.

La primera validación GitHub detectó un fallo del resolvedor `next/font/google`
en Linux. Se versionaron las mismas fuentes Latin WOFF2 del build local y sus
licencias SIL OFL mediante `next/font/local`, conservando las familias,
variables CSS y pesos 500–700. La compilación ya no descarga las fuentes.
Referencia técnica: https://nextjs.org/docs/app/api-reference/components/font.

## Publicación verificada

El PR https://github.com/rcpservicessrl/RCP/pull/27 se integró mediante squash
como `667322bac904611ce6aaa41d1ae181b089f2da18`, después de aprobar ambos
checks requeridos. El workflow productivo
https://github.com/rcpservicessrl/RCP/actions/runs/38124487244 terminó con éxito
para ese mismo commit. Vercel informa Ready, target production, despliegue
`dpl_5Edy1EemtL6GZ3mr4dTqm4vjsscv`, con alias https://rcp.services/.

Se verificaron respuestas anónimas 200 de portada, `/demo` y `/en/demo`.
La portada contiene el nuevo botón y ambas presentaciones enlazan la demo.
El navegador abrió `/demo` con las funciones y límites esperados. Su primer
intento de abrir la portada mostró un error de carga del navegador, aunque la
verificación HTTP confirmó el HTML; no se atribuye a una falla del servidor.

Evidencia visual pública: `C:/RCP/artifacts/demo-evidence/site-demo-public.png`.
La demo pública tiene 12 fotografías reales alojadas en ImgBB con respaldo
local, acceso abierto, estado ficticio por pestaña y API empresarial denegada.
Su release independiente es `95f6b93232daaf870c402b5b4b11aeba844e4181`.

## Dirección y catálogo revisados

La dirección solicitada es https://mercadodemo.rcp.services/. Vercel la
verificó para `mercado-aurora-demo` y su health anónimo respondió HTTP 200
con base de datos deshabilitada. El DNS autoritativo observado el 11 de octubre
es Cloudflare (`alice.ns.cloudflare.com`, `cullen.ns.cloudflare.com`); las
referencias históricas de Route 53 no autorizan cambios en esa zona antigua.
Se creó sólo el CNAME `mercadodemo` con el destino recomendado por Vercel,
sin proxy y TTL 60. La evidencia DNS y su estado previo permanecen locales.

El botón ES/EN usa el subdominio solicitado. El catálogo revisado sustituye
las cuatro bebidas alcohólicas por Coca-Cola y 7UP de Fenómeno: diez productos,
todos con imágenes transparentes. Se conservaron las ocho fotografías de
embutidos y quesos y se extrajo el fondo blanco de los dos refrescos mediante
la herramienta integrada de imágenes. La demo cambia a estado versión 4 para
evitar que sesiones anteriores sigan mostrando el catálogo sustituido.

Los ocho originales usan ImgBB; los dos nuevos recortes están incluidos en
el paquete. Su carga a ImgBB queda pendiente porque el navegador dejó de estar
disponible, sin una credencial API de ImgBB configurada. La demo permanece
funcional con los archivos incluidos. Este apartado debe completarse con el
PR y despliegue del cambio de enlace antes de atribuirle publicación remota.

Conservar como rollback de este ajuste el despliegue del lanzamiento anterior
`dpl_5Edy1EemtL6GZ3mr4dTqm4vjsscv`. El anterior a PR 27 es
`dpl_9emHny8uQj3b4NgZpQfD4xk61kaH`. No alterar proveedores de formularios
ni variables productivas. Los siguientes cambios de código siguen el flujo
normal de PR y publicación.

## Electronic and accounting revision 5

PR 28 updates the custom-domain CTA and ES/EN tour to E31/E32/E34. The public demo now generates automatic journal entries and reconciles inventory, customers and suppliers. Electronic invoice previews use grayscale logos, a real demo QR and an illustrative unsigned XML; no DGII connection or certification is claimed. The demo engine passed 26 tests, TypeScript, production build and a zero-vulnerability production dependency audit. Current browser visual QA is pending because the browser surface was unavailable. Website TypeScript and 56 tests passed locally. Record the PR merge and production workflow outcome below after release.

## Confirmed domain and revision 5 publication

PR 28 merged as 9cc0e318cf80d492ea0ee8a70b4e10dec3831eab. Production workflow 38132890877 succeeded, deployment dpl_DyKMEYajQ3YT4YwTzn3xQxntqMXM is Ready, and anonymous /demo and /en/demo HTML points to the custom domain. The homepage keeps its internal /demo button. The demo final build is dpl_4oKnGyy2XxkavqKMrPpQZwVWkubr from 7a2da2581ec27148ad2fa9276289454e90ef9ee7 with 27 engine tests passed. Receipt fiscal status is resolved from the current document after session serialization, avoiding stale reprints. Anonymous health remains 200 with database disabled and business GET/POST APIs remain 403. Both transparent soft-drink PNGs return 200 and match the packaged bytes.

A follow-up corrects the ES/EN SEO descriptions, which still mentioned the paper series despite the updated page content. Current browser/print visual QA and the two ImgBB uploads remain pending. The following release must keep these limits explicit; no actual DGII integration, certification or fiscal-validity claim is authorized.
