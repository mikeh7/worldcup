// Audio has two parts, both from real recorded samples (no tone generators):
//  1. A continuous football-crowd roar looped as the background bed (started on
//     the first user gesture, runs for the whole session).
//  2. A vuvuzela fanfare — only when a WINNER is added. The real vuvuzela blast
//     is played at native pitch as a few overlapping honks in two waves.
//
// Samples (see CREDITS.md):
//  - crowd.ogg     — "Free Crowd Cheering Sounds" by Gregor Quendel, CC BY 4.0
//  - vuvuzela.ogg  — "VUVUZELA 2" by Audioflow (Freesound), CC0

import crowdUrl from "../assets/crowd.ogg";
import vuvuzelaUrl from "../assets/vuvuzela.ogg";

let ctx: AudioContext | null = null;
let master: DynamicsCompressorNode | null = null; // soft limiter so layers don't clip
let ambientStarted = false;

let crowdBuffer: AudioBuffer | null = null;
let vuvBuffer: AudioBuffer | null = null;

function loadSample(c: AudioContext, url: string, set: (b: AudioBuffer) => void): Promise<void> {
  return fetch(url)
    .then((r) => r.arrayBuffer())
    .then((ab) => c.decodeAudioData(ab))
    .then(set)
    .catch(() => {
      /* if a sample fails to load, that layer simply won't play */
    });
}

/**
 * Call from a user gesture (e.g. pressing Enter). Creates/resumes the audio
 * engine, loads the samples, and starts the looping crowd bed.
 */
export function initAudio(): void {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createDynamicsCompressor();
    master.threshold.value = -10;
    master.knee.value = 20;
    master.ratio.value = 4;
    master.attack.value = 0.01;
    master.release.value = 0.25;
    master.connect(ctx.destination);

    loadSample(ctx, crowdUrl, (b) => {
      crowdBuffer = b;
      startAmbientCrowd();
    });
    loadSample(ctx, vuvuzelaUrl, (b) => {
      vuvBuffer = b;
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
  startAmbientCrowd();
}

// Loop the recorded crowd roar as the background bed (its own dynamics provide
// the natural swell/dissipation of a live match).
function startAmbientCrowd(): void {
  if (!ctx || !master || !crowdBuffer || ambientStarted) return;
  ambientStarted = true;
  const now = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = crowdBuffer;
  src.loop = true;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.5, now + 2.5); // ease the crowd in

  src.connect(gain).connect(master);
  src.start(now);
  // Never stopped — the crowd bed runs for the whole session.
}

// One vuvuzela honk: the recorded blast played once at its native pitch.
function vuvuzelaHonk(startOffset: number, gain: number): void {
  if (!ctx || !master || !vuvBuffer) return;
  const src = ctx.createBufferSource();
  src.buffer = vuvBuffer;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g).connect(master);
  src.start(ctx.currentTime + startOffset);
}

/**
 * Winner fanfare: a few real vuvuzela honks at native pitch, overlapping in two
 * waves so it sounds like a handful of fans blowing — not a synthetic tone.
 */
export function playVuvuzelas(): void {
  if (!ctx || !master || !vuvBuffer) return;
  vuvuzelaHonk(0.0, 0.55);
  vuvuzelaHonk(0.35, 0.4); // a second horn overlapping the first
  vuvuzelaHonk(2.4, 0.55); // second wave
  vuvuzelaHonk(2.75, 0.4);
}
