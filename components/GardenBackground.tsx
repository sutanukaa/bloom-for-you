"use client";

import { useEffect, useState } from "react";

// Full-viewport garden scenery pinned to the bottom of the screen: rolling
// hedges, bushes, grass and flowers swaying in the wind, with gusts rippling
// through left-to-right, butterflies, drifting dandelion seeds, and a sky
// that follows the visitor's time of day (fireflies after dark).

const FLOWERS: { x: number; h: number; c: string; center: string; d: number; dur: number; s: number }[] = [
  { x: 60, h: 90, c: "#e9b44c", center: "#8a6238", d: 0, dur: 4.2, s: 1 },
  { x: 150, h: 60, c: "#e9a6b0", center: "#c76e7c", d: 0.8, dur: 5.1, s: 0.8 },
  { x: 235, h: 110, c: "#fdfaf2", center: "#e9b44c", d: 1.6, dur: 4.6, s: 1.1 },
  { x: 330, h: 70, c: "#d16a6a", center: "#a94f4f", d: 0.4, dur: 5.5, s: 0.85 },
  { x: 430, h: 95, c: "#e9b44c", center: "#8a6238", d: 2.1, dur: 4.0, s: 0.95 },
  { x: 520, h: 55, c: "#c9a0dc", center: "#9a6fb0", d: 1.2, dur: 5.8, s: 0.75 },
  { x: 1080, h: 65, c: "#e9a6b0", center: "#c76e7c", d: 0.6, dur: 4.8, s: 0.8 },
  { x: 1170, h: 100, c: "#fdfaf2", center: "#e9b44c", d: 1.9, dur: 4.3, s: 1 },
  { x: 1265, h: 70, c: "#e9b44c", center: "#8a6238", d: 0.2, dur: 5.3, s: 0.9 },
  { x: 1360, h: 105, c: "#d16a6a", center: "#a94f4f", d: 1.4, dur: 4.5, s: 1.05 },
  { x: 1455, h: 60, c: "#c9a0dc", center: "#9a6fb0", d: 2.4, dur: 5.0, s: 0.8 },
  { x: 1540, h: 85, c: "#e9a6b0", center: "#c76e7c", d: 0.9, dur: 4.4, s: 0.95 },
];

const GRASS: { x: number; s: number; d: number; dur: number }[] = [
  { x: 100, s: 1, d: 0.3, dur: 3.6 }, { x: 200, s: 0.8, d: 1.1, dur: 4.2 },
  { x: 290, s: 1.1, d: 0.7, dur: 3.9 }, { x: 385, s: 0.9, d: 1.8, dur: 4.5 },
  { x: 480, s: 1, d: 0.1, dur: 3.7 }, { x: 575, s: 0.85, d: 1.4, dur: 4.1 },
  { x: 700, s: 0.9, d: 0.9, dur: 4.4 }, { x: 830, s: 1, d: 1.7, dur: 3.8 },
  { x: 960, s: 0.85, d: 0.5, dur: 4.3 }, { x: 1120, s: 1.05, d: 1.2, dur: 3.9 },
  { x: 1220, s: 0.9, d: 0.2, dur: 4.6 }, { x: 1315, s: 1, d: 1.5, dur: 3.7 },
  { x: 1410, s: 0.8, d: 0.8, dur: 4.2 }, { x: 1505, s: 1.1, d: 2.0, dur: 3.95 },
];

type Period = "morning" | "day" | "dusk" | "night";

const SKIES: Record<Period, [string, string, string]> = {
  morning: ["#f6e3c0", "#eef0da", "#e2ecd4"],
  day: ["#dcebee", "#e9f0e0", "#e2ecd4"],
  dusk: ["#e8c4c0", "#ecdcd2", "#dfe8cf"],
  night: ["#2b3a4e", "#3a4a57", "#42524e"],
};

function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 16) return "day";
  if (hour >= 16 && hour < 20) return "dusk";
  return "night";
}

