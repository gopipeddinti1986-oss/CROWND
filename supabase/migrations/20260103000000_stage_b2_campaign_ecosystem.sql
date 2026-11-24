-- ==============================================================================
-- CROWND Platform Migration: Stage B2 — Complete Campaign Ecosystem
-- Campaigns, Collaborations, Tracking, Attribution, Orders, Rewards, Notifications
-- ==============================================================================

-- 1. Campaign Applications Status Extension
do $$ begin
  alter type application_status add value if not exists 'under_review';
  alter type application_status add value if not exists 'withdrawn';
  alter type application_status add value if not exists 'completed';
exception
  when duplicate_object then null;
end $$;

-- 2. Campaigns Table Extensions
alter table public.campaigns
  add column if not exists objective text not null default 'Sales',
  add column if not exists campaign_type text not null default 'performance',
  add column if not exists category text not null default 'General',
  add column if not exists cover_image_url text,
  add column if not exists target_platforms text[] not null default '{"Instagram"}',
  add column if not exists min_followers integer not null default 0,
  add column if not exists max_followers integer,
  add column if not exists required_deliverables text[] not null default '{"1x Reel", "1x Story"}',
  add column if not exists deliverable_guidelines text,
  add column if not exists application_deadline timestamptz,
  add column if not exists content_deadline timestamptz,
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists allocated_budget numeric(12,2) not null default 0.00,
  add column if not exists remaining_budget numeric(12,2) not null default 0.00,
  add column if not exists compensation_model text not null default 'commission',
  add column if not exists fixed_amount numeric(10,2) not null default 0.00,
  add column if not exists terms_and_conditions text,
  add column if not exists tags text[] not null default '{}';

-- 3. Campaign Applications Table Extensions
alter table public.campaign_applications
  add column if not exists proposed_content_plan text,
  add column if not exists portfolio_links text[] not null default '{}',
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists review_notes text;

-- 4. Collaborations Table
create table if not exists public.collaborations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  application_id uuid references public.campaign_applications(id) on delete set null,
  status text not null default 'active' check (status in ('accepted', 'onboarding', 'active', 'content_pending', 'content_submitted', 'revision_requested', 'approved', 'completed', 'cancelled')),
  deliverables_status jsonb not null default '{}'::jsonb,
  content_url text,
  content_caption text,
  content_platform text,
  submission_notes text,
  revision_feedback text,
  submitted_at timestamptz,
  approved_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

-- 5. Referral Links Extensions
alter table public.referral_links
  add column if not exists collaboration_id uuid references public.collaborations(id) on delete set null,
  add column if not exists destination_url text not null default 'https://crownd.com',
  add column if not exists is_active boolean not null default true,
  add column if not exists revenue_generated numeric(12,2) not null default 0.00,
  add column if not exists commissions_earned numeric(12,2) not null default 0.00,
  add column if not exists expires_at timestamptz;

-- 6. Clicks Table Extensions
alter table public.clicks
  add column if not exists campaign_id uuid references public.campaigns(id) on delete set null,
  add column if not exists creator_id uuid references public.creators(id) on delete set null,
  add column if not exists device_category text default 'desktop',
  add column if not exists browser text,
  add column if not exists country text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists is_bot boolean not null default false,
  add column if not exists visitor_id text;

-- 7. Orders Table Extensions
alter table public.orders
  add column if not exists currency text not null default 'USD',
  add column if not exists customer_email_hash text,
  add column if not exists click_id uuid references public.clicks(id) on delete set null,
  add column if not exists attribution_model text not null default 'last_click',
  add column if not exists attributed_at timestamptz not null default now(),
  add column if not exists refunded_amount numeric(10,2) not null default 0.00,
  add column if not exists notes text;

-- 8. Rewards Table Extensions
alter table public.rewards
  add column if not exists campaign_id uuid references public.campaigns(id) on delete cascade,
  add column if not exists brand_id uuid references public.brands(id) on delete cascade,
  add column if not exists reward_type text not null default 'commission',
  add column if not exists disputed_reason text,
  add column if not exists currency text not null default 'USD';

-- 9. Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  action_url text,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 10. Enable Row Level Security (RLS)
alter table public.collaborations enable row level security;
alter table public.notifications enable row level security;

-- 11. Collaborations Policies
do $$ begin
  create policy "Brands can view and manage their campaign collaborations"
    on public.collaborations
    for all
    using (
      exists (
        select 1 from public.brands
        where brands.id = collaborations.brand_id and brands.profile_id = auth.uid()
      )
    );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "Creators can view and update their collaborations"
    on public.collaborations
    for all
    using (
      exists (
        select 1 from public.creators
        where creators.id = collaborations.creator_id and creators.profile_id = auth.uid()
      )
    );
exception
  when duplicate_object then null;
end $$;

-- 12. Notifications Policies
do $$ begin
  create policy "Users can view and update their own notifications"
    on public.notifications
    for all
    using (auth.uid() = user_id);
exception
  when duplicate_object then null;
end $$;

-- 13. Referral Links Public Read Policy for Tracking Redirection
do $$ begin
  create policy "Public can read active referral links for redirection"
    on public.referral_links
    for select
    using (true);
exception
  when duplicate_object then null;
end $$;

-- 14. Clicks Insertion Policy for Tracking
do $$ begin
  create policy "Public can insert click tracking events"
    on public.clicks
    for insert
    with check (true);
exception
  when duplicate_object then null;
end $$;

-- 15. Indexes for Query Performance
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_brand on public.campaigns(brand_id);
create index if not exists idx_campaign_applications_campaign on public.campaign_applications(campaign_id);
create index if not exists idx_campaign_applications_creator on public.campaign_applications(creator_id);
create index if not exists idx_collaborations_campaign on public.collaborations(campaign_id);
create index if not exists idx_collaborations_creator on public.collaborations(creator_id);
create index if not exists idx_referral_links_code on public.referral_links(code);
create index if not exists idx_clicks_link on public.clicks(link_id);
create index if not exists idx_orders_campaign on public.orders(campaign_id);
create index if not exists idx_orders_creator on public.orders(creator_id);
create index if not exists idx_rewards_creator on public.rewards(creator_id);
create index if not exists idx_notifications_user_read on public.notifications(user_id, is_read);
