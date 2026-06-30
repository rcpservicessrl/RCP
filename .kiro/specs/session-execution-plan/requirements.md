# Requirements Document

## Introduction

This document defines the structured execution plan for resolving all pending technical debt and features in the RCP Services project. Work is organized into **Sessions** — focused 1-2 hour work blocks that an AI agent and user can complete together. Sessions are ordered by priority and dependency, with clear inputs/outputs and explicit separation of AI-autonomous work vs. user-required actions.

The project has completed its Astro migration (13/13 pages) and Supabase cleanup. The next priority is security hardening (Phase 1), followed by roles/permissions, real functionality, quality/UX, and ecosystem work.

## Glossary

- **Session**: A focused work block of 1-2 hours with defined inputs, outputs, and dependencies
- **AI_Agent**: The AI development assistant (Kiro/Claude) executing code changes autonomously
- **User**: The project owner who provides credentials, confirms destructive actions, and validates deployments
- **Portal**: The authentication page (`src/pages/portal.astro`) handling login, signup, and OAuth
- **Dashboard**: The admin/client panel (`src/pages/dashboard.astro`) with KPIs, CRUD, and charts
- **Cloud_Function**: GCP Cloud Functions (Python) at `cloud_function/main.py` handling chat and leads
- **Supabase_DB**: The hosted PostgreSQL database with RLS policies at `wpfovxgbennpgydbellw.supabase.co`
- **RLS**: Row Level Security — Supabase's policy system controlling data access per role
- **RBAC**: Role-Based Access Control — permission system based on assigned roles
- **Cutover**: The process of confirming the Astro build serves correctly and removing legacy HTML files

## Requirements

### Requirement 1: Session 0 — Prerequisites and Credential Collection

**User Story:** As the project owner, I want to provide all blocked credentials upfront, so that subsequent sessions can proceed without interruption.

#### Acceptance Criteria

1. THE Session_Plan SHALL list all required credentials before any implementation session begins
2. WHEN the User provides a GitHub PAT with `repo` scope, THE AI_Agent SHALL verify connectivity by listing repository branches
3. WHEN the User provides the Supabase DB password, THE AI_Agent SHALL verify connectivity by querying `pg_policies` count
4. WHEN the User provides a super admin email, THE AI_Agent SHALL document the email for use in Session 2 (auth migration)
5. IF the User cannot provide CardNet or Stripe keys, THEN THE Session_Plan SHALL defer payment gateway integration (Session 8) until keys are available
6. THE Session_Plan SHALL identify which sessions are blocked vs. which can proceed without credentials

### Requirement 2: Session 1 — Cutover Verification and Legacy Cleanup

**User Story:** As the project owner, I want to confirm the Astro deployment serves correctly and remove legacy HTML files, so that the codebase has a single source of truth.

#### Acceptance Criteria

1. WHEN Session 1 begins, THE AI_Agent SHALL verify that `rcp.services` resolves to content served from `dist/`
2. WHEN the Astro deployment is confirmed working, THE AI_Agent SHALL list all root-level `.html` files for deletion approval
3. WHEN the User approves deletion, THE AI_Agent SHALL remove legacy HTML files from the repository root
4. THE AI_Agent SHALL verify that `astro build` still produces a green build after cleanup
5. THE AI_Agent SHALL commit and push changes to a new branch for User review
6. IF `rcp.services` does not resolve correctly, THEN THE AI_Agent SHALL diagnose the GitHub Pages configuration and CNAME setup

### Requirement 3: Session 2 — Security Emergency Part A (Frontend Credential Removal)

**User Story:** As the project owner, I want hardcoded admin credentials removed from the frontend, so that attackers cannot extract them from the source code.

#### Acceptance Criteria

