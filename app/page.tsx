import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { HeroPlant } from "@/components/HeroPlant";

export const dynamic = "force-dynamic";

// seeds that haven't reached their bloom time yet are still growing
async function growingCount(): Promise<number | null> {
  try {
    const { count } = await supabaseAdmin.from("seeds").select("id", { count: "exact", head: true }).gte("blooms_at", new Date().toISOString());
    return count;
  } catch {
    return null;
  }
}

export default async function Cover() {
  const count = await growingCount();

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-16 lg:gap-24 max-w-5xl w-full justify-center">
        {/* the plant, growing on its own side */}
        <div className="rise rise-1 shrink-0 order-1 md:order-none">
          <HeroPlant />
        </div>

        {/* words + the invitation */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
          <p className="rise text-ink-soft tracking-[0.4em] text-sm uppercase mb-2">🌱 welcome 🌱</p>

          <h1 className="rise rise-1 hand text-ink text-5xl sm:text-7xl leading-[0.95]">bloom for you</h1>

          <p className="rise rise-2 text-ink-soft text-xl sm:text-2xl leading-relaxed mt-5">
            plant a seed with a secret note inside and send it to someone.
            it grows in <span className="text-ink">real time</span> — as slow as you choose —
            and they can visit and water it, but the note only opens when it blooms.
          </p>

          <p className="rise rise-2 hand text-sage-deep text-xl mt-3">good things take time ♡</p>

          <Link
            href="/plant"
            className="rise rise-3 group mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(46,59,46,0.25)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
          >
            plant a seed
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <div className="rise rise-3 glass-pill flex flex-col items-center md:items-start gap-1 mt-6 backdrop-blur-sm border border-ink/10 rounded-2xl px-5 py-3 shadow-[2px_4px_14px_rgba(46,59,46,0.12)]">
            {count ? (
              <p className="text-ink-soft text-sm">
                🌱 {count} seed{count === 1 ? " is" : "s are"} growing right now
              </p>
            ) : null}
            <Link href="/garden" className="hand text-lg text-ink-soft hover:text-ink underline decoration-wavy">
              wander the garden →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
