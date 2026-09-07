# Customer journey, imagery and planning prices

## Owner request and boundaries

The owner explicitly requested the official head icon in the guide launcher, natural photography, distinct catalog images, a useful interactive SVG, a complete responsive customer journey review, market research and promoted estimated prices. Publication was already authorized in the preceding redesign request. This request supersedes the earlier decision to omit all public price guidance. Estimates remain separate from quotes, checkout and payment data. No private CRM, legal offer or unavailable e-CF integration is activated.

Production baseline: master `31963b673fb43ccd3f18480824f7cf385acbfd26`, Vercel `dpl_2PX45Wg8uPyXtA65oo3G77Aap5uB`. Work occurs in the existing Next.js worktree, preserving the dirty legacy Astro checkout. Current `.neural_state.md` takes precedence over historical deployment/database details in the shared architecture document. No database or provider change is required.

## Market observations

Public provider pages checked on September 6, 2026. This is a small convenience sample, not a representative market survey or verified transaction data. Published prices can change. Provider performance claims and market percentages have not been adopted.

| Provider and primary source | Observed offer | Comparability |
| --- | --- | --- |
| [Signage RD](https://signagerd.com/diseno-web) | RD$15,000 one-page site; RD$25,000 standard; RD$35,000 advanced | Advertises domain and hosting for one year. RCP estimates exclude these external costs. |
| [Intelia](https://www.inteliard.com/diseno-web) | RD$4,995 launch landing offer; RD$9,995 and RD$14,995 larger offers | Promotion and hosting duration vary. Do not treat its low promotional price as a sustainable market floor. |
| [TAKUM](https://takum.io/precios-redes-sociales/) | USD750/month entry social plan, 12 posts across two platforms and community management | Broader service than the limited RCP static-content estimate. Currency left in USD; no assumed conversion rate. |
| [MOVOPos](https://www.movopos.com/precios) | RD$1,300/month software subscription | Software subscription is not consulting, implementation, equipment or custom development. No implication that this is an RCP price or integration. |

## RCP estimates and estimation method

The figures below are planning hypotheses, not observed historical RCP sales or fixed offers. They are published as ranges under the owner's instruction. Each public card states deliverables, limits, billing cadence, exclusions and applicable taxes excluded. A written quote confirms the final scope. There are no invented discounts, countdowns, stock limits or guaranteed revenue claims.

| Scope | Planning estimate | Internal effort assumption, not a commitment |
| --- | --- | --- |
| One-page website, up to five sections | RD$15,000–30,000/project | 15–25 delivery hours at an illustrative RD$1,000–1,200/hour |
| Review and redesign of one process | RD$12,000–28,000/project | 12–20 hours at an illustrative RD$1,000–1,400/hour |
| Eight static social pieces adapted to two channels | RD$8,000–15,000/month | 10–15 hours at an illustrative RD$800–1,000/hour |
| Basic visual identity | RD$12,000–25,000/project | 12–20 hours at an illustrative RD$1,000–1,250/hour |
| One two-hour remote workshop plus preparation | RD$5,000–10,000/project | 5–8 total hours at an illustrative RD$1,000–1,250/hour |

Rates are commercial planning assumptions. Supplier costs, actual delivery hours and margins have not been verified. Before issuing a binding quote, confirm staff availability, complexity, licensed materials, travel, external providers, taxes and delivery schedule. Printing needs dimensions, substrate, quantity, finishing and installation; regulated work needs responsible professional review, so neither receives an invented generic price.

## Journey improvements

- Official `public/icono-rcp.png` replaces the full-body pose only in the floating launcher. Existing mascot poses and help/search actions are preserved.
- Homepage puts an illustrative shop owner and advisors in the main scene, with responsive composition that exposes the photograph earlier on mobile.
- Imagery correction (September 7): the local catalog now has 31 distinct 2.5D illustrations for its 31 public services: 13 representative existing images plus 18 new service-specific WebP assets. All 14 original illustrations remain available. The 21 natural photographs remain available for homepage and editorial sections and do not count toward this expansion. See `CATALOG_ARTWORK_RECONCILIATION_2026-09-07.md` for measured sizes, file and hash verification, and the limits of local validation.
- The interactive SVG changes a real suggested route, steps, price cadence and assessment link. Native keyboard activation, visible focus, announced updates and reduced-motion support accompany the visual interaction.
- Price cards and catalog details communicate scope and exclusions and carry the selected service to the existing intake. No fake purchase or autonomous message is produced.
- Empty search recovery restores all filters. Selection and guide overlays are checked on small screens.

## Validation record

Implementation and visual verification in progress. Final measured results and production reference will be appended after checks; this document does not itself establish a live deployment.
