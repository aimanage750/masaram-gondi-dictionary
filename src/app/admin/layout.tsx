import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || (user.role !== "admin" && user.role !== "contributor")) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-terracotta-500/20 bg-forest-700 p-4 text-cream-50 md:block">
        <p className="font-display text-lg">Admin</p>
        <p className="mt-1 truncate text-xs text-cream-200">{user.email}</p>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          <Link className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/admin">
            Dashboard
          </Link>
          <Link className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/admin/entries">
            Entries
          </Link>
          <Link className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/admin/import">
            CSV import
          </Link>
          <Link className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/admin/contributions">
            Contributions
          </Link>
          <Link className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/admin/audit">
            Audit log
          </Link>
          <Link className="mt-6 rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/">
            ← Public site
          </Link>
        </nav>
      </aside>
      <div className="md:pl-56">
        <header className="flex items-center justify-between border-b border-terracotta-500/20 bg-cream-50 px-4 py-3 md:hidden">
          <span className="font-display">Admin</span>
          <Link href="/admin/entries">Entries</Link>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
