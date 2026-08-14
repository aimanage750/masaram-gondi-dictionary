"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const TABS = [
  { href: "/", label: "खोज", hint: "शब्द" },
  { href: "/browse", label: "श्रेणी", hint: "विषय" },
  { href: "/vakya", label: "वाक्यांश", hint: "वाक्य" },
];

const MORE = [
  { href: "/keyboard", label: "कीबोर्ड" },
  { href: "/contribute", label: "योगदान" },
  { href: "/about", label: "परिचय" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  function tabActive(href: string) {
    return path === href || (href !== "/" && path.startsWith(href));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-terracotta-500/20 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-terracotta-500 font-gondi text-lg text-cream-50 shadow-inset">
            𑴎
          </span>
          <span>
            <span className="block font-display text-lg leading-none text-ink-800">
              Masaram Gondi
            </span>
            <span className="font-deva text-sm text-forest-500">गोंडी शब्द कोश</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="hidden rounded-full border border-terracotta-500/40 px-3 py-1.5 text-sm text-terracotta-600 md:inline"
          >
            Admin
          </Link>
          <button
            className="rounded-lg p-2 text-ink-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <nav className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-3 pb-2" aria-label="मुख्य टैब">
        {TABS.map((n) => {
          const on = tabActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-xl px-2 py-2 text-center ${
                on ? "bg-forest-500 text-cream-50" : "bg-cream-200/70 text-ink-800"
              }`}
            >
              <span className="block font-deva text-base leading-none">{n.label}</span>
              <span className={`mt-1 block text-[11px] ${on ? "text-cream-100/80" : "text-ink-700/60"}`}>
                {n.hint}
              </span>
            </Link>
          );
        })}
      </nav>

      {open && (
        <nav className="border-t border-terracotta-500/15 px-4 py-3">
          {MORE.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-ink-800 hover:bg-cream-200"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg px-3 py-2 text-terracotta-600"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
