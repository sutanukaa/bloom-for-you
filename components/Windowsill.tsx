"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plant } from "@/components/Plant";
import { stageAt, timeLeft, type Flower, type Stage } from "@/lib/seed";
import { duckAmbience, unduckAmbience } from "@/lib/ambience";

/* eslint-disable @next/next/no-img-element */

type Media = { type: "image" | "video"; url: string };
type Song = { title: string; artist: string; artwork: string; preview: string; link: string };

// the song that came sealed with the note, on a little record-sleeve card
function SongCard({ song }: { song: Song }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function ensureAudio(): HTMLAudioElement {
    if (!audio.current) {
      audio.current = new Audio(song.preview);
      audio.current.onended = () => {
        setPlaying(false);
        unduckAmbience(); // the garden comes back when the song ends
      };
    }
    return audio.current;
  }

  // the song starts on its own when the card appears (right after "open the
  // note", so the click's user-activation still covers autoplay) — and the
  // garden ambience steps aside for it
  useEffect(() => {
    if (!song.preview) return;
    const a = ensureAudio();
    duckAmbience();
    a.play()
      .then(() => setPlaying(true))
      .catch(() => unduckAmbience()); // autoplay refused → garden keeps singing
    return () => {
      a.pause();
      unduckAmbience();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const a = ensureAudio();
    if (playing) {
      a.pause();
      unduckAmbience();
    } else {
      duckAmbience();
      a.play().catch(() => unduckAmbience());
    }
    setPlaying(!playing);
  }

  return (
    <div className="unfold paper-card flex items-center gap-3 mt-4 bg-[#fffdf8] border border-ink/10 rounded-2xl p-3 pr-4 shadow-[3px_6px_14px_rgba(74,64,56,0.18)] max-w-sm w-full">
      <img src={song.artwork} alt="" className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-ink truncate">{song.title}</p>
        <p className="text-ink-soft text-sm truncate">{song.artist}</p>
        {song.link ? (
          <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-ink-soft/80 text-xs underline underline-offset-2 hover:text-ink">
            open in your music app ↗
          </a>
        ) : null}
      </div>
      {song.preview ? (
        <button
          onClick={toggle}
          aria-label={playing ? "pause" : "play"}
          className="shrink-0 w-11 h-11 rounded-full bg-sage/70 hover:bg-sage flex items-center justify-center text-lg cursor-pointer transition-colors"
        >
          {playing ? "⏸" : "▶"}
        </button>
      ) : null}
    </div>
  );
}

// sprouts that take root as waterings accumulate — each threshold adds one
const WATERED_SPROUTS: { at: number; src: string; pos: React.CSSProperties; h: number }[] = [
  { at: 1, src: "/grass.png", pos: { left: "3.5rem" }, h: 44 },
  { at: 2, src: "/grass.png", pos: { right: "4rem" }, h: 40 },
  { at: 4, src: "/flower1.png", pos: { left: "5.5rem" }, h: 62 },
  { at: 7, src: "/flower3.png", pos: { right: "6rem" }, h: 70 },
  { at: 10, src: "/grass.png", pos: { left: "8rem" }, h: 38 },
  { at: 14, src: "/flower4.png", pos: { right: "8.5rem" }, h: 56 },
];

const STAGE_LINES: Record<Stage, string> = {
  seed: "the seed is tucked in, fast asleep.",
  sprout: "oh! two little leaves.",
  seedling: "growing up so fast.",
  bud: "so close now — it's holding its breath.",
  bloom: "it bloomed!",
};

export function Windowsill({
  id,
  plantedAt,
  bloomsAt,
  flower,
  from,
  to,
  waterings: initialWaterings,
  note,
  media = null,
  song = null,
  bloomedOthers = 0,
  isPublic = false,
}: {
  id: string;
  plantedAt: string;
  bloomsAt: string;
  flower: Flower;
  from: string;
  to: string;
  waterings: number;
  note: string | null;
  media?: Media | null;
  song?: Song | null;
  bloomedOthers?: number;
  isPublic?: boolean;
}) {
  const [stage, setStage] = useState<Stage>(() => stageAt(plantedAt, bloomsAt));
  const [left, setLeft] = useState(() => timeLeft(bloomsAt));
  const [waterings, setWaterings] = useState(initialWaterings);
  const [watering, setWatering] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  // the "live here forever?" invitation: hidden → asking → planted
  const [invite, setInvite] = useState<"hidden" | "asking" | "planted">("hidden");

  // a beat after the note unfolds, the garden welcomes the new flower —
  // and 10s in, it asks whether the flower may stay forever (once)
  useEffect(() => {
    if (!noteOpen) return;
    const t = setTimeout(() => setJoined(true), 2200);
    const asked = isPublic || localStorage.getItem(`garden-asked-${id}`);
    const t2 = asked ? undefined : setTimeout(() => setInvite("asking"), 10_000);
    return () => {
      clearTimeout(t);
      if (t2) clearTimeout(t2);
    };
  }, [noteOpen, isPublic, id]);

  function declineInvite() {
    localStorage.setItem(`garden-asked-${id}`, "1");
    setInvite("hidden");
  }

  async function acceptInvite() {
    localStorage.setItem(`garden-asked-${id}`, "1");
    try {
      const res = await fetch(`/api/seeds/${id}/public`, { method: "POST" });
      if (res.ok) setInvite("planted");
      else setInvite("hidden");
    } catch {
      setInvite("hidden");
    }
  }

  // tick the countdown; if the bloom moment passes while they're watching,
  // reload so the server hands over the note
  useEffect(() => {
    const t = setInterval(() => {
      const s = stageAt(plantedAt, bloomsAt);
      setLeft(timeLeft(bloomsAt));
      if (s === "bloom" && stage !== "bloom" && note === null) window.location.reload();
      setStage(s);
    }, 15_000);
    return () => clearInterval(t);
  }, [plantedAt, bloomsAt, stage, note]);

  async function water() {
    if (watering) return;
    setWatering(true);
    fetch(`/api/seeds/${id}/water`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => typeof d.waterings === "number" && setWaterings(d.waterings))
      .catch(() => {});
    // the can pours, then the plant does a happy wiggle
    setTimeout(() => {
      setWatering(false);
      setWiggle(true);
      setTimeout(() => setWiggle(false), 1100);
    }, 1600);
  }

  return (
    <div className="flex flex-col items-center text-center max-w-md">
      <p className="hand text-2xl text-ink-soft">
        {from.trim() ? `${from} planted this` : "someone planted this"}
        {to.trim() ? ` for ${to}` : " for you"} ♡
      </p>

      {/* the plant lives right in the garden, with grass and wildflowers for company
          (fixed height, bottom-anchored so nothing jumps between stages) */}
      {/* eslint-disable @next/next/no-img-element */}
      <div className="relative mt-4 flex items-end justify-center h-80 sm:h-[26rem] w-72 sm:w-96">
        {/* the watering can tips in over the pot and pours */}
        {watering && (
          <div className="pour absolute top-6 left-1/2 z-10" style={{ marginLeft: "-8.5rem" }} aria-hidden>
            <img src="/water-can.png" alt="" className="w-28 sm:w-32" />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="drip absolute text-base"
                style={{ right: `${-4 + i * 10}px`, top: "58%", animationDelay: `${0.3 + i * 0.18}s`, color: "#6d9ec1" }}
              >
                💧
              </span>
            ))}
          </div>
        )}

        {/* garden companions — the base pair is always there, and every few
            waterings a new sprout takes root in the patch: care visibly
            accumulates (thresholds against the persisted count) */}
        <img src="/flower2.png" alt="" className="windy absolute bottom-0 left-2 h-24 sm:h-32 w-auto pointer-events-none" style={{ animationDelay: "0.6s" }} />
        <img src="/flower5.png" alt="" className="windy absolute bottom-0 right-2 h-28 sm:h-36 w-auto pointer-events-none" style={{ animationDelay: "0.2s" }} />
        {WATERED_SPROUTS.filter((s) => waterings >= s.at).map((s) => (
          <img
            key={s.at}
            src={s.src}
            alt=""
            className="rise windy absolute bottom-0 w-auto pointer-events-none"
            style={{ ...s.pos, height: `${s.h}px`, animationDelay: `0s, ${(s.at % 5) * 0.4}s` }}
          />
        ))}

        {/* a butterfly keeps the bloomed flower company */}
        {stage === "bloom" && (
          <div className="bob absolute top-6 right-16 sm:right-24 pointer-events-none">
            <img src="/butterfly1.png" alt="" className="flap-img w-9 sm:w-11" />
          </div>
        )}

        {/* freshly watered: a brief happy glow along with the wiggle */}
        <div className={wiggle ? "wiggle" : ""} style={{ filter: wiggle ? "saturate(1.3) brightness(1.06)" : "none", transition: "filter 1s" }}>
          <Plant stage={stage} flower={flower} potPx={130} />
        </div>
      </div>

      {/* pre-bloom status needs a paper pill (it sits over the bushes); the
          bloom line stands on its own — one card too many otherwise */}
      {stage !== "bloom" ? (
        <div className="glass-pill backdrop-blur-sm border border-ink/10 rounded-2xl px-6 py-4 mt-8 shadow-[2px_4px_14px_rgba(46,59,46,0.12)]">
          <p className="hand text-2xl text-ink">{STAGE_LINES[stage]}</p>
          <p className="text-ink-soft mt-1">
            blooms in {left || "a moment"} — there&apos;s a note inside, but it opens only when the flower does.
          </p>
          <p className="text-ink-soft/80 text-sm mt-2">
            {waterings === 0 ? "it hasn't been watered yet" : `watered ${waterings} time${waterings === 1 ? "" : "s"} with love`}
            {" "}· watering won&apos;t make it bloom sooner, but the patch around it grows greener ♡
          </p>
        </div>
      ) : (
        <p className="hand text-3xl text-ink mt-8" style={{ textShadow: "0 1px 10px rgba(246,239,223,0.7)" }}>
          {STAGE_LINES.bloom}
        </p>
      )}

      {stage !== "bloom" ? (
        <button
          onClick={water}
          disabled={watering}
          className="mt-5 rounded-full bg-sage text-[#2e3b2e] px-8 py-3 text-lg border border-sage-deep shadow-[3px_4px_0_0_rgba(109,143,107,0.4)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform disabled:opacity-60 cursor-pointer"
        >
          {watering ? "watering…" : "water it 🫗"}
        </button>
      ) : !noteOpen ? (
        <button
          onClick={() => setNoteOpen(true)}
          className="mt-6 rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(74,64,56,0.25)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform cursor-pointer"
        >
          open the note ✉
        </button>
      ) : (
        <>
          <div className="unfold relative mt-6 bg-[#fffdf8] border border-ink/10 rounded-sm px-8 py-6 shadow-[3px_6px_14px_rgba(74,64,56,0.18)] max-w-sm">
            <img src="/dandelion.png" alt="" className="absolute -top-3 -right-3 w-8 pointer-events-none" />
            {/* whatever was tucked in with the note, taped above the words */}
            {media ? (
              media.type === "video" ? (
                <video src={media.url} controls playsInline className="w-full rounded-[3px] mb-4 rotate-[0.5deg]" />
              ) : (
                <img src={media.url} alt="" className="w-full rounded-[3px] mb-4 rotate-[0.5deg]" />
              )
            ) : null}
            <p className="hand text-2xl text-[#2e3b2e] whitespace-pre-wrap text-left leading-snug">{note}</p>
            {from.trim() ? <p className="hand text-xl text-[#64735f] text-right mt-4">— {from}</p> : null}
          </div>
          {song ? <SongCard song={song} /> : null}
        </>
      )}

      {/* the invitation: may this flower live in the public garden? */}
      {invite !== "hidden" && (
        <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={declineInvite}>
          <div
            className="paper-card relative bg-[#fffdf8] max-w-md w-full rounded-3xl p-8 shadow-2xl text-center border border-ink/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={declineInvite}
              aria-label="close"
              className="absolute top-3 right-4 text-ink-soft hover:text-ink text-2xl leading-none cursor-pointer"
            >
              ✕
            </button>
            {invite === "asking" ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/${flower}.png`} alt="" className="h-24 w-auto mx-auto mb-3" />
                <h3 className="hand text-3xl text-ink mb-3">may this flower stay forever?</h3>
                <p className="text-ink-soft leading-relaxed mb-2">
                  there&apos;s a little public garden where flowers like this one live on.
                  anyone wandering by would see your flower and your names —{" "}
                  <span className="text-ink">never your note</span>, that stays yours alone ♡
                </p>
                <p className="text-ink-soft leading-relaxed mb-6">so this memory keeps blooming, forever.</p>
                <button
                  onClick={acceptInvite}
                  className="rounded-full bg-ink text-cream px-8 py-3 text-lg shadow-[3px_4px_0_0_rgba(46,59,46,0.25)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform cursor-pointer"
                >
                  yes, let it live in the garden 🌼
                </button>
                <div className="mt-3">
                  <button onClick={declineInvite} className="text-ink-soft underline underline-offset-4 decoration-ink/30 hover:text-ink transition-colors cursor-pointer">
                    keep it just ours
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="hand text-3xl text-ink mb-3">it&apos;s planted ♡</h3>
                <p className="text-ink-soft leading-relaxed mb-6">
                  your flower now lives in the garden, with your names beside it — for as long as this little corner of the internet stands.
                </p>
                <Link
                  href="/garden"
                  className="rounded-full bg-ink text-cream px-8 py-3 text-lg shadow-[3px_4px_0_0_rgba(46,59,46,0.25)] hover:-translate-y-0.5 transition-transform inline-block"
                >
                  visit the garden →
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* …and then the garden takes the flower in */}
      {joined && (
        <div className="rise mt-8 flex flex-col items-center">
          <div className="flex items-end gap-1">
            {["/flower1.png", "/flower3.png", "/flower5.png", "/flower2.png", "/flower4.png"].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="rise windy w-auto pointer-events-none"
                style={{ height: `${52 + (i % 3) * 16}px`, animationDelay: `${0.15 + i * 0.18}s, ${i * 0.7}s` }}
              />
            ))}
          </div>
          <p className="hand text-2xl text-ink mt-3 max-w-sm" style={{ textShadow: "0 1px 10px rgba(246,239,223,0.7)" }}>
            {bloomedOthers > 0 ? (
              <>your flower has joined the garden, blooming alongside {bloomedOthers} other{bloomedOthers === 1 ? "" : "s"} ♡</>
            ) : (
              <>your flower is the very first bloom in the garden ♡</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
