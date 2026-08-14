-- =============================================================================
-- 0006 — Automatic admin audit trail
-- Every INSERT / UPDATE / DELETE on moderated tables is written to
-- admin_audit_log by a SECURITY DEFINER trigger. Clients have no INSERT
-- privilege on that table (see 0005), so the only writer is this function.
-- =============================================================================

create or replace function public.log_admin_action()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor       uuid;
  v_email       text;
  v_action      text;
  v_row_id      text;
  v_old         jsonb;
  v_new         jsonb;
begin
  v_actor := auth.uid();

  if v_actor is not null then
    select email into v_email from auth.users where id = v_actor;
  end if;

  if tg_op = 'INSERT' then
    v_action := 'insert';
    v_new    := to_jsonb(new);
    v_row_id := coalesce(new.id::text, '');
  elsif tg_op = 'UPDATE' then
    if to_jsonb(old) = to_jsonb(new) then
      return new;
    end if;
    v_action := 'update';
    v_old    := to_jsonb(old);
    v_new    := to_jsonb(new);
    v_row_id := coalesce(new.id::text, old.id::text, '');
    -- Name the approval explicitly so the moderation UI can filter it.
    if tg_table_name = 'words'
       and old.status is distinct from new.status
       and new.status = 'published' then
      v_action := 'approve';
    elsif tg_table_name = 'words'
       and old.status is distinct from new.status
       and new.status = 'rejected' then
      v_action := 'reject';
    end if;
  elsif tg_op = 'DELETE' then
    v_action := 'delete';
    v_old    := to_jsonb(old);
    v_row_id := coalesce(v_old->>'id', v_old->>'user_id', v_old->>'slug', '');
  end if;

  insert into public.admin_audit_log (
    actor, actor_email, action, table_name, row_id, old_row, new_row
  ) values (
    v_actor, v_email, v_action, tg_table_name, nullif(v_row_id, ''), v_old, v_new
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.log_admin_action() from public;
-- Trigger functions do not need to be granted to anon/authenticated.

-- words
drop trigger if exists words_audit on public.words;
create trigger words_audit
  after insert or update or delete on public.words
  for each row execute function public.log_admin_action();

-- categories
drop trigger if exists categories_audit on public.categories;
create trigger categories_audit
  after insert or update or delete on public.categories
  for each row execute function public.log_admin_action();

-- contributions
drop trigger if exists contributions_audit on public.contributions;
create trigger contributions_audit
  after insert or update or delete on public.contributions
  for each row execute function public.log_admin_action();

-- audio_files
drop trigger if exists audio_files_audit on public.audio_files;
create trigger audio_files_audit
  after insert or update or delete on public.audio_files
  for each row execute function public.log_admin_action();

-- user_roles (privilege changes are the highest-value audit events)
drop trigger if exists user_roles_audit on public.user_roles;
create trigger user_roles_audit
  after insert or update or delete on public.user_roles
  for each row execute function public.log_admin_action();

-- ---------------------------------------------------------------------------
-- Privileged approve helper — admin only. Sets published + verified.
-- Never mutates devanagari_transliteration (source Gondi pronunciation).
-- ---------------------------------------------------------------------------
create or replace function public.approve_word(p_word_id uuid)
returns public.words
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.words;
begin
  if not public.is_admin() then
    raise exception 'only admin can approve words' using errcode = '42501';
  end if;

  update public.words
     set status     = 'published',
         verified   = true,
         updated_at = now()
   where id = p_word_id
     and status = 'pending'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'word % is not a pending row', p_word_id using errcode = 'P0002';
  end if;

  return v_row;
end;
$$;

revoke all on function public.approve_word(uuid) from public;
grant execute on function public.approve_word(uuid) to authenticated;
