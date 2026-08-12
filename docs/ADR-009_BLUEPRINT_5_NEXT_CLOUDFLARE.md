# ADR-009 — Next.js and Cloudflare for the Blueprint 5 website

**Date:** 2026-08-11  
**Status:** accepted for isolated implementation; production cutover pending approval.

## Context

The current Astro website contains valuable features and official assets, but its content and monolithic client scripts still represent the previous Agency 360 / sovereign ecosystem proposition. Blueprint 5 requires a richer interactive catalog, server-side lead qualification, localized HTML, a deterministic guide and a future Delivery Hub boundary.

## Decision

Build the replacement in the same Git repository on an isolated branch/worktree using:

- Next.js App Router and TypeScript;
- Cloudflare Workers through `@opennextjs/cloudflare` for the approved production target;
- portable Web APIs so Vercel remains a viable paid alternative;
- Supabase as the existing data and authentication platform, with current schema boundaries preserved;
- no Clerk, Pinecone or Vercel-only dependency in the initial release.

The Astro site remains live until explicit cutover approval.

## Consequences

- Cloudflare preview must pass; a successful `next build` alone is insufficient.
- Portal and Delivery Hub remain separate products.
- DNS migration and deployment require a later operational window.
- Existing user changes in the Astro checkout remain untouched.
- The old service worker must be retired during cutover.

## Alternatives

- **Keep Astro:** lowest migration cost, but does not satisfy the approved interaction and server-side product direction without significant restructuring.
- **Vercel Pro:** strongest native Next.js experience and acceptable if paid, but creates a higher recurring cost. Kept as a portable alternative.
- **Vercel Hobby:** excluded for commercial production.
