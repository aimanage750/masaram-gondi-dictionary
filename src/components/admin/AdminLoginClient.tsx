"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldAlert } from "lucide-react";

const ERROR_TEXT: Record<string, string> = {
  not_configured:
    "Google OAuth is not configured. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (and ADMIN_EMAILS) in the environment.",
  state: "Security check failed. Please try signing in again.",
  exchange: "Google sign-in failed. Please try again.",
  identity: "Could not verify the Google identity.",
  rate: "Too many attempts. Please wait and try again.",
};

function LoginInner({
  devMode,
  googleConfigured,
}: {
  devMode: boolean;
  googleConfigured: boolean;
}) {
  const router = useRouter();
  const error = useSearchParams().get("error");
  const [csrf, setCsrf] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (devMode) {
      fetch("/api/csrf")
        .then((r) => r.json())
        .then((d) => setCsrf(d.token))
        .catch(() => {});
    }
  }, [devMode]);

  async function onDevSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin-auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, csrf }),
    });
    if (res.ok) router.push("/admin");
    else {
      const d = await res.json().catch(() => ({}));
      setErr(d?.error ?? "Not authorized");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <div className="gond-frame w-full rounded-3xl bg-white p-8 text-ink-800 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta-500">
          Masaram Gondi Dictionary
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-forest-600">Admin Panel</h1>
        <p className="mt-1 font-deva text-sm text-ink-700/80">
          सुरक्षित प्रशासन — केवल अधिकृत उपयोगकर्ता।
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-2xl bg-terracotta-500/10 p-3 text-xs leading-relaxed text-terracotta-700"
          >
            <ShieldAlert size={14} aria-hidden className="mt-0.5 shrink-0" />
            {ERROR_TEXT[error] ?? "Sign-in failed."}
          </p>
        )}

        <a
          href="/api/admin-auth/google"
          aria-disabled={!googleConfigured}
          className={`mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold shadow-card transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
            googleConfigured
              ? "bg-forest-600 text-cream-50 hover:bg-forest-500"
              : "pointer-events-none bg-cream-200 text-ink-700/50"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.6 4.1-5.35 4.1a6.1 6.1 0 1 1 0-12.2c1.95 0 3.25.85 4 1.5l2.7-2.6C16.95 3.1 14.7 2 12 2a10 10 0 1 0 0 20c5.75 0 9.55-4.05 9.55-9.75 0-.65-.05-1.15-.2-1.15Z"
            />
          </svg>
          Continue with Google
        </a>
        {!googleConfigured && (
          <p className="mt-2 text-center text-xs text-ink-700/60">
            Google OAuth अभी configured नहीं है।
          </p>
        )}

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-700/70">
          <Lock size={13} aria-hidden className="mt-0.5 shrink-0" />
          Google login alone does not grant access — your email must be on the server-side admin
          allowlist (ADMIN_EMAILS).
        </p>

        {devMode && (
          <form onSubmit={onDevSubmit} className="mt-6 border-t border-earth-500/15 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ochre-600">
              Dev sign-in (non-production only)
            </p>
            <label className="mt-2 block text-sm font-medium">
              Allowlisted email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-base outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30"
              />
            </label>
            {err && (
              <p role="alert" className="mt-2 text-xs font-medium text-terracotta-700">
                {err}
              </p>
            )}
            <button
              type="submit"
              className="mt-3 inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-ochre-500/50 px-5 py-2 text-sm font-semibold text-earth-500 hover:bg-ochre-500/10"
            >
              Dev Sign In
            </button>
          </form>
        )}

        <p className="mt-6 text-center">
          <a href="/" className="text-xs font-medium text-terracotta-500 underline-offset-2 hover:underline">
            ← Public website · सार्वजनिक साइट
          </a>
        </p>
      </div>
    </div>
  );
}

export function AdminLoginClient(props: { devMode: boolean; googleConfigured: boolean }) {
  return (
    <Suspense>
      <LoginInner {...props} />
    </Suspense>
  );
}
