"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;
  return (
    <footer className="mt-16 border-t border-terracotta-500/20 bg-forest-700 text-cream-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p>
          Created by <strong>Saiyyam Ji</strong> · Masaram Gondi Dictionary
        </p>
        <p className="text-cream-200/80">
          Source: गोंडी करीयाट (गोंडी सिखाएं) · Unicode U+11D00–U+11D5F
        </p>
      </div>
    </footer>
  );
}