1. WHEN Session 2 begins, THE AI_Agent SHALL locate and remove the hardcoded admin credentials from `portal.astro`
2. THE AI_Agent SHALL remove the dead Firebase SDK imports from `portal.astro`
3. THE AI_Agent SHALL create a server-side login endpoint in `cloud_function/main.py` that validates credentials against Supabase Auth
4. THE AI_Agent SHALL implement password hashing using bcrypt in the Cloud Function login endpoint
5. THE AI_Agent SHALL update `portal.astro` to call the Cloud Function endpoint instead of performing direct SQL authentication
6. THE AI_Agent SHALL verify that the login flow works end-to-end with the new server-side endpoint
7. IF the Supabase DB password is not available, THEN THE AI_Agent SHALL implement the Cloud Function with a mock response and document the integration point

### Requirement 4: Session 3 — Security Emergency Part B (RLS and Auth Migration)

**User Story:** As the project owner, I want proper RLS policies and a real Supabase Auth admin user, so that the database is protected by defense-in-depth.

#### Acceptance Criteria

1. WHEN Session 3 begins, THE AI_Agent SHALL generate SQL to add a DELETE policy to the `clientes` table
2. THE AI_Agent SHALL generate SQL to validate INSERT operations with proper `with_check` expressions
3. WHEN the User provides the super admin email, THE AI_Agent SHALL generate instructions for creating a Supabase Auth user with admin role
4. THE AI_Agent SHALL create a migration script (`05_rls_delete_insert.sql`) that is idempotent
5. THE AI_Agent SHALL document the manual steps the User must perform in the Supabase Dashboard
6. THE AI_Agent SHALL update the `portal.astro` admin check to use Supabase Auth metadata instead of hardcoded values

### Requirement 5: Session 4 — Unify Lead System and Remove EmailJS

**User Story:** As the project owner, I want a single lead capture pipeline through the Cloud Function, so that leads are not duplicated or lost between systems.

#### Acceptance Criteria

1. WHEN Session 4 begins, THE AI_Agent SHALL identify all EmailJS references in the codebase
2. THE AI_Agent SHALL remove EmailJS SDK and configuration from all Astro pages and scripts
3. THE AI_Agent SHALL route all contact form submissions through the existing `rcpLead` Cloud Function
4. THE AI_Agent SHALL verify that the `rcpLead` function handles all form fields previously sent via EmailJS
5. THE AI_Agent SHALL add rate limiting middleware to both `rcpChat` and `rcpLead` Cloud Functions
6. THE AI_Agent SHALL verify the build succeeds and no broken references remain after EmailJS removal

### Requirement 6: Session 5 — RBAC Schema Creation (Supabase Tables)

**User Story:** As the project owner, I want the roles and permissions schema created in Supabase, so that the application can enforce access control.

#### Acceptance Criteria

1. WHEN Session 5 begins, THE AI_Agent SHALL generate a SQL migration script creating tables: `users`, `roles`, `user_roles`, `client_assignments`, `audit_log`
2. THE `users` table SHALL reference `auth.users(id)` as a foreign key
3. THE `roles` table SHALL include at minimum: `super_admin`, `gestor_marketing`, `consultor_legal`, `ejecutivo_cuenta`, `viewer`
4. THE `user_roles` table SHALL implement a many-to-many relationship between `users` and `roles`
5. THE `client_assignments` table SHALL map gestors to clients with a service type filter
6. THE `audit_log` table SHALL capture user_id, action, table_name, record_id, and timestamp for all mutations
7. THE AI_Agent SHALL generate RLS policies restricting role management to `super_admin` only
8. THE migration script SHALL be idempotent using `CREATE TABLE IF NOT EXISTS` and `DO $$ ... $$ ` blocks

### Requirement 7: Session 6 — RBAC Frontend Implementation

**User Story:** As the project owner, I want the dashboard to enforce role-based visibility, so that each user sees only what their role permits.

#### Acceptance Criteria

