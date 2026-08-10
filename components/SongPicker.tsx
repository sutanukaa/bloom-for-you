"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

export type Song = { title: string; artist: string; artwork: string; preview: string; link: string };

// one shared audio element so previews never overlap
let audio: HTMLAudioElement | null = null;
function playPreview(url: string, onEnd: () => void): void {
  if (!audio) audio = new Audio();
  audio.pause();
  audio.src = url;
  audio.onended = onEnd;
  audio.play().catch(onEnd);
}
export function stopPreview() {
  audio?.pause();
}

// A cute little song search (iTunes catalog ≈ everything on Spotify/YT Music).
export function SongPicker({ song, onPick }: { song: Song | null; onPick: (s: Song | null) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      fetch(`/api/songs?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.songs ?? []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  function toggle(s: Song) {
    if (playing === s.preview) {
      stopPreview();
      setPlaying(null);
    } else if (s.preview) {
      playPreview(s.preview, () => setPlaying(null));
      setPlaying(s.preview);
    }
  }

  if (song) {
    return (
      <div className="flex items-center gap-3 bg-cream/70 border border-ink/10 rounded-2xl p-2 pr-3">
        <img src={song.artwork} alt="" className="w-12 h-12 rounded-xl" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-ink truncate">{song.title}</p>
          <p className="text-ink-soft text-sm truncate">{song.artist}</p>
        </div>
        <button
          onClick={() => {
            stopPreview();
            onPick(null);
          }}
          aria-label="remove song"
          className="text-ink-soft hover:text-ink text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div ref={box} className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search a song… ♪"
        className="w-full bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink"
      />
      {q.trim() && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-[#fffdf8] border border-ink/10 rounded-2xl shadow-[3px_6px_18px_rgba(46,59,46,0.16)] overflow-hidden max-h-72 overflow-y-auto">
          {searching && results.length === 0 ? (
            <p className="text-ink-soft text-sm p-3">listening for it…</p>
          ) : results.length === 0 ? (
            <p className="text-ink-soft text-sm p-3">nothing found — try another spelling?</p>
          ) : (
            results.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-cream/60 transition-colors">
                <img src={s.artwork} alt="" className="w-11 h-11 rounded-lg shrink-0" />
                <button onClick={() => onPick(s)} className="flex-1 min-w-0 text-left cursor-pointer">
                  <p className="text-ink text-sm truncate">{s.title}</p>
                  <p className="text-ink-soft text-xs truncate">{s.artist}</p>
                </button>
                {s.preview ? (
                  <button
                    onClick={() => toggle(s)}
                    aria-label="preview"
                    className="shrink-0 w-8 h-8 rounded-full bg-sage/60 hover:bg-sage flex items-center justify-center text-sm cursor-pointer"
                  >
                    {playing === s.preview ? "⏸" : "▶"}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
