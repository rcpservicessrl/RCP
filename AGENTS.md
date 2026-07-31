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
