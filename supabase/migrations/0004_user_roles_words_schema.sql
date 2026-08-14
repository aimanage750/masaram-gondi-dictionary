-- =============================================================================
-- 0004 — Masaram Gondi dictionary core tables
--   user_roles · categories (id) · words · contributions (extended)
--   audio_files · admin_audit_log
--
-- Safe to run after 0001–0003. Does not drop existing entries/profiles.
-- Gondi pronunciation (devanagari_transliteration) is the source form and
-- must never be silently rewritten.
-- =============================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- user_roles
-- Canonical role assignment. Separate from auth.users so a compromised
-- client cannot self-promote (no UPDATE policy for non-admins).
-- ---------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        text not null check (role in ('admin', 'contributor')),
  granted_by  uuid references auth.users (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists user_roles_role_idx on public.user_roles (role);

comment on table public.user_roles is
  'Role grants. Only an existing admin (or service_role) may insert/update.';

-- ---------------------------------------------------------------------------
-- categories — 0001 created slug PK. Add a stable uuid for words.category_id.
-- ---------------------------------------------------------------------------
alter table public.categories
  add column if not exists id uuid;

update public.categories
   set id = gen_random_uuid()
 where id is null;

alter table public.categories
  alter column id set default gen_random_uuid();

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'categories_id_key'
       and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories add constraint categories_id_key unique (id);
  end if;
end $$;

alter table public.categories
  add column if not exists description text;

-- ---------------------------------------------------------------------------
-- words
-- Public display fields (app layer projects only these four):
--   gondi_script, devanagari_transliteration, hindi_meaning, english_meaning
-- roman_* columns are INTERNAL search/mapping only — never shown to users.
-- ---------------------------------------------------------------------------
create table if not exists public.words (
  id                         uuid primary key default gen_random_uuid(),
  gondi_script               text not null,
  devanagari_transliteration text not null,
  english_meaning            text not null,
  hindi_meaning              text not null,
  category_id                uuid references public.categories (id) on delete set null,
  pronunciation_audio_url    text,
  usage_example              text,
  status                     text not null default 'pending'
                               check (status in ('published', 'pending', 'rejected')),
  created_by                 uuid references auth.users (id) on delete set null,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),

  -- Internal only (search / matching). Not part of the public 4-field result.
  roman_gondi                text,
  roman_hindi                text,
  gondi_normalized           text,
  source                     text not null default 'uploaded',
  source_page                text,
  verified                   boolean not null default false,

  constraint words_gondi_script_not_blank
    check (char_length(btrim(gondi_script)) > 0),
  constraint words_deva_not_blank
    check (char_length(btrim(devanagari_transliteration)) between 1 and 200),
  constraint words_english_not_blank
    check (char_length(btrim(english_meaning)) between 1 and 200),
  constraint words_hindi_not_blank
    check (char_length(btrim(hindi_meaning)) between 1 and 200),
  constraint words_usage_example_len
    check (usage_example is null or char_length(usage_example) <= 500),
  constraint words_audio_url_safe
    check (
      pronunciation_audio_url is null
      or pronunciation_audio_url ~ '^(https://|/)[^<>]*$'
    )
);

create unique index if not exists words_source_form_meaning_uidx
  on public.words (
    devanagari_transliteration,
    hindi_meaning,
    coalesce(source_page, '')
  );

create index if not exists words_status_idx     on public.words (status);
create index if not exists words_category_idx   on public.words (category_id);
create index if not exists words_created_by_idx on public.words (created_by);
create index if not exists words_deva_trgm
  on public.words using gin (devanagari_transliteration gin_trgm_ops);
create index if not exists words_hindi_trgm
  on public.words using gin (hindi_meaning gin_trgm_ops);
create index if not exists words_english_trgm
  on public.words using gin (english_meaning gin_trgm_ops);
create index if not exists words_script_trgm
  on public.words using gin (gondi_script gin_trgm_ops);
create index if not exists words_roman_gondi_trgm
  on public.words using gin (roman_gondi gin_trgm_ops);
create index if not exists words_roman_hindi_trgm
  on public.words using gin (roman_hindi gin_trgm_ops);

comment on column public.words.devanagari_transliteration is
  'Gondi Pronunciation — original source form. Do not silently correct.';
comment on column public.words.gondi_script is
  'Masaram Gondi Unicode (U+11D00–U+11D5F). Real code points, not a font swap.';
comment on column public.words.roman_gondi is
  'INTERNAL search field only. Never return in a public result.';
comment on column public.words.roman_hindi is
  'INTERNAL search field only. Never return in a public result.';

-- ---------------------------------------------------------------------------
-- contributions — extend 0001 table so a contributor can submit a pending word
-- ---------------------------------------------------------------------------
alter table public.contributions
  add column if not exists word_id uuid references public.words (id) on delete set null;

alter table public.contributions
  add column if not exists gondi_script text;

alter table public.contributions
  add column if not exists category_id uuid references public.categories (id) on delete set null;

alter table public.contributions
  add column if not exists usage_example text;

create index if not exists contributions_status_idx
  on public.contributions (status);

create index if not exists contributions_word_id_idx
  on public.contributions (word_id);

-- ---------------------------------------------------------------------------
-- audio_files — metadata only. Bytes live in Storage (bucket: audio).
-- pronunciation_audio_url on words is a signed URL or storage path.
-- ---------------------------------------------------------------------------
create table if not exists public.audio_files (
  id                 uuid primary key default gen_random_uuid(),
  word_id            uuid references public.words (id) on delete cascade,
  storage_path       text not null,
  mime_type          text not null
                       check (mime_type in (
                         'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
                         'audio/ogg', 'audio/webm', 'audio/mp4', 'audio/aac'
                       )),
  byte_size          integer not null check (byte_size > 0 and byte_size <= 5242880),
  original_filename  text not null,
  uploaded_by        uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),

  constraint audio_files_path_no_traversal
    check (storage_path !~* '(\.\.|[\\])'),
  constraint audio_files_filename_safe
    check (original_filename !~* '(\.\.|[\\/])')
);

create index if not exists audio_files_word_idx on public.audio_files (word_id);

comment on table public.audio_files is
  'Pronunciation audio metadata. Objects are private in Storage; serve via signed URLs.';

-- ---------------------------------------------------------------------------
-- admin_audit_log — append-only via trigger. No client INSERT/UPDATE/DELETE.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor        uuid,
  actor_email  text,
  action       text not null,
  table_name   text not null,
  row_id       text,
  old_row      jsonb,
  new_row      jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

create index if not exists admin_audit_log_actor_idx
  on public.admin_audit_log (actor);

create index if not exists admin_audit_log_table_idx
  on public.admin_audit_log (table_name, action);

comment on table public.admin_audit_log is
  'Append-only audit trail. Written solely by security-definer triggers.';

-- Keep updated_at current
drop trigger if exists words_touch on public.words;
create trigger words_touch
  before update on public.words
  for each row execute function public.touch_updated_at();

drop trigger if exists user_roles_touch on public.user_roles;
create trigger user_roles_touch
  before update on public.user_roles
  for each row execute function public.touch_updated_at();
