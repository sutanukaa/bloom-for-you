import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { stageAt, type Flower } from "@/lib/seed";
import { Windowsill } from "@/components/Windowsill";

export default async function SeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("seeds")
    .select("created_at, blooms_at, from_name, to_name, note, flower, waterings")
    .eq("id", id)
    .single();
  if (!data) notFound();

  const bloomed = stageAt(data.created_at, data.blooms_at) === "bloom";

  // how many other seeds have bloomed into the garden (only needed once ours has)
  let bloomedOthers = 0;
  if (bloomed) {
    const { count } = await supabaseAdmin
      .from("seeds")
      .select("id", { count: "exact", head: true })
      .lte("blooms_at", new Date().toISOString());
    bloomedOthers = Math.max((count ?? 1) - 1, 0);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <Windowsill
        id={id}
        plantedAt={data.created_at}
        bloomsAt={data.blooms_at}
        flower={data.flower as Flower}
        from={data.from_name}
        to={data.to_name}
        waterings={data.waterings}
        // the note stays on the server until the plant has actually bloomed
        note={bloomed ? data.note : null}
        bloomedOthers={bloomedOthers}
      />
      <Link href="/" className="hand text-xl text-ink-soft hover:text-ink underline decoration-wavy mt-10">
        plant a seed for someone ♡
      </Link>
    </main>
  );
}
