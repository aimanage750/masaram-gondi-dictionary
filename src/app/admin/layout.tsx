import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV = [
  { href: "/admin", label: "डैशबोर्ड" },
  { href: "/admin/scan", label: "किताब स्कैन" },
  { href: "/admin/vakya", label: "वाक्यांश" },
  { href: "/admin/entries", label: "सभी शब्द" },
  { href: "/admin/entries/new", label: "एक शब्द जोड़ें" },
  { href: "/admin/import", label: "CSV" },
  { href: "/admin/contributions", label: "सुझाव" },
  { href: "/admin/audit", label: "ऑडिट" },
];

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
          {NAV.map((n) => (
            <Link key={n.href} className="rounded-lg px-2 py-1.5 hover:bg-forest-600" href={n.href}>
              {n.label}
            </Link>
          ))}
          <Link className="mt-6 rounded-lg px-2 py-1.5 hover:bg-forest-600" href="/">
            ← सार्वजनिक साइट
          </Link>
        </nav>
      </aside>
      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-terracotta-500/20 bg-cream-50 px-3 py-2 text-sm md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-full bg-cream-200 px-3 py-1">
              {n.label}
            </Link>
          ))}
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