function Flower({ f, i, kicked, onKick }: { f: (typeof FLOWERS)[number]; i: number; kicked: boolean; onKick: (i: number) => void }) {
  const { x, h, c, center, d, dur, s } = f;
  const origin = { transformOrigin: `${x}px 900px` } as const;
  return (
    // three nested groups so the transforms compose: gust wave → click-kick → own sway
    <g className="gust" style={{ ...origin, animationDelay: `${(x / 1600) * 1.6}s` }}>
      <g className={kicked ? "kicked" : ""} style={origin}>
        <g
          className="windy flower-hit"
          style={{ ...origin, animationDelay: `${d}s`, animationDuration: `${dur}s`, pointerEvents: "auto" }}
          onPointerDown={() => onKick(i)}
        >
          <path d={`M${x} 900 Q ${x - 4 * s} ${900 - h / 2} ${x} ${900 - h}`} stroke="#5f7f58" strokeWidth={4 * s} fill="none" strokeLinecap="round" />
          <path d={`M${x} ${900 - h * 0.45} q ${-14 * s} ${-8 * s} ${-18 * s} ${2 * s} q ${8 * s} ${9 * s} ${18 * s} ${-2 * s}`} fill="#7ba173" />
          <path d={`M${x} ${900 - h * 0.65} q ${14 * s} ${-8 * s} ${18 * s} ${2 * s} q ${-8 * s} ${9 * s} ${-18 * s} ${-2 * s}`} fill="#7ba173" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx={x} cy={900 - h - 11 * s} rx={6 * s} ry={12 * s} fill={c} transform={`rotate(${a} ${x} ${900 - h})`} />
          ))}
          <circle cx={x} cy={900 - h} r={6.5 * s} fill={center} />
        </g>
      </g>
    </g>
  );
}

function Grass({ x, s, d, dur }: (typeof GRASS)[number]) {
  const origin = { transformOrigin: `${x}px 900px` } as const;
  return (
    <g className="gust" style={{ ...origin, animationDelay: `${(x / 1600) * 1.6}s` }}>
      <g className="windy" style={{ ...origin, animationDelay: `${d}s`, animationDuration: `${dur}s` }}>
        <path d={`M${x} 900 q ${-6 * s} -${28 * s} -${12 * s} -${36 * s}`} stroke="#6d8f65" strokeWidth={3.5 * s} fill="none" strokeLinecap="round" />
        <path d={`M${x} 900 q 0 -${34 * s} ${-2 * s} -${44 * s}`} stroke="#7ba173" strokeWidth={3.5 * s} fill="none" strokeLinecap="round" />
        <path d={`M${x} 900 q ${7 * s} -${26 * s} ${13 * s} -${33 * s}`} stroke="#6d8f65" strokeWidth={3.5 * s} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

// outer <g transform> attribute sets the height; the animated groups inside
// only ever translate relative to it (a CSS animation would otherwise
// override an inline transform style and pin these to y=0)
function Butterfly({ delay, dur, color, y }: { delay: number; dur: number; color: string; y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="butterfly" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <g className="flap">
          <ellipse cx="-9" cy="0" rx="12" ry="8" fill={color} transform="rotate(-20)" />
          <ellipse cx="9" cy="0" rx="12" ry="8" fill={color} transform="rotate(20)" />
          <ellipse cx="0" cy="2" rx="2.6" ry="9" fill="#4a4038" />
        </g>
      </g>
    </g>
  );
}

function DandelionSeed({ delay, dur, y }: { delay: number; dur: number; y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="drift-seed" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <g className="bob" style={{ animationDelay: `${delay * 0.7}s` }}>
          <circle cx="0" cy="0" r="2.5" fill="#fdfaf2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="0" y1="0" x2={13 * Math.cos((a * Math.PI) / 180)} y2={13 * Math.sin((a * Math.PI) / 180)} stroke="#fdfaf2" strokeWidth="1.4" opacity="0.85" />
          ))}
        </g>
      </g>
    </g>
  );
}

const FIREFLIES = [
  { x: 250, y: 700, d: 0 }, { x: 520, y: 640, d: 1.3 }, { x: 760, y: 720, d: 2.6 },
  { x: 980, y: 660, d: 0.7 }, { x: 1230, y: 710, d: 1.9 }, { x: 1440, y: 650, d: 3.1 },
];

