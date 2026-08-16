import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import { updateSource } from "@/lib/data/store";

const patchSchema = z.object({
  verified: z.boolean().optional(),
  name: z.string().trim().min(1).max(200).optional(),
  author: z.string().trim().max(120).optional(),
  page: z.string().trim().max(40).optional(),
  url: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(500).optional(),
  csrf: z.string().min(8),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAdminUser();
  if (!user || !can(user.role, "edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  try {
    assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  const d = parsed.data;
  const patch = {
    verified: d.verified,
    name: d.name,
    author: d.author,
    page: d.page,
    url: d.url,
    notes: d.notes,
  };
  try {
    await updateSource(params.id, patch, user.email);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
