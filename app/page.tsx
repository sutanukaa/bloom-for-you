import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { BLOOM_MS } from "@/lib/seed";
import { HeroPlant } from "@/components/HeroPlant";

export const dynamic = "force-dynamic";

// seeds planted in the last 3 days are still growing right now
async function growingCount(): Promise<number | null> {
  try {
    const since = new Date(Date.now() - BLOOM_MS).toISOString();
    const { count } = await supabaseAdmin.from("seeds").select("id", { count: "exact", head: true }).gte("created_at", since);
    return count;
  } catch {
    return null;
  }
}

export default async function Cover() {
  const count = await growingCount();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="rise text-ink-soft tracking-[0.4em] text-sm uppercase mb-2">🌱 welcome 🌱</p>

      <h1 className="rise rise-1 hand text-ink text-5xl sm:text-7xl leading-[0.95]">bloom for you</h1>

      <div className="rise rise-1">
        <HeroPlant />
      </div>

      <p className="rise rise-2 text-ink-soft text-xl sm:text-2xl leading-relaxed max-w-lg">
        plant a seed with a secret note inside and send it to someone.
        it takes <span className="text-ink">3 real days</span> to grow — they can visit and
        water it, but the note only opens when it blooms.
      </p>

      <p className="rise rise-2 hand text-sage-deep text-xl mt-3">good things take time ♡</p>

      <Link
        href="/plant"
        className="rise rise-3 group mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(46,59,46,0.25)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
      >
        plant a seed
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>

      {count ? (
        <p className="rise rise-3 text-ink-soft/80 text-sm mt-6">
          🌱 {count} seed{count === 1 ? " is" : "s are"} growing right now
        </p>
      ) : null}
    </main>
  );
}
