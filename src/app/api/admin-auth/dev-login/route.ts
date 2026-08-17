import { NextRequest, NextResponse } from "next/server";
import { devLoginEnabled } from "@/lib/admin-auth/env";
import { resolveAdminRole } from "@/lib/admin-auth/roles";
import { adminSessionCookie } from "@/lib/admin-auth/session";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit } from "@/lib/security";

/** DEVELOPMENT-ONLY sign-in (E2E testing without Google credentials).
 * Disabled unless NODE_ENV !== "production" AND ADMIN_DEV_LOGIN=1, and the
 * email must still pass the server-side allowlist. Never active in prod. */
export async function POST(req: NextRequest) {
  if (!devLoginEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const ip = clientIp(req.headers);
  const rl = rateLimit(`admin-dev:${ip}`, 10, 15 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  try {
    await assertCsrf(typeof body.csrf === "string" ? body.csrf : undefined);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const role = resolveAdminRole(email);
  if (!email || !role) {
    return NextResponse.json({ error: "Email not authorized" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  const session = adminSessionCookie({ email: email.toLowerCase(), role, name: "Dev Admin" });
  res.cookies.set(session.name, session.value, session.options);
  return res;
}
