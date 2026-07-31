# Project: RCP Services Ecosystem Audit & Active Optimization

## Architecture
- **Sitio-Web Astro**: Static frontend site served on GitHub Pages (`https://rcp.services`).
  - Layouts: `src/layouts/BaseLayout.astro`, `src/layouts/DashboardLayout.astro`
  - Pages: `src/pages/*.astro` (static compilation output)
  - Styles: `src/styles/*.css`, `public/styles.css`
  - I18n Data: `src/data/i18n/`
- **Obsidian Vault**: Manuals, documentation, and processes stored at `C:\RCP\RCP Services\` (folders `00 - Inicio` to `99 - Archivo y Fuentes` and root markdown files).
- **Database**: Supabase integration config (`SUPABASE_URL`, database keys/credentials in parent `.env`).
- **Environment & Secrets**: `C:\RCP\RCP Services\.env` storing API keys for Gemini, OpenRouter, Ideogram, GitHub PAT, Supabase DB.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Audit | Multi-profile analysis (Senior Dev, UX/UI, SecOps, SEO/Perf) of Astro site, Supabase, .env, and Obsidian manuals. | none | DONE |
| 2 | Active Optimization | Implement lint fixes, asset path resolution, CSS/JS tuning, environment validation, and manual improvements. | M1 | DONE |
| 3 | Static Site Build | Verify compile correctness via `npm run build` with zero errors. | M2 | DONE |
| 4 | Audit Report Generation | Compile and write the final audit report to `C:\RCP\RCP Services\auditoria_ejecucion.md`. | M3 | DONE |
| 5 | Quality Gate & Forensic Audit | Validate build, run reviews, challenger verification, and Forensic Auditor verification (CLEAN verdict). | M4 | IN_PROGRESS (4fefec60, 88b31c77) |

## Interface & Safety Contracts
- **No Secrets Exposure**: Absolutely no API keys, tokens, or passwords from `.env` must be hardcoded or checked into git or build files.
- **Asset Routing**: All asset paths must resolve correctly from both root and nested pages.
- **Zero Compilation Errors**: Astro static compilation must succeed without warnings or errors.
- **Report Completeness**: `auditoria_ejecucion.md` must have dedicated sections for Seguridad, Rendimiento, Código, and UX.
- **Security Audit Criteria**: Inputs must be sanitized, headers checked, and secure scripting verified.
- **SEO & AEO Criteria**: Rich semantic structure and LLM/chatbot meta-tags optimized.
- **Speed Criteria**: Script load optimizations (defer/async) and render-blocking resources audited.
- **Functionality Criteria**: Verification of interactive forms, inputs, diagnostics, and shop/portal checkout flows.
