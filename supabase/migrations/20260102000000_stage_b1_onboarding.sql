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
