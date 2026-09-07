# Catalog artwork reconciliation

## Direction and measured inventory

The owner's clarification takes precedence over the earlier photography plan: preserve and expand the approved 2.5D illustration family. Natural photography remains available for homepage and editorial business scenes. This records local implementation and checks, not deployment.

| Local asset or usage | Count | Verified scope |
| --- | ---: | --- |
| Canonical product illustrations preserved | 8 | `public/assets/products-2026/*.png` |
| Existing editorial illustrations preserved | 6 | `public/assets/catalog-editorial/*.png` |
| Additional service illustrations | 18 | `public/assets/catalog-editorial/*.webp`, all 640 × 640 with transparent alpha |
| Total available 2.5D illustrations | 32 | All files exist |
| Public catalog services | 31 | Actual exported `catalog` in `lib/content.ts` |
| Distinct illustrations used by catalog cards | 31 | Explicit assignments; unique paths and file hashes |
| Natural business photographs retained | 21 | `public/assets/business-scenes/*.webp` |
| Natural photographs referenced by this homepage | 1 | `hero-team.webp` in `EditorialIntro` |
| Other natural scenes retained for future editorial placement | 20 | Available files; no claim of placement in sections |

The POS illustration remains available for technology solutions and is not assigned to a public catalog card. The existing blueprint-to-ERP mapping is unchanged. Thirteen representative existing illustrations remain in the catalog; eighteen additions remove repetition.

## Completed expansion

Five completed PNG sources were recovered from the interrupted generation pass and visually inspected. Thirteen further images were generated with the built-in image generation tool. All eighteen final WebP files are copied into the project; original generated PNG sources remain intact in the Codex generation directory. Exact prompts for the thirteen new generations and observed briefs for the recovered five are in `CATALOG_EXPANSION_PROMPTS_2026-09-07.md`.

The additions cover the need dossier, SOP documentation, operating roles, business documentation, organizational identity, adoption, bookkeeping, financial control, compliance, brand strategy, community management, search visibility, campaigns, analytics, stationery, promotional print, packaging and large-format printing.

The family uses amber, ivory, charcoal and muted sage, with transparent backgrounds and three-quarter dimensional objects. All new files have alpha values ranging from fully transparent to fully opaque. Their combined size is 1,199,256 bytes; each is 48,368–85,478 bytes. `CATALOG_ARTWORK_INVENTORY_2026-09-07.json` records sizes, dimensions, hashes and source filenames.

## Code and verification

- `CatalogIcon` resolves every card through `ProductArtwork` and `catalogArt`; photographs do not override illustrations.
- `catalogArtByService` assigns a distinct illustration to every actual public service. Existing category fallback behavior is preserved for noncatalog callers.
- `lib/catalog-photography.ts` remains a separate natural-scene inventory. The prior mixed resolver and explicit `.ts` import were already removed.
- `node --max-old-space-size=128 --test --test-concurrency=1 tests-next/catalog-art.test.mjs tests-next/customer-journey.test.mjs`: all 5 tests passed. They check actual service membership, shipped files, 31 distinct paths and SHA-256 contents, WebP size and format, all 21 natural scenes, and pricing scope/availability.
- All generated sources were visually reviewed. Optimized samples were also inspected; Sharp checks verified transparent alpha for all eighteen additions.
- Original PNG artwork was not modified.
- Follow-up validation passed: full project typecheck, all 59 tests, Next production build with 65 generated pages, and production dependency audit with no known vulnerabilities. Responsive browser review and deployment remain pending. See `WEB_RELEASE_CANDIDATE_2026-09-07.md`.
- The preceding Graphify query located the relevant catalog files. No framework, authentication, schema, integration or deployment structure changed; graph refresh remains part of coordinated integration.
