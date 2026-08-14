# Masaram Gondi Dictionary

Production-grade dictionary for the **Masaram Gondi** script (Unicode `U+11D00–U+11D5F`).

Created by **Saiyyam Ji**.

## Public result (always 4 fields)

1. Masaram Gondi  
2. Gondi Pronunciation  
3. Hindi  
4. English  

Roman Gondi / Roman Hindi are **internal search fields only**.

Search accepts all of: `तल्ला` · `Talla` · `talla` · `TALLA` · `sir` · `सिर` · `Head` · `𑴛𑴧𑵅𑴧𑴱`

## Source rule

Uploaded PDFs (`गोंडी करीयाट (गोंडी सिखाएं)` 2–5) are the **primary source**.  
Gondi pronunciation is never invented and never silently respelt.  
Hindi/English only receive obvious spelling fixes (e.g. Beared → Beard).

## Stack

- Next.js 14 App Router · React · Tailwind CSS
- Supabase (Postgres + Auth + Storage) when env is set
- Local JSON store + demo admin when Supabase is not configured
- PWA (offline cache of the public dictionary)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Demo admin (local mode only):

- Email: `admin@localhost`
- Password: `ChangeMeNow1`  ← change immediately

## Supabase

1. Create a project. Enable **email confirmation** for Auth.  
2. Put `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.  
3. Put `SUPABASE_SERVICE_ROLE_KEY` **only** in server env — never `NEXT_PUBLIC_`.  
4. Run in order:

```
supabase/migrations/0001_schema.sql
supabase/migrations/0002_rls.sql
```

RLS is **default deny**. Policies:

- public: `select` published entries only  
- contributor: `insert` pending rows they own  
- admin: full access  
- `rate_limits` / service-role tables: no anon policies  

## Security checklist

- [x] RLS SQL for every table  
- [x] service_role never shipped to the browser  
- [x] `/admin/*` gated by middleware + server session  
- [x] Zod validation + script-injection / path-traversal rejects  
- [x] Rate limits on search, login, contribute, import  
- [x] CSRF cookie on admin + contribution POSTs  
- [x] CSP + security headers  
- [x] Audio MIME / size / filename checks, private storage + signed URLs  
- [x] `.env` not committed (`.env.example` only)  
- [x] Audit log for admin writes  

## Mapping

Devanagari Gondi pronunciation is converted to real Masaram Gondi code points  
(not a font swap). Example:

`तल्ला` → `𑴛𑴧𑵅𑴧𑴱`

## Deploy (Vercel)

Set the same env vars. HTTPS is enforced by Vercel. Confirm no mixed-content URLs.
