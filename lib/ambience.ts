// Synthesized garden ambience — no audio files. A soft wind bed (looping
// noise through a slowly-breathing lowpass) and occasional little bird
// trills at random intervals and stereo positions.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let birdTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;

export function isAmbienceOn(): boolean {
  return typeof window !== "undefined" && localStorage.getItem("bloom-ambience") === "1";
}

export function ambienceRunning(): boolean {
  return running;
}

function makeNoiseBuffer(a: AudioContext, seconds: number): AudioBuffer {
  const buf = a.createBuffer(1, a.sampleRate * seconds, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// night here = whatever the garden is showing: GardenBackground stamps the
// current period (including ?time= previews and cycle mode) on <html>
function isNight(): boolean {
  const shown = document.documentElement.dataset.garden;
  if (shown) return shown === "night";
  const h = new Date().getHours();
  return h >= 20 || h < 5;
}

// one little trill: 2-5 quick rising chirps on a sine, panned somewhere in the trees
function chirp(a: AudioContext, out: GainNode) {
  const t0 = a.currentTime + 0.05;
  const notes = 2 + Math.floor(Math.random() * 4);
  const pan = a.createStereoPanner();
  pan.pan.value = Math.random() * 1.6 - 0.8;
  pan.connect(out);
  for (let n = 0; n < notes; n++) {
    const t = t0 + n * (0.12 + Math.random() * 0.08);
    const f = 2200 + Math.random() * 1600;
    const osc = a.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(f * (1.25 + Math.random() * 0.4), t + 0.07);
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.035 + Math.random() * 0.02, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    osc.connect(g);
    g.connect(pan);
    osc.start(t);
    osc.stop(t + 0.13);
  }
}

// a cricket: a fast train of tiny high pulses (that classic "chrrp-chrrp")
function cricket(a: AudioContext, out: GainNode) {
  const t0 = a.currentTime + 0.05;
  const pan = a.createStereoPanner();
  pan.pan.value = Math.random() * 1.6 - 0.8;
  pan.connect(out);
  const pulses = 6 + Math.floor(Math.random() * 8);
  const f = 4200 + Math.random() * 500;
  for (let n = 0; n < pulses; n++) {
    const t = t0 + n * 0.036;
    const osc = a.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = a.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.014, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);
    osc.connect(g);
    g.connect(pan);
    osc.start(t);
    osc.stop(t + 0.032);
  }
}

// birds by day, crickets after dark
function scheduleNature(a: AudioContext, out: GainNode) {
  const night = isNight();
  birdTimer = setTimeout(() => {
    if (isNight()) {
      cricket(a, out);
    } else {
      chirp(a, out);
      // sometimes a second bird answers
      if (Math.random() < 0.35) setTimeout(() => running && ctx && master && chirp(ctx, master), 600 + Math.random() * 900);
    }
    if (running) scheduleNature(a, out);
  }, night ? 700 + Math.random() * 1800 : 2500 + Math.random() * 6500);
}

export function startAmbience() {
  if (running) return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  // ease in so it doesn't pop
  master.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

  // wind: looping noise through a lowpass whose cutoff (and level) breathe slowly
  const src = ctx.createBufferSource();
  src.buffer = makeNoiseBuffer(ctx, 4);
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  // cutoff sits high enough to be audible on laptop speakers (pure low
  // rumble disappears on small drivers)
  lp.frequency.value = 750;
  lp.Q.value = 0.4;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.11;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06; // one gust every ~16s
  const lfoToFreq = ctx.createGain();
  lfoToFreq.gain.value = 450; // cutoff sweeps 300..1200Hz — the gust "opens up"
  lfo.connect(lfoToFreq);
  lfoToFreq.connect(lp.frequency);
  const lfoToGain = ctx.createGain();
  lfoToGain.gain.value = 0.05; // level swells with the gust
  lfo.connect(lfoToGain);
  lfoToGain.connect(windGain.gain);

  src.connect(lp);
  lp.connect(windGain);
  windGain.connect(master);
  src.start();
  lfo.start();

  running = true;
  scheduleNature(ctx, master);
  localStorage.setItem("bloom-ambience", "1");
}

export function stopAmbience() {
  running = false;
  if (birdTimer) clearTimeout(birdTimer);
  birdTimer = null;
  if (ctx && master) {
    // fade out, then close
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    const c = ctx;
    setTimeout(() => c.close().catch(() => {}), 1000);
  }
  ctx = null;
  master = null;
  localStorage.setItem("bloom-ambience", "0");
}
