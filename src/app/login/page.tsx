"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrf, setCsrf] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, csrf }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error === "Invalid credentials" ? "ईमेल या पासवर्ड गलत। Vercel में ADMIN_EMAIL / ADMIN_PASSWORD सेट करें।" : data.error ?? "लॉगिन नहीं हुआ");
    else router.push(next);
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="gond-frame w-full rounded-3xl bg-cream-50 p-8 text-ink-800">
        <h1 className="font-display text-2xl text-ink-800">एडमिन लॉगिन</h1>
        <p className="mt-1 font-deva text-sm text-ink-700/80">
          किताब के पन्ने स्कैन करने, शब्द जोड़ने और साइट नियंत्रित करने के लिए।
        </p>
        <p className="mt-2 text-xs text-ink-700/60">
          लाइव साइट: Vercel → Project → Settings → Environment Variables में{" "}
          <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code> डालें,
          फिर Redeploy करें।
        </p>
        <label className="mt-6 block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2 text-ink-800"
          />
        </label>
        <label className="mt-3 block text-sm">
          Password (कम से कम 8 अक्षर)
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2 text-ink-800"
          />
        </label>
        {err && <p className="mt-3 text-sm text-terracotta-600">{err}</p>}
        <button className="mt-6 w-full rounded-xl bg-terracotta-500 py-2.5 text-cream-50">
          अंदर जाएँ
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
