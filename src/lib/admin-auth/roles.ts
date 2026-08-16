import type { AdminRole } from "@/lib/types";
import {
  ADMIN_EMAILS_VAR,
  EDITOR_EMAILS_VAR,
  REVIEWER_EMAILS_VAR,
  emailList,
} from "./env";

/** Server-side allowlist resolution. A successful Google login NEVER grants
 * admin access by itself — the authenticated email must appear here. */
export function resolveAdminRole(email: string): AdminRole | null {
  const e = email.trim().toLowerCase();
  if (emailList(ADMIN_EMAILS_VAR).includes(e)) return "super_admin";
  if (emailList(EDITOR_EMAILS_VAR).includes(e)) return "editor";
  if (emailList(REVIEWER_EMAILS_VAR).includes(e)) return "reviewer";
  return null;
}

const RANK: Record<AdminRole, number> = { reviewer: 1, editor: 2, super_admin: 3 };

/** Role gate: dictionary writes need editor+, publishing/CSV/archive need
 * super_admin when strict, review actions need reviewer+. */
export function can(role: AdminRole, action: "review" | "edit" | "publish") {
  if (action === "review") return RANK[role] >= 1;
  if (action === "edit") return RANK[role] >= 2;
  return RANK[role] >= 3;
}