1. WHEN Session 6 begins, THE AI_Agent SHALL update `dashboard.js` to fetch the current user's roles from `user_roles`
2. THE AI_Agent SHALL implement panel visibility logic: admin panels visible only to `super_admin`, client data filtered by `client_assignments`
3. THE AI_Agent SHALL create a role management panel in the admin section of `dashboard.astro`
4. THE AI_Agent SHALL implement client filtering in the CRUD view based on the logged-in user's assignments
5. THE AI_Agent SHALL verify that non-admin users cannot access admin panels through URL manipulation or DOM inspection
6. WHEN a user has no assigned role, THE Dashboard SHALL display a "pending approval" message instead of an empty dashboard

### Requirement 8: Session 7 — Real Store Connection (Supabase productos)

**User Story:** As the project owner, I want the store to load products from Supabase instead of static JavaScript, so that products can be managed without code changes.

#### Acceptance Criteria

1. WHEN Session 7 begins, THE AI_Agent SHALL refactor `tienda.js` to fetch products from the `productos` table in Supabase
2. THE AI_Agent SHALL maintain the existing filter and cart UI behavior with dynamically loaded data
3. THE AI_Agent SHALL implement a loading state while products are being fetched
4. IF the Supabase fetch fails, THEN THE AI_Agent SHALL display an error message to the user instead of falling back to static data
5. THE AI_Agent SHALL remove the hardcoded product array from `tienda.js`
6. THE AI_Agent SHALL verify that the store renders correctly with products from Supabase

### Requirement 9: Session 8 — Payment Gateway Integration

**User Story:** As the project owner, I want a real payment gateway connected to checkout, so that customers can complete purchases.

#### Acceptance Criteria

1. WHEN Session 8 begins and payment gateway keys are available, THE AI_Agent SHALL integrate the chosen gateway SDK (CardNet or Stripe) into `checkout.astro`
2. THE AI_Agent SHALL implement a Cloud Function endpoint to handle payment confirmation securely (no client-side secret keys)
3. WHEN a payment is confirmed, THE Cloud_Function SHALL create an order record in the `ordenes` table
4. THE AI_Agent SHALL update the checkout flow to display real payment status (processing, success, failure)
5. IF payment gateway keys are not available, THEN THE Session_Plan SHALL skip this session and document the integration points for later
6. THE AI_Agent SHALL implement proper error handling for declined payments and network failures

### Requirement 10: Session 9 — Dashboard Real Data (KPIs, Charts, Payment History)

**User Story:** As the project owner, I want the dashboard to show real data instead of dummy values, so that users get actionable information.

#### Acceptance Criteria

1. WHEN Session 9 begins, THE AI_Agent SHALL replace dummy KPI values with queries against `clientes`, `ordenes`, and `producto_avances` tables
2. THE AI_Agent SHALL render "Sin datos" placeholders when query results are empty instead of showing fake numbers
3. THE AI_Agent SHALL connect the SVG chart components to real data from `chart_data` or computed aggregations
4. THE AI_Agent SHALL populate the payment history panel from the `ordenes` and `orden_items` tables
5. THE AI_Agent SHALL remove all `localStorage` fallback patterns and use Supabase as the single source of truth
6. THE AI_Agent SHALL implement Supabase Auth persistent sessions instead of `sessionStorage`

### Requirement 11: Session 10 — Internationalization Completion (i18n to 100%)

**User Story:** As the project owner, I want complete bilingual support (ES/EN), so that English-speaking clients can use the platform fully.

#### Acceptance Criteria

1. WHEN Session 10 begins, THE AI_Agent SHALL extract all translation strings from the existing `translations` object (~850 lines in script.js) and `i18n-extra.js` into `src/data/i18n/es.json` and `src/data/i18n/en.json`
2. THE AI_Agent SHALL identify and fill all 131 missing translation keys
3. THE AI_Agent SHALL implement a JSON-based i18n loader that replaces the inline `translations` object
4. THE AI_Agent SHALL verify that all pages render correctly in both ES and EN modes
5. THE AI_Agent SHALL remove the old inline translation objects from `script.js` and `i18n-extra.js`
6. IF any translation requires business context that the AI_Agent cannot determine, THEN THE AI_Agent SHALL flag it for User review with a placeholder

