# Mapa del repositorio web RCP Services 6.0-RC2

## Autoridad

- Checkout Astro preservado: `C:\RCP\RCP Services\Sitio-Web`.
- Worktree candidato: `C:\RCP\.worktrees\rcp-next-blueprint5`.
- Rama: `codex/rcp-next-blueprint-5`.
- Remoto: `rcpservicessrl/RCP`.
- Producción previa al corte: Astro/GitHub Pages en `https://rcp.services`.
- Objetivo RC2: Next.js en Vercel Pro; Route 53 autoritativo.
- Fuente de negocio: `FUENTE_DE_VERDAD_6_RC2.md`.

| Ruta | Responsabilidad | Estado |
|---|---|---|
| `app/` | rutas, metadata, SEO y APIs | autoridad ejecutable |
| `components/` | UI, Pulso, búsqueda, catálogo y formularios | activa |
| `lib/content.ts` | contenido y estados filtrados | autoridad pública estructurada |
| `lib/server/` | entrega server-side y controles antiabuso | activa; proveedor real pendiente |
| `public/assets/brand/` | logos y Pulso aprobados | inmutable por hash |
| `tests-next/` | contratos de negocio, arquitectura y seguridad | 42 pruebas |
| `.github/workflows/` | CI y despliegue Vercel manual | candidata |
| `legacy/` | Astro y metadata preservados | archivo/rollback, no compilado |
| `graphify-out/graph.json` | grafo estructural | regenerado tras cambios |
| `.next/`, `.open-next/`, `node_modules/` | artefactos locales | no versionar |

Flujo piloto: `contenido filtrado -> selección validada -> API Next -> Resend -> Zoho -> referencia`.

Flujo futuro: `API Next -> HMAC/idempotencia -> CRM -> evento aprobado -> Hub`. Solo uno es fuente de verdad a la vez.
