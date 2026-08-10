import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Water the plant. Ritual only — growth is time-based; this just counts the love.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin.rpc("water_seed", { seed_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ waterings: data });
}
