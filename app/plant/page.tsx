import { PlantForm } from "@/components/PlantForm";

/* eslint-disable @next/next/no-img-element */

export default function PlantPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-6 py-14 text-center">
      <h1 className="rise hand text-ink text-4xl sm:text-5xl mb-8">plant a seed</h1>

      {/* the form sits on a garden card — paper on the grass, a butterfly
          resting on the corner, a wildflower leaning against the side */}
      <div className="rise rise-1 relative w-full max-w-xl">
        <div className="bob absolute -top-6 right-10 z-10 pointer-events-none">
          <img src="/butterfly2.png" alt="" className="flap-img w-10" />
        </div>
        <img src="/flower4.png" alt="" className="windy absolute -bottom-2 -left-8 h-28 z-10 pointer-events-none hidden sm:block" style={{ animationDelay: "0.8s" }} />
        <img src="/grass.png" alt="" className="windy absolute -bottom-1 -right-6 h-12 z-10 pointer-events-none hidden sm:block" style={{ animationDelay: "1.4s" }} />

        <div className="paper-card bg-[#fffdf8]/85 backdrop-blur-sm border border-ink/10 rounded-3xl shadow-[4px_8px_24px_rgba(46,59,46,0.14)] p-6 sm:p-10">
          <PlantForm />
        </div>
      </div>
    </main>
  );
}
