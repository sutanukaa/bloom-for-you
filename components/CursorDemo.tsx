"use client";

import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element */

// ?cursor=demo — draws the sprout/butterfly cursor as an in-page element so
// tab recorders (Cursorful etc.) capture it; the real cursor is hidden.
// Recording aid only; normal visitors get the CSS cursors.
const CLICKABLE = "a, button, label, summary, select, [role='button'], .cursor-pointer, .flower-hit";

export function CursorDemo() {
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cursor") !== "demo") return;
    setOn(true);
    document.documentElement.classList.add("demo-cursor");
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setHovering(!!(e.target as HTMLElement).closest?.(CLICKABLE));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("demo-cursor");
    };
  }, []);

  if (!on) return null;
  return (
    <img
      src={hovering ? "/cursor-butterfly.svg" : "/cursor-sprout.svg"}
      alt=""
      className="fixed z-[100] pointer-events-none select-none w-7 h-7"
      style={{ left: pos.x - 4, top: pos.y - 4 }}
    />
  );
}
