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

Conservar como rollback el despliegue previo
`dpl_9emHny8uQj3b4NgZpQfD4xk61kaH`. No alterar DNS, proveedores de formularios
ni variables productivas. Los siguientes cambios de código siguen el flujo
normal de PR y publicación; esta nota de cierre no requiere otro despliegue.
