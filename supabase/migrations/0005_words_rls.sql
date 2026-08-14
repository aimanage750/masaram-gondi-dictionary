-- =============================================================================
-- 0005 — Row Level Security
-- Default DENY on every new table. Explicit policies only.
-- FORCE RLS so table owners hitting the Data API are also constrained.
-- =============================================================================

alter table public.user_roles       enable row level security;
alter table public.words            enable row level security;
alter table public.audio_files      enable row level security;
alter table public.admin_audit_log  enable row level security;

alter table public.user_roles       force row level security;
alter table public.words            force row level security;
alter table public.audio_files      force row level security;
alter table public.admin_audit_log  force row level security;

-- categories + contributions already have RLS from 0002; keep FORCE on.
alter table public.categories       enable row level security;
alter table public.contributions    enable row level security;
alter table public.categories       force row level security;
alter table public.contributions    force row level security;

-- ---------------------------------------------------------------------------
-- Role helpers (security definer, locked search_path).
-- Prefer user_roles; fall back to profiles.role from 0001.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.user_roles
       where user_id = auth.uid() and role = 'admin'
    )
    or exists (
      select 1 from public.profiles
       where id = auth.uid() and role = 'admin'
    );
$$;

create or replace function public.is_contributor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and (
      exists (
        select 1 from public.user_roles
         where user_id = auth.uid()
           and role in ('contributor', 'admin')
      )
      or exists (
        select 1 from public.profiles
         where id = auth.uid()
           and role in ('contributor', 'admin')
      )
    );
$$;

revoke all on function public.is_admin()        from public;
revoke all on function public.is_contributor()  from public;
grant execute on function public.is_admin()       to authenticated, anon;
grant execute on function public.is_contributor() to authenticated, anon;

-- =============================================================================
-- user_roles
-- =============================================================================
drop policy if exists user_roles_self_read   on public.user_roles;
drop policy if exists user_roles_admin_read  on public.user_roles;
drop policy if exists user_roles_admin_write on public.user_roles;

create policy user_roles_self_read on public.user_roles
  for select
  using (user_id = auth.uid() or public.is_admin());

-- No INSERT/UPDATE/DELETE for contributors. Admins manage grants.
create policy user_roles_admin_write on public.user_roles
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- words
-- =============================================================================
drop policy if exists words_public_select_published     on public.words;
drop policy if exists words_owner_select_own            on public.words;
drop policy if exists words_contributor_insert_pending  on public.words;
drop policy if exists words_admin_all                   on public.words;

-- Anyone (anon + authenticated) may read published rows only.
create policy words_public_select_published on public.words
  for select
  using (status = 'published');

-- A contributor may see their own pending/rejected rows (moderation loop).
create policy words_owner_select_own on public.words
  for select
  using (created_by = auth.uid());

-- Authenticated contributors INSERT only as pending, owned by themselves.
-- They cannot self-publish (status is locked to 'pending' in WITH CHECK).
create policy words_contributor_insert_pending on public.words
  for insert
  to authenticated
  with check (
    public.is_contributor()
    and created_by = auth.uid()
    and status = 'pending'
    and verified is not true
  );

-- Admin: full UPDATE / DELETE (includes approving pending → published).
-- SELECT for admins is covered by the two SELECT policies above plus this ALL.
create policy words_admin_all on public.words
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- categories — public read, admin write (re-assert after FORCE)
-- =============================================================================
drop policy if exists categories_public_read  on public.categories;
drop policy if exists categories_admin_write  on public.categories;

create policy categories_public_read on public.categories
  for select
  using (true);

create policy categories_admin_write on public.categories
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- contributions
-- =============================================================================
drop policy if exists contributions_insert              on public.contributions;
drop policy if exists contributions_contributor_insert  on public.contributions;
drop policy if exists contributions_admin_read          on public.contributions;
drop policy if exists contributions_admin_write         on public.contributions;

-- Authenticated contributors submit pending rows only.
create policy contributions_contributor_insert on public.contributions
  for insert
  to authenticated
  with check (
    public.is_contributor()
    and status = 'pending'
    and char_length(coalesce(gondi_pronunciation, '')) between 1 and 200
    and char_length(coalesce(hindi, '')) between 1 and 200
    and char_length(coalesce(english, '')) between 1 and 200
  );

create policy contributions_admin_read on public.contributions
  for select
  using (public.is_admin());

create policy contributions_admin_write on public.contributions
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy contributions_admin_delete on public.contributions
  for delete
  using (public.is_admin());

-- =============================================================================
-- audio_files
-- Published word audio is readable; only admin writes.
-- =============================================================================
drop policy if exists audio_files_public_read  on public.audio_files;
drop policy if exists audio_files_admin_write  on public.audio_files;

create policy audio_files_public_read on public.audio_files
  for select
  using (
    exists (
      select 1 from public.words w
       where w.id = audio_files.word_id
         and w.status = 'published'
    )
    or public.is_admin()
  );

create policy audio_files_admin_write on public.audio_files
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- admin_audit_log
-- INSERT/UPDATE/DELETE: no client policies at all → default DENY.
-- Triggers run as security definer and therefore bypass RLS to append rows.
-- =============================================================================
drop policy if exists admin_audit_log_admin_select  on public.admin_audit_log;
drop policy if exists audit_admin_read              on public.admin_audit_log;
drop policy if exists audit_admin_insert            on public.admin_audit_log;

create policy admin_audit_log_admin_select on public.admin_audit_log
  for select
  using (public.is_admin());

-- Intentionally omitted:
--   INSERT  — trigger only (security definer)
--   UPDATE  — nobody
--   DELETE  — nobody (append-only)

revoke insert, update, delete on public.admin_audit_log from anon, authenticated;
grant  select                 on public.admin_audit_log to authenticated;
