import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security-headers";

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }

  const { pathname } = req.nextUrl;
  if (!pathname.startsWith(ADMIN_PREFIX)) return res;

  // Server-side session check — never rely on client redirects alone.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && anon) {
    const access =
      req.cookies.get("sb-access-token")?.value ||
      req.cookies.getAll().find((c) => c.name.endsWith("-auth-token"))?.value;
    if (!access) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  const local = req.cookies.get("mgd_session")?.value;
  if (!local) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/|icons/|sw.js|manifest.json).*)"],
};
