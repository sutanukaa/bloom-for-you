import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { stageAt, type Flower } from "@/lib/seed";
import { Windowsill } from "@/components/Windowsill";

export default async function SeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("seeds")
    .select("created_at, from_name, to_name, note, flower, waterings")
    .eq("id", id)
    .single();
  if (!data) notFound();

  const bloomed = stageAt(data.created_at) === "bloom";

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <Windowsill
        id={id}
        plantedAt={data.created_at}
        flower={data.flower as Flower}
        from={data.from_name}
        to={data.to_name}
        waterings={data.waterings}
        // the note stays on the server until the plant has actually bloomed
        note={bloomed ? data.note : null}
      />
      <Link href="/" className="hand text-2xl text-ink-soft hover:text-ink underline decoration-wavy mt-10">
        plant a seed for someone ♡
      </Link>
    </main>
  );
}
