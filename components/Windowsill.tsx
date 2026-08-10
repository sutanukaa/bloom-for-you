"use client";

import { useEffect, useState } from "react";
import { Plant } from "@/components/Plant";
import { stageAt, timeLeft, type Flower, type Stage } from "@/lib/seed";

const STAGE_LINES: Record<Stage, string> = {
  seed: "the seed is tucked in, fast asleep.",
  sprout: "oh! two little leaves.",
  seedling: "growing up so fast.",
  bud: "so close now — it's holding its breath.",
  bloom: "it bloomed!",
};

export function Windowsill({
  id,
  plantedAt,
  bloomsAt,
  flower,
  from,
  to,
  waterings: initialWaterings,
  note,
}: {
  id: string;
  plantedAt: string;
  bloomsAt: string;
  flower: Flower;
  from: string;
  to: string;
  waterings: number;
  note: string | null;
}) {
  const [stage, setStage] = useState<Stage>(() => stageAt(plantedAt, bloomsAt));
  const [left, setLeft] = useState(() => timeLeft(bloomsAt));
  const [waterings, setWaterings] = useState(initialWaterings);
  const [watering, setWatering] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  // tick the countdown; if the bloom moment passes while they're watching,
  // reload so the server hands over the note
  useEffect(() => {
    const t = setInterval(() => {
      const s = stageAt(plantedAt, bloomsAt);
      setLeft(timeLeft(bloomsAt));
      if (s === "bloom" && stage !== "bloom" && note === null) window.location.reload();
      setStage(s);
    }, 15_000);
    return () => clearInterval(t);
  }, [plantedAt, bloomsAt, stage, note]);

  async function water() {
    if (watering) return;
    setWatering(true);
    fetch(`/api/seeds/${id}/water`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => typeof d.waterings === "number" && setWaterings(d.waterings))
      .catch(() => {});
    // droplets fall, then the plant does a happy wiggle
    setTimeout(() => {
      setWatering(false);
      setWiggle(true);
      setTimeout(() => setWiggle(false), 1100);
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center text-center max-w-md">
      <p className="hand text-2xl text-ink-soft">
        {from.trim() ? `${from} planted this` : "someone planted this"}
        {to.trim() ? ` for ${to}` : " for you"} ♡
      </p>

      {/* the windowsill: sky through the window, plant on the ledge */}
      <div className="relative mt-6 rounded-t-[80px] rounded-b-xl border-[10px] border-terracotta/80 bg-sky/60 px-10 pt-10 pb-0 shadow-[4px_8px_20px_rgba(74,64,56,0.18)]">
        {/* falling droplets while watering */}
        {watering && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="drip absolute text-sky-700 text-lg"
                style={{ left: `${(i - 1) * 16}px`, animationDelay: `${i * 0.15}s`, color: "#6d9ec1" }}
              >
                💧
              </span>
            ))}
          </div>
        )}
        {/* fixed-height, bottom-anchored so the window doesn't resize between stages */}
        <div className={`flex items-end justify-center h-80 sm:h-[26rem] ${wiggle ? "wiggle" : ""}`}>
          <Plant stage={stage} flower={flower} potPx={130} />
        </div>
        {/* the sill */}
        <div className="absolute -bottom-3 -left-6 -right-6 h-4 bg-terracotta/80 rounded-full shadow-[0_4px_8px_rgba(74,64,56,0.2)]" />
      </div>

      <p className="hand text-2xl text-ink mt-8">{STAGE_LINES[stage]}</p>
      {stage !== "bloom" ? (
        <p className="text-ink-soft mt-1">
          blooms in {left || "a moment"} — there&apos;s a note inside, but it opens only when the flower does.
        </p>
      ) : null}

      {stage !== "bloom" ? (
        <>
          <button
            onClick={water}
            disabled={watering}
            className="mt-6 rounded-full bg-sage text-ink px-8 py-3 text-lg border border-sage-deep shadow-[3px_4px_0_0_rgba(109,143,107,0.4)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform disabled:opacity-60 cursor-pointer"
          >
            {watering ? "watering…" : "water it 🫗"}
          </button>
          <p className="text-ink-soft/70 text-sm mt-2">
            {waterings === 0 ? "it hasn't been watered yet" : `watered ${waterings} time${waterings === 1 ? "" : "s"} with love`}
            {" "}· watering doesn&apos;t make it grow faster — it just likes the company
          </p>
        </>
      ) : !noteOpen ? (
        <button
          onClick={() => setNoteOpen(true)}
          className="mt-6 rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(74,64,56,0.25)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform cursor-pointer"
        >
          open the note ✉
        </button>
      ) : (
        <div className="unfold mt-6 bg-[#fffdf8] border border-ink/10 rounded-sm px-8 py-6 shadow-[3px_6px_14px_rgba(74,64,56,0.18)] max-w-sm">
          <p className="hand text-2xl text-ink whitespace-pre-wrap text-left leading-snug">{note}</p>
          {from.trim() ? <p className="hand text-xl text-ink-soft text-right mt-4">— {from}</p> : null}
        </div>
      )}
    </div>
  );
}
