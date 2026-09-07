# Whole-site editorial integration

The owner requested a consistent, more visual website using the supplied 2.0 and 3.2 references, canonical product artwork, conversion improvements and optional SVG animation. The earlier request explicitly authorizes integration and publication. This implementation extends the approved Next.js release at `5d360a0f0735cef7e3d522ff6a8062676d78d16f` in the same repository.

## Reconciliation

- Reviewed `RCP-Services-2.0.html`, `RCP-Services-2.0-Fuentes.zip` and `RCP-Mercado-y-Conversion.html`, alongside the earlier 3.2 direction. Reference scripts were not executed.
- Adopted charcoal headers, warm paper backgrounds, sage image panels, Montserrat typography, photography, canonical product illustrations and a consistent visual hierarchy.
- Reference prices, invented results, unavailable products and obsolete CRM/publication instructions do not override the current commercial authority or the owner's request.
- The supplied artwork directory resolves to `Marca/Iconos_Productos_RCP_2026`. All eight PNG files match the source SHA-256 hashes; artwork is copied unchanged. Next Image serves responsive derivatives.

## Coverage and behavior

| Area | Integrated change |
| --- | --- |
| Home and navigation | Product artwork, decorative SVG connections, shared colors, corresponding language routes and preserved selection parameters |
| Service directory and three pillars | Shared editorial headers and product illustrations, coordinated section/card styles |
| Catalog | Illustrated cards, named selection controls, result count, four-item limit and direct assessment link |
| Technology and custom software | Six illustrated solution tabs, existing glossary retained, chosen solution carried into assessment in both languages |
| Sectors and tools | Shared photo/SVG headers, four business types, local route download and sector/priority passed to assessment |
| About, method, contact, resources and media | Consistent headers, photography/illustrations and accessible actions; tools discoverable in resources/footer |
| Assessment and specialists | Shared visual treatment, assessment form moved before explanatory material, current submission logic retained |
| Legal and operational pages | Shared typography, theme, header/footer; existing notices, boundaries and route behavior retained |

Fixed the long-catalog animation: an observer threshold of 8% could never be reached by a roughly 19,694px mobile container, leaving its children invisible. It now reveals on entry. Decorative SVG animations finish within three seconds and have a reduced-motion fallback. Hero images load eagerly; catalog images remain lazy.

Discovery parameters are allowlisted when switching languages. Repeated/malformed query values are rejected safely. Public services, filtered search records, provider delivery, idempotency, consent, search, music and Pulso guidance remain available. No provider, DNS, Supabase schema, dependency or payment behavior changes are included.

## Additional catalog illustrations

The owner subsequently requested more images to explain other catalog areas. Six new transparent 3D illustrations cover processes, training, branding, audiovisual content, signage and textiles. They supplement the eight unchanged canonical assets, and service-specific mappings replace repeated generic software illustrations. Prompts and provenance are in `CATALOG_IMAGE_PROMPTS_2026-09-06.md`.

## Verification

- `pnpm check`: TypeScript, 54 tests and production build passed; 65 generated pages.
- HTTP smoke: all 50 sitemap routes returned 200, exactly one H1 and a Content Security Policy.
- Public catalog records and counts exactly match pre-release production: 31 services, six solutions and 15 searchable capability terms.
- Browser checks: desktop and 390×844 layouts, long-catalog visibility, search/selection, four-selection limit, light/dark catalog, sector landing, specialist form and legal route.
- Browser journey: selected web service reaches assessment; print sector and priority survive the tools-to-assessment flow and switching to English.
- Actual downloaded `mi-ruta-rcp.txt` contains the selected print guidance and expansion-stage advice without registration.
- Repeated query parameters return 200 safely; English `sales-inventory` resolves to the canonical assessment solution.
- Original provider-contract tests pass. No real inquiry, specialist application, email, WhatsApp or payment was sent during validation. Health checks confirm configured mode, not mailbox delivery.

Production deployment and live verification are recorded in the associated pull request and deployment result. Rollback before this release: `dpl_9kjT6Mjxpx5onryVoR57piXP7Sq7` (`rcp-services-fxrffvrjw-rcp-services.vercel.app`). Conversion improvement is a design objective; no unmeasured conversion uplift is claimed.
