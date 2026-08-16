-- Phase 9: admin management system support.
-- 1) entries may now be archived (soft delete) — extend the status check.
-- 2) sources table for reference management (books, PDFs, websites, authors).

alter table public.entries drop constraint if exists entries_status_check;
alter table public.entries add constraint entries_status_check
  check (status in ('published', 'pending', 'rejected', 'draft', 'archived'));

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'other',
  name text not null,
  author text,
  page text,
  url text,
  notes text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sources enable row level security;

-- No public access to sources. Admin-only via service role / is_admin().
drop policy if exists sources_admin_read on public.sources;
create policy sources_admin_read on public.sources
  for select using (public.is_admin());

drop policy if exists sources_admin_write on public.sources;
create policy sources_admin_write on public.sources
  for all using (public.is_admin()) with check (public.is_admin());
