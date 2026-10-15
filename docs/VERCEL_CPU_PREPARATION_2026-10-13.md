---
id: web-vercel-cpu-preparation-20261013
project: rcpservicessrl/RCP
status: proposed
recorded_at: 2026-10-13T08:15:00Z
source_refs:
  - baseline:ea57abf1ea92cc982cbc9df6ba5579b12463a6ac
  - proxy.ts
  - next.config.ts
  - tests-next/static-resource-security.test.mjs
  - scripts/static-proxy-measure.mjs
validation:
  - production identity read-only: ea57abf / dpl_F1ZjGzEFMfNKz7b3driprDQrh3Ts Ready
  - 104 local tests, types, lint, snapshot and production build passed
  - local Chrome: unchanged static bytes, theme runs, no mobile overflow and SVG scripts blocked
supersedes: []
superseded_by: null
owner: RCP Services
---

# Reducción acotada de CPU: preparación local, sin publicar

Base verificada por GitHub y CLI Vercel el 13 de octubre: master ea57abf,
producción dpl_F1ZjGzEFMfNKz7b3driprDQrh3Ts Ready. El checkout master estaba
limpio; se creó la rama aislada `codex/vercel-cpu-static-proxy-20261013` en
C:/RCP/.worktrees/rcp-cpu-free-20261013 para esta tarea, conservando el trabajo
paralelo y la versión integrada PR34/35. No es una variante de diseño ni un
retroceso de contenido. No se publicó, cambiaron planes, permisos, credenciales,
servicios o configuración remota; cero inferencias.

## Diagnóstico y límites de la medición

La última cifra aportada por el propietario es del **12 de octubre, 15:30 UTC**:
Active CPU 3 h 2 min de 4 h (75,8%). En 30 días, rcp-services-web 58 m 36 s y
fenomeno 34 m 38 s. La muestra de rutas de 12 h (portada 9 s, catálogo 2,79 s,
not-found 2,24 s) no explica por sí sola el total mensual. No se volvió a medir
Usage el 13; no atribuir esas cifras a la carga actual, ataques o volumen de
tráfico. Tampoco se modificó ningún otro proyecto. No se compró Observability Plus.

El código y cuatro HEAD públicos acotados muestran:

- RootLayout lee headers para obtener el nonce; el build identifica casi todas
  las rutas HTML como dinámicas. Portada responde private/no-store y MISS. Es
  compatible con el diseño de seguridad: Next requiere un nonce nuevo por HTML.
- El proxy actual también genera nonce para archivos públicos. theme-init.js y
  manifest.webmanifest respondieron HIT de CDN, pero conservaron nonce por petición.
  Routing Middleware corre antes de la caché; ese trabajo no se evita con HIT.
- business-catalog ya declara s-maxage=30/SWR=60 y el fetch del catálogo público
  revalida cada 30 s. Vercel consume esas directivas antes de enviar al cliente.
  El HEAD único dio MISS; eso no demuestra que no pueda cachear. No se cambió
  su frescura, el catálogo publicado ni las estimaciones comerciales.

No se recomienda cachear HTML con nonce reutilizado, retirar el nonce, añadir
unsafe-inline para scripts, cachear formularios privados o alterar Turnstile.
Cambiar el renderizado global necesita un diseño CSP aparte y no forma parte
de esta preparación. SRI de Next sigue experimental y no es un arreglo mínimo
para el build Turbopack actual.

## Cambio preparado

El matcher omite sólo el namespace de recursos públicos `/assets/` y los archivos
theme-init.js, manifest.webmanifest, icono-rcp.png y logo_rcp_*.png/svg. Conserva
HTML, API, portal, checkout, documentos no encontrados y prefijos parecidos.
Los assets existentes inspeccionados son 64 PNG, 43 WebP y 41 SVG, sin scripts
o foreignObject encontrados en esos SVG.

next.config agrega una CSP fija más restrictiva para esas respuestas estáticas:
default-src/script-src none, sin nonce, con styles/imágenes/fuentes locales para
su representación. Todas las cabeceras globales y los no-store privados siguen
vigentes; el TTL de archivos y catálogo no cambia. Los documentos mantienen su
CSP original, nonce nuevo y controles de origen. No se modifica JSX, copy,
contenido dinámico, precios, Worker AI, formulario ni manifiesto visual.

## Ahorro demostrado y pruebas

La utilidad de matcher instalada en Next comprobó **166 rutas de recursos** que
antes invocaban el proxy y ahora no. Inventario: 199 archivos públicos. El muestreo
local ejecutó 1.660 veces el código previo de nonce/headers y midió **297 ms CPU**;
con la selección nueva esas llamadas pasan a cero. No mide facturación Vercel,
tráfico real, cold starts o CPU SSR. No permite prometer porcentaje mensual ni
que la cuenta completa permanecerá dentro de las 4 h. El ahorro efectivo depende
de cuántas peticiones alcancen esas rutas; HTML dinámico permanece como coste.

Pruebas locales completadas:

- pnpm check: tipos, lint, snapshot, **104/104 tests**, build de 63 rutas.
- Tres tests nuevos verifican matcher con la utilidad real Next, lookalikes y
  rutas privadas, nonces frescos/no inyectables y cabeceras de seguridad/no-store.
- Servidor Next production y Chrome instalado con perfil temporal, tráfico
  externo bloqueado: mismos bytes JS/PNG/SVG, CSP fija en recursos y manifest,
  nonce en HTML/API, GET intake 405/no-store, tema oscuro ejecutado y móvil 390px
  sin overflow. SVG sintético con script y onload fue bloqueado y se retiró.
- Primera ejecución detectó CRLF en snapshot del checkout Windows; normalizado
  a bytes LF del blob Git, sin cambio de contenido. La utilidad Next instalada
  conserva el nombre antiguo unstable_doesMiddlewareMatch; el test usa ese export.

Evidencia local: C:/RCP/.artifacts/vercel-cpu-20261013/local-proxy-measure.json y
local-runtime-result.json. No contiene clientes, conversaciones, valores de
credenciales ni peticiones de IA. Los tests no provocan carga en Vercel.

## Integración posterior acotada

Revalidar master y dominio porque el propietario trabaja en paralelo; integrar
sólo el commit CPU sobre la versión entonces vigente. Crear candidato con el
workflow aprobado, verificar CSP/bytes/tema en las mismas rutas y salud sin
inferencias; publicar únicamente bajo el alcance posterior autorizado. Comparar
invocaciones/Active CPU en ventanas equivalentes con Usage ya disponible, sin
comprar servicios. No borrar deployments, pausar servicios o purgar cachés.

Revertir este cambio sólo restaura matcher y cabeceras estáticas del commit base;
no requiere rollback del sitio a un commit antiguo ni tocar el Worker. Riesgo:
los namespaces omitidos son exclusivamente recursos públicos; contenido futuro
que necesite scripts o lógica por usuario debe ubicarse/revisarse fuera de ellos.

Fuentes oficiales consultadas:

- https://nextjs.org/docs/app/guides/content-security-policy
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://vercel.com/docs/routing-middleware
- https://vercel.com/docs/caching/cache-control-headers