export function GardenBackground() {
  // default to "day" on the server; real hour arrives after mount (no hydration mismatch)
  const [period, setPeriod] = useState<Period>("day");
  const [kicked, setKicked] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setPeriod(periodOf(new Date().getHours()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  function kick(i: number) {
    setKicked(i);
    setTimeout(() => setKicked(null), 750);
  }

  const [top, mid, bot] = SKIES[period];
  const night = period === "night";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" aria-hidden>
      <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={top} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={bot} />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sky)" style={{ transition: "all 2s" }} />

        {/* sun by day, moon by night */}
        {night ? (
          <g>
            <circle cx="1380" cy="130" r="48" fill="#e8e6d8" opacity="0.9" />
            <circle cx="1362" cy="118" r="9" fill="#d5d3c4" opacity="0.7" />
            <circle cx="1394" cy="146" r="6" fill="#d5d3c4" opacity="0.7" />
            {[[200, 90], [420, 160], [660, 70], [900, 130], [1120, 60], [1500, 220]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="#fdfaf2" className="twinkle" style={{ animationDelay: `${i * 0.6}s` }} />
            ))}
          </g>
        ) : (
          <g>
            <circle cx="1380" cy="130" r="90" fill={period === "dusk" ? "#f0b58e" : "#f6dfa0"} opacity="0.55" />
            <circle cx="1380" cy="130" r="55" fill={period === "dusk" ? "#eda173" : "#f3d98b"} opacity="0.8" />
          </g>
        )}

        {/* drifting clouds */}
        <g className="cloud" style={{ animationDuration: "80s" }}>
          <ellipse cx="300" cy="120" rx="90" ry="26" fill="#ffffff" opacity={night ? 0.12 : 0.65} />
          <ellipse cx="360" cy="100" rx="60" ry="22" fill="#ffffff" opacity={night ? 0.12 : 0.65} />
        </g>
        <g className="cloud" style={{ animationDuration: "110s", animationDelay: "-40s" }}>
          <ellipse cx="800" cy="70" rx="70" ry="20" fill="#ffffff" opacity={night ? 0.1 : 0.5} />
          <ellipse cx="850" cy="55" rx="45" ry="16" fill="#ffffff" opacity={night ? 0.1 : 0.5} />
        </g>

        {/* butterflies by day, fireflies by night */}
        {!night && (
          <>
            <Butterfly delay={0} dur={38} color="#e9a6b0" y={520} />
            <Butterfly delay={-16} dur={52} color="#e9b44c" y={430} />
          </>
        )}

        {/* dandelion seeds riding the wind */}
        <DandelionSeed delay={0} dur={30} y={380} />
        <DandelionSeed delay={-12} dur={42} y={480} />
        <DandelionSeed delay={-25} dur={36} y={300} />

        {/* distant hedge line */}
        <path
          d="M0 780 Q 100 730 220 765 Q 340 720 470 760 Q 600 715 740 758 Q 880 720 1010 762 Q 1140 722 1270 760 Q 1400 725 1600 768 L 1600 900 L 0 900 Z"
          fill="#a9c49b"
        />

        {/* bushes */}
        <g className="windy-slow" style={{ transformOrigin: "120px 900px" }}>
          <circle cx="60" cy="850" r="80" fill="#7ba173" />
          <circle cx="160" cy="865" r="65" fill="#87ab7c" />
          <circle cx="240" cy="885" r="55" fill="#7ba173" />
        </g>
        <g className="windy-slow" style={{ transformOrigin: "1480px 900px", animationDelay: "1.5s" }}>
          <circle cx="1540" cy="850" r="85" fill="#7ba173" />
          <circle cx="1440" cy="868" r="62" fill="#87ab7c" />
          <circle cx="1360" cy="888" r="52" fill="#7ba173" />
        </g>
        <g className="windy-slow" style={{ transformOrigin: "700px 900px", animationDelay: "0.7s" }}>
          <circle cx="650" cy="885" r="45" fill="#87ab7c" />
          <circle cx="720" cy="892" r="38" fill="#7ba173" />
        </g>
        <g className="windy-slow" style={{ transformOrigin: "1000px 900px", animationDelay: "2.2s" }}>
          <circle cx="980" cy="888" r="42" fill="#7ba173" />
          <circle cx="1050" cy="894" r="34" fill="#87ab7c" />
        </g>

        {/* ground */}
        <path d="M0 880 Q 400 862 800 876 Q 1200 890 1600 872 L 1600 900 L 0 900 Z" fill="#8fae7e" />

        {GRASS.map((g, i) => <Grass key={i} {...g} />)}
        {FLOWERS.map((f, i) => <Flower key={i} f={f} i={i} kicked={kicked === i} onKick={kick} />)}

        {/* fireflies wandering low over the garden */}
        {night &&
          FIREFLIES.map((f, i) => (
            <g key={i} className="firefly" style={{ transformOrigin: `${f.x}px ${f.y}px`, animationDelay: `${f.d}s` }}>
              <circle cx={f.x} cy={f.y} r="8" fill="#f3e98b" opacity="0.25" />
              <circle cx={f.x} cy={f.y} r="3" fill="#f3e98b" />
            </g>
          ))}

        {/* evening settles over everything */}
        {period !== "day" && (
          <rect
            width="1600"
            height="900"
            fill={night ? "#1c2b3a" : period === "dusk" ? "#e9a6b0" : "#f3d98b"}
            opacity={night ? 0.18 : 0.08}
            style={{ transition: "all 2s" }}
          />
        )}
      </svg>
    </div>
  );
}
