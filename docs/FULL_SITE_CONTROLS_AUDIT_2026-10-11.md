---
id: sitio-web-controls-audit-20261011
project: sitio-web
status: partial
recorded_at: 2026-10-11T00:00:00-04:00
source_refs:
  - master@b23f6c0182d29cb18676ce8f00aa432ee3b1b9e1
  - fix/full-site-audit-pos-offer
validation:
  - baseline public navigation: 58 routes, 232 page checks, 808 main controls inventoried
  - baseline accessibility: 232 checks with axe-core 4.11.0
  - local TypeScript and 82 unit tests passed
  - local production build passed
  - final candidate and public verification pending
supersedes: []
superseded_by: null
owner: RCP Services
---

# Full site controls audit — October 11, 2026

## Source and scope

Continue the integrated PR 31 master source: approved October 10 visuals,
PR 29 demo and PR 30 runtime repair. This work does not deploy the preserved
older visual checkout or modify the client application behind the demo.

Public sitemap pages and compatibility entries were inspected at 390px and
1440px, Spanish/English, light/dark, in fresh isolated headless Chrome contexts.
No Computer Use, existing user browser profile, real inquiry or applicant
submission was used. Controls were exercised through their visible UI.

## Confirmed corrections

- Demo pages had nested `main` landmarks. `InteriorShell` already supplies the
  main region; remove the duplicate so assistive technology has one main region.
- A homepage rule overrode the price section's dark brown eyebrow with bright
  amber on its pale surface. The measured ratio was 1.56:1. Scope the intended
  foreground explicitly so light and dark themes retain legible pricing text.
- Pulso's translucent surface produced variable backgrounds and subtitle
  contrast below 4.5:1. Use an opaque theme surface and the stronger text token.
- Enabled media players previously removed their external platform link. Keep
  that fallback visible, add a close control and return keyboard focus to the
  play control. Each player has a descriptive accessible control name.
- Use explicit `noopener noreferrer` on new-tab contact/media/handoff links.
  `noreferrer` already implied opener protection; this is an explicit contract,
  not evidence that those links were broken or exploitable.
- English legacy quote review now uses `services` in the diagnosis handoff and
  focuses its form anchor. Both language aliases were accepted before this fix.

## Test interpretation

The baseline navigation audit found no failing internal destination or missing
hash target. Catalog controls becoming disabled after four selections are
intentional. The detailed form uses a visually hidden radio inside a clickable
label; the interaction fixture must click that label and fill both required
textareas. One technology tab intentionally links to the web catalog.

Initial axe findings on specialist text were collected during theme hydration.
A settled-theme check showed the correct dark foregrounds. Final accessibility
checks wait for the requested theme and its color transitions before measuring.
Automated contrast checks leave gradients and some SVG text incomplete; they
do not establish complete WCAG conformance.

Form success and provider failure paths are intercepted test fixtures. They
validate UI behavior and request payloads, not actual downstream CRM delivery.
The local build has no public Turnstile key; full form checks must run against
the remotely built production candidate with its actual public configuration.

## Commercial work pending owner confirmation

The owner requested an integrated e-CF POS offer. Existing commercial content
still marks e-CF unavailable, and the demo intentionally simulates issuance.
The operational integration/provider was requested before changing that state.
See `POS_OFFER_RESEARCH_2026-10-11.md` for first-party competitor sources, a
proposed peso-denominated offer and its explicit scope and separate costs.
Do not infer DGII acceptance, provider certification or unlimited fiscal
documents from simulated demo receipts.

## Evidence and release

Local evidence: `C:/RCP/.artifacts/full-site-pos-20261011`.
The known good rollback before this release is
`dpl_8YDhXSQf9Trhuv97SqaqN6wZLgoy` (PR 31, latest approved visuals).
Record candidate commit, required checks, deployment and public results here
before treating this audit as published.
