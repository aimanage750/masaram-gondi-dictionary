import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import { auditEvent, getEntry, upsertEntry } from "@/lib/data/store";

/** Partial admin update: status / verified / notes only.
 * Full content edits go through PUT /api/entries/[id]. */
const patchSchema = z.object({
  status: z.enum(["published", "pending", "rejected", "draft", "archived"]).optional(),
  verified: z.boolean().optional(),
  notes: z.string().trim().max(500).optional(),
  csrf: z.string().min(8),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAdminUser();
  if (!user || !can(user.role, "edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  try {
    await assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const existing = await getEntry(id, true);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const action =
    parsed.data.status === "archived"
      ? "WORD_ARCHIVED"
      : parsed.data.status === "published"
        ? "WORD_PUBLISHED"
        : parsed.data.verified === true
          ? "WORD_VERIFIED"
          : "WORD_UPDATED";

  const next = {
    ...existing,
    status: parsed.data.status ?? existing.status,
    verified: parsed.data.verified ?? existing.verified,
    notes: parsed.data.notes !== undefined ? parsed.data.notes || null : existing.notes,
    updated_at: new Date().toISOString(),
  };
  try {
    await upsertEntry(next, user.email);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  await auditEvent(
    user.email,
    action,
    "entry",
    existing.id,
    `${existing.gondi_pronunciation} (${existing.status}→${next.status}, verified=${next.verified})`
  );
  return NextResponse.json({ ok: true });
}
