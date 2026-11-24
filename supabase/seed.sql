-- ==============================================================================
-- CROWND Stage A Development Seed Data
-- ==============================================================================

-- Sample profiles, brands, creators, and active campaigns for development & testing

-- Notice: In live Supabase with auth, profiles are linked to auth.users.
-- The seed below provides structured reference data.

-- 1. Sample Brands
-- Note: Replace UUIDs with actual auth user IDs when testing in a live Supabase instance.
do $$
declare
  brand_user_id uuid := '11111111-1111-1111-1111-111111111111';
  creator_user_id uuid := '22222222-2222-2222-2222-222222222222';
  brand_id uuid;
  creator_id uuid;
  campaign_id uuid;
begin
  -- Optional test setup only if auth user exists:
  if exists (select 1 from auth.users where id = brand_user_id) then
    insert into public.brands (profile_id, company_name, website, industry, description, verified)
    values (
      brand_user_id,
      'Aura Roasters',
      'https://auraroasters.example.com',
      'Specialty Coffee & Beverages',
      'Artisanal small-batch single-origin coffee roastery committed to fair trade.',
      true
    )
    on conflict (profile_id) do nothing
    returning id into brand_id;

    if brand_id is not null then
      insert into public.campaigns (
        brand_id, title, slug, description, requirements, budget, commission_rate, commission_type, return_window_days, status
      ) values (
        brand_id,
        'Winter Single-Origin Launch',
        'winter-single-origin-launch',
        'Looking for genuine coffee enthusiasts and morning routine creators to showcase our highland Ethiopian beans.',
        'Must have genuine interest in manual brewing or coffee culture; 1,000 to 25,000 engaged community.',
        5000.00,
        15.00,
        'percentage',
        14,
        'active'
      )
      on conflict (slug) do nothing
      returning id into campaign_id;

      insert into public.products (brand_id, title, description, sku, price, return_period_days, url)
      values (
        brand_id,
        'Ethiopian Yirgacheffe Whole Bean (12oz)',
        'Floral jasmine notes with bright bergamot acidity and peach sweetness.',
        'AURA-ETH-01',
        22.00,
        14,
        'https://auraroasters.example.com/products/ethiopia-yirgacheffe'
      ) on conflict do nothing;
    end if;
  end if;
end $$;
