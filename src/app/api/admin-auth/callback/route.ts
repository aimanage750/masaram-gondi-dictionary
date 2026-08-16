import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, fetchGoogleUserInfo } from "@/lib/admin-auth/google";
import { googleOAuthConfigured } from "@/lib/admin-auth/env";
import { resolveAdminRole } from "@/lib/admin-auth/roles";
import {
  adminSessionCookie,
  oauthStateCookie,
  verifyOauthState,
} from "@/lib/admin-auth/session";
import { clientIp, rateLimit, safeEqual } from "@/lib/security";

/** Step 2: Google redirects back here. Verify identity server-side, then
 * check the allowlist — Google login alone NEVER grants admin access. */
export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`admin-cb:${ip}`, 10, 15 * 60_000);
  if (!rl.ok) return NextResponse.redirect(new URL("/admin/login?error=rate", req.url));

  if (!googleOAuthConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = verifyOauthState(req.cookies.get("mgd_oauth_state")?.value);
  if (!code || !state || !expected || !safeEqual(state, expected)) {
    return NextResponse.redirect(new URL("/admin/login?error=state", req.url));
  }

  const redirectUri = new URL("/api/admin-auth/callback", req.url).toString();
  const accessToken = await exchangeCode(code, redirectUri);
  if (!accessToken) {
    return NextResponse.redirect(new URL("/admin/login?error=exchange", req.url));
  }
  const info = await fetchGoogleUserInfo(accessToken);
  if (!info || info.email_verified === false) {
    return NextResponse.redirect(new URL("/admin/login?error=identity", req.url));
  }

  const role = resolveAdminRole(info.email);
  if (!role) {
    // Authenticated Google account but NOT on the admin allowlist.
    return NextResponse.redirect(new URL("/admin/access-denied", req.url));
  }

  const res = NextResponse.redirect(new URL("/admin", req.url));
  const session = adminSessionCookie({
    email: info.email.toLowerCase(),
    name: info.name,
    picture: info.picture,
    role,
  });
  res.cookies.set(session.name, session.value, session.options);
  const clearState = oauthStateCookie("");
  res.cookies.set(clearState.name, "", { ...clearState.options, maxAge: 0 });
  return res;
}
