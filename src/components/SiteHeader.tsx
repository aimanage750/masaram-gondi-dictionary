"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "खोज" },
  { href: "/browse", label: "श्रेणी" },
  { href: "/vakya", label: "वाक्यांश" },
  { href: "/keyboard", label: "कीबोर्ड" },
  { href: "/contribute", label: "योगदान" },
  { href: "/about", label: "परिचय" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-terracotta-500/20 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-terracotta-500 text-cream-50 font-gondi text-lg shadow-inset">
            𑴎
          </span>
          <span>
            <span className="block font-display text-lg leading-none text-ink-800">
              Masaram Gondi
            </span>
            <span className="font-deva text-sm text-forest-500">गोंडी शब्द कोश</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-1.5 text-sm ${
                path === n.href || (n.href !== "/" && path.startsWith(n.href))
                  ? "bg-forest-500 text-cream-50"
                  : "text-ink-700 hover:bg-cream-200"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-full border border-terracotta-500/40 px-3 py-1.5 text-sm text-terracotta-600"
          >
            Admin
          </Link>
        </nav>
        <button
          className="md:hidden rounded-lg p-2 text-ink-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-terracotta-500/15 px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-ink-800 hover:bg-cream-200"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
