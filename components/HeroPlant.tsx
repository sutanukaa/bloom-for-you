"use client";

import { useEffect, useState } from "react";
import { FLOWERS, type Stage } from "@/lib/seed";
import { plantSrc } from "@/components/Plant";

// Flipbook: the painted stages crossfade into each other, bottom-anchored so
// the pot never moves — reads as one plant growing. Bloom holds a while,
// then it fades back to soil as the next flower.
const STAGES: { stage: Stage; hold: number }[] = [
  { stage: "seed", hold: 1300 },
  { stage: "sprout", hold: 1300 },
  { stage: "seedling", hold: 1300 },
  { stage: "bud", hold: 1500 },
  { stage: "bloom", hold: 3800 },
];

export function HeroPlant() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((n) => n + 1), STAGES[i % STAGES.length].hold);
    return () => clearTimeout(t);
  }, [i]);

  const step = i % STAGES.length;
  const flower = FLOWERS[Math.floor(i / STAGES.length) % FLOWERS.length];

  return (
    <div className="pointer-events-none select-none sway" aria-hidden>
      {/* every frame stays mounted (so they're preloaded), stacked bottom-center;
          only the current one is visible, easing in with a little upward swell */}
      <div className="relative w-44 sm:w-52 h-72 sm:h-80">
        {STAGES.map(({ stage }, s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={stage}
            src={plantSrc(stage, flower)}
            alt=""
            draggable={false}
            className="absolute bottom-0 left-1/2 w-full max-h-full object-contain object-bottom transition-all duration-700 ease-out"
            style={{
              transform: `translateX(-50%) scale(${s === step ? 1 : 0.96})`,
              transformOrigin: "50% 100%",
              opacity: s === step ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
