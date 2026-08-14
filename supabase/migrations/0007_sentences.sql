-- =============================================================================
-- 0007 — Gondi sentences (वाक्यांश)
-- Schema + RLS before public /vakya traffic.
-- Public may SELECT published rows only. Writes are admin-only.
-- Application still projects only the 4 public fields.
-- =============================================================================

create table if not exists public.sentences (
  id text primary key,
  gondi_script text not null,
  gondi_pronunciation text not null,
  roman_gondi text not null,
  roman_hindi text not null,
  hindi text not null,
  english text not null,
  source text not null default 'admin — book sentence',
  source_page text,
  verified boolean not null default false,
  status text not null default 'pending' check (status in ('published', 'pending', 'rejected', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create index if not exists sentences_status_idx on public.sentences (status);
create index if not exists sentences_gondi_trgm on public.sentences using gin (gondi_pronunciation gin_trgm_ops);
create index if not exists sentences_hindi_trgm on public.sentences using gin (hindi gin_trgm_ops);
create index if not exists sentences_english_trgm on public.sentences using gin (english gin_trgm_ops);

drop trigger if exists sentences_touch on public.sentences;
create trigger sentences_touch before update on public.sentences
for each row execute function public.touch_updated_at();

alter table public.sentences enable row level security;
alter table public.sentences force row level security;

drop policy if exists sentences_public_select_published on public.sentences;
drop policy if exists sentences_admin_all on public.sentences;

create policy sentences_public_select_published on public.sentences
  for select
  using (status = 'published');

create policy sentences_admin_all on public.sentences
  for all
  using (public.is_admin())
  with check (public.is_admin());

revoke insert, update, delete on public.sentences from anon, authenticated;
grant select on public.sentences to anon, authenticated;
