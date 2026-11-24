-- ==============================================================================
-- CROWND Database Foundation Migration (Stage A)
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. Custom Types & Enums
do $$ begin
  create type user_role as enum ('brand', 'creator', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type campaign_status as enum ('draft', 'active', 'paused', 'completed', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type application_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type order_status as enum ('pending', 'delivered', 'return_cleared', 'refunded', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type reward_status as enum ('pending', 'eligible', 'paid', 'forfeited');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type transaction_type as enum ('credit', 'debit', 'payout');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type transaction_status as enum ('pending', 'completed', 'failed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type risk_severity as enum ('low', 'medium', 'high', 'critical');
exception
  when duplicate_object then null;
end $$;

-- ==============================================================================
-- 3. Core Tables
-- ==============================================================================

-- Profiles (Linked 1:1 with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role user_role not null default 'creator',
  full_name text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brands
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  company_name text not null,
  website text,
  industry text not null default 'General',
  description text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Creators
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade unique,
  handle text not null unique,
  primary_niche text not null default 'Lifestyle',
  bio text,
  primary_platform text not null default 'Instagram',
  audience_size integer not null default 0,
  engagement_rate numeric(5,2) not null default 0.00,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campaigns
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  requirements text,
  budget numeric(12,2) not null default 0.00,
  commission_rate numeric(5,2) not null default 10.00,
  commission_type text not null default 'percentage' check (commission_type in ('percentage', 'fixed')),
  return_window_days integer not null default 14,
  status campaign_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campaign Applications
create table if not exists public.campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  status application_status not null default 'pending',
  pitch text,
  applied_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (campaign_id, creator_id)
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  title text not null,
  description text,
  sku text,
  price numeric(10,2) not null,
  return_period_days integer not null default 14,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Referral Links
create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  code text not null unique,
  tracking_url text not null,
  clicks_count integer not null default 0,
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique(campaign_id, creator_id)
);

-- Clicks (Tracking)
create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.referral_links(id) on delete cascade,
  ip_hash text,
  user_agent text,
  referrer text,
  clicked_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references public.referral_links(id) on delete set null,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete set null,
  order_number text not null unique,
  order_amount numeric(10,2) not null,
  commission_amount numeric(10,2) not null default 0.00,
  status order_status not null default 'pending',
  delivered_at timestamptz,
  return_cleared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rewards
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  amount numeric(10,2) not null,
  status reward_status not null default 'pending',
  eligible_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  type transaction_type not null,
  reference_id text,
  status transaction_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Audit Logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- Risk Flags
create table if not exists public.risk_flags (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  severity risk_severity not null default 'low',
  reason text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- ==============================================================================
-- 4. Triggers & Helpers
-- ==============================================================================

-- Trigger to auto-create profile on auth.user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'creator'),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger set_brands_updated_at before update on public.brands for each row execute procedure public.handle_updated_at();
create trigger set_creators_updated_at before update on public.creators for each row execute procedure public.handle_updated_at();
create trigger set_campaigns_updated_at before update on public.campaigns for each row execute procedure public.handle_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute procedure public.handle_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.handle_updated_at();
create trigger set_rewards_updated_at before update on public.rewards for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- 5. Row Level Security (RLS)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.creators enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_applications enable row level security;
alter table public.products enable row level security;
alter table public.referral_links enable row level security;
alter table public.clicks enable row level security;
alter table public.orders enable row level security;
alter table public.rewards enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.risk_flags enable row level security;

-- Profiles Policies
create policy "Public can view basic profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Brands Policies
create policy "Public can view verified brands" on public.brands
  for select using (verified = true or auth.uid() = profile_id);

create policy "Brand owners can insert their brand profile" on public.brands
  for insert with check (auth.uid() = profile_id);

create policy "Brand owners can update their brand profile" on public.brands
  for update using (auth.uid() = profile_id);

-- Creators Policies
create policy "Public can view verified creators" on public.creators
  for select using (verified = true or auth.uid() = profile_id);

create policy "Creator owners can insert their creator profile" on public.creators
  for insert with check (auth.uid() = profile_id);

create policy "Creator owners can update their creator profile" on public.creators
  for update using (auth.uid() = profile_id);

-- Campaigns Policies
create policy "Public can view active campaigns" on public.campaigns
  for select using (
    status = 'active'
    or exists (select 1 from public.brands where brands.id = campaigns.brand_id and brands.profile_id = auth.uid())
  );

create policy "Brand owners can manage campaigns" on public.campaigns
  for all using (
    exists (select 1 from public.brands where brands.id = campaigns.brand_id and brands.profile_id = auth.uid())
  );

-- Campaign Applications Policies
create policy "Creators can view and submit applications" on public.campaign_applications
  for all using (
    exists (select 1 from public.creators where creators.id = campaign_applications.creator_id and creators.profile_id = auth.uid())
  );

create policy "Brands can view applications for their campaigns" on public.campaign_applications
  for select using (
    exists (
      select 1 from public.campaigns
      join public.brands on brands.id = campaigns.brand_id
      where campaigns.id = campaign_applications.campaign_id and brands.profile_id = auth.uid()
    )
  );

-- Products Policies
create policy "Public can view products" on public.products
  for select using (true);

create policy "Brand owners can manage products" on public.products
  for all using (
    exists (select 1 from public.brands where brands.id = products.brand_id and brands.profile_id = auth.uid())
  );

-- Referral Links Policies
create policy "Creators can view their referral links" on public.referral_links
  for select using (
    exists (select 1 from public.creators where creators.id = referral_links.creator_id and creators.profile_id = auth.uid())
  );

create policy "Brands can view referral links for their campaigns" on public.referral_links
  for select using (
    exists (
      select 1 from public.campaigns
      join public.brands on brands.id = campaigns.brand_id
      where campaigns.id = referral_links.campaign_id and brands.profile_id = auth.uid()
    )
  );

-- Clicks Policies
create policy "Allow recording clicks from anonymous tracking" on public.clicks
  for insert with check (true);

create policy "Creators and Brands can view clicks" on public.clicks
  for select using (
    exists (
      select 1 from public.referral_links
      left join public.creators on creators.id = referral_links.creator_id
      left join public.campaigns on campaigns.id = referral_links.campaign_id
      left join public.brands on brands.id = campaigns.brand_id
      where referral_links.id = clicks.link_id
      and (creators.profile_id = auth.uid() or brands.profile_id = auth.uid())
    )
  );

-- Orders Policies
create policy "Brands can view their campaign orders" on public.orders
  for select using (
    exists (select 1 from public.brands where brands.id = orders.brand_id and brands.profile_id = auth.uid())
  );

create policy "Creators can view orders attributed to them" on public.orders
  for select using (
    exists (select 1 from public.creators where creators.id = orders.creator_id and creators.profile_id = auth.uid())
  );

-- Rewards Policies
create policy "Creators can view their rewards" on public.rewards
  for select using (
    exists (select 1 from public.creators where creators.id = rewards.creator_id and creators.profile_id = auth.uid())
  );

-- Transactions Policies
create policy "Users can view their own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- Audit Logs Policies (Admin or Service Role only)
create policy "Admins can view audit logs" on public.audit_logs
  for select using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- Risk Flags Policies (Admin or Service Role only)
create policy "Admins can manage risk flags" on public.risk_flags
  for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- 6. Indexes for High-Traffic Foreign Keys and Lookups
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_brands_profile_id on public.brands(profile_id);
create index if not exists idx_creators_profile_id on public.creators(profile_id);
create index if not exists idx_creators_handle on public.creators(handle);
create index if not exists idx_campaigns_brand_id on public.campaigns(brand_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_slug on public.campaigns(slug);
create index if not exists idx_applications_campaign on public.campaign_applications(campaign_id);
create index if not exists idx_applications_creator on public.campaign_applications(creator_id);
create index if not exists idx_referral_links_code on public.referral_links(code);
create index if not exists idx_orders_campaign on public.orders(campaign_id);
create index if not exists idx_orders_creator on public.orders(creator_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_rewards_creator on public.rewards(creator_id);
create index if not exists idx_transactions_user on public.transactions(user_id);
-- ==============================================================================
-- CROWND Platform Migration: Stage B1 — User Profile System & Onboarding
-- Schema extensions for Brands, Creators, Profiles, and Storage Buckets
-- ==============================================================================

-- 1. Profiles Table Extensions
alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

-- 2. Brands Table Extensions
alter table public.brands
  add column if not exists logo_url text,
  add column if not exists company_size text,
  add column if not exists location text,
  add column if not exists country text,
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists business_contact jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_step integer not null default 1;

-- 3. Creators Table Extensions
alter table public.creators
  add column if not exists display_name text,
  add column if not exists profile_photo_url text,
  add column if not exists categories text[] not null default '{}',
  add column if not exists location text,
  add column if not exists platforms jsonb not null default '{}'::jsonb,
  add column if not exists portfolio_items jsonb not null default '[]'::jsonb,
  add column if not exists collaboration_preferences jsonb not null default '{}'::jsonb,
  add column if not exists languages text[] not null default '{"English"}',
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_step integer not null default 1;

-- 4. Storage Buckets Configuration (Avatars and Brand Assets)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('brand-assets', 'brand-assets', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 5. Storage Access Security Policies
do $$ begin
  create policy "Public Access avatars and brand-assets"
    on storage.objects for select
    using (bucket_id in ('avatars', 'brand-assets'));
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated users can upload own files"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id in ('avatars', 'brand-assets')
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated users can update own files"
    on storage.objects for update
    to authenticated
    using (
      bucket_id in ('avatars', 'brand-assets')
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated users can delete own files"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id in ('avatars', 'brand-assets')
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;
