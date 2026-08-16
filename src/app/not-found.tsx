import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center md:py-28">
      <p aria-hidden className="font-gondi text-5xl text-terracotta-500/80">
        𑴎
      </p>
      <p className="mt-4 font-english text-6xl font-bold tracking-tight text-forest-600">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink-800 md:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 font-deva text-base text-ink-700">
        यह पृष्ठ नहीं मिला। लिंक गलत हो सकता है या पृष्ठ हटा दिया गया हो।
      </p>
      <p className="mt-1 text-sm text-ink-700/70">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <ArrowLeft size={15} aria-hidden /> Back to Home
        </Link>
        <Link
          href="/browse"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-terracotta-600/30 px-6 py-2.5 text-sm font-semibold text-terracotta-700 transition hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <BookOpen size={15} aria-hidden /> Open Dictionary · शब्दकोश खोलें
        </Link>
      </div>
    </div>
  );
}
