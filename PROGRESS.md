# CROWND — Progress & Architecture Journal

> **Last Updated:** 2026-11-24  
> **Repository:** `https://github.com/gopipeddinti1986-oss/CROWND.git`  
> **Current Stage:** Stage B1 Complete (User Profile System & Onboarding)

---

## 1. Executive Summary

CROWND is a performance-based creator-commerce platform connecting small & local brands with vetted micro-creators. Rewards are strictly attributed to verified post-delivery purchases past return clearance windows.

- **Current Git HEAD:** Clean on branch `main`.
- **Quality Gates:** 100% Passing (TypeScript, ESLint, Prettier, Vitest, Next.js 15 App Router Build).
- **Test Coverage:** 72 unit, component, accessibility, and integration tests passing.
- **Production Build:** 29 routes prerendered / dynamically compiled with zero errors.

---

## 2. Completed Milestones

### Stage A: Foundation & Core Platform (Complete)

- Initial repository setup, strict TypeScript configuration, and Tailwind CSS.
- Editorial design system featuring dual themes (Warm Alabaster Light / Deep Charcoal Dark) and UI primitives.
- Supabase foundation: typed database client, database schema migrations, Row Level Security policies.
- Robust authentication: sign up, login, logout, password recovery, verification callbacks, and server-enforced role clamping.
- Comprehensive marketing website: 14 public routes with real copywriting, SEO metadata, sitemap, and robots.txt.

### Stage B0: Infrastructure & CI Audit (Complete)

- Investigated and resolved GitHub Actions CI check failure caused by formatting in markdown.
- Scoped mock environment variables across CI runner steps for build and test reliability.
- Audited live Supabase database connectivity with truthful, active inspection.
- Sanitized base URL normalization to gracefully handle trailing `/rest/v1` or trailing slashes.

### Stage B1: User Profile System & Onboarding (Complete)

- **Database Schema Extensions:** Created migration `20260102000000_stage_b1_onboarding.sql` adding profile completion tracking, brand identity, creator niches/categories/platforms, and storage security policies. Generated single consolidated `supabase/combined_migrations.sql`.
- **Supabase Storage Configuration:** Created public storage buckets `avatars` (5MB limit) and `brand-assets` (10MB limit) with authenticated ownership upload policies.
- **Validation Engine:** Built comprehensive field validators for company names, websites, descriptions, handles, categories, reach, and secure file uploads (`validation.ts`).
- **Profile Completion Algorithm:** Built real-time scoring algorithm (`completion.ts`) evaluating completeness (0-100%) and missing items for both brands and creators.
- **Server Actions:** Implemented `getOnboardingDataAction`, `saveBrandStepAction`, `saveCreatorStepAction`, `completeOnboardingAction`, and `uploadAssetAction` with server-side MIME type and size checks.
- **Onboarding Experience (`/onboarding`):** Built 4-step progressive onboarding flows for Brands and Creators with auto-saving, step tracking, file uploads, and terms acceptance.
- **Profile Management (`/dashboard/profile`):** Built full profile view and edit views for Brands and Creators with live completion progress bar and immediate form feedback.
- **Dashboard Integration:** Updated dashboard layout with persistent navigation tabs, profile breadcrumbs, and an onboarding notice banner for incomplete profiles.

---

## 3. Task Tracker

| Task / Gate                        | Scope                                                                | Status       | Details                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| **Git & Repo Inspection**          | Verify origin, branch, history                                       | ✅ Completed | Clean repo, origin set to https://github.com/gopipeddinti1986-oss/CROWND.git               |
| **Project Scaffolding**            | Next.js 15, TS strict, Tailwind, Prettier, ESLint                    | ✅ Completed | Scaffolded, configured, initial commit ee98fa7 pushed to GitHub                            |
| **Design System**                  | Tokens, themes (light/dark), components, typography                  | ✅ Completed | Tokens, theme switcher, UI primitives, 43 passing tests, Next.js build verified            |
| **Supabase Foundation**            | Client configs, schema, migrations, RLS, seed                        | ✅ Completed | Database schema, RLS policies, clients, and types pushed; 13 tables defined                |
| **Supabase Env Setup**             | .env.example, .gitignore, guidance                                   | ✅ Completed | .env.local configured, verified ignored by Git, live connection verified with 0 errors     |
| **Authentication Foundation**      | Sign up, sign in, password reset, protected routes, roles            | ✅ Completed | Server-enforced role clamping, session middleware, protected dashboard, password recovery  |
| **Public Marketing Website**       | Home, How it works, Creators, Campaigns, Pricing, FAQ, Guides, Legal | ✅ Completed | 14 responsive public routes, zero lorem ipsum, real guides, SEO metadata, sitemap & robots |
| **Stage B0: CI & Storage Audit**   | GitHub Actions CI fix, URL normalization, live storage setup         | ✅ Completed | CI green, mock env scoped, avatars & brand-assets buckets created                          |
| **Stage B1: Profile & Onboarding** | Multi-step onboarding, profile view/edit, completion scoring, tests  | ✅ Completed | 4-step Brand & Creator flows, completion widget, upload validation, 72 tests passing       |

