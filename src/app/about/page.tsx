import type { Metadata } from "next";
import { CulturePortal } from "@/components/culture/CulturePortal";
import { CulturalDivider } from "@/components/ui/CulturalDivider";

export const metadata: Metadata = {
  title: "Culture & Knowledge",
  description:
    "Explore India's tribal communities, languages, Gondi heritage, scripts, festivals, cultural traditions and important heritage places — with sources and data years.",
  alternates: { canonical: "/about" },
};

export default function CultureKnowledgePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest-900">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            Culture &amp; Knowledge
          </p>
          <h1 className="mt-3 font-deva text-3xl font-bold text-cream-50 md:text-5xl">
            संस्कृति एवं ज्ञान
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-deva text-sm leading-relaxed text-cream-200/85 md:text-base">
            भारत की आदिवासी संस्कृति, भाषाओं, परंपराओं, इतिहास और विरासत को जानने का एक
            डिजिटल मंच।
          </p>
          <p className="mx-auto mt-2 max-w-3xl font-english text-xs leading-relaxed text-cream-200/60 md:text-sm">
            A digital platform for learning about India&rsquo;s Adivasi communities, languages
            and heritage — starting with the Gondi people and the Masaram Gondi script.
          </p>
          <div className="mt-6">
            <CulturalDivider className="text-gold-500" />
          </div>
        </div>
      </section>

      {/* Portal */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <CulturePortal />
      </div>
    </div>
  );
}
