import { NextRequest, NextResponse } from "next/server";
import { googleAuthUrl } from "@/lib/admin-auth/google";
import { googleOAuthConfigured } from "@/lib/admin-auth/env";
import { oauthStateCookie, oauthStateToken } from "@/lib/admin-auth/session";

/** Step 1: start the Google OAuth authorization-code flow. */
export async function GET(req: NextRequest) {
  if (!googleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/login?error=not_configured", req.url)
    );
  }
  const state = oauthStateToken();
  const redirectUri = new URL("/api/admin-auth/callback", req.url).toString();
  const res = NextResponse.redirect(googleAuthUrl(redirectUri, state));
  const cookie = oauthStateCookie(state);
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
