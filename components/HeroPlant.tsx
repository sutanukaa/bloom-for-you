"use client";

import { useEffect, useState } from "react";
import { Plant } from "@/components/Plant";
import { FLOWERS, type Stage } from "@/lib/seed";

const STAGES: Stage[] = ["seed", "sprout", "seedling", "bud", "bloom"];

// The whole product in one loop: a seed grows to bloom (holding the bloom a
// while), then starts over as the next flower.
export function HeroPlant() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const stage = STAGES[i % STAGES.length];
    const t = setTimeout(() => setI((n) => n + 1), stage === "bloom" ? 3500 : 1400);
    return () => clearTimeout(t);
  }, [i]);

  const stage = STAGES[i % STAGES.length];
  const flower = FLOWERS[Math.floor(i / STAGES.length) % FLOWERS.length];

  return (
    <div key={`${stage}-${flower}`} className="rise pointer-events-none select-none scale-90 -my-4" style={{ animationDuration: "0.5s" }} aria-hidden>
      <Plant stage={stage} flower={flower} />
    </div>
  );
}
