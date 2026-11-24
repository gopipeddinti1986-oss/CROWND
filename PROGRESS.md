# CROWND — Development Progress

## 1. Project Overview

CROWND is a performance-based creator-commerce platform connecting small & local businesses with micro-creators through verified, post-delivery attribution and explainable creator-campaign matching.

- **Tagline:** "From Followers to Real Results."
- **Core Value Proposition:** Brands pay strictly for verified sales; micro-creators receive guaranteed, transparent commissions.

---

## 2. Current Status

- **Current Stage:** Stage A: Foundation & Core Platform
- **Phase:** Task 3 — Design System & Layout Complete; Preparing Supabase Foundation
- **Latest Commit:** ee98fa7 (chore: scaffold Next.js application with TypeScript, Tailwind CSS and test tooling)

---

## 3. Task Tracker

| Task / Gate                   | Scope                                                                | Status         | Details                                                                                 |
| ----------------------------- | -------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------- |
| **Git & Repo Inspection**     | Verify origin, branch, history                                       | ✅ Completed   | Clean repo, origin set to https://github.com/gopipeddinti1986-oss/CROWND.git            |
| **Project Scaffolding**       | Next.js 15, TS strict, Tailwind, Prettier, ESLint                    | ✅ Completed   | Scaffolded, configured, initial commit ee98fa7 pushed to GitHub                         |
| **Design System**             | Tokens, themes (light/dark), components, typography                  | ✅ Completed   | Tokens, theme provider/switcher, UI primitives, 9 passing tests, Next.js build verified |
| **Supabase Foundation**       | Client configs, schema, migrations, RLS, seed                        | 🔄 In Progress | Database schema, RLS policies, clients, and types in progress                           |
| **Supabase Env Setup**        | .env.example, .gitignore, guidance                                   | ✅ Completed   | Template created; awaiting user local .env.local values                                 |
| **Authentication Foundation** | Sign up, sign in, password reset, protected routes, roles            | ⏳ Queued      | Client/server sessions and role-aware layout                                            |
| **Public Marketing Website**  | Home, How it works, Creators, Campaigns, Pricing, FAQ, Guides, Legal | ⏳ Queued      | Editorial, clean, informative content without lorem ipsum                               |
| **Testing & Quality Gates**   | Vitest, TypeScript, Lint, Axe a11y, responsive                       | 🔄 In Progress | 9 tests passing, 0 lint warnings, 0 type errors, production build verified              |

---

## 4. Tests Performed & Results

- Repository inspection: Remote verified (`origin` -> `https://github.com/gopipeddinti1986-oss/CROWND.git`, branch `main`).
- Unit & Component tests (`npm test`): 9/9 passed (smoke test, theme switching & storage, button, input with password toggle, alert with accessible dismiss, badge).
- Type check (`npm run typecheck`): 0 errors.
- Lint (`npm run lint`): 0 warnings, 0 errors.
- Formatting (`npm run format:check`): Clean.
- Production build (`npm run build`): Compiled successfully (Next.js 15.5.29 App Router).

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

---

## 6. Required Environment Variables

| Variable                        | Description               | Exposure                   |
| ------------------------------- | ------------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Project URL      | Public / Client & Server   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon API Key       | Public / Scoped by RLS     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase Service Role Key | Server-Only / Bypasses RLS |
| `NEXT_PUBLIC_SITE_URL`          | Application root URL      | Public / Client & Server   |

---

## 7. Known Issues / Blockers

- None at this stage. Awaiting local `.env.local` credentials from user for live Supabase connectivity.

---

## 8. Next Steps

1. Finalize dependency installation and setup test harness (`src/test/setup.ts`).
2. Implement CSS variables in `src/app/globals.css` and theme provider/switcher.
3. Build complete design system UI primitives (Button, Input, Select, Table, Dialog, Dropdown, Badge, Alert, Toast, Skeleton, EmptyState).
4. Implement Supabase database schema and migrations (`users`, `profiles`, `brands`, `creators`, `campaigns`, `applications`, `products`, `referral_links`, `clicks`, `orders`, `rewards`, `transactions`, `audit_logs`, `risk_flags`).
5. Provide user guidance for `.env.local` and await credentials while building public pages and auth components.
