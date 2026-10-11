# Latest visual recovery — 2026-10-11

## Decision and source reconciliation

The runtime repair in PR 30 resolved the published Turnstile exception, but its
master baseline omitted the visual release approved in this chat. That release
was published on October 10 from `C:/RCP/.worktrees/rcp-visual-3-2`, including
uncommitted source. Commit identity alone did not identify its published contents.

The release manifest is
`C:/RCP/.artifacts/controls-audit-20261010/release-snapshot.json`, fingerprint
`6d4a92cd1ada04f98e8d461f97ae960722323cf79e0306abb051d13fdd7c3375`.
Its deployment was `dpl_9emHny8uQj3b4NgZpQfD4xk61kaH`.

The integration starts from master `78c7bf2e2c7980fb2fd4c4ca589dd189e7141a4a`
in the existing `C:/RCP/.worktrees/rcp-aurora-demo-link` checkout. A comparison
against common ancestor `31963b673fb43ccd3f18480824f7cf385acbfd26` restores the
approved visuals while preserving later master additions. The source comparison
and applied scope are recorded in `C:/RCP/.artifacts/home-repair-20261011/`.

## Integrated result

- Restore the shop owner and two advisers hero, readable typography in both
  themes, commercial offers, interactive connected journey, method diagrams,
  anonymized system showcases, prices, shared footer and public SEO metadata.
- Keep `/demo`, `/en/demo`, their sitemap entries and the hero access to
  `https://mercadodemo.rcp.services`. The demo button uses theme tokens and 16px
  text instead of the former fixed white text on the revised light hero.
- Keep Next.js 16.3.8, self-hosted variable fonts, remote production builds,
  the `[SENSITIVE]` build guard and Turnstile render/load/cleanup recovery.
- Restore the approved nonce CSP, validation, bounded request bodies and safe
  contact fallbacks. Keep the latest specialist-specific email fallback.
- Restore previously applied archived-source security corrections. Archived
  applications and cloud functions remain excluded from the Vercel artifact.

## Validation

- TypeScript with fresh analysis: passed (`tsc --noEmit --incremental false`).
- Unit/contract suite: 82 passed.
- Next.js production build: passed.
- Browser runtime regression: 10 passed at 1440px and 390px, covering success,
  provider render/load/error callback failures and cleanup exceptions.
- Visual browser checks and production verification are recorded below when
  completed. Runtime tests do not send real inquiries or specialist applications.

## Publication authority

Publish the integrated master source after review and checks. Do not deploy the
older master baseline or the preserved dirty visual checkout on its own.
The checked runtime repair `dpl_CxEzRuCkJEhd3kPHsaSdK1bsQk5d` is the rollback
target for this integration. A production verification must check the actual
`hero-team.webp` image, interactive sections, demo link and client exceptions;
HTTP 200 alone is insufficient.

No Supabase migration, provider credential change or client application release
is part of this integration. Real CRM receipt remains a separate verification.
