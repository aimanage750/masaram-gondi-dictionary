# PHASE 9 — SECURE ADMIN PANEL IMPLEMENTATION REPORT

Date: 2026-08-16 · Repository `aimanage750/masaram-gondi-dictionary`
Checkpoint commit: `5614d08` — `feat: add secure admin management system`
Backup branch before admin work: `backup/pre-admin-phase9` (= `097bba6`, pushed to remote).

---

## 1. Admin architecture

New admin panel built **alongside** the existing one (nothing destroyed):

```
/admin/login           → Google OAuth admin login (+ dev-only escape hatch, off in prod)
/admin/access-denied   → authenticated-but-unauthorized screen
/admin                 → Dashboard (counts, recent activity)
/admin/dashboard       → alias redirect → /admin
/admin/dictionary      → search / filter / edit / archive / restore (soft delete)
/admin/dictionary/new  → Add Word (sectioned form, current-schema fields)
/admin/dictionary/[id] → Edit Word — shows CURRENT DATA panel before editing
/admin/generator       → Word Generator (structured drafts, no fabrication)
/admin/contributions   → Phase 4 data: review / publish / merge / reject
/admin/reports         → Phase 5 data: investigate / correct / resolve / reject / duplicate
/admin/sources         → source & reference management + verification flags
/admin/verification    → AUTHOR VERIFICATION queue
/admin/data            → CSV export + validate → preview → confirm → apply import
/admin/settings        → safe config status (secrets never rendered)
/admin/profile         → Google profile (photo/name/email/role) + logout
/admin/audit           → audit log table (who/what/when, action badges)
Legacy tools kept:     → /admin/scan, /admin/vakya, /admin/entries*, /admin/import
```

Shell: `AdminShell` (sidebar desktop / drawer mobile, theme toggle reused from the public site, active states, logout form).

## 2. Google OAuth implementation

Standard authorization-code flow, zero new dependencies (`src/lib/admin-auth/google.ts`):
1. `/api/admin-auth/google` → signed state cookie (5 min) → Google consent.
2. `/api/admin-auth/callback` → state check (timing-safe) → code exchange → userinfo →
   **allowlist check** → signed session cookie → `/admin`.
3. Errors surface on `/admin/login?error=…` (state/exchange/identity/rate/not_configured).
Client secret lives server-side only; never rendered or bundled to the client.

## 3. Authorization method

- **Google login alone NEVER grants access.** Authenticated email is matched against
  server-side env allowlists: `ADMIN_EMAILS` (super_admin), `ADMIN_EDITOR_EMAILS` (editor),
  `ADMIN_REVIEWER_EMAILS` (reviewer). Otherwise → `/admin/access-denied`.
- Session: HttpOnly + SameSite=Lax + Secure(prod) signed cookie `mgd_admin`, 12 h expiry
  (`AUTH_SECRET`, falls back to `ADMIN_SESSION_SECRET`). No tokens in localStorage.
- Defense in depth: middleware redirect → layout redirect → per-API role checks.
- `getSessionUser()` now honors the new session, so ALL pre-existing admin APIs are
  automatically protected for Google sessions too.
- Dev escape hatch: `ADMIN_DEV_LOGIN=1` **and** `NODE_ENV !== "production"`, and the email
  must still pass the allowlist. Used for E2E testing; impossible in production.

## 4. Admin roles

`super_admin` (everything incl. publish/CSV/archive) · `editor` (dictionary edits, corrections,
sources) · `reviewer` (contribution/report review, status changes). Enforced server-side via
`can(role, action)` in every admin API. Role-management UI intentionally kept minimal per spec.

## 5. Dictionary management

Search/filter (status, verified), table view, Edit (CURRENT DATA shown first), Archive instead
of delete (status `archived`, reversible, public-hidden), Restore. New EntryStatus `"archived"`
added; Supabase migration 0010 extends the status check constraint safely.

## 6. Word Generator

Input Gondi/Roman/Masaram → prepared structure derived **only** from the project's verified
mapping (labelled SOURCE: verified mapping), candidate Roman Gondi spellings (never
auto-authoritative), reference search against the existing dictionary. Hindi/English fields are
manual (no web/AI backend is connected — nothing is invented). Drafts save with
`status=draft, verified=false` + “AUTHOR VERIFICATION REQUIRED” flag. Words without a verified
Masaram form show “Pending Author Verification”.

## 7. Contribution management (Phase 4 data)

