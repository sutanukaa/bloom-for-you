"use client";

import { useEffect, useState } from "react";
import { FLOWERS, type Stage } from "@/lib/seed";
import { plantSrc, plantWidth } from "@/components/Plant";

// Flipbook: the painted stages crossfade into each other, bottom-anchored so
// the pot never moves — reads as one plant growing. Bloom holds a while,
// then it fades back to soil as the next flower.
const STAGES: { stage: Stage; hold: number }[] = [
  { stage: "seed", hold: 1900 }, // long enough for the outgoing bloom's slow dissolve

  { stage: "sprout", hold: 1300 },
  { stage: "seedling", hold: 1300 },
  { stage: "bud", hold: 1500 },
  { stage: "bloom", hold: 3800 },
];

export function HeroPlant() {
  const [i, setI] = useState(0);
  const [flowerIdx, setFlowerIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((n) => n + 1), STAGES[i % STAGES.length].hold);
    // swap the flower only AFTER the bloom frame has fully faded out (the
    // crossfade is 700ms) — swapping at the wrap flashed the next flower
    // on the still-visible outgoing bloom
    const wrapped = i > 0 && i % STAGES.length === 0;
    const f = wrapped ? setTimeout(() => setFlowerIdx((n) => n + 1), 1600) : undefined;
    return () => {
      clearTimeout(t);
      if (f) clearTimeout(f);
    };
  }, [i]);

  const step = i % STAGES.length;
  const flower = FLOWERS[flowerIdx % FLOWERS.length];

  return (
    <div className="pointer-events-none select-none sway" aria-hidden>
      {/* every frame stays mounted (so they're preloaded), stacked bottom-center
          and sized so the POT is identical in all of them (no max-h clamping —
          that shrank the tall bloom frames and made the soil frames look huge);
          only the current one is visible, easing in with a little upward swell */}
      {/* tall enough for the widest bloom (the sunflower renders ~363px high
          at pot width 118 — h-80 clipped it into the content below on mobile) */}
      <div className="relative w-44 h-[23rem] sm:h-96">
        {STAGES.map(({ stage }, s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={stage}
            src={plantSrc(stage, flower)}
            alt=""
            draggable={false}
            className="absolute bottom-0 left-1/2 h-auto transition-all ease-out"
            style={{
              width: plantWidth(stage, flower, 118),
              transform: `translateX(-50%) scale(${s === step ? 1 : 0.96})`,
              transformOrigin: "50% 100%",
              opacity: s === step ? 1 : 0,
              // frames fade IN briskly but linger on the way OUT — the slow
              // dissolve softens the bloom→soil reset most of all
              transitionDuration: s === step ? "700ms" : "1500ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}