---

## 4. Tests Performed & Results

- **Unit & Component Tests (`npm test`):** 72/72 passed across 10 test suites:
  - `smoke.test.ts`: Test environment sanity check.
  - `env.test.ts`: Supabase URL normalization, protocol repair, trailing slash & rest path cleanup.
  - `validation.test.ts`: Auth validators, password complexity, role clamping, open-redirect protection.
  - `onboarding/validation.test.ts`: 23 tests covering brand/creator field validations, file upload constraints, and profile completion percentages.
  - `theme.test.tsx`: Dual-theme cycling, document attribute synchronization, and persistence.
  - `components.test.tsx`: Buttons, input password reveal toggle, alerts with dismiss action, badge variants.
  - `onboarding-components.test.tsx`: Brand and Creator onboarding step rendering, asset upload drag-and-drop.
  - `profile-completion-widget.test.tsx`: 100% complete state, in-progress state, progress bar aria attributes.
  - `public-pages.test.tsx`: Rendering of all marketing pages, interactive creator search/filtering, campaign search.
  - `a11y-responsive.test.tsx`: Accessible SkipLink, landmark navigation, mobile toggle with ARIA, accessible form labels, radiogroup role selection, and modal dialog semantics.
- **Type check (`npm run typecheck`):** 0 errors.
- **Lint (`npm run lint`):** 0 errors, 0 warnings.
- **Formatting (`npm run format:check`):** 100% compliant with Prettier.
- **Production build (`npm run build`):** Compiled successfully in 18.3s. Prerendered / compiled 29 routes including `/onboarding` and `/dashboard/profile`.

---

## 4.2 Stage B2: Complete Campaign Ecosystem, Collaborations, Referral Tracking & Attribution (COMPLETED)

### Implemented Capabilities

1. **Campaign Ecosystem & Database Architecture (B2.0):**
   - Migration `supabase/migrations/20260103000000_stage_b2_campaign_ecosystem.sql` appended to `supabase/combined_migrations.sql`.
   - Comprehensive tables with full RLS: `campaigns`, `campaign_applications`, `collaborations`, `referral_links`, `clicks`, `orders`, `rewards`, `notifications`.
   - Strict TypeScript definitions in `src/lib/types/database.ts`.

2. **Brand Campaign Management (B2.1):**
   - 7-step Campaign Wizard (`src/components/campaigns/campaign-wizard.tsx`): Basics, Product, Creators, Deliverables, Budget, Schedule, Preview & Publish.
   - Lifecycle Status Transitions (`src/components/campaigns/campaign-status-control.tsx`): Draft -> Active -> Paused -> Active -> Completed -> Archived.
   - Server Actions: `createCampaignAction`, `updateCampaignAction`, `updateCampaignStatusAction`, `getBrandCampaignsAction`, `deleteCampaignDraftAction`.
   - Brand Pages: `/dashboard/campaigns`, `/dashboard/campaigns/new`, `/dashboard/campaigns/[id]`, `/dashboard/campaigns/[id]/edit`.

3. **Creator Discovery & Applications (B2.2):**
   - Creator Discovery Hub (`/dashboard/discover`): Browse active campaigns with audience size eligibility badge.
   - Application Modal (`src/components/campaigns/campaign-application-modal.tsx`): Creator pitch, proposed content plan, portfolio link submission.
   - Brand Application Review (`src/components/campaigns/brand-application-card.tsx`): Review creator stats, accept with automatic referral link generation or decline with notes.
   - Pages: `/dashboard/campaigns/[id]/applications`, `/dashboard/applications`, `/campaigns/[id]` (public/creator detail view).

4. **Creator Collaboration Workspace (B2.3):**
   - Workspace (`/dashboard/collaborations`): Status-grouped collaborations for both brands and creators.
   - Collaboration Card (`src/components/collaborations/collaboration-card.tsx`): Live tracking link copying, deliverables progress, creator content submission modal (URL, caption, notes), brand review modal (approve or request revision).
   - Navigation: Role-aware navigation tabs in `src/app/dashboard/layout.tsx`.

5. **Privacy-Preserving Referral Tracking Engine (B2.4):**
   - Route Handler (`/r/[code]`): 302 redirection, open-redirect prevention, bot traffic filtering (`Googlebot`, `Bingbot`, `HeadlessChrome`, scrapers).
   - Cookies: 30-day attribution cookie (`crownd_attribution`) and 1-year anonymous visitor cookie (`crownd_vid`).
   - Privacy: SHA-256 salted IP hashing (`hashIp`) prevents storing raw IP addresses.

