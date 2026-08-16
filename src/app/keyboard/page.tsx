import type { Metadata } from "next";
import { KeyboardClient } from "@/components/keyboard/KeyboardClient";

export const metadata: Metadata = {
  title: "Masaram Gondi Keyboard · कीबोर्ड",
  description:
    "Type Devanagari Gondi pronunciation and see it map live to Masaram Gondi Unicode (U+11D00–U+11D5F), with an on-screen Masaram Gondi keyboard.",
  alternates: { canonical: "/keyboard" },
};

export default function KeyboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-forest-600">Masaram Gondi Keyboard</h1>
      <p className="mt-2 text-sm text-ink-700/70">
        Type Devanagari Gondi pronunciation — it maps live to Masaram Gondi Unicode.
      </p>
      <KeyboardClient />
    </div>
  );
}
