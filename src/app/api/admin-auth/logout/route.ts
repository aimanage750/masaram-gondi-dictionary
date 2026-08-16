import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth/session";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  const cookie = clearAdminSessionCookie();
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
