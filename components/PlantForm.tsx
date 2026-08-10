"use client";

import { useState } from "react";
import { FLOWERS, MIN_BLOOM_MS, type Flower } from "@/lib/seed";
import { Plant } from "@/components/Plant";
import { SongPicker, stopPreview, type Song } from "@/components/SongPicker";

const FLOWER_LABELS: Record<Flower, string> = {
  sunflower: "sunflower ☀",
  tulip: "tulip ♡",
  rose: "rose ✿",
  daisy: "daisy ❀",
};

export function PlantForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [flower, setFlower] = useState<Flower>("sunflower");
  const [amount, setAmount] = useState(3);
  const [unit, setUnit] = useState<"minutes" | "hours" | "days">("days");
  const [song, setSong] = useState<Song | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const UNIT_MS = { minutes: 60_000, hours: 3_600_000, days: 86_400_000 } as const;
  const bloomMs = amount * UNIT_MS[unit];
  const tooShort = bloomMs < MIN_BLOOM_MS;

  function pickMedia(f: File | null) {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMedia(f);
    setMediaPreview(f ? URL.createObjectURL(f) : "");
  }

  async function plant() {
    setBusy(true);
    setError("");
    stopPreview();
    try {
      const form = new FormData();
      form.set("from", from);
      form.set("to", to);
      form.set("note", note);
      form.set("flower", flower);
      form.set("bloomMs", String(bloomMs));
      if (song) form.set("song", JSON.stringify(song));
      if (media) form.set("media", media);
      const res = await fetch("/api/seeds", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "the seed didn't take — try again?");
      setLink(`${window.location.origin}/p/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (link) {
    return (
      <div className="rise w-full max-w-md text-center">
        <p className="hand text-3xl text-ink mb-2">it&apos;s planted 🌱</p>
        <p className="text-ink-soft mb-4">
          send this to {to.trim() || "them"} — the seed blooms in {amount} {amount === 1 ? unit.slice(0, -1) : unit}, and only then does your note open.
        </p>
        <div className="flex gap-2">
          <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="flex-1 min-w-0 bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink-soft" />
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="shrink-0 rounded-lg bg-ink text-cream px-4 text-sm hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            {copied ? "copied!" : "copy"}
          </button>
        </div>
        <p className="text-ink-soft/70 text-sm mt-3">visit it yourself too — someone has to keep it company ♡</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex gap-3">
        <label className="flex-1 text-left">
          <span className="hand text-xl text-ink">from</span>
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="you" maxLength={60} className="mt-1 w-full bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink" />
        </label>
        <label className="flex-1 text-left">
          <span className="hand text-xl text-ink">for</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="someone you love" maxLength={60} className="mt-1 w-full bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink" />
        </label>
      </div>

      <label className="text-left">
        <span className="hand text-xl text-ink">the note inside the seed</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="write something worth waiting 3 days for…"
          className="mt-1 w-full bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink resize-none"
        />
      </label>

      <div className="text-left">
        <span className="hand text-xl text-ink">tuck something in with the note</span>
        <p className="text-ink-soft/70 text-sm">a photo, a little video, a song — they stay sealed until it blooms (all optional)</p>
        <div className="mt-2 flex flex-col gap-2">
          {media ? (
            <div className="flex items-center gap-3 bg-cream/70 border border-ink/10 rounded-2xl p-2 pr-3">
              {media.type.startsWith("video/") ? (
                <video src={mediaPreview} className="w-12 h-12 rounded-xl object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaPreview} alt="" className="w-12 h-12 rounded-xl object-cover" />
              )}
              <p className="flex-1 min-w-0 text-left text-ink-soft text-sm truncate">{media.name}</p>
              <button onClick={() => pickMedia(null)} aria-label="remove file" className="text-ink-soft hover:text-ink text-xl cursor-pointer">
                ✕
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 bg-[#fffdf8] border border-ink/15 border-dashed rounded-lg px-3 py-2 text-ink-soft hover:text-ink cursor-pointer w-fit">
              📷 add a photo or video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  e.target.value = "";
                  if (f && f.size > 4 * 1024 * 1024) {
                    setError("that file is a bit heavy — keep it under 4MB ♡");
                    return;
                  }
                  setError("");
                  pickMedia(f);
                }}
              />
            </label>
          )}
          <SongPicker song={song} onPick={setSong} />
        </div>
      </div>

      <div className="text-left">
        <span className="hand text-xl text-ink">how long should it take to bloom?</span>
        <div className="flex gap-2 mt-1 items-center">
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
            className="w-24 bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="bg-[#fffdf8] border border-ink/15 rounded-lg px-3 py-2 text-ink cursor-pointer"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
        <p className="text-ink-soft/70 text-sm mt-1">
          {tooShort ? "give it at least 5 minutes — good things take time ♡" : "they'll wait, and watch, and water it."}
        </p>
      </div>

      <div className="text-left">
        <span className="hand text-xl text-ink">what should it grow into?</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {FLOWERS.map((f) => (
            <button
              key={f}
              onClick={() => setFlower(f)}
              className={`rounded-full px-4 py-1.5 border transition-transform hover:-translate-y-0.5 cursor-pointer ${
                flower === f ? "bg-sage text-ink border-sage-deep shadow-[2px_3px_0_0_rgba(109,143,107,0.4)]" : "bg-[#fffdf8] text-ink-soft border-ink/15"
              }`}
            >
              {FLOWER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* live preview of the chosen bloom */}
      <div className="flex justify-center -my-2 pointer-events-none select-none scale-75">
        <Plant stage="bloom" flower={flower} />
      </div>

      {error ? <p className="text-terracotta text-sm text-center">{error}</p> : null}

      <button
        onClick={plant}
        disabled={busy || !note.trim() || tooShort}
        className="mx-auto rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(74,64,56,0.25)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg] disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
      >
        {busy ? "tucking it into the soil…" : "plant the seed 🌱"}
      </button>
    </div>
  );
}
