/** Skeleton for the dynamic word-detail route — keeps layout stable while
 * the entry is fetched. Pure presentation; no data invented. */
export default function WordLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">शब्द लोड हो रहा है… Loading word…</span>
      <div className="h-4 w-40 animate-pulse rounded-full bg-cream-300/60" aria-hidden />
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8">
            <div className="h-5 w-28 animate-pulse rounded-full bg-cream-300/60" aria-hidden />
            <div className="mt-6 h-14 w-56 animate-pulse rounded-2xl bg-cream-300/60" aria-hidden />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-cream-200" aria-hidden />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-cream-200" aria-hidden />
              <div className="h-4 w-4/6 animate-pulse rounded-full bg-cream-200" aria-hidden />
            </div>
          </div>
          <div className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8">
            <div className="h-4 w-32 animate-pulse rounded-full bg-cream-300/60" aria-hidden />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-cream-200" aria-hidden />
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-36 animate-pulse rounded-3xl border border-earth-500/10 bg-white shadow-card" aria-hidden />
          <div className="h-36 animate-pulse rounded-3xl border border-earth-500/10 bg-white shadow-card" aria-hidden />
        </div>
      </div>
    </div>
  );
}
