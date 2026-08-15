import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContributeForm } from "@/components/contribute/ContributeForm";

export const metadata: Metadata = {
  title: "Contribute a Word · शब्द का योगदान करें",
  description:
    "Help expand and improve the Masaram Gondi Dictionary by sharing words, meanings, pronunciations and reliable references. Contributions are reviewed before publication.",
  alternates: { canonical: "/contribute" },
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <ArrowLeft size={15} aria-hidden /> Back to Dictionary · शब्दकोश
      </Link>

      <header className="mt-5 max-w-3xl">
        <h1 className="font-english text-3xl font-bold text-forest-600 md:text-4xl">
          Contribute a Word
        </h1>
        <p className="mt-1 font-deva text-xl text-terracotta-600">शब्द का योगदान करें</p>
        <p className="mt-3 text-base leading-relaxed text-ink-700/90">
          Help expand and improve the Masaram Gondi Dictionary by sharing words, meanings,
          pronunciations and reliable references.
        </p>
        <p className="mt-1 font-deva text-base leading-relaxed text-ink-700/80">
          मसराम गोंडी शब्दकोश को बेहतर बनाने में अपना योगदान दें। हर योगदान समीक्षा के बाद ही प्रकाशित
          होता है — कुछ भी स्वतः प्रकाशित नहीं होता।
        </p>
      </header>

      <div className="mt-7">
        <ContributeForm />
      </div>
    </div>
  );
}
