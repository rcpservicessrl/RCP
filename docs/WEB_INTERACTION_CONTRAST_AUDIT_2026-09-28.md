---
id: rcp-web-interaction-contrast-20260928
project: rcp-services-web
status: partial
recorded_at: 2026-09-28T23:07:26-04:00
source_refs:
  - "published source commit cbe494ea91f1b857c1c661b7fe9a2c54037d8359"
  - "app/layout.tsx SHA-256 50969c5e06a3d69e981bc40be6e2623ba291597fb423aa2f1989a32541374a80"
  - "proxy.ts SHA-256 d1cae1d45e58dda40340d6b7befefdb73420551ec87fa78dac5e6c9d92a3ad6f"
  - "app/globals.css SHA-256 b3738d62985047ce2f90163c558c3313765b1e4113ff17104c0758df42102432"
  - "app/editorial-system.css SHA-256 187cbd467c5b299b2fdb234eb5208db69c33324237d5a15e06172f4074a877a0"
  - "components/home-editorial.css SHA-256 d8a459ae46d3415981ae7ec02ba38cd3377efd8e7b07349e24c032dce92df648"
validation:
  - "2026-09-28 live: 56 page routes and 56 internal links returned 200; 148 desktop/mobile theme screens had no horizontal overflow, unnamed visible buttons or broken anchors; C:/RCP/.artifacts/site-audit-20260928/results.json"
  - "2026-09-28 local production: all 56 page routes returned 200; C:/RCP/.artifacts/site-audit-20260928/results-local.json"
  - "2026-09-28 local production: 18 primary and 16 additional interactive flows passed at 1440 and 390 px, with no page errors; C:/RCP/.artifacts/site-audit-20260928/functional-local.json and functional-extra-local.json"
  - "2026-09-28 local production: targeted text contrast >= 4.5:1 in light/dark at 1440/390 px; C:/RCP/.artifacts/site-audit-20260928/contrast-local.json"
  - "2026-09-28 local production: CSP nonce present, React hydrated and need selector responded; debug-production.mjs output"
  - "2026-09-28 local production: mobile menu theme control responded with consent banner visible; check-menu-overlay.mjs output"
  - "2026-09-28 local: pnpm test 74/74; pnpm build passed"
  - "2026-09-28 production: Vercel deployment dpl_9uehge1pDnUbr74Lmp5bbauYNcrq READY and assigned to rcp.services"
  - "2026-09-28 production: all 56 page routes returned 200; C:/RCP/.artifacts/site-audit-20260928/results-production-20260929.json"
  - "2026-09-28 production browser: search returned five results for inventario, mobile menu and theme worked, technology tab updated its panel, and 390 CSS px had no horizontal overflow"
  - "2026-09-28 production browser: targeted text contrast 6.73:1 to 18.25:1 on home and 7.11:1 to 15.71:1 in the technology glossary"
  - "2026-09-28 production: response CSP contains a per-request nonce; /api/health reported deliveryMode crm; no live lead was submitted"
supersedes: []
superseded_by: null
owner: RCP Services
---

# Interaction and contrast audit

## Problem and decision

The live site served a response CSP nonce without forwarding that policy to the Next.js request. Inline bootstrap scripts were blocked, React reported connection closed, and interactive controls could fail to hydrate. The root layout now reads the request nonce and Next.js receives the request CSP before rendering. The response keeps the restrictive CSP. This requires dynamic server rendering for public pages; the prior static-rendering claim in `.neural_state.md` is superseded for this source state.

Light-theme text in the home problem/specialist sections, diagnosis, technology glossary and route-map labels had measured contrast as low as about 1:1. Those surfaces now use theme-aware ink and explicit form colors. The mobile menu portal now stacks above the privacy banner, so its controls remain clickable.

## Scope and limits

The live audit covered public routes, internal navigation targets, viewport overflow, anchor targets and visible button labels. Functional browser checks covered search, language/theme/menu, home selectors and tabs, catalog filters/search/selection/details, technology tabs, route map, tools and calculator inputs, first-step diagnosis validation, consent, editorial stories, showcase tabs, Pulso, music volume, price details, sector FAQ and opt-in media on desktop and mobile. No live form was submitted, and receipt by CRM, email or Turnstile was not verified. A local production environment without the public Turnstile key intentionally disables specialist submission.

The source changes were published from a clean archive of the exact commit. Production verification covers routing, representative controls and affected colors. A live lead was not submitted, so CRM, email and Turnstile receipt remain unverified. The GitHub Actions workflow still lacks Vercel secrets and a production environment; direct Vercel CLI deployment was used for this release.

## Release candidate, 2026-09-28

- Reproducible source commit: `cbe494ea91f1b857c1c661b7fe9a2c54037d8359`, pushed to `codex/rcp-human-customer-journey`. It includes web source, tests, 24 public showcase images already served byte-for-byte by `rcp.services`, and this audit note. Private raw images, credentials, generated graphs and unrelated working documents remain outside the commit.
- Previous production deployment confirmed in Vercel: `dpl_J6Qm99gZMMvsgPop15UYx8HQ31Gt`, created 2026-09-24. It remains the rollback target.
- Release gate: `.github/workflows/deploy.yml` requires approval of the exact commit and rollback. The GitHub repository currently has no Actions secrets for Vercel and no `rcp-services-production` environment, so the workflow is not usable until those credentials are configured. Direct Vercel CLI deployment requires account authentication.
- Production validation: `NEXT_PUBLIC_SITE_URL=https://rcp.services RCP_DEPLOYMENT_ENV=production pnpm check` passed locally (typecheck, 74 tests, build).

## Production release, 2026-09-28

- The user approved publishing the exact commit and using the previous deployment for rollback. Vercel device authorization was completed by the user.
- Preview `dpl_HXXrYTMH171GCKDD9ccxjudkZL9N` built successfully. Its form remained disabled because the Turnstile configuration exists only in Vercel Production.
- A separate production build from the same clean archive created `dpl_9uehge1pDnUbr74Lmp5bbauYNcrq`. `vercel inspect rcp.services` confirmed `READY`, `target=production` and aliases for `rcp.services` and `www.rcp.services`.
- The public health endpoint reported `runtime=vercel-node-ready` and `deliveryMode=crm`. This verifies configuration visibility, not a successful CRM write.
- Public HTTP checks returned 200 for all 56 page routes. Browser checks on the live domain confirmed responsive search, mobile menu/theme, technology tabs, CSP nonce and legible affected text. No React or CSP error was seen in the site logs; Chrome extension and Cloudflare Turnstile emitted their own console messages.
- Remaining acceptance limit: a positive submission and provider receipt require an authorized test lead with agreed cleanup. No customer or business record was created for this audit.
