import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import { addSource, listSources } from "@/lib/data/store";
import type { SourceItem } from "@/lib/types";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    return NextResponse.json({ sources: await listSources() });
  } catch {
    return NextResponse.json({ sources: [] });
  }
}

const createSchema = z.object({
  type: z.enum(["book", "pdf", "author", "website", "academic", "community", "other"]),
  name: z.string().trim().min(1).max(200),
  author: z.string().trim().max(120).optional(),
  page: z.string().trim().max(40).optional(),
  url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https:\/\/[\w.-]+(:\d+)?(\/\S*)?$/i.test(v), "https only")
    .optional(),
  notes: z.string().trim().max(500).optional(),
  csrf: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user || !can(user.role, "edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid source" }, { status: 400 });
  }
  try {
    await assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  const now = new Date().toISOString();
  const item: SourceItem = {
    id: `src_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    type: parsed.data.type,
    name: parsed.data.name,
    author: parsed.data.author || null,
    page: parsed.data.page || null,
    url: parsed.data.url || null,
    notes: parsed.data.notes || null,
    verified: false,
    created_at: now,
    updated_at: now,
  };
  try {
    await addSource(item, user.email);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: item.id });
}
