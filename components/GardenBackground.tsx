"use client";

import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element */

// The painted garden: hedge, bushes, grass and wildflowers (all generated in
// the same gouache style as the plant art), swaying in the wind with gusts
// rippling through, butterflies, drifting dandelion seeds, and a sky that
// follows the visitor's clock — moon, stars and fireflies after dark.

type Period = "morning" | "day" | "dusk" | "night";

const SKIES: Record<Period, [string, string, string]> = {
  morning: ["#f6e3c0", "#eef0da", "#e2ecd4"],
  day: ["#dcebee", "#e9f0e0", "#e2ecd4"],
  dusk: ["#e8c4c0", "#ecdcd2", "#dfe8cf"],
  night: ["#35496b", "#45586e", "#4d6066"],
};

// dims the painted art itself so the scenery genuinely darkens at night —
// but only to "moonlit", never to "gloomy"
const SCENERY_FILTER: Record<Period, string> = {
  morning: "brightness(1.03) saturate(1.02)",
  day: "none",
  dusk: "brightness(0.94) saturate(0.95) hue-rotate(-6deg)",
  night: "brightness(0.8) saturate(0.85)",
};

function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 16) return "day";
  if (hour >= 16 && hour < 20) return "dusk";
  return "night";
}

// wildflowers along the bottom: img 1-5, position, height (vh), sway timing
const FLOWERS = [
  { img: 1, left: 2, h: 15, d: 0, dur: 4.2 },
  { img: 2, left: 7.5, h: 10, d: 0.8, dur: 5.1 },
  { img: 3, left: 14, h: 17, d: 1.6, dur: 4.6 },
  { img: 4, left: 20, h: 11, d: 0.4, dur: 5.5 },
  { img: 5, left: 26, h: 14, d: 2.1, dur: 4.0 },
  { img: 1, left: 32, h: 9, d: 1.2, dur: 5.8 },
  { img: 2, left: 66, h: 10, d: 0.6, dur: 4.8 },
  { img: 3, left: 72, h: 16, d: 1.9, dur: 4.3 },
  { img: 4, left: 78.5, h: 11, d: 0.2, dur: 5.3 },
  { img: 5, left: 84, h: 17, d: 1.4, dur: 4.5 },
  { img: 1, left: 90, h: 10, d: 2.4, dur: 5.0 },
  { img: 2, left: 95.5, h: 13, d: 0.9, dur: 4.4 },
];

const GRASS = [
  { left: 4.5, h: 6, d: 0.3, dur: 3.6 }, { left: 11, h: 4.5, d: 1.1, dur: 4.2 },
  { left: 17, h: 6.5, d: 0.7, dur: 3.9 }, { left: 23, h: 5, d: 1.8, dur: 4.5 },
  { left: 29.5, h: 6, d: 0.1, dur: 3.7 }, { left: 36, h: 4.5, d: 1.4, dur: 4.1 },
  { left: 43, h: 5.5, d: 0.9, dur: 4.4 }, { left: 51, h: 6, d: 1.7, dur: 3.8 },
  { left: 58, h: 4.5, d: 0.5, dur: 4.3 }, { left: 69, h: 6, d: 1.2, dur: 3.9 },
  { left: 75.5, h: 5, d: 0.2, dur: 4.6 }, { left: 81.5, h: 6.5, d: 1.5, dur: 3.7 },
  { left: 88, h: 4.5, d: 0.8, dur: 4.2 }, { left: 93.5, h: 6, d: 2.0, dur: 3.95 },
];

const FIREFLIES = [
  { left: 16, bottom: 22, d: 0 }, { left: 27, bottom: 34, d: 1.3 }, { left: 38, bottom: 20, d: 2.6 },
  { left: 48, bottom: 40, d: 0.7 }, { left: 57, bottom: 25, d: 1.9 }, { left: 66, bottom: 36, d: 3.1 },
  { left: 76, bottom: 21, d: 0.4 }, { left: 85, bottom: 31, d: 2.2 }, { left: 93, bottom: 26, d: 1.1 },
];

