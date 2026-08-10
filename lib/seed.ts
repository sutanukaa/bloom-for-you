// A seed takes 3 real days to bloom. Growth is pure elapsed time —
// watering is a ritual, not a fertilizer.

export const BLOOM_MS = 3 * 24 * 60 * 60 * 1000;

export type Stage = "seed" | "sprout" | "seedling" | "bud" | "bloom";

// stage boundaries as fractions of the 3 days
const STAGES: [number, Stage][] = [
  [0, "seed"],
  [0.15, "sprout"], // ~11h
  [0.4, "seedling"], // ~29h
  [0.75, "bud"], // ~54h
  [1, "bloom"],
];

export const FLOWERS = ["sunflower", "tulip", "rose", "daisy"] as const;
export type Flower = (typeof FLOWERS)[number];

export function stageAt(plantedAt: string, now = Date.now()): Stage {
  const t = (now - new Date(plantedAt).getTime()) / BLOOM_MS;
  let stage: Stage = "seed";
  for (const [at, s] of STAGES) if (t >= at) stage = s;
  return stage;
}

export function bloomsAt(plantedAt: string): number {
  return new Date(plantedAt).getTime() + BLOOM_MS;
}

// "2 days and 4 hours" — the gentle countdown
export function timeLeft(plantedAt: string, now = Date.now()): string {
  const ms = bloomsAt(plantedAt) - now;
  if (ms <= 0) return "";
  const h = Math.ceil(ms / 3_600_000);
  const days = Math.floor(h / 24);
  const hours = h % 24;
  if (days > 0 && hours > 0) return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours > 1 ? "s" : ""}`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 1) return `${hours} hours`;
  return "less than an hour";
}
