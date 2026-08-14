import { createHash, randomBytes, timingSafeEqual } from "crypto";

const SECRET = () =>
  process.env.ADMIN_SESSION_SECRET || "dev-only-change-me-not-for-production";

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function signValue(value: string, ttlMs = 1000 * 60 * 60 * 12): string {
  const exp = Date.now() + ttlMs;
  const payload = `${value}.${exp}`;
  const sig = sha256(`${SECRET()}:${payload}`);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySigned(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split(".");
    if (parts.length < 3) return null;
    const sig = parts.pop()!;
    const exp = parts.pop()!;
    const value = parts.join(".");
    const payload = `${value}.${exp}`;
    const expected = sha256(`${SECRET()}:${payload}`);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    if (Date.now() > Number(exp)) return null;
    return value;
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

const buckets = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): {
  ok: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now > cur.reset) {
    const reset = now + windowMs;
    buckets.set(key, { n: 1, reset });
    return { ok: true, remaining: limit - 1, reset };
  }
  cur.n += 1;
  return { ok: cur.n <= limit, remaining: Math.max(0, limit - cur.n), reset: cur.reset };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "local"
  );
}

export { SECURITY_HEADERS } from "@/lib/security-headers";
