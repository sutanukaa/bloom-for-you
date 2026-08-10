"use client";

import { useState } from "react";
import { FLOWERS } from "@/lib/seed";
import { PETALS, CENTERS } from "@/components/Plant";

// Continuous growth on a single 9s timeline: the stem draws itself up out of
// the soil, leaves unfurl one by one, the flower pops open and holds, then it
// all fades and starts over as the next flower. All timing lives in the
// grow-* keyframes in globals.css.
export function HeroPlant() {
  const [i, setI] = useState(0);
  const flower = FLOWERS[i % FLOWERS.length];
  const petal = PETALS[flower];
  const center = CENTERS[flower];

  return (
    <div
      className="grow-cycle pointer-events-none select-none scale-90 -my-4"
      onAnimationIteration={(e) => {
        if (e.target === e.currentTarget) setI((n) => n + 1);
      }}
      aria-hidden
    >
      <svg viewBox="0 0 200 260" className="w-56 sm:w-64 h-auto">
        <g className="sway">
          {/* stem draws itself upward */}
          <path
            d="M100 190 C 96 150, 104 115, 100 84"
            className="grow-stem"
            pathLength={1}
            stroke="var(--sage-deep)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* leaves unfurl from the stem, lowest first */}
          <g className="grow-leaf-1">
            <path d="M100 156 q-22 -15 -30 -4 q11 13 30 4" fill="var(--sage)" stroke="var(--sage-deep)" strokeWidth="2.5" />
          </g>
          <g className="grow-leaf-2">
            <path d="M100 128 q22 -15 30 -4 q-11 13 -30 4" fill="var(--sage)" stroke="var(--sage-deep)" strokeWidth="2.5" />
          </g>
          {/* the bloom swells open at the top */}
          <g className="grow-bloom">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                cx="100"
                cy="56"
                rx="11"
                ry="24"
                fill={petal}
                stroke="var(--ink)"
                strokeOpacity="0.15"
                transform={`rotate(${a} 100 76)`}
              />
            ))}
            <circle cx="100" cy="76" r="14" fill={center} stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="2" />
          </g>
        </g>

        {/* terracotta pot */}
        <g>
          <path d="M64 188 h72 l-4 14 h-64 Z" fill="var(--terracotta)" stroke="#a05f42" strokeWidth="2" strokeLinejoin="round" />
          <path d="M72 202 l6 38 a6 6 0 0 0 6 5 h32 a6 6 0 0 0 6 -5 l6 -38 Z" fill="var(--terracotta)" stroke="#a05f42" strokeWidth="2" strokeLinejoin="round" />
          <path d="M80 212 q20 6 40 0" stroke="#a05f42" strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
