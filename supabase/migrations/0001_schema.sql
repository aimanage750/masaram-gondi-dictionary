-- =============================================================================
-- Masaram Gondi Dictionary — schema
-- Run in Supabase SQL editor (or via CLI) BEFORE any UI traffic.
-- =============================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Roles live in a profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  display_name text,
  role text not null default 'contributor' check (role in ('contributor', 'admin')),
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  slug text primary key,
  name text not null,
  name_hi text not null,
  sort_order int not null default 0
);

create table if not exists public.entries (
  id text primary key,
  gondi_script text not null,
  gondi_pronunciation text not null,
  roman_gondi text not null,
  roman_hindi text not null,
  hindi text not null,
  english text not null,
  gondi_normalized text,
  category text not null default 'general' references public.categories (slug),
  category_hi text not null default '',
  notes text,
  source text not null default 'uploaded',
  source_page text,
  verified boolean not null default false,
  status text not null default 'pending' check (status in ('published', 'pending', 'rejected', 'draft')),
  audio_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

-- Generated search document (internal only)
alter table public.entries
  add column if not exists search_doc tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(gondi_pronunciation, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(roman_gondi, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(hindi, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(roman_hindi, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(english, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(gondi_script, '')), 'A')
  ) stored;

create index if not exists entries_search_idx on public.entries using gin (search_doc);
create index if not exists entries_status_idx on public.entries (status);
create index if not exists entries_category_idx on public.entries (category);
create index if not exists entries_gondi_trgm on public.entries using gin (gondi_pronunciation gin_trgm_ops);
create index if not exists entries_hindi_trgm on public.entries using gin (hindi gin_trgm_ops);
create index if not exists entries_english_trgm on public.entries using gin (english gin_trgm_ops);
create index if not exists entries_roman_gondi_trgm on public.entries using gin (roman_gondi gin_trgm_ops);
create index if not exists entries_roman_hindi_trgm on public.entries using gin (roman_hindi gin_trgm_ops);
create index if not exists entries_script_trgm on public.entries using gin (gondi_script gin_trgm_ops);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  gondi_pronunciation text not null,
  hindi text not null,
  english text not null,
  category text,
  notes text,
  contributor_name text,
  contributor_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  payload_bytes int not null default 0
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor uuid,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  detail text,
  ip inet,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key text primary key,
  hits int not null default 0,
  window_start timestamptz not null default now()
);

-- Storage bucket for pronunciation audio (private; signed URLs only)
insert into storage.buckets (id, name, public)
values ('audio', 'audio', false)
on conflict (id) do nothing;

-- Updated-at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entries_touch on public.entries;
create trigger entries_touch before update on public.entries
for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, role, email_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'contributor'),
    (new.email_confirmed_at is not null)
  )
  on conflict (id) do update
    set email_verified = (new.email_confirmed_at is not null);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
