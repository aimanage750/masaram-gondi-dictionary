import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { AUDIO_MIME, sanitizeFilename } from "@/lib/validation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/service";
import { promises as fs } from "fs";
import path from "path";

const MAX = Number(process.env.MAX_AUDIO_BYTES || 5_242_880);

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  try {
    await assertCsrf(String(form.get("csrf") ?? ""));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  const file = form.get("file");
  const entryId = String(form.get("entry_id") ?? "").replace(/[^a-z0-9_-]/gi, "");
  if (!(file instanceof File) || !entryId) {
    return NextResponse.json({ error: "file and entry_id required" }, { status: 400 });
  }
  if (file.size > MAX) return NextResponse.json({ error: "Audio too large" }, { status: 413 });
  if (!AUDIO_MIME.has(file.type)) {
    return NextResponse.json({ error: "Unsupported audio type" }, { status: 400 });
  }
  const safe = sanitizeFilename(file.name);
  const dest = `${entryId}/${Date.now()}-${safe}`;
  const buf = Buffer.from(await file.arrayBuffer());

  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.storage.from("audio").upload(dest, buf, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data } = await sb.storage.from("audio").createSignedUrl(dest, 60 * 60);
    return NextResponse.json({ path: dest, url: data?.signedUrl ?? null });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "audio", entryId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, path.basename(dest)), buf);
  return NextResponse.json({ path: dest, url: `/uploads/audio/${dest}` });
}
