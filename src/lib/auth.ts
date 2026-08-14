import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/types";
import { signValue, verifySigned } from "@/lib/security";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const COOKIE = "mgd_session";

export async function getSessionUser(): Promise<SessionUser | null> {
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
