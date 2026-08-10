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

// An aesthetic little song-search modal (iTunes catalog ≈ everything on
// Spotify / YT Music). Picking a song closes it.
export function SongModal({ open, onPick, onClose }: { open: boolean; onPick: (s: Song) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      stopPreview();
      setPlaying(null);
    }
  }, [open]);

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

  function togglePlay(s: Song) {
    if (playing === s.preview) {
      stopPreview();
      setPlaying(null);
    } else if (s.preview) {
      playPreview(s.preview, () => setPlaying(null));
      setPlaying(s.preview);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="paper-card relative bg-[#fffdf8] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-ink/10 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="close" className="absolute top-3 right-4 text-ink-soft hover:text-ink text-2xl leading-none cursor-pointer">
          ✕
        </button>
        <h3 className="hand text-3xl text-ink mb-1 text-center">a song for the seed ♪</h3>
        <p className="text-ink-soft text-sm text-center mb-4">it plays when the flower blooms</p>

        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search any song…"
          className="w-full bg-cream/60 border border-ink/15 rounded-xl px-4 py-2.5 text-ink"
        />

        <div className="mt-3 overflow-y-auto flex-1 -mx-2 px-2">
          {q.trim() === "" ? (
            <p className="hand text-xl text-ink-soft/70 text-center mt-8 mb-6">hum it, type it, find it ♡</p>
          ) : searching && results.length === 0 ? (
            <p className="text-ink-soft text-sm text-center mt-8 mb-6">listening for it…</p>
          ) : results.length === 0 ? (
            <p className="text-ink-soft text-sm text-center mt-8 mb-6">nothing found — try another spelling?</p>
          ) : (
            results.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-cream/70 transition-colors">
                <img src={s.artwork} alt="" className="w-12 h-12 rounded-xl shrink-0 shadow-[1px_2px_6px_rgba(46,59,46,0.15)]" />
                <button
                  onClick={() => {
                    stopPreview();
                    onPick(s);
                    onClose();
                  }}
                  className="flex-1 min-w-0 text-left cursor-pointer"
                >
                  <p className="text-ink truncate">{s.title}</p>
                  <p className="text-ink-soft text-sm truncate">{s.artist}</p>
                </button>
                {s.preview ? (
                  <button
                    onClick={() => togglePlay(s)}
                    aria-label="preview"
                    className="shrink-0 w-9 h-9 rounded-full bg-sage/60 hover:bg-sage flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {playing === s.preview ? "⏸" : "▶"}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
