import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { entrySchema, rejectDangerous } from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { deleteEntry, getEntry, upsertEntry } from "@/lib/data/store";
import { enrichRaw } from "@/lib/mapping/enrich";
import { CATEGORY_META } from "@/data/raw-entries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const existing = await getEntry(params.id, true);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    assertCsrf(body.csrf);
    rejectDangerous(parsed.data.gondi_pronunciation, "Gondi");
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  const cat = CATEGORY_META.find((c) => c.slug === (parsed.data.category || existing.category));
  const entry = enrichRaw(
    {
      gondi_pronunciation: parsed.data.gondi_pronunciation,
      hindi: parsed.data.hindi,
      english: parsed.data.english,
      category: cat?.slug ?? existing.category,
      category_hi: cat?.name_hi ?? existing.category_hi,
      source_page: existing.source_page ?? "admin",
      notes: parsed.data.notes,
    },
    {
      ...existing,
      id: existing.id,
      status: parsed.data.status ?? existing.status,
      verified: parsed.data.verified ?? existing.verified,
    }
  );
  await upsertEntry(entry, user.email);
  return NextResponse.json({ id: entry.id });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  try {
    assertCsrf(body.csrf);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  await deleteEntry(params.id, user.email);
  return NextResponse.json({ ok: true });
}
