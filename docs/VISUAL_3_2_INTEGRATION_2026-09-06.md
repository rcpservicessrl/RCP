# Visual 3.2 integration

## Scope and authority

The owner requested analysis, integration and publication of the supplied RCP Services 3.2 visual proposal, with existing capabilities preserved. That direct request supersedes the attached package's earlier review-only publication language.

Production was verified as Next.js on the Vercel project `rcp-services-web`, serving `rcp.services`. The starting source is `origin/master` at `a1b4685`. The legacy Astro checkout contains unrelated work and was left untouched. Implementation uses an isolated Git worktree of the same repository.

Rollback reference before this release: `dpl_2iPEqvgJcAqjh9zFnmPqFebdcXXa`, `https://rcp-services-d9nz0onod-rcp-services.vercel.app` (Ready, observed September 6).

## Reconciliation

| Proposal area | Integrated behavior |
| --- | --- |
| Photographic home, charcoal/amber palette, warm editorial sections | New bilingual hero with the approved sentence-case headline and three manually selected story steps. Local supplied WebP images; illustrative labels; existing RCP brand assets retained. |
| Business audiences | Native Spanish and English retail/service-business pages, connected to existing pillars, catalog, custom software and assessment. |
| Orientation | Three choices produce practical next steps. Only a validated priority enum is passed to the existing assessment. |
| Time calculator | Visitor-defined scenario; finite values, bounded ranges and integer counts checked. No prices, promised savings, persistence or new network requests. |
| Service explorer | Existing commercial catalog and selection rules retained. No second 36-item prototype catalog, duplicated offers or reactivation of restricted services. |
| Method, technology, resources, company and contact | Existing canonical pages retained; new home links use those routes. No parallel production microsite. |
| Inquiry and quote flow | Existing four-step form, catalog/capability/solution context, delivery confirmation, retry identity, validation and anti-abuse boundaries preserved. |
| Language, theme, music, search and Pulso | Retained; discovery pages added to search. Language control preserves the new page pair. New tools appear in the mobile menu. |
| Privacy | Existing consent options and behavior retained; desktop banner moved away from the hero photograph. |
| Demonstration portal and operation dashboard | Not promoted to live functionality. Existing private portal behavior and CRM SECURITY-HOLD preserved. No customer data, providers, Supabase migrations, payments or calendar activation. |

The reference package and its isolated adapter remain outside the production worktree. The standalone reference passed 93 checks, type checking, and 64 link checks after correcting a Windows-only path comparison in its verifier. Those results establish reference integrity, not production integration correctness.

The reference inquiry baseline differed from the live source (`58ec9ae417edddc1f3a7875e971ed7d039ce597f`). The current API was kept, rather than installing the prototype transport. The images are copied from the owner's supplied ZIP, with no client attribution or invented results.

## Verification

- Integrated production build: successful; 65 generated pages including six new localized routes.
- Existing and new automated checks: 50 passed. New execution tests cover calculator scenarios, invalid inputs and priority normalization.
- Browser checks: 390 × 844 mobile and desktop; manual story selection, mobile menu and Escape, live calculator updates and invalid-value feedback, orientation-to-assessment priority continuity, incomplete-form blocking.
- Protected API, catalog-selection policy and form implementation compared to `origin/master`: unchanged.
- Production dependency audit: zero reported vulnerabilities at the time checked. Next.js patched from 16.3.0 to 16.3.3; AVIF optimization disabled in line with the official August 2026 security release.
- No real inquiry, email, application or payment was submitted during verification. Provider acceptance and human response are separate operational checks.

Publication evidence is recorded in the release PR and Vercel deployment associated with the final commit. Conversion uplift requires real consented traffic and inquiry follow-up; it is not established by these tests.

Source: [Next.js August 2026 security release](https://nextjs.org/blog/august-2026-security-release).
