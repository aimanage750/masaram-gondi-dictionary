import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TranslatorClient } from "@/components/translator/TranslatorClient";

export const metadata: Metadata = {
  title: "Translator · अनुवादक",
  description:
    "Translate between Hindi, English and Masaram Gondi using the uploaded गोंडी करीयाट dictionary data. Instant word translation with Gondi script output.",
  alternates: { canonical: "/translator" },
};

export default function TranslatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <SectionTitle
        kicker="Translator"
        title="Hindi ⇄ English ⇄ Masaram Gondi"
        sub="शब्दकोश-आधारित तुरंत अनुवाद — अपलोड की गई पुस्तक के प्रकाशित शब्दों से।"
        divider
        level="h1"
      />
      <div className="mt-10">
        <TranslatorClient />
      </div>
    </div>
  );
}
