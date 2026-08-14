"use client";

import { useEffect, useRef, useState } from "react";

export function GondiScript({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [tofu, setTofu] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    // Missing-glyph heuristic: tofu boxes are typically very narrow or .notdef
    const width = el.getBoundingClientRect().width;
    if (text.length > 0 && width < 4) setTofu(true);
  }, [text]);

  return (
    <span className="inline-flex flex-col">
      <span ref={ref} className={`font-gondi ${tofu ? "tofu-flag" : ""} ${className}`}>
        {text}
      </span>
      {tofu && (
        <span className="mt-1 text-[10px] uppercase tracking-wide text-terracotta-600">
          Missing glyph — install Noto Sans Masaram Gondi
        </span>
      )}
    </span>
  );
}
