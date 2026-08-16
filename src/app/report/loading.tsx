/** Skeleton for the dynamic report route (reads ?word= server-side). */
export default function ReportLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">लोड हो रहा है… Loading…</span>
      <div className="h-4 w-44 animate-pulse rounded-full bg-cream-300/60" aria-hidden />
      <div className="mt-5 h-10 w-72 max-w-full animate-pulse rounded-2xl bg-cream-300/60" aria-hidden />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-cream-200" aria-hidden />
      <div className="mt-7 max-w-4xl space-y-5">
        <div className="h-44 animate-pulse rounded-3xl border border-earth-500/10 bg-white shadow-card" aria-hidden />
        <div className="h-40 animate-pulse rounded-3xl border border-earth-500/10 bg-white shadow-card" aria-hidden />
      </div>
    </div>
  );
}
