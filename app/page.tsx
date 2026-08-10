import Link from "next/link";

export default function Cover() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="rise text-ink-soft tracking-[0.4em] text-sm uppercase mb-4">🌱 welcome 🌱</p>

      <h1 className="rise rise-1 hand text-ink text-5xl sm:text-7xl leading-[0.95]">bloom for you</h1>

      <p className="rise rise-2 text-ink-soft text-xl sm:text-2xl mt-5 leading-relaxed max-w-lg">
        plant a seed with a secret note inside and send it to someone.
        it takes <span className="text-ink">3 real days</span> to grow — they can visit and
        water it, but the note only opens when it blooms.
      </p>

      <p className="rise rise-2 hand text-sage-deep text-xl mt-3">good things take time ♡</p>

      <Link
        href="/plant"
        className="rise rise-3 group mt-10 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-10 py-4 text-xl shadow-[3px_5px_0_0_rgba(46,59,46,0.25)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
      >
        plant a seed
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </main>
  );
}
