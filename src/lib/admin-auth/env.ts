/** Phase 9 — admin auth environment configuration.
 * Secrets are read server-side ONLY — nothing here reaches the client. */

export function googleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function authSecret(): string {
  return (
    (process.env.AUTH_SECRET || process.env.ADMIN_SESSION_SECRET || "").trim() ||
    "dev-only-change-me-not-for-production"
  );
}

/** Dev-only escape hatch (E2E testing without Google credentials).
 * Requires NODE_ENV !== "production" AND ADMIN_DEV_LOGIN=1. */
export function devLoginEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_LOGIN === "1";
}

function emailList(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const ADMIN_EMAILS_VAR = "ADMIN_EMAILS";
export const EDITOR_EMAILS_VAR = "ADMIN_EDITOR_EMAILS";
export const REVIEWER_EMAILS_VAR = "ADMIN_REVIEWER_EMAILS";

export { emailList };
