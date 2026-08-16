-- Phase 5: public dictionary error reports.
-- Reports NEVER modify the dictionary. Every submission is stored as
-- 'pending' for future admin/author review.

create table if not exists public.dictionary_reports (
  id uuid primary key default gen_random_uuid(),
  dictionary_entry_id text,
  -- Server-side snapshot of the entry at report time (audit trail).
  reported_gondi_devanagari text,
  reported_roman_gondi text,
  reported_masaram_gondi text,
  reported_hindi text,
  reported_english text,
  error_types text[] not null,
  description text not null,
  suggested_correction text,
  -- User suggestions — never applied automatically. Kept as jsonb so the
  -- schema stays stable if more correction fields are added later.
  corrections jsonb,
  source_type text,
  source_name text,
  source_author text,
  source_page text,
  source_url text,
  evidence text,
  reporter_name text,
  reporter_email text,
  status text not null default 'pending' check (
    status in ('pending', 'investigating', 'corrected', 'rejected', 'duplicate', 'resolved')
  ),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload_bytes int not null default 0
);

alter table public.dictionary_reports enable row level security;

-- Public insert: status is FORCED to 'pending'. No public read/update/delete.
drop policy if exists dictionary_reports_insert on public.dictionary_reports;
create policy dictionary_reports_insert on public.dictionary_reports
  for insert
  with check (
    status = 'pending'
    and char_length(description) between 1 and 1000
    and payload_bytes <= 16384
    and array_length(error_types, 1) between 1 and 8
  );

-- Admin-only read/write.
drop policy if exists dictionary_reports_admin_read on public.dictionary_reports;
create policy dictionary_reports_admin_read on public.dictionary_reports
  for select using (public.is_admin());

drop policy if exists dictionary_reports_admin_write on public.dictionary_reports;
create policy dictionary_reports_admin_write on public.dictionary_reports
  for update using (public.is_admin()) with check (public.is_admin());
