# Web architecture

## Decision

The public website remains on Astro. Commercial pages are prerendered as static HTML for fast delivery, crawlability, resilience, and low hosting cost. Interactive features run as progressively enhanced client-side modules and use Supabase or dedicated webhooks.

Next.js is not required merely because the project is deployed on Vercel. Reconsider a framework migration only if the product needs a predominantly authenticated server-rendered application, extensive React-only UI, or a backend-for-frontend whose surface outgrows Astro endpoints.

## Rendering boundary

- Indexable: home, services, diagnostics, store catalog, about, media, and careers.
- Non-indexable: portal, onboarding, dashboard, checkout, contact submission, and error pages.
- Public content must remain available in the initial HTML without requiring JavaScript.
- Authentication, authorization, prices, payments, access codes, and privileged writes must be validated by a trusted backend. Client-generated values are never authoritative.

## SEO and AEO safeguards

- Stable canonical URLs and descriptive page metadata.
- Organization, LocalBusiness, WebSite, and FAQ structured data.
- Sitemap contains only canonical, indexable pages.
- `robots.txt` links to the sitemap; private routes also carry `noindex` metadata.
- `llms.txt` provides a concise discovery map, without replacing normal crawlable HTML or structured data.
- Vercel headers enforce baseline browser security and immutable caching for versioned assets.

## Functional roadmap

Before enabling real card or PayPal payments, move order creation, price calculation, payment confirmation, and activation-code issuance to server-side endpoints with idempotency and webhook signature verification. Supabase RLS remains mandatory for every browser-accessible table and storage bucket.
