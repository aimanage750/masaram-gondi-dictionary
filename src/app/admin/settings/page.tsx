import { CheckCircle2, XCircle } from "lucide-react";
import { devLoginEnabled, googleOAuthConfigured } from "@/lib/admin-auth/env";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Settings" };

/** Safe configuration display — booleans only. Secrets (OAuth secret,
 * Supabase service role key, session secret) are NEVER rendered. */
export default function AdminSettingsPage() {
  const user = getAdminUser();
  const rows: { label: string; on: boolean; hint: string }[] = [
    {
      label: "Google OAuth (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)",
      on: googleOAuthConfigured(),
      hint: "Required for production admin sign-in.",
    },
    {
      label: "Admin allowlist (ADMIN_EMAILS)",
      on: Boolean((process.env.ADMIN_EMAILS ?? "").trim()),
      hint: "Server-side list of super-admin emails.",
    },
    {
      label: "Supabase backend",
      on: isSupabaseConfigured(),
      hint: "When unset, the local/GitHub data store is used.",
    },
    {
      label: "GitHub data store (GITHUB_STORE_TOKEN)",
      on: Boolean((process.env.GITHUB_STORE_TOKEN ?? "").trim()),
      hint: "Persists admin changes on Vercel via the data-store branch.",
    },
    {
      label: "Dev login escape hatch",
      on: devLoginEnabled(),
      hint: "Must stay OFF in production (NODE_ENV check + ADMIN_DEV_LOGIN=1).",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Configuration status only — secret values are never displayed.
        </p>
      </header>

      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start justify-between gap-4 rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
            <div>
              <p className="text-sm font-semibold text-ink-800">{r.label}</p>
              <p className="mt-0.5 text-xs text-ink-700/60">{r.hint}</p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                r.on ? "bg-forest-600/10 text-forest-600" : "bg-terracotta-500/10 text-terracotta-700"
              }`}
            >
              {r.on ? <CheckCircle2 size={13} aria-hidden /> : <XCircle size={13} aria-hidden />}
              {r.on ? "Configured" : "Not set"}
            </span>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
        <h2 className="font-english text-base font-bold text-forest-600">Your Session</h2>
        <p className="mt-2 text-sm text-ink-700/80">
          {user?.email} · role <strong>{user?.role}</strong>
          {user?.legacy ? " (legacy local session)" : " (Google OAuth)"}
        </p>
        <p className="mt-1 text-xs text-ink-700/60">
          Sessions are HttpOnly signed cookies (12 h expiry) — no tokens in localStorage.
        </p>
      </section>
    </div>
  );
}
