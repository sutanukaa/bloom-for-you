import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { stageAt, type Flower } from "@/lib/seed";
import { Windowsill } from "@/components/Windowsill";

export default async function SeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("seeds")
    .select("created_at, blooms_at, from_name, to_name, note, flower, waterings, public, media, song")
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
        // the note (and anything tucked in with it) stays on the server until bloom
        note={bloomed ? data.note : null}
        media={bloomed ? data.media : null}
        song={bloomed ? data.song : null}
        bloomedOthers={bloomedOthers}
        isPublic={data.public}
      />
      <Link
        href="/"
        className="glass-pill hand text-xl text-ink-soft hover:text-ink underline decoration-wavy mt-10 backdrop-blur-sm border border-ink/10 rounded-full px-6 py-2 shadow-[2px_4px_14px_rgba(46,59,46,0.12)]"
      >
        plant a seed for someone ♡
      </Link>
    </main>
  );
}