const STARS = [
  { left: 12, top: 10 }, { left: 20, top: 22 }, { left: 26, top: 6 }, { left: 34, top: 16 },
  { left: 41, top: 8 }, { left: 49, top: 20 }, { left: 56, top: 12 }, { left: 64, top: 5 },
  { left: 70, top: 17 }, { left: 79, top: 9 }, { left: 87, top: 28 }, { left: 94, top: 20 },
];

export function GardenBackground() {
  // default to "day" on the server; the real hour arrives after mount
  const [period, setPeriod] = useState<Period>("day");
  const [kicked, setKicked] = useState<number | null>(null);

  useEffect(() => {
    // ?time=night|dusk|morning|day previews any hour without waiting for it;
    // ?time=cycle walks day→dusk→night→morning on a loop to demo the transitions
    const forced = new URLSearchParams(window.location.search).get("time");
    if (forced === "cycle") {
      const order: Period[] = ["day", "dusk", "night", "morning"];
      let i = 0;
      const t = setInterval(() => setPeriod(order[++i % order.length]), 25_000);
      return () => clearInterval(t);
    }
    const tick = () => setPeriod(forced && forced in SKIES ? (forced as Period) : periodOf(new Date().getHours()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  // let the page's text tokens follow the hour (globals.css flips the ink
  // light at night — forest-dark text vanishes against a night sky)
  useEffect(() => {
    document.documentElement.dataset.garden = period;
  }, [period]);

  function kick(i: number) {
    setKicked(i);
    setTimeout(() => setKicked(null), 750);
  }

  const [top, mid, bot] = SKIES[period];
  const night = period === "night";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${bot} 100%)`, transition: "background 8s" }}
      />

      {/* everything painted lives under one dimmer so night actually darkens it */}
      <div className="absolute inset-0" style={{ filter: SCENERY_FILTER[period], transition: "filter 8s" }}>
        {/* sun and moon are both always mounted; the hour moves them, so at
            the boundaries the sun visibly sets and the moon rises (12s glide) */}
        <img
          src="/sun.png"
          alt=""
          className="absolute w-[13vw] min-w-28 max-w-52"
          style={{
            right: period === "morning" ? "16%" : "4%",
            top: period === "dusk" ? "58%" : "4%",
            transform: night ? "translateY(90vh)" : undefined,
            opacity: night ? 0 : 0.95,
            filter: period === "dusk" ? "saturate(1.4) hue-rotate(-18deg) drop-shadow(0 0 30px rgba(240,160,100,0.5))" : undefined,
            transition: "all 12s ease-in-out",
          }}
        />
        <img
          src="/moon.png"
          alt=""
          className="absolute w-[11vw] min-w-24 max-w-44"
          style={{
            right: "6%",
            top: "4%",
            transform: night ? "translateY(0)" : "translateY(110vh)",
            opacity: night ? 0.95 : 0,
            filter: "drop-shadow(0 0 24px rgba(240,238,215,0.45))",
            transition: "all 12s ease-in-out",
          }}
        />
        {night &&
          STARS.map((s, i) => (
            <div
              key={i}
              className="twinkle absolute w-1 h-1 rounded-full bg-[#fdfaf2]"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${i * 0.6}s`, boxShadow: "0 0 6px 1px rgba(253,250,242,0.8)" }}
            />
          ))}

        {/* clouds */}
        <img src="/cloud1.png" alt="" className="cloud absolute w-[15vw] min-w-32" style={{ top: "9%", animationDuration: "80s", opacity: night ? 0.25 : 0.9 }} />
        <img src="/cloud1.png" alt="" className="cloud absolute w-[9vw] min-w-24" style={{ top: "3%", animationDuration: "110s", animationDelay: "-40s", opacity: night ? 0.2 : 0.7 }} />

        {/* butterflies by day (they sleep at night) */}
        {!night && (
          <>
            <div className="butterfly absolute" style={{ top: "38%", animationDuration: "38s" }}>
              <img src="/butterfly1.png" alt="" className="flap-img w-10 sm:w-12" />
            </div>
            <div className="butterfly absolute" style={{ top: "26%", animationDuration: "52s", animationDelay: "-16s" }}>
              <img src="/butterfly2.png" alt="" className="flap-img w-8 sm:w-10" style={{ animationDelay: "0.2s" }} />
            </div>
          </>
        )}

        {/* dandelion seeds riding the wind */}
        {[{ top: 30, dur: 30, delay: 0 }, { top: 45, dur: 42, delay: -12 }, { top: 22, dur: 36, delay: -25 }].map((sd, i) => (
          <div key={i} className="drift-seed absolute" style={{ top: `${sd.top}%`, animationDuration: `${sd.dur}s`, animationDelay: `${sd.delay}s` }}>
            <div className="bob" style={{ animationDelay: `${i * 1.1}s` }}>
              <img src="/dandelion.png" alt="" className="w-6 sm:w-8 opacity-90" />
            </div>
          </div>
        ))}

        {/* distant hedge line — tiled strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[24vh]"
          style={{ backgroundImage: "url(/hedge.png)", backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", backgroundPosition: "bottom" }}
        />

        {/* bushes breathing in the wind */}
        {/* mirror on a wrapper — an inline scaleX on the img itself would be
            overridden by the sway animation's transform */}
        <img src="/bush1.png" alt="" className="windy-slow absolute bottom-[-3vh] left-[-2vw] w-[13vw] min-w-28" />
        <div className="absolute bottom-[-3vh] right-[-2vw] w-[15vw] min-w-32" style={{ transform: "scaleX(-1)" }}>
          <img src="/bush1.png" alt="" className="windy-slow w-full" style={{ animationDelay: "1.5s" }} />
        </div>
        <img src="/bush1.png" alt="" className="windy-slow absolute bottom-[-3vh] left-[38vw] w-[13vw] min-w-28" style={{ animationDelay: "0.7s" }} />
        <div className="absolute bottom-[-3vh] left-[58vw] w-[11vw] min-w-24" style={{ transform: "scaleX(-1)" }}>
          <img src="/bush1.png" alt="" className="windy-slow w-full" style={{ animationDelay: "2.2s" }} />
        </div>

        {/* grass tufts */}
        {GRASS.map((g, i) => (
          <div key={i} className="gust absolute bottom-0" style={{ left: `${g.left}%`, animationDelay: `${(g.left / 100) * 1.6}s` }}>
            <img src="/grass.png" alt="" className="windy" style={{ height: `${g.h}vh`, width: "auto", animationDelay: `${g.d}s`, animationDuration: `${g.dur}s` }} />
          </div>
        ))}

        {/* wildflowers — poke one and it springs about */}
        {FLOWERS.map((f, i) => (
          <div key={i} className="gust absolute bottom-0" style={{ left: `${f.left}%`, animationDelay: `${(f.left / 100) * 1.6}s` }}>
            <div className={kicked === i ? "kicked" : ""}>
              <img
                src={`/flower${f.img}.png`}
                alt=""
                className="windy flower-hit"
                style={{ height: `${f.h}vh`, width: "auto", animationDelay: `${f.d}s`, animationDuration: `${f.dur}s`, pointerEvents: "auto" }}
                onPointerDown={() => kick(i)}
                draggable={false}
              />
            </div>
          </div>
        ))}

        {/* fireflies wandering low over the garden */}
        {night &&
          FIREFLIES.map((f, i) => (
            <div key={i} className="firefly absolute" style={{ left: `${f.left}%`, bottom: `${f.bottom}%`, animationDelay: `${f.d}s`, animationDuration: `${4.2 + (i % 4) * 0.9}s` }}>
              <div className="firefly-orb" />
            </div>
          ))}
      </div>

      {/* the hour's tint settles over everything */}
      {period !== "day" && (
        <div
          className="absolute inset-0"
          style={{
            background: night ? "#26364e" : period === "dusk" ? "#e9a6b0" : "#f3d98b",
            opacity: night ? 0.1 : 0.08,
            transition: "all 8s",
          }}
        />
      )}
    </div>
  );
}
