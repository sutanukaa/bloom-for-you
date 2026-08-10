import type { Flower, Stage } from "@/lib/seed";

// The plant art: one painting per stage, blooms per flower, all sharing the
// same pot at the same width so stages line up when they swap.
export function plantSrc(stage: Stage, flower: Flower): string {
  return stage === "bloom" ? `/${flower}.png` : `/${stage}.png`;
}

export function Plant({ stage, flower, className = "w-40" }: { stage: Stage; flower: Flower; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={plantSrc(stage, flower)} alt="" className={`${className} h-auto select-none`} draggable={false} />
  );
}
