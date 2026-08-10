# bloom for you 🌱

Plant a seed with a secret note inside and send the link to someone.
The plant takes **3 real days** to grow — they can visit and water it,
but the note only opens when it blooms. Anticipation as the product.

## Setup

1. Create a Supabase project, run `schema.sql` in the SQL editor.
2. `.env.local`:
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. `npm install && npm run dev`

## How it works

- Growth is pure elapsed time (`lib/seed.ts`): seed → sprout (~11h) → seedling (~29h) → bud (~54h) → bloom (72h).
- Watering is a ritual, not a fertilizer — it's counted, the plant wiggles, nothing speeds up.
- The note never leaves the server before bloom (`app/p/[id]/page.tsx` only includes it once the stage is `bloom`).
- Plant art is inline SVG per stage (`components/Plant.tsx`) — swap in generated PNGs at `/public/plants/<flower>/<stage>.png` later.
