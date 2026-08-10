import { PlantForm } from "@/components/PlantForm";

export default function Cover() {
  return (
    <main className="flex-1 flex flex-col items-center px-6 py-16 text-center">
      <p className="rise text-ink-soft tracking-[0.4em] text-sm uppercase mb-4">🌱 welcome 🌱</p>

      <h1 className="rise rise-1 hand text-ink text-5xl sm:text-7xl leading-[0.95]">bloom for you</h1>

      <p className="rise rise-2 text-ink-soft text-xl sm:text-2xl mt-5 leading-relaxed max-w-lg">
        plant a seed with a secret note inside and send it to someone.
        it takes <span className="text-ink">3 real days</span> to grow — they can visit and
        water it, but the note only opens when it blooms.
      </p>

      <p className="rise rise-2 hand text-sage-deep text-xl mt-3 mb-10">good things take time ♡</p>

      <div className="rise rise-3 w-full flex justify-center">
        <PlantForm />
      </div>
    </main>
  );
}
