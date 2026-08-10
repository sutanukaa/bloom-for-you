import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { Flower } from "@/lib/seed";
import { plantWidth } from "@/components/Plant";
import { BackLink } from "@/components/BackLink";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";

function fmt(date: string): string {
  const d = new Date(date);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
}

// The public garden: every flower whose people chose to let it live here.
// Names on hover only — the notes stay private forever.
export default async function GardenPage() {
  const { data } = await supabaseAdmin
    .from("seeds")
    .select("id, from_name, to_name, flower, blooms_at")
    .eq("public", true)
    .order("blooms_at", { ascending: false })
    .limit(300);

  const flowers = data ?? [];

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-14 text-center">
      <BackLink />
      <h1 className="rise hand text-ink text-4xl sm:text-6xl" style={{ textShadow: "0 1px 10px rgba(246,239,223,0.7)" }}>
        the garden
      </h1>
      <p className="rise rise-1 text-ink-soft text-lg mt-3 max-w-md" style={{ textShadow: "0 1px 8px rgba(246,239,223,0.6)" }}>
        every flower here was grown for someone and left to bloom forever.
        {flowers.length > 0 ? ` ${flowers.length} so far — say hello to them.` : ""}
      </p>

      {flowers.length === 0 ? (
        <p className="rise rise-2 hand text-2xl text-ink-soft mt-16">no flowers have moved in yet — yours could be the first ♡</p>
      ) : (
        // a planted meadow: bottom-anchored flowers with deterministic jitter
        // (height, lean, spacing from the index) so it reads as a scene, not a grid
        <div className="rise rise-2 flex flex-wrap items-end justify-center gap-x-2 gap-y-8 mt-14 max-w-5xl">
          {flowers.map((f, i) => (
            <div
              key={f.id}
              className="group relative"
              style={{ marginLeft: `${(i % 3) * 10}px`, marginRight: `${((i + 1) % 4) * 8}px` }}
            >
              {/* hover card */}
              <div
                className="paper-card pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap
                           bg-[#fffdf8]/95 border border-ink/10 rounded-xl px-4 py-2 shadow-[2px_4px_14px_rgba(46,59,46,0.16)]
                           opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              >
                <p className="hand text-lg text-ink leading-tight">
                  to {f.to_name.trim() || "someone"} from {f.from_name.trim() || "someone"},
                </p>
                <p className="text-ink-soft text-sm">bloomed on {fmt(f.blooms_at)}</p>
              </div>

              {/* lean lives on a wrapper — the sway animation owns the img's
                  transform and would cancel an inline rotate there */}
              <div
                className="origin-bottom transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                style={{ transform: `rotate(${((i % 5) - 2) * 1.5}deg)` }}
              >
                <img
                  src={`/${f.flower}.png`}
                  alt=""
                  className="windy w-auto"
                  style={{
                    height: `${105 + (i % 4) * 20 + (i % 7) * 4}px`,
                    maxWidth: plantWidth("bloom", f.flower as Flower, 74),
                    animationDelay: `${(i % 7) * 0.6}s`,
                    animationDuration: `${4 + (i % 5) * 0.5}s`,
                  }}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/plant"
        className="rise rise-3 mt-16 rounded-full bg-ink text-cream px-8 py-3 text-lg shadow-[3px_4px_0_0_rgba(46,59,46,0.25)] hover:-translate-y-0.5 transition-transform"
      >
        grow one for someone you love →
      </Link>
    </main>
  );
}
