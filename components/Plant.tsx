import type { Flower, Stage } from "@/lib/seed";

// Hand-drawn-style inline SVG plant, one drawing per stage.
// ponytail: placeholder art — swap each stage for a generated PNG in /public/plants/<flower>/<stage>.png later.

export const PETALS: Record<Flower, string> = {
  sunflower: "#e8b64c",
  tulip: "#e9a6b0",
  rose: "#d16a6a",
  daisy: "#fdfaf2",
};
export const CENTERS: Record<Flower, string> = {
  sunflower: "#8a6238",
  tulip: "#e9a6b0",
  rose: "#b95252",
  daisy: "#e8b64c",
};

export function Plant({ stage, flower }: { stage: Stage; flower: Flower }) {
  const petal = PETALS[flower];
  const center = CENTERS[flower];
  return (
    <svg viewBox="0 0 200 260" className="w-56 sm:w-64 h-auto" aria-hidden>
      {/* sunbeam glow behind a bloomed flower */}
      {stage === "bloom" && <circle cx="100" cy="80" r="55" fill="#f3d98b" opacity="0.45" className="glow" />}

      <g className="sway">
        {/* seed: a little mound with a hopeful dimple */}
        {stage === "seed" && (
          <g>
            <ellipse cx="100" cy="188" rx="26" ry="10" fill="#8a6f52" />
            <path d="M96 184 q4 -6 8 0" stroke="#4a4038" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* sprout: two baby leaves */}
        {stage === "sprout" && (
          <g stroke="var(--sage-deep)" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M100 190 v-24" />
            <path d="M100 168 q-16 -12 -22 -2 q8 10 22 2" fill="var(--sage)" strokeWidth="2.5" />
            <path d="M100 168 q16 -12 22 -2 q-8 10 -22 2" fill="var(--sage)" strokeWidth="2.5" />
          </g>
        )}

        {/* seedling: taller stem, more leaves */}
        {stage === "seedling" && (
          <g stroke="var(--sage-deep)" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M100 190 C 98 160, 102 140, 100 118" />
            <path d="M100 160 q-20 -14 -27 -3 q10 12 27 3" fill="var(--sage)" strokeWidth="2.5" />
            <path d="M100 140 q20 -14 27 -3 q-10 12 -27 3" fill="var(--sage)" strokeWidth="2.5" />
            <path d="M100 118 q-14 -10 -19 -2 q7 9 19 2" fill="var(--sage)" strokeWidth="2.5" />
          </g>
        )}

        {/* bud: closed and promising */}
        {stage === "bud" && (
          <g>
            <g stroke="var(--sage-deep)" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M100 190 C 97 150, 103 120, 100 92" />
              <path d="M100 158 q-20 -14 -27 -3 q10 12 27 3" fill="var(--sage)" strokeWidth="2.5" />
              <path d="M100 132 q20 -14 27 -3 q-10 12 -27 3" fill="var(--sage)" strokeWidth="2.5" />
            </g>
            <path d="M100 92 c -12 -2, -12 -22, 0 -26 c 12 4, 12 24, 0 26" fill={petal} stroke="var(--sage-deep)" strokeWidth="2.5" />
            <path d="M92 84 q8 8 16 0" stroke="var(--sage-deep)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* bloom: the whole point */}
        {stage === "bloom" && (
          <g>
            <g stroke="var(--sage-deep)" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M100 190 C 96 150, 104 115, 100 84" />
              <path d="M100 156 q-22 -15 -30 -4 q11 13 30 4" fill="var(--sage)" strokeWidth="2.5" />
              <path d="M100 128 q22 -15 30 -4 q-11 13 -30 4" fill="var(--sage)" strokeWidth="2.5" />
            </g>
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
        )}
      </g>

      {/* terracotta pot */}
      <g>
        <path d="M64 188 h72 l-4 14 h-64 Z" fill="var(--terracotta)" stroke="#a05f42" strokeWidth="2" strokeLinejoin="round" />
        <path d="M72 202 l6 38 a6 6 0 0 0 6 5 h32 a6 6 0 0 0 6 -5 l6 -38 Z" fill="var(--terracotta)" stroke="#a05f42" strokeWidth="2" strokeLinejoin="round" />
        <path d="M80 212 q20 6 40 0" stroke="#a05f42" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}
