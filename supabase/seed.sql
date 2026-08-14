-- =============================================================================
-- seed.sql — 5 published sample words for local / staging tests
--
-- PRIMARY SOURCE: गोंडी करीयाट (गोंडी सिखाएं) — uploaded PDF tables.
-- Gondi pronunciation is the printed source form (never invented).
-- Masaram Gondi is a real Unicode mapping of that source form.
--
-- Public 4-field projection:
--   gondi_script | devanagari_transliteration | hindi_meaning | english_meaning
--
-- roman_gondi / roman_hindi are INTERNAL search fields only.
--
-- Run AFTER migrations 0001–0006 (categories must already exist).
-- Idempotent: on conflict do nothing.
-- =============================================================================

-- Ensure the categories used below exist (0003 already inserts these).
insert into public.categories (slug, name, name_hi, sort_order) values
  ('body',      'Body',             'अंग प्रत्यंग', 1),
  ('building',  'Buildings',        'भवन',          7),
  ('direction', 'Direction',        'दिशा',         13)
on conflict (slug) do nothing;

update public.categories
   set id = coalesce(id, gen_random_uuid())
 where id is null;

-- Five verified source entries.
-- id is stable so tests can address a row by UUID.
insert into public.words (
  id,
  gondi_script,
  devanagari_transliteration,
  hindi_meaning,
  english_meaning,
  category_id,
  pronunciation_audio_url,
  usage_example,
  status,
  created_by,
  roman_gondi,
  roman_hindi,
  source,
  source_page,
  verified
) values
  (
    '59b2mn00-0000-4000-8000-000000000001',
    '𑴛𑴧𑵅𑴧𑴱',
    'तल्ला',
    'सिर',
    'Head',
    (select id from public.categories where slug = 'body'),
    null,
    'तल्ला तोयत — सिर दर्द है।',
    'published',
    null,
    'Talla',
    'sir',
    'गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source',
    '1',
    true
  ),
  (
    '59b2mn00-0000-4000-8000-000000000002',
    '𑴤𑴺𑴟𑵅𑴝𑴽𑴧',
    'मेन्दोल',
    'शरीर',
    'Body',
    (select id from public.categories where slug = 'body'),
    null,
    'मावा मेन्दोल — हमारा शरीर।',
    'published',
    null,
    'Mendol',
    'sharir',
    'गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source',
    '1',
    true
  ),
  (
    '59b2mn00-0000-4000-8000-000000000003',
    '𑴌𑴟',
    'कन',
    'आँख',
    'Eye',
    (select id from public.categories where slug = 'body'),
    null,
    'कन तक्वाना — आँख से देखना।',
    'published',
    null,
    'Kan',
    'aankh',
    'गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source',
    '1',
    true
  ),
  (
    '59b2mn00-0000-4000-8000-000000000004',
    '𑴦𑴽𑴟',
    'रोन',
    'मकान',
    'House',
    (select id from public.categories where slug = 'building'),
    null,
    'नवा रोन — नया मकान।',
    'published',
    null,
    'Ron',
    'makan',
    'गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source',
    '12',
    true
  ),
  (
    '59b2mn00-0000-4000-8000-000000000005',
    '𑴠𑴦𑴺𑵀𑴎',
    'परेंग',
    'उत्तर',
    'North',
    (select id from public.categories where slug = 'direction'),
    null,
    'परेंग अड़ोन — उत्तर दिशा।',
    'published',
    null,
    'Pareng',
    'uttar',
    'गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source',
    '31',
    true
  )
on conflict (id) do nothing;

-- Smoke checks (visible in the SQL editor output)
do $$
declare
  n int;
begin
  select count(*) into n from public.words where status = 'published';
  raise notice 'published words in database: %', n;
end $$;