6. **Conversion Attribution & Financial Precision Engine (B2.5 & B2.6):**
   - Attribution Resolution (`src/lib/attribution/engine.ts`): Last-Click attribution within a 30-day window.
   - Minor Currency Precision: `calculateDecimalCommission` uses integer-cent arithmetic to eliminate IEEE-754 floating-point rounding errors.
   - Order Processing (`src/lib/conversions/actions.ts`): `recordOrderConversionAction` with idempotency, referral link stats updates, reward ledger creation, and transaction logs.
   - Conversion Modal (`src/components/campaigns/record-conversion-modal.tsx`): Brand manual conversion logging.
   - Rewards Ledger (`src/lib/rewards/actions.ts`): Creator earnings breakdown (paid, eligible, pending return window), maturity checks, and brand payout disbursement.

7. **Performance Analytics & Notifications (B2.7 & B2.8):**
   - Analytics Engine (`src/lib/analytics/actions.ts`): Aggregates clicks, conversions, CR%, revenue, commission, and ROAS.
   - Dashboard (`/dashboard/analytics`): Role-aware dashboard with performance KPI cards, top creator links, and verified orders ledger.
   - Notifications System (`src/lib/notifications/actions.ts` & `src/components/notifications/notification-bell.tsx`): Interactive bell dropdown with unread badge counter and mark-as-read actions.
   - Public Directory (`/campaigns`): Live query of active database campaigns with search and category filtering.

### Stage B2 Verification Results

- **Unit & Component Tests (`npm test`):** 13 test files passed, 110/110 tests passed (100%).
- **TypeScript (`npm run typecheck`):** 0 errors.
- **ESLint (`npm run lint`):** 0 errors, 0 warnings.
- **Formatting (`npm run format:check`):** 100% compliant with Prettier.
- **Production build (`npm run build`):** 35 static & dynamic routes compiled successfully.

---

## 5. Architectural Decisions

1. **Next.js App Router (15.x):** Clean server-side rendering, layout nesting, and strict boundary separation between server actions and interactive client controls.
2. **Design Philosophy:** Editorial, trustworthy layout with custom CSS custom properties (tokens), max width 1120px, 4-6px subtle rounded corners, hairline borders, no purple/blue gradients or glassmorphism.
3. **Typography:**
   - Headings: `Source Serif 4` / `Newsreader` (editorial serif)
   - Body & UI: `Source Sans 3` / `IBM Plex Sans` (crisp legible grotesque sans)
   - Fallbacks: `Noto Serif Telugu` / `Noto Sans`
4. **Theme Palettes:**
   - **Light:** Background `#FAF8F4`, Surface `#FFFFFF`, Text `#1A1A1A`, Muted `#5C5A54`, Border `#DDD8CC`, Accent `#1F5C46`
   - **Dark:** Background `#14130F`, Surface `#1C1B16`, Text `#ECE8DF`, Muted `#A8A398`, Border `#33312A`, Accent `#5FB08F`
5. **Security & State Management:**
   - Server-first role enforcement via Supabase SSR and Server Actions.
   - Database tables guarded by Row Level Security (RLS) with explicit tenant/owner policies.
   - Public credentials strictly segregated from `SUPABASE_SERVICE_ROLE_KEY`.
   - File uploads validated server-side for MIME type, file size limit (5MB avatar / 10MB logo), and authenticated user folder isolation.
   - Attribution cookies signed and scoped; destination URLs strictly sanitized; visitor IPs hashed via HMAC-SHA256.
   - Commission and financial ledgers calculated using integer-cent rounding to guarantee zero floating point errors.

---

## 6. Database Migration Guidance

The full database schema for Stage A, Stage B1, and Stage B2 is compiled in:

- `supabase/combined_migrations.sql`

To apply to your Supabase project:

1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/fuvvbydrhfyhxwdwqnri`
2. Navigate to the **SQL Editor** tab on the left sidebar.
3. Click **New Query**, paste the contents of `supabase/combined_migrations.sql`, and click **Run**.
4. Both storage buckets (`avatars` and `brand-assets`) have already been created via the Storage API.

---

## 7. Next Steps (Stage C Transition)

1. **Stage C1 — Stripe Connect & Marketplace Escrow Engine:**
   - Onboarding brand payout methods and creator payout accounts.
   - Escrow lock on campaign budgets and automated payouts upon return window clearance.
2. **Stage C2 — Third-Party E-Commerce Store Integrations:**
   - Shopify, WooCommerce, and custom webhooks for automated order syncing.
3. **Stage C3 — Fraud Detection & Advanced Attribution:**
   - IP clustering, velocity anomaly detection, self-referral prevention.
