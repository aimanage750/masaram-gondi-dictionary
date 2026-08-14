"use client";

import { Volume2 } from "lucide-react";

export function SpeakButton({
  text,
  lang = "hi-IN",
  label = "Play pronunciation",
}: {
  text: string;
  lang?: string;
  label?: string;
}) {
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
  return (
    <button
      type="button"
      onClick={speak}
      className="inline-flex items-center gap-1 rounded-full bg-ochre-500/15 px-3 py-1 text-sm text-terracotta-700 hover:bg-ochre-500/25"
      aria-label={label}
    >
      <Volume2 size={16} />
      सुनें
    </button>
  );
}
