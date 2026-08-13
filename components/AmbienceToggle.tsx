"use client";

import { useEffect, useState } from "react";
import { startAmbience, stopAmbience, isAmbienceOn, ambienceRunning } from "@/lib/ambience";

// Wind-chime button (bottom-right): toggles the garden's wind + birdsong.
// Audio can only start on a user gesture, so if it was left on last visit we
// wait for the first click/tap anywhere and resume it then.
export function AmbienceToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!isAmbienceOn()) return;
    const resume = () => {
      startAmbience();
      setOn(true);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    return () => window.removeEventListener("pointerdown", resume);
  }, []);

  function toggle() {
    // check the actual audio state, not React state — the pointerdown resume
    // listener may have just started it in this same click
    if (ambienceRunning()) {
      stopAmbience();
      setOn(false);
    } else {
      startAmbience();
      setOn(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? "turn garden sounds off" : "turn garden sounds on"}
      title={on ? "the garden is singing" : "hear the garden"}
      className={`fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-[#fffdf8]/80 backdrop-blur-sm border border-ink/15 shadow-[2px_3px_0_0_rgba(46,59,46,0.15)] flex items-center justify-center text-xl transition-all hover:-translate-y-0.5 cursor-pointer ${on ? "" : "grayscale opacity-60"}`}
    >
      {on ? "🎐" : "🔇"}
    </button>
  );
}
