# Pulso interaction system

This repository implements the canonical decision in:

`C:\RCP\RCP Services\01 - Identidad y Estrategia\Marca\00_Contexto_Neuronal\DECISION_NOMBRE_Y_DERIVADOS_PULSO_2026-08-11.md`

## Approved runtime scenes

| Scene | Versioned asset | Use |
| --- | --- | --- |
| `idle` | `pulso-presenta-v1.png` | welcome and Portal |
| `progress` | `pulso-avanza-v1.png` | method and progress |
| `present` | `pulso-presenta-v1.png` | pillars and capability presentation |
| `analyze` | `pulso-orienta-v1.png` | search and catalog |
| `consider` | `pulso-orienta-v1.png` | diagnosis and contextual help |

The component renders one complete transparent image per context with `object-fit: contain`. It does not use CSS background positioning, sprite slices or clipped avatar cells. The two official master files remain unchanged. RCP Services approved these three `v1` derivatives for production use on 2026-08-12.

## Approved asset allowlist

| Asset | SHA-256 |
| --- | --- |
| `pulso-presenta-v1.png` | `e366f36acb645ae4cd5977d50d71f96a5f8ed04910ff2b16404e93ad0862c66c` |
| `pulso-orienta-v1.png` | `70c0c93240f126132dfd581b833f50c75ed97958f367bfc59bb196f8b594d3ff` |
| `pulso-avanza-v1.png` | `a26b6f0373fa6e813795985826c60dfc43e5862979e72e0e26bbedabfdd046e1` |

Generation mode: offline built-in image generation with both official masters as references. Prompt invariants locked the RCP Jaguar species, green eyes, orange fur, black rosettes, white muzzle, black business suit, white shirt, orange pocket accent, professional proportions, full-body framing, generous safety padding, flat chroma background, and no text, logo, watermark or cast shadow. Chroma was removed after generation to produce true alpha transparency.

## Presence policy

- Hero: one contextual appearance.
- Pillar or technology section: at most one secondary appearance.
- Floating guide: compact trigger and user-initiated panel.
- Error, legal, tax-sensitive, payment, collection and crisis screens: absent.

## Candidate asset workflow

New AI-assisted poses normally remain outside the production release path with their source master, prompt, model/version, date, license and review record. A preview-only candidate may enter the UAT branch when it is versioned, hashed, visually inspected at original resolution and clearly marked as pending brand approval. Only an explicitly approved derivative can enter a production release. The three files in the allowlist above completed that approval on 2026-08-12.

## QA

- Hash the masters before every release.
- Compare face, eyes, muzzle, ears, spots, body, hands, feet, tail and clothing.
- Test on light and dark surfaces at 100% and 200%.
- Verify keyboard, screen reader names and reduced motion.
- Reject any output that looks attractive but drifts from identity.
