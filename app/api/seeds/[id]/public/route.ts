import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Opt the flower into the public garden (names + flower only — the note
// stays private forever). Only a bloomed flower can join.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabaseAdmin
    .from("seeds")
    .update({ public: true })
    .eq("id", id)
    .lte("blooms_at", new Date().toISOString());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
