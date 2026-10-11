---
id: site-demo-showcase-20261011
project: published-web
status: current
recorded_at: 2026-10-11T04:35:00-04:00
source_refs:
  - repository: rcpservicessrl/RCP
    path: components/demo-overview.tsx
    revision: working-tree; release commit recorded by pull request
validation:
  - local: Next.js 16.3.8 production build; passed
  - local: TypeScript and 56 tests; passed
  - local: production dependency audit; zero vulnerabilities
  - local: mobile, tablet, desktop, light and dark themes, ES/EN navigation; passed
  - remote: publication pending approved CI checks
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

Publicar mediante PR con los checks `validate` y `Vercel – rcp-services-web`.
Conservar como rollback el despliegue previo
`dpl_9emHny8uQj3b4NgZpQfD4xk61kaH`. No alterar DNS, proveedores de formularios
ni variables productivas. Registrar la publicación real y su commit en la
evidencia de release; un build local no demuestra la publicación.
