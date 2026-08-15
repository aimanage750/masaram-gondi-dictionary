-- Phase 4: rich public word-contribution payload.
-- Adds an optional `details` column carrying the full structured submission
-- (Roman Gondi, Masaram Gondi, definitions, examples, synonyms, source info).
-- Idempotent. Existing rows and the admin review flow are unaffected.

alter table public.contributions
  add column if not exists details jsonb;

-- Replace the anonymous insert policy: new minimum is at least one Gondi
-- identifier (gondi_pronunciation OR roman_gondi OR masaram_gondi inside
-- details). Status is STILL forced to 'pending' — public users can never
-- insert approved/rejected rows.
drop policy if exists contributions_insert on public.contributions;
create policy contributions_insert on public.contributions
  for insert
  with check (
    status = 'pending'
    and char_length(gondi_pronunciation) <= 200
    and char_length(hindi) <= 200
    and char_length(english) <= 200
    and payload_bytes <= 16384
    and (
      char_length(gondi_pronunciation) >= 1
      or coalesce(details->>'roman_gondi', '') <> ''
      or coalesce(details->>'masaram_gondi', '') <> ''
    )
  );
