-- =============================================================================
-- Row Level Security — default DENY, explicit grants per role
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;
alter table public.contributions enable row level security;
alter table public.audit_log enable row level security;
alter table public.rate_limits enable row level security;

-- Helper: current user's role
create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'public');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- profiles ----------
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- categories ----------
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- entries ----------
-- Public: published rows only. Internal columns are still in the row;
-- the application MUST project the 4 public fields. RLS cannot hide columns.
drop policy if exists entries_public_read on public.entries;
create policy entries_public_read on public.entries
  for select using (status = 'published' or public.is_admin() or created_by = auth.uid());

-- Contributors may insert pending rows they own. They cannot self-publish.
drop policy if exists entries_contributor_insert on public.entries;
create policy entries_contributor_insert on public.entries
  for insert
  with check (
    auth.uid() is not null
    and created_by = auth.uid()
    and status = 'pending'
    and verified = false
  );

drop policy if exists entries_contributor_update_own on public.entries;
create policy entries_contributor_update_own on public.entries
  for update
  using (created_by = auth.uid() and status = 'pending')
  with check (created_by = auth.uid() and status = 'pending' and verified = false);

drop policy if exists entries_admin_all on public.entries;
create policy entries_admin_all on public.entries
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contributions (anonymous + signed-in) ----------
drop policy if exists contributions_insert on public.contributions;
create policy contributions_insert on public.contributions
  for insert
  with check (
    status = 'pending'
    and char_length(gondi_pronunciation) between 1 and 200
    and char_length(hindi) between 1 and 200
    and char_length(english) between 1 and 200
    and payload_bytes <= 8192
  );

drop policy if exists contributions_admin_read on public.contributions;
create policy contributions_admin_read on public.contributions
  for select using (public.is_admin());

drop policy if exists contributions_admin_write on public.contributions;
create policy contributions_admin_write on public.contributions
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------- audit log ----------
drop policy if exists audit_admin_read on public.audit_log;
create policy audit_admin_read on public.audit_log
  for select using (public.is_admin());

drop policy if exists audit_admin_insert on public.audit_log;
create policy audit_admin_insert on public.audit_log
  for insert with check (public.is_admin());

-- ---------- rate_limits (service role / security definer only) ----------
-- No policies for authenticated/anon → default deny.

-- ---------- storage: audio bucket ----------
drop policy if exists audio_public_read on storage.objects;
create policy audio_public_read on storage.objects
  for select using (bucket_id = 'audio');

drop policy if exists audio_admin_write on storage.objects;
create policy audio_admin_write on storage.objects
  for insert
  with check (bucket_id = 'audio' and public.is_admin());

drop policy if exists audio_admin_update on storage.objects;
create policy audio_admin_update on storage.objects
  for update using (bucket_id = 'audio' and public.is_admin());

drop policy if exists audio_admin_delete on storage.objects;
create policy audio_admin_delete on storage.objects
  for delete using (bucket_id = 'audio' and public.is_admin());

-- Force RLS even for table owners in the API
alter table public.profiles force row level security;
alter table public.entries force row level security;
alter table public.contributions force row level security;
alter table public.audit_log force row level security;
alter table public.rate_limits force row level security;
alter table public.categories force row level security;
