# RCP Services site rules

- This checkout is the canonical source for `https://rcp.services`.
- Read `RCP_SERVICES_SHARED_ARCHITECTURE.md` and `.neural_state.md` before
  changing Supabase links, Auth, forms, portal data or deployment configuration.
- The site belongs to corporate project `wpfovxgbennpgydbellw`, currently using
  `public`. Do not add client tables to this schema.
- Do not create another site variant to work around dirty state or migration
  drift. Resolve changes in this checkout and update RCP Matrix.
- Query Graphify before broad inspection and update the graph after structural
  or architectural changes.
- Never commit `.env`, provider credentials, service-role keys or business data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