List/filter/open full details (rich `details`, source, dialect, examples), then:
- **Approve & Publish** — explicit confirm dialog (“Publish this entry to the public
  Dictionary?”); duplicate-safe (same word+Hindi merges into the existing entry); contributor
  identity fields are stripped from the published entry.
- **Merge with Existing Entry** — side-by-side contributor vs existing data, per-field choice.
- **Reject**.

## 8. Report management (Phase 5 data)

Status workflow `pending → investigating → corrected / resolved / rejected / duplicate`.
Correction UI shows Current vs Suggested (USER SUGGESTION — not verified); applying writes to
the entry only after explicit confirmation and is audited. Reports never modify the dictionary
automatically.

## 9. Source management

`sources` table (migration 0010, RLS admin-only): type/name/author/page/url/notes with
**Source Verified / Source Unverified** marking. References only — no copyrighted uploads.

## 10. Verification workflow

`/admin/verification` queues every unverified non-archived entry. Actions: Verify, Edit,
Request More Evidence (→ draft + note), Reject. Gondi-side data stays non-authoritative until
verified here. Statuses in use: DRAFT / PENDING / VERIFIED / PUBLISHED / REJECTED / ARCHIVED
(via `status` + `verified` combination on the existing schema).

## 11. CSV / data management

Export: full dictionary CSV (all fields incl. ids/status/verified).
Import: parse → validate (required fields, forbidden content, duplicate ids in file, duplicate
words vs DB, Masaram Unicode range check) → **preview with row-level errors/warnings** →
confirm → apply. Blocking errors prevent apply; duplicates without ids are skipped. Every apply
is audit-logged (`CSV_IMPORTED`).

## 12. Audit log

Actions recorded: WORD_PUBLISHED / WORD_ARCHIVED / WORD_VERIFIED / WORD_UPDATED,
CONTRIBUTION_PUBLISHED / CONTRIBUTION_MERGED, REPORT_* (status + corrected), CSV_IMPORTED,
SOURCE_*. OAuth tokens/passwords never logged.

## 13. Security test results (all server-side enforced)

| Test | Result |
|---|---|
| Unauthenticated `/admin` | 307 → `/admin/login` |
| Unauthenticated admin APIs (entries PATCH, admin/*, import, export) | 403 |
| Non-allowlisted email (dev-login path) | 403 |
| Editor role attempting CSV import (publish-level) | 403 |
| Authorized session: all 13 admin pages + 5 legacy pages | 200 |
| Draft entry hidden publicly (`/word/[id]`) | 404 until published |
| Archived entry hidden / restored correctly | 404 / 200 |
| Public contribution → admin publish | published, contributor data not leaked |
| Merge contribution into existing entry | fields applied, no duplicate entry |
| Public report → investigate → apply correction | entry updated, report `corrected` |
| Logout clears session → admin redirects | ✅ |
| OAuth unconfigured → graceful error redirect | ✅ |
| CSV dry-run detects missing fields / bad Unicode / duplicates | ✅ |

## 14. Public site & data integrity

- All public routes 200 (home, browse, word detail, report, contribute, script, converter,
  keyboard, grammar, vakya, translator, about, contact).
- Raw seed untouched: **437 entries**; तल्ला verified intact (𑴛𑴧𑵅𑴧𑴱 / तल्ला / Talla / सिर / Head).
- Converter parity suite ALL PASSED; mappings unchanged.
- Theme system unchanged (admin reuses public tokens + Light/Dark/System toggle).
- Build: TypeScript ✅ · ESLint ✅ · production build ✅ (71/71 pages).

## 15. Environment variables (added to .env.example)

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `ADMIN_EMAILS`,
`ADMIN_EDITOR_EMAILS`, `ADMIN_REVIEWER_EMAILS`, `ADMIN_DEV_LOGIN`.
No real credentials committed. Supabase users must also run migration `0010`.

## 16. Known limitations / future work

- Google OAuth exchange could not be exercised end-to-end in the sandbox (no live Google
  credentials); the session/allowlist/authorization layer was fully E2E-tested via the
  dev-login path, which shares the exact same allowlist + session code.
- Publish/merge contribution workflows operate on the local/GitHub data store; the Supabase
  path keeps the legacy review API (documented in code).
- Web/AI research is intentionally NOT connected to the generator (fabrication prohibited;
  no trusted research infra exists). All such fields remain manual + review-required.
