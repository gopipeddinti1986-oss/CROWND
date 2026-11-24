# CROWND

> **"From Followers to Real Results."**

CROWND is a performance-based creator-commerce platform designed for brands, small local businesses, and micro-creators. Brands launch targeted campaigns with guaranteed attribution, micro-creators promote authentic products with tracked links and coupon codes, and rewards unlock strictly for verified, delivered, and unreturned purchases.

---

## 🏛️ Platform Architecture (Stage A: Foundation & Core Platform)

- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS 3.4 with custom design tokens and dynamic CSS variables
- **Theming:** Dual-mode light/dark themes with persistent storage and system detection (no theme flash)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Auth SSR)
- **Testing:** Vitest, React Testing Library, JSDOM, Axe Core (Accessibility)
- **Code Quality:** ESLint 9, Prettier with Tailwind plugin, GitHub Actions CI

---

## 🎨 Design System & Aesthetic Principles

CROWND features an **editorial, restrained, trustworthy aesthetic**:

- Maximum layout width: `1120px` (12-column grid system)
- Flat surfaces with hairline borders (`1px`)
- Precise corner radius: `4px` to `6px`
- Zero purple/blue gradients, glowing orbs, or generic AI aesthetics
- Deep green primary brand accent

### Color Palettes

| Element               | Light Theme                | Dark Theme                  |
| --------------------- | -------------------------- | --------------------------- |
| **Background**        | `#FAF8F4` (Alabaster Warm) | `#14130F` (Deep Charcoal)   |
| **Surface**           | `#FFFFFF` (Pure Flat)      | `#1C1B16` (Card Surface)    |
| **Foreground / Text** | `#1A1A1A` (Near Black)     | `#ECE8DF` (Soft Warm White) |
| **Muted Text**        | `#5C5A54`                  | `#A8A398`                   |
| **Hairline Border**   | `#DDD8CC`                  | `#33312A`                   |
| **Brand Accent**      | `#1F5C46` (Forest Green)   | `#5FB08F` (Sage Mint)       |

### Typography

- **Headings:** `Source Serif 4` / `Newsreader` (Editorial Serif)
- **Body & UI:** `Source Sans 3` / `IBM Plex Sans`
- **Fallbacks:** `Noto Serif Telugu`, `Noto Sans`

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js `20.x` or `22.x`
- npm `10.x`

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Quality & Verification Commands

```bash
# Type checking
npm run typecheck

# Code formatting check
npm run format:check

# Linting
npm run lint

# Unit and component tests
npm run test

# Production build
npm run build
```

---

## 📂 Project Structure

```
├── .github/workflows/      # CI pipelines (GitHub Actions)
├── src/
│   ├── app/                # Next.js App Router pages, layouts & routes
│   │   ├── (auth)/         # Authentication routes (login, signup, reset)
│   │   ├── (marketing)/    # Public pages (home, how it works, pricing, etc.)
│   │   ├── layout.tsx      # Root layout with fonts & theme provider
│   │   └── globals.css     # CSS custom property tokens & resets
│   ├── components/
│   │   ├── ui/             # Design system atomic components (Button, Input, etc.)
│   │   ├── layout/         # Navigation, Footer, SkipLink, ThemeToggle
│   │   └── feedback/       # Alerts, Toasts, EmptyStates, Skeletons
│   ├── lib/
│   │   ├── supabase/       # Browser, Server & Service-Role Supabase clients
│   │   ├── utils/          # Class merging, formatting & validation utilities
│   │   └── types/          # Database definitions & application types
│   ├── supabase/
│   │   └── migrations/     # Idempotent SQL schema migrations & RLS policies
│   └── test/               # Test configuration & Vitest setup
├── PROGRESS.md             # Development tracker & stage audit log
├── README.md               # Repository documentation
└── tailwind.config.ts      # Tailwind token mappings
```

---

## 🛡️ Security & Access Control

- All database tables enforce **Row Level Security (RLS)**.
- User authentication and authorization are validated **server-side**.
- Service role key is strictly isolated to backend operations and omitted from client bundles.

---

## 📄 License

All rights reserved © CROWND.
