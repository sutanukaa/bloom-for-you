import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { FLOWERS, MIN_BLOOM_MS, DEFAULT_BLOOM_MS, type Flower } from "@/lib/seed";

// Vercel's request body limit is ~4.5MB — stay under it
const MAX_MEDIA_BYTES = 4 * 1024 * 1024;

// Plant a seed. multipart form: from, to, note, flower, bloomMs, song (JSON), media (file)
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const from = String(form.get("from") || "").trim().slice(0, 60);
  const to = String(form.get("to") || "").trim().slice(0, 60);
  const note = String(form.get("note") || "").trim().slice(0, 2000);
  const flower: Flower = FLOWERS.includes(form.get("flower") as Flower) ? (form.get("flower") as Flower) : "sunflower";
  const bloomMsRaw = Number(form.get("bloomMs"));
  const bloomMs = Number.isFinite(bloomMsRaw) ? bloomMsRaw : DEFAULT_BLOOM_MS;

  if (!note) return NextResponse.json({ error: "the seed needs a note inside" }, { status: 400 });
  if (bloomMs < MIN_BLOOM_MS) return NextResponse.json({ error: "give it at least 5 minutes to grow" }, { status: 400 });

  let song: unknown = null;
  try {
    const s = form.get("song");
    if (s) song = JSON.parse(String(s));
  } catch {
    /* an unparseable song just gets left out */
  }

  const id = randomUUID();

  // optional image/video, tucked into storage until bloom day
  let media: { type: "image" | "video"; url: string } | null = null;
  const file = form.get("media");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_MEDIA_BYTES) {
      return NextResponse.json({ error: "that file is a bit heavy — keep it under 4MB ♡" }, { status: 400 });
    }
    const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
    if (!kind) return NextResponse.json({ error: "only images and little videos can fit in a seed" }, { status: 400 });

    // ensure the public bucket exists (no-op error if it already does)
    await supabaseAdmin.storage.createBucket("seed-media", { public: true }).catch(() => {});
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const path = `${id}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("seed-media")
      .upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
    media = { type: kind, url: supabaseAdmin.storage.from("seed-media").getPublicUrl(path).data.publicUrl };
  }

  const blooms_at = new Date(Date.now() + bloomMs).toISOString();
  const { error } = await supabaseAdmin
    .from("seeds")
    .insert({ id, from_name: from, to_name: to, note, flower, blooms_at, media, song });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id });
}
