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
  - local TypeScript and 85 unit tests passed
  - local production build passed
  - final candidate: 58 routes, 232 page checks, 816 main controls inventoried
  - final candidate: 64 resolved interactive scenarios and 8 visual checks passed
  - final candidate: 201 internal destinations and hash targets passed
  - final candidate: zero violations in the 11 configured axe rules
  - public domain verification required after merge
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
- The compact desktop music control hid the only normal-click volume access.
  Show the volume button, use its volume icon and support Escape with focus
  restored to that button. Right-click remains an optional shortcut.

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

The final candidate has 64 distinct interactive scenarios. Initial offer
fixtures inspected an existing heading before client navigation completed;
wait for the destination URL before asserting the page. One mobile navigation
exceeded the fixture's original ten-second limit while concurrent audits ran;
its targeted recheck passed with a thirty-second navigation timeout. One theme
snapshot was taken before initialization settled; wait explicitly for the
requested theme. Original and targeted recheck evidence are retained separately.
These are test timing corrections, not additional application fixes.

Form success and provider failure paths are intercepted test fixtures. They
validate UI behavior and request payloads, not actual downstream CRM delivery.
The local build has no public Turnstile key; full form checks must run against
the remotely built production candidate with its actual public configuration.

## Owner-confirmed commercial availability

The owner confirmed operational e-CF integration on October 11 and authorized
announcing the service. Supplier identity is private and excluded from public
content. Replace the outdated unavailable state across pages, catalog and search.
The demo intentionally continues to simulate issuance.
See `POS_OFFER_RESEARCH_2026-10-11.md` for first-party competitor sources, a
implementation offer from RD$9,900 once, optional accompaniment from
RD$1,990/month and explicit separate licensing, issuance and certificate costs.
Do not infer DGII acceptance, provider certification or unlimited fiscal
documents from simulated demo receipts.

## Evidence and release

Local evidence: `C:/RCP/.artifacts/full-site-pos-20261011`.
The known good rollback before this release is
`dpl_8YDhXSQf9Trhuv97SqaqN6wZLgoy` (PR 31, latest approved visuals).
Record candidate commit, required checks, deployment and public results here
before treating this audit as published.

Candidate source: `2175bf30703b4e5300036136dee14694308a5e07`.
Remote production build: `dpl_E83VcXbGFV3pKTDAVTEZMLxvUkpk`, READY,
staged without public domain assignment. The final documentation commit changes
no application input. GitHub validation and both Vercel checks passed for the
candidate source. Local build and 85 unit tests passed; the remote candidate
also compiled the final application inputs successfully.

Evidence files: `offer-candidate-audit.json`,
`offer-candidate-resource-dark-audit.json`,
`offer-candidate-interactions-resolved.json`, `offer-candidate-visuals.json`.
The candidate covers Spanish/English, desktop/mobile, light/dark; body text in
the new offer is 18px and the narrow layouts have no horizontal overflow.
Public promotion and final domain checks remain a release step.
