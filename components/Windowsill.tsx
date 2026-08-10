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
  bloomedOthers = 0,
}: {
  id: string;
  plantedAt: string;
  bloomsAt: string;
  flower: Flower;
  from: string;
  to: string;
  waterings: number;
  note: string | null;
  bloomedOthers?: number;
}) {
  const [stage, setStage] = useState<Stage>(() => stageAt(plantedAt, bloomsAt));
  const [left, setLeft] = useState(() => timeLeft(bloomsAt));
  const [waterings, setWaterings] = useState(initialWaterings);
  const [watering, setWatering] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  // a beat after the note unfolds, the garden welcomes the new flower
  useEffect(() => {
    if (!noteOpen) return;
    const t = setTimeout(() => setJoined(true), 2200);
    return () => clearTimeout(t);
  }, [noteOpen]);

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

      {/* the plant lives right in the garden, with grass and wildflowers for company
          (fixed height, bottom-anchored so nothing jumps between stages) */}
      {/* eslint-disable @next/next/no-img-element */}
      <div className="relative mt-4 flex items-end justify-center h-80 sm:h-[26rem] w-72 sm:w-96">
        {/* falling droplets while watering */}
        {watering && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="drip absolute text-lg"
                style={{ left: `${(i - 1) * 16}px`, animationDelay: `${i * 0.15}s`, color: "#6d9ec1" }}
              >
                💧
              </span>
            ))}
          </div>
        )}

        {/* garden companions */}
        <img src="/flower2.png" alt="" className="windy absolute bottom-0 left-2 h-24 sm:h-32 w-auto pointer-events-none" style={{ animationDelay: "0.6s" }} />
        <img src="/grass.png" alt="" className="windy absolute bottom-0 left-14 h-12 sm:h-14 w-auto pointer-events-none" style={{ animationDelay: "1.2s" }} />
        <img src="/flower5.png" alt="" className="windy absolute bottom-0 right-2 h-28 sm:h-36 w-auto pointer-events-none" style={{ animationDelay: "0.2s" }} />
        <img src="/grass.png" alt="" className="windy absolute bottom-0 right-16 h-11 sm:h-13 w-auto pointer-events-none" style={{ animationDelay: "1.8s" }} />

        {/* a butterfly keeps the bloomed flower company */}
        {stage === "bloom" && (
          <div className="bob absolute top-6 right-16 sm:right-24 pointer-events-none">
            <img src="/butterfly1.png" alt="" className="flap-img w-9 sm:w-11" />
          </div>
        )}

        <div className={wiggle ? "wiggle" : ""}>
          <Plant stage={stage} flower={flower} potPx={130} />
        </div>
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
        <div className="unfold relative mt-6 bg-[#fffdf8] border border-ink/10 rounded-sm px-8 py-6 shadow-[3px_6px_14px_rgba(74,64,56,0.18)] max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dandelion.png" alt="" className="absolute -top-3 -right-3 w-8 pointer-events-none" />
          <p className="hand text-2xl text-[#2e3b2e] whitespace-pre-wrap text-left leading-snug">{note}</p>
          {from.trim() ? <p className="hand text-xl text-[#64735f] text-right mt-4">— {from}</p> : null}
        </div>
      )}

      {/* …and then the garden takes the flower in */}
      {joined && (
        <div className="rise mt-8 flex flex-col items-center">
          <div className="flex items-end gap-1">
            {["/flower1.png", "/flower3.png", "/flower5.png", "/flower2.png", "/flower4.png"].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="rise windy w-auto pointer-events-none"
                style={{ height: `${34 + (i % 3) * 10}px`, animationDelay: `${0.15 + i * 0.18}s, ${i * 0.7}s` }}
              />
            ))}
          </div>
          <p className="hand text-2xl text-ink mt-3">
            {bloomedOthers > 0 ? (
              <>your flower has joined the garden, blooming alongside {bloomedOthers} other{bloomedOthers === 1 ? "" : "s"} ♡</>
            ) : (
              <>your flower is the very first bloom in the garden ♡</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
