"use client";

export type ConverterDirection = "deva-to-masaram" | "masaram-to-deva";

/**
 * Explicit direction switch — makes the reverse path (Masaram Gondi →
 * Devanagari/Hindi) a first-class, visible feature.
 */
export function ConverterModeTabs({
  direction,
  onChange,
}: {
  direction: ConverterDirection;
  onChange: (d: ConverterDirection) => void;
}) {
  const tabs: { id: ConverterDirection; label: string; sub: string }[] = [
    { id: "deva-to-masaram", label: "हिन्दी → मसराम गोंडी", sub: "Hindi to Gondi script" },
    { id: "masaram-to-deva", label: "मसराम गोंडी → हिन्दी", sub: "Gondi script to Hindi" },
  ];

  return (
    <div
      role="tablist"
      aria-label="कन्वर्टर दिशा"
      className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {tabs.map((t) => {
        const active = direction === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`rounded-xl border px-4 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
              active
                ? "border-transparent bg-gradient-to-b from-terracotta-400 to-terracotta-500 text-cream-50 shadow-[0_8px_18px_rgba(196,92,38,0.35)]"
                : "border-earth-500/15 bg-white text-ink-800 hover:border-terracotta-500/50 hover:bg-cream-100"
            }`}
          >
            <span className="block font-deva text-base font-semibold leading-tight">
              {t.label}
            </span>
            <span
              className={`block text-[11px] ${active ? "text-cream-100/85" : "text-ink-700/60"}`}
            >
              {t.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
