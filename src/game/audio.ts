// A self-contained stadium roar, synthesised with the Web Audio API (no audio
// assets shipped). It uses *pink* noise (a warm, natural "wash" rather than the
// hissy white noise) shaped into a low-mid crowd roar, with a rising onset and
// slow surges so it sounds like a real crowd rather than static.

let ctx: AudioContext | null = null;
let pink: AudioBuffer | null = null;

// Pink noise via Paul Kellet's refined method — warmer & less hissy than white.
function makePinkNoise(c: AudioContext): AudioBuffer {
  const len = Math.floor(c.sampleRate * 4);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

/** Call from a user gesture (e.g. pressing Enter) so the browser allows audio. */
export function initAudio(): void {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    pink = makePinkNoise(ctx);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** Play a stadium roar for `durationMs`. intensity > 1 = louder (winners). */
export function playCheer(durationMs = 4500, intensity = 1): void {
  if (!ctx || !pink) return;
  const now = ctx.currentTime;
  const dur = Math.max(1, durationMs / 1000);
  const peak = Math.min(0.5, 0.32 * intensity);
  const stopAt = now + dur + 0.2;

  // Master envelope: quick eruption, sustained roar, gentle fade.
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(peak, now + 0.4); // crowd erupts
  master.gain.setValueAtTime(peak, now + Math.max(0.6, dur - 1.4)); // hold
  master.gain.exponentialRampToValueAtTime(0.0001, now + dur); // dies down
  master.connect(ctx.destination);

  // Body — the main roar. Lowpass tamed (kills hiss); rises on the onset.
  const body = ctx.createBufferSource();
  body.buffer = pink;
  body.loop = true;
  const bodyLP = ctx.createBiquadFilter();
  bodyLP.type = "lowpass";
  bodyLP.Q.value = 0.4;
  bodyLP.frequency.setValueAtTime(700, now);
  bodyLP.frequency.exponentialRampToValueAtTime(2100, now + 0.5); // cheer rises
  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0.9;
  body.connect(bodyLP).connect(bodyGain).connect(master);

  // Rumble — pitched-down layer for low-end weight.
  const rumble = ctx.createBufferSource();
  rumble.buffer = pink;
  rumble.loop = true;
  rumble.playbackRate.value = 0.7;
  const rumbleLP = ctx.createBiquadFilter();
  rumbleLP.type = "lowpass";
  rumbleLP.frequency.value = 500;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.5;
  rumble.connect(rumbleLP).connect(rumbleGain).connect(master);

  // Slow surges so the crowd swells rather than sitting static.
  const surge = ctx.createOscillator();
  surge.frequency.value = 0.45;
  const surgeGain = ctx.createGain();
  surgeGain.gain.value = 0.12;
  surge.connect(surgeGain).connect(bodyGain.gain);

  body.start(now);
  body.stop(stopAt);
  rumble.start(now);
  rumble.stop(stopAt);
  surge.start(now);
  surge.stop(stopAt);
}
