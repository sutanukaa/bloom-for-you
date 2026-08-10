// The planter chooses how long the seed takes to bloom — minimum 5 minutes,
// no maximum. Growth stages are fractions of that span; watering is a
// ritual, not a fertilizer.

export const MIN_BLOOM_MS = 5 * 60 * 1000;
export const DEFAULT_BLOOM_MS = 3 * 24 * 60 * 60 * 1000;

export type Stage = "seed" | "sprout" | "seedling" | "bud" | "bloom";

// stage boundaries as fractions of the full wait
const STAGES: [number, Stage][] = [
  [0, "seed"],
  [0.15, "sprout"],
  [0.4, "seedling"],
  [0.75, "bud"],
  [1, "bloom"],
];

export const FLOWERS = ["sunflower", "tulip", "rose", "daisy"] as const;
export type Flower = (typeof FLOWERS)[number];

export function stageAt(plantedAt: string, bloomsAt: string, now = Date.now()): Stage {
  const start = new Date(plantedAt).getTime();
  const end = new Date(bloomsAt).getTime();
  const t = (now - start) / Math.max(end - start, 1);
  let stage: Stage = "seed";
  for (const [at, s] of STAGES) if (t >= at) stage = s;
  return stage;
}

// "2 days and 4 hours" / "25 minutes" — the gentle countdown
export function timeLeft(bloomsAt: string, now = Date.now()): string {
  const ms = new Date(bloomsAt).getTime() - now;
  if (ms <= 0) return "";
  const totalMin = Math.ceil(ms / 60_000);
  if (totalMin < 60) return `${totalMin} minute${totalMin > 1 ? "s" : ""}`;
  const h = Math.ceil(ms / 3_600_000);
  const days = Math.floor(h / 24);
  const hours = h % 24;
  if (days > 0 && hours > 0) return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours > 1 ? "s" : ""}`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  return `${hours} hour${hours > 1 ? "s" : ""}`;
}
