import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomToken } from "@/lib/security";

export async function GET() {
  const token = randomToken(16);
  cookies().set("mgd_csrf", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  return NextResponse.json({ token });
}
