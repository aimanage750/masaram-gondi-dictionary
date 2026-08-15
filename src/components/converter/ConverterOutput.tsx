"use client";

export function ConverterOutput({
  value,
  direction,
}: {
  value: string;
  direction: "deva-to-masaram" | "masaram-to-deva";
}) {
  const label = direction === "deva-to-masaram" ? "मसराम गोंडी" : "देवनागरी";

  return (
    <div className="flex h-full flex-col">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-terracotta-600">
        {label}
      </span>
      <div
        lang={direction === "deva-to-masaram" ? "gon" : "hi"}
        aria-live="polite"
        aria-label={label}
        className={`min-h-[148px] w-full flex-1 overflow-auto whitespace-pre-wrap break-words rounded-2xl border-[1.5px] border-ink-800/15 px-4 py-3.5 text-[30px] leading-[1.55] text-ink-800 md:text-[32px] ${
          direction === "deva-to-masaram"
            ? "font-gondi [background-image:radial-gradient(circle_at_8px_8px,rgba(196,92,38,0.09)_1.1px,transparent_1.4px)] [background-size:16px_16px]"
            : "font-deva"
        } bg-[#fffdf6]`}
      >
        {value}
      </div>
    </div>
  );
}
