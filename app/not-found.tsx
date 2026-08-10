import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

// A wrong turn in the garden.
export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rise relative">
        <img src="/seed.png" alt="" className="w-36 mx-auto" />
        <img src="/dandelion.png" alt="" className="bob absolute -top-4 -right-6 w-10" />
      </div>

      <h1 className="rise rise-1 hand text-ink text-6xl sm:text-7xl mt-6" style={{ textShadow: "0 1px 10px rgba(246,239,223,0.7)" }}>
        oh no, 404
      </h1>
      <p className="rise rise-2 text-ink-soft text-xl mt-3 max-w-md" style={{ textShadow: "0 1px 8px rgba(246,239,223,0.6)" }}>
        nothing has been planted here — just an empty pot and a lot of possibility.
      </p>

      <div className="rise rise-3 flex flex-wrap items-center justify-center gap-4 mt-10">
        <Link
          href="/"
          className="rounded-full bg-ink text-cream px-8 py-3 text-lg shadow-[3px_4px_0_0_rgba(46,59,46,0.25)] hover:-translate-y-0.5 hover:rotate-[-1deg] transition-transform"
        >
          back to the meadow 🌱
        </Link>
        <Link
          href="/garden"
          className="paper-card rounded-full bg-[#fffdf8]/80 backdrop-blur-sm border border-ink/15 text-ink px-8 py-3 text-lg shadow-[2px_4px_14px_rgba(46,59,46,0.12)] hover:-translate-y-0.5 transition-transform"
        >
          wander the garden 🌼
        </Link>
      </div>
    </main>
  );
}
