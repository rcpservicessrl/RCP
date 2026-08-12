# ADR-010 — Pulso identity and runtime behavior

**Date:** 2026-08-11  
**Status:** accepted.

## Decision

Pulso is the official name of the RCP Jaguar Mascot and the visual identity of the public guide. Search, contextual tour and help converge into one deterministic experience.

Runtime image or response generation is not allowed. The original release plan used five poses already present in the approved masters and animated only their containers.

AI may be used offline only to create a candidate pose that no master pose can cover. It requires identity locks, manual comparison, brand approval, checksum, versioning and an allowlist before publication. The logo is excluded without exception.

## Approved implementation — 2026-08-12

The previous sprite slicing produced visible anatomical crops, especially in compact avatars. The five semantic scenes now map to three independent, full-body, transparent `v1` images generated offline from both official masters. RCP Services approved `pulso-presenta-v1.png`, `pulso-orienta-v1.png` and `pulso-avanza-v1.png` for production use on 2026-08-12. The files are versioned and checksum-locked, the masters remain unchanged, and no generation occurs at runtime.

## Security and privacy

- No remote HTML is rendered.
- Search queries stay local to the approved public index in v1.
- Pulso does not issue legal, tax, accounting or financial conclusions.
- No persistent chat transcript with PII.
- Analytics never receives free text.

## Accessibility

- Pulso is decorative unless it is an actual control.
- The guide uses a named button, Escape close behavior and keyboard navigation.
- Essential information is always textual.
- Reduced motion produces a static pose.
