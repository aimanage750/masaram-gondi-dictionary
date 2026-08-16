import { cookies } from "next/headers";
import type { AdminUser, SessionUser } from "@/lib/types";
import { signValue, verifySigned } from "@/lib/security";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminSession } from "@/lib/admin-auth/session";

const COOKIE = "mgd_session";

export async function getSessionUser(): Promise<SessionUser | null> {
  // Phase 9: new Google-OAuth admin session is honored everywhere the old
  // admin session was — existing admin APIs keep working unchanged.
  const admin = getAdminSession();
  if (admin) {
    return { id: `admin:${admin.email}`, email: admin.email, role: "admin", name: admin.name };
  }

  if (isSupabaseConfigured()) {
    const sb = createServerSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getUser();
    if (!data.user?.email) return null;
    const { data: profile } = await sb
      .from("profiles")
      .select("role, display_name")
      .eq("id", data.user.id)
      .maybeSingle();
    return {
      id: data.user.id,
      email: data.user.email,
      role: (profile?.role as SessionUser["role"]) ?? "contributor",
      name: profile?.display_name ?? undefined,
    };
  }

  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const email = verifySigned(token);
  if (!email) return null;
  return { id: "local-admin", email, role: "admin", name: "Local Admin" };
}

export function localSessionCookie(email: string) {
  return {
    name: COOKIE,
    value: signValue(email, 1000 * 60 * 60 * 12),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  };
}

export const SESSION_COOKIE = COOKIE;

/** Full admin profile for the Phase 9 panel: Google session first, then the
 * legacy local session (mapped to super_admin for backwards compatibility). */
export function getAdminUser(): AdminUser | null {
  const google = getAdminSession();
  if (google) return google;
  const token = cookies().get(COOKIE)?.value;
  const email = token ? verifySigned(token) : null;
  if (!email) return null;
  return { email, role: "super_admin", legacy: true };
}