### Requirement 12: Session 11 — UX Polish (Images, Scripts, Flow, Footer)

**User Story:** As the project owner, I want optimized page load performance and consistent UX, so that customers have a professional experience.

#### Acceptance Criteria

1. WHEN Session 11 begins, THE AI_Agent SHALL implement responsive images using `srcset` and WebP format for all hero and product images
2. THE AI_Agent SHALL implement conditional script loading so Supabase SDK loads only on pages that use it
3. THE AI_Agent SHALL improve the Onboarding → Activation → Dashboard flow to eliminate confusing redirections
4. THE AI_Agent SHALL add a spinner/overlay component for login and signup actions in `portal.astro`
5. THE AI_Agent SHALL audit and fix all footer links to be consistent across pages
6. THE AI_Agent SHALL verify that Lighthouse performance score improves after optimizations

### Requirement 13: Session 12 — Ecosystem Infrastructure (n8n Tunnel, Health Checks)

**User Story:** As the project owner, I want stable infrastructure for automation services, so that n8n workflows and integrations run reliably.

#### Acceptance Criteria

1. WHEN Session 12 begins, THE AI_Agent SHALL generate a Cloudflare Tunnel configuration for permanent n8n exposure
2. THE AI_Agent SHALL create a Docker Compose override or script to auto-start the tunnel with n8n
3. THE AI_Agent SHALL create an automated health check script that monitors all services (Supabase, GCP Functions, n8n, Docker containers)
4. THE AI_Agent SHALL configure the health check to report failures via a notification channel (WhatsApp via Evolution API or email)
5. IF Cloudflare credentials are not available, THEN THE AI_Agent SHALL document the setup steps for the User to complete manually

### Requirement 14: Session 13 — Supabase-to-Odoo Workflow and AI Packaging

**User Story:** As the project owner, I want automated order flow to Odoo and a packaged AI product, so that the business can scale operations.

#### Acceptance Criteria

1. WHEN Session 13 begins, THE AI_Agent SHALL design an n8n workflow that creates an Odoo Sale Order when a payment is confirmed in Supabase
2. THE AI_Agent SHALL export the workflow as JSON for version control in the repository
3. THE AI_Agent SHALL create documentation and a Docker Compose file for the "Private AI" product (Ollama + LiteLLM + Open WebUI as a sellable package)
4. THE AI_Agent SHALL write a README with pricing tiers, hardware requirements, and deployment instructions
5. THE AI_Agent SHALL verify the Supabase → Odoo workflow logic handles edge cases (duplicate orders, failed Odoo calls)

### Requirement 15: Session Dependency Map

**User Story:** As the project owner, I want a clear dependency map between sessions, so that I can understand which sessions can run in parallel and which are sequential.

#### Acceptance Criteria

1. THE Session_Plan SHALL define the following dependency chain: Session 0 (credentials) → Sessions 1-4 (can run in parallel after Session 0)
2. THE Session_Plan SHALL define that Sessions 5-6 (RBAC) depend on Session 3 (auth migration)
3. THE Session_Plan SHALL define that Session 7 (store) has no dependencies beyond Session 0
4. THE Session_Plan SHALL define that Session 8 (payments) depends on Session 7 (store) and requires gateway keys
5. THE Session_Plan SHALL define that Session 9 (real data) depends on Sessions 5, 7, and 8
6. THE Session_Plan SHALL define that Sessions 10-11 (i18n, UX) can run independently after Session 1
7. THE Session_Plan SHALL define that Sessions 12-13 (ecosystem) can run independently after Session 0
8. THE Session_Plan SHALL mark each session as: AI-autonomous, User-required, or Mixed (specifying which steps need the User)
