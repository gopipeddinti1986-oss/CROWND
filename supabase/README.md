# CROWND — Supabase Database Architecture & Migrations

This directory contains database schemas, migrations, security policies, and seed data for CROWND.

---

## 🏗️ Schema Overview

The database is built on PostgreSQL inside Supabase, enforcing **Row Level Security (RLS)** across all tables.

### Tables

1. `profiles`: Extends `auth.users` with user roles (`brand`, `creator`, `admin`), display name, avatar, and verification status. Managed automatically by a trigger on `auth.users` insertion.
2. `brands`: Profile extension for business accounts (company name, industry, website, verified status).
3. `creators`: Profile extension for creators (handle, niche, bio, platform, audience size, engagement rate).
4. `campaigns`: Performance campaigns created by brands with commission rates, budget, return window, and slug.
5. `campaign_applications`: Applications submitted by creators to participate in specific brand campaigns.
6. `products`: Catalog items featured in campaigns with prices and return period policies.
7. `referral_links`: Unique creator-specific tracked URLs and referral codes for campaigns.
8. `clicks`: Performance tracking records with client IP hash, user agent, and timestamp.
9. `orders`: Attributed e-commerce purchases tracking fulfillment, delivery, and return-clearance windows.
10. `rewards`: Creator earnings unlocked strictly after successful delivery and return clearance.
11. `transactions`: Balance modifications, payouts, and financial ledger entries.
12. `audit_logs`: Security and administrative event audit trails.
13. `risk_flags`: Automated or manual risk detection entries for anomalous referral patterns.

---

## 🔒 Row Level Security (RLS) Summary

- **Public Access:** Restricted to verified creators, active public campaigns, and basic public profile details.
- **Brand Isolation:** Brands can only inspect, create, and update their own campaigns, products, and applications.
- **Creator Isolation:** Creators can only view their own applications, referral links, orders, and rewards.
- **Attribution & Clicks:** Anonymous click tracking is permitted via a restricted insert policy.
- **Admin Isolation:** Audit logs and risk flags are strictly limited to admin roles and the backend service role.

---

## 🚀 How to Apply Migrations

### Method 1: Via Supabase Web Dashboard (Recommended for Initial Setup)

1. Navigate to your [Supabase Dashboard](https://app.supabase.com).
2. Select your CROWND project.
3. In the left navigation, click **SQL Editor**.
4. Click **New query**.
5. Copy and paste the entire contents of [`supabase/migrations/20260101000000_stage_a_schema.sql`](./migrations/20260101000000_stage_a_schema.sql).
6. Click **Run** (or `Cmd/Ctrl + Enter`).
7. Verify that all 13 tables are listed under the **Table Editor**.

### Method 2: Via Supabase CLI

```bash
# Link project
npx supabase link --project-ref your-project-ref

# Push migrations to remote database
npx supabase db push
```
