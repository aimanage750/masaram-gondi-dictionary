import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { AdminUser } from "@/lib/types";
import { authSecret } from "./env";

export const ADMIN_COOKIE = "mgd_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

interface SessionPayload {
  email: string;
  name?: string;
  picture?: string;
  role: AdminUser["role"];
  exp: number;
}

function sign(payload: string): string {
  return createHash("sha256").update(`${authSecret()}:${payload}`).digest("hex");
}

export function encodeSession(user: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return null;
  const body = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (sign(body) !== sig) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!parsed.email || !parsed.exp || Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function adminSessionCookie(user: Omit<SessionPayload, "exp">) {
  const payload: SessionPayload = { ...user, exp: Date.now() + SESSION_TTL_MS };
  return {
    name: ADMIN_COOKIE,
    value: encodeSession(payload),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    },
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_COOKIE,
    value: "",
    options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 },
  };
}

/** Current admin from the HttpOnly cookie (never localStorage). */
export function getAdminSession(): AdminUser | null {
  const payload = decodeSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!payload) return null;
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    role: payload.role,
  };
}

/** Short-lived signed state token for the OAuth round-trip. */
export function oauthStateToken(): string {
  const state = randomBytes(24).toString("base64url");
  const body = `${state}.${Date.now() + 5 * 60_000}`;
  return `${body}.${sign(body)}`;
}

export function verifyOauthState(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [state, exp, sig] = parts;
  if (sign(`${state}.${exp}`) !== sig) return null;
  if (Date.now() > Number(exp)) return null;
  return state;
}

export function oauthStateCookie(token: string) {
  return {
    name: "mgd_oauth_state",
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 300,
    },
  };
}
