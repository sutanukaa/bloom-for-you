import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { FLOWERS, MIN_BLOOM_MS, DEFAULT_BLOOM_MS, type Flower } from "@/lib/seed";

// Plant a seed. Body: { from, to, note, flower, bloomMs }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const from = String(body?.from || "").trim().slice(0, 60);
  const to = String(body?.to || "").trim().slice(0, 60);
  const note = String(body?.note || "").trim().slice(0, 2000);
  const flower: Flower = FLOWERS.includes(body?.flower) ? body.flower : "sunflower";
  const bloomMs = Number.isFinite(body?.bloomMs) ? Number(body.bloomMs) : DEFAULT_BLOOM_MS;

  if (!note) return NextResponse.json({ error: "the seed needs a note inside" }, { status: 400 });
  if (bloomMs < MIN_BLOOM_MS) return NextResponse.json({ error: "give it at least 5 minutes to grow" }, { status: 400 });

  const id = randomUUID();
  const blooms_at = new Date(Date.now() + bloomMs).toISOString();
  const { error } = await supabaseAdmin.from("seeds").insert({ id, from_name: from, to_name: to, note, flower, blooms_at });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id });
}
