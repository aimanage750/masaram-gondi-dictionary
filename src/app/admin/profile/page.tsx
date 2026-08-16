import { LogOut } from "lucide-react";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Profile" };

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin — full access",
  editor: "Editor — dictionary editing",
  reviewer: "Reviewer — contribution/report review",
};

export default function AdminProfilePage() {
  const user = getAdminUser();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Profile</h1>
      <div className="mt-6 rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.picture} alt="" className="mx-auto h-20 w-20 rounded-full object-cover shadow-card" />
        ) : (
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-terracotta-500 text-2xl font-bold text-cream-50">
            {(user.name ?? user.email).slice(0, 1).toUpperCase()}
          </span>
        )}
        <p className="mt-4 font-english text-lg font-bold text-ink-800">{user.name ?? "Admin"}</p>
        <p className="mt-1 text-sm text-ink-700/70">{user.email}</p>
        <p className="mt-2 inline-block rounded-full bg-forest-600/10 px-3.5 py-1 text-xs font-semibold text-forest-600">
          {ROLE_LABEL[user.role] ?? user.role}
        </p>
        {user.legacy && (
          <p className="mt-2 text-xs text-ink-700/60">Legacy local session — Google OAuth recommended.</p>
        )}
        <form action="/api/admin-auth/logout" method="post" className="mt-6">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600"
          >
            <LogOut size={15} aria-hidden /> Logout
          </button>
        </form>
      </div>
    </div>
  );
}
