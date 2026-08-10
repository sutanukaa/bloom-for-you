import type { Flower, Stage } from "@/lib/seed";

export function plantSrc(stage: Stage, flower: Flower): string {
  return stage === "bloom" ? `/${flower}.png` : `/${stage}.png`;
}

// The paintings don't share exact framing: the pot fills ~97% of the image
// width in the soil frames but only ~78% in the sunflower (its leaves stick
// out). Rendering every image at "pot width / fraction" keeps the POT the
// same size on screen, which is what makes stage swaps read as one plant.
// ponytail: eyeballed fractions; re-measure if art is regenerated.
const POT_FRACTION: Record<string, number> = {
  seed: 0.97,
  sprout: 0.97,
  seedling: 0.95,
  bud: 0.92,
  sunflower: 0.78,
  tulip: 0.95,
  rose: 0.95,
  daisy: 0.95,
};

// on-screen width in px for a given pot width
export function plantWidth(stage: Stage, flower: Flower, potPx: number): number {
  const key = stage === "bloom" ? flower : stage;
  return Math.round(potPx / (POT_FRACTION[key] ?? 0.95));
}

export function Plant({ stage, flower, potPx = 150 }: { stage: Stage; flower: Flower; potPx?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={plantSrc(stage, flower)}
      alt=""
      draggable={false}
      className="h-auto select-none"
      style={{ width: plantWidth(stage, flower, potPx) }}
    />
  );
}
