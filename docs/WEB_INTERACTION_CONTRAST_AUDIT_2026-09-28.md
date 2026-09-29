---
id: rcp-web-interaction-contrast-20260928
project: rcp-services-web
status: partial
recorded_at: 2026-09-28T16:28:27-04:00
source_refs:
  - "HEAD 423e37e; working tree contains unrelated pre-existing edits"
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
  - "2026-09-28 live after changes: not-run; production release pending"
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

The source changes have not been published. The working tree already contained unrelated changes, so a deployable commit and rollback target must be reconciled before using the explicit Vercel release workflow. After publication, repeat the CSP/hydration interaction checks and spot-check the affected colors on the actual domain.
