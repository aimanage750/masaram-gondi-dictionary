import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit, safeEqual } from "@/lib/security";
import { localSessionCookie } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`login:${ip}`, 8, 15 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  try {
    assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  if (isSupabaseConfigured()) {
    const sb = createServerSupabase();
    if (!sb) return NextResponse.json({ error: "Auth unavailable" }, { status: 500 });
    const { error } = await sb.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (error) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    return NextResponse.json({ ok: true });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPass = process.env.ADMIN_PASSWORD || "";
  if (
    !adminEmail ||
    !adminPass ||
    !safeEqual(parsed.data.email, adminEmail) ||
    !safeEqual(parsed.data.password, adminPass)
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookie = localSessionCookie(parsed.data.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
