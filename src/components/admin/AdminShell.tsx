"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Database,
  FileSearch,
  Flag,
  FolderArchive,
  Inbox,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { AdminUser } from "@/lib/types";

const NAV: { href: string; label: string; Icon: typeof LayoutDashboard }[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/dictionary", label: "Dictionary", Icon: BookOpen },
  { href: "/admin/dictionary/new", label: "Add Word", Icon: PlusCircle },
  { href: "/admin/generator", label: "Word Generator", Icon: Sparkles },
  { href: "/admin/contributions", label: "Contributions", Icon: Inbox },
  { href: "/admin/reports", label: "Reports", Icon: Flag },
  { href: "/admin/sources", label: "Sources", Icon: Library },
  { href: "/admin/verification", label: "Verification", Icon: CheckCircle2 },
  { href: "/admin/data", label: "Data / CSV", Icon: Database },
  { href: "/admin/audit", label: "Audit Log", Icon: FileSearch },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
  { href: "/admin/profile", label: "Profile", Icon: User },
];

const LEGACY: { href: string; label: string }[] = [
  { href: "/admin/scan", label: "Book Scan (legacy)" },
  { href: "/admin/vakya", label: "Sentences (legacy)" },
  { href: "/admin/entries", label: "Entries v1 (legacy)" },
  { href: "/admin/import", label: "CSV v1 (legacy)" },
];

const ROLE_LABEL: Record<AdminUser["role"], string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  reviewer: "Reviewer",
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  function active(href: string) {
    if (href === "/admin") return path === "/admin";
    return path.startsWith(href);
  }
  return (
    <>
      <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {NAV.map(({ href, label, Icon }) => {
          const on = active(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 ${
                on
                  ? "bg-terracotta-500 text-cream-50 shadow-card"
                  : "text-cream-100/90 hover:bg-forest-600"
              }`}
            >
              <Icon size={15} aria-hidden />
              {label}
            </Link>
          );
        })}
        <p className="mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-200/50">
          Legacy tools
        </p>
        {LEGACY.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-cream-200/70 transition hover:bg-forest-600"
          >
            <FolderArchive size={13} aria-hidden />
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 space-y-3 border-t border-cream-200/15 pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-cream-100/80 hover:bg-forest-600"
        >
          <BookOpen size={15} aria-hidden /> Public website
        </Link>
        <form action="/api/admin-auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-cream-100/80 transition hover:bg-terracotta-500 hover:text-cream-50"
          >
            <LogOut size={15} aria-hidden /> Logout
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 text-ink-800">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-forest-900 p-4 lg:flex">
        <p className="px-3 font-display text-lg text-cream-50">Masaram Gondi</p>
        <p className="px-3 text-[11px] uppercase tracking-[0.2em] text-gold-400">Admin Panel</p>
        <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-forest-800 p-2.5">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-terracotta-500 text-sm font-bold text-cream-50">
              {(user.name ?? user.email).slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-cream-50">
              {user.name ?? user.email}
            </span>
            <span className="block truncate text-[11px] text-cream-200/70">
              {ROLE_LABEL[user.role]}
              {user.legacy ? " · legacy session" : ""}
            </span>
          </span>
        </div>
        <div className="mt-4">
          <ThemeToggle />
        </div>
        <div className="mt-4 flex flex-1 flex-col overflow-hidden">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-earth-500/15 bg-cream-100/95 px-3 py-2 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl text-forest-600 hover:bg-cream-200"
        >
          <Menu size={20} aria-hidden />
        </button>
        <p className="font-display text-base text-forest-600">Admin Panel</p>
        <ThemeToggle />
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-900/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto bg-forest-900 p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-cream-50">Admin Panel</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-xl text-cream-100 hover:bg-forest-600"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <p className="mt-1 truncate text-xs text-cream-200/70">
              {user.email} · {ROLE_LABEL[user.role]}
            </p>
            <div className="mt-4 flex flex-1 flex-col">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <main className="p-4 md:p-6 lg:ml-60 lg:p-8">{children}</main>
    </div>
  );
}
