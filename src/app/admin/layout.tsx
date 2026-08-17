import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  robots: { index: false, follow: false },
};

/** Phase 9 guarded admin shell. Unauthenticated users are redirected to the
 * admin login by the middleware AND here (defense in depth). The Google
 * session is verified server-side on every request via signed cookie. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return <AdminShell user={user}>{children}</AdminShell>;
}
