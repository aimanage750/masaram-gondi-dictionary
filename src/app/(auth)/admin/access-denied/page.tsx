import { ShieldX } from "lucide-react";

export const metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card">
        <ShieldX size={44} aria-hidden className="mx-auto text-terracotta-500" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-800">Access Denied</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-700/80">
          Your Google account is authenticated, but it is not on the admin allowlist. If you
          believe this is a mistake, contact the project owner.
        </p>
        <p className="mt-1 font-deva text-sm text-ink-700/70">
          आपका खाता सत्यापित है, परंतु एडमिन सूची में नहीं है।
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/api/admin-auth/google"
            className="inline-flex min-h-[42px] items-center rounded-full border border-terracotta-600/30 px-5 py-2 text-sm font-semibold text-terracotta-700 hover:bg-terracotta-500/10"
          >
            Try another account
          </a>
          <a
            href="/"
            className="inline-flex min-h-[42px] items-center rounded-full bg-terracotta-500 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-terracotta-600"
          >
            Public site
          </a>
        </div>
      </div>
    </div>
  );
}
