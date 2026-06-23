// Sound effects & haptic feedback — kid-friendly audio/ tactile responses
// All sounds generated via Web Audio API (no external files needed)

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Check if user prefers reduced motion/sound
function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --- Sound Generators ---

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  if (prefersReduced()) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playMultiTone(notes: [number, number][], type: OscillatorType = "sine", volume = 0.12) {
  if (prefersReduced()) return;
  try {
    const ctx = getAudioCtx();
    let startTime = ctx.currentTime;
    notes.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);
      gain.gain.setValueAtTime(volume, startTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + delay + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime + delay);
      osc.stop(startTime + delay + 0.35);
    });
  } catch {}
}

// --- Public Sound Effects ---

/** Short click / button tap */
export function playClick() {
  playTone(800, 0.08, "sine", 0.1);
}

/** Correct answer — happy ascending */
export function playCorrect() {
  playMultiTone([[523, 0], [659, 0.1], [784, 0.2]], "sine", 0.12);
}

/** Wrong answer — gentle descending */
export function playWrong() {
  playMultiTone([[400, 0], [350, 0.15]], "triangle", 0.1);
}

/** Level up! — triumphant fanfare */
export function playLevelUp() {
  playMultiTone([
    [523, 0], [659, 0.12], [784, 0.24], [1047, 0.4],
  ], "sine", 0.15);
}

/** XP gained — coin-like ding */
export function playXPGain() {
  playTone(1200, 0.12, "sine", 0.08);
  setTimeout(() => playTone(1500, 0.1, "sine", 0.06), 80);
}

/** Celebration — confetti moment (quiz complete, match complete) */
export function playCelebration() {
  playMultiTone([
    [523, 0], [659, 0.08], [784, 0.16], [1047, 0.24],
    [784, 0.36], [1047, 0.44], [1319, 0.52],
  ], "sine", 0.12);
}

/** Start recording — quick beep */
export function playStartRecording() {
  playTone(600, 0.15, "sine", 0.1);
}

/** Stop recording — descending beep */
export function playStopRecording() {
  playTone(500, 0.15, "sine", 0.1);
  setTimeout(() => playTone(400, 0.12, "sine", 0.08), 100);
}

/** Card flip for match game */
export function playCardFlip() {
  playTone(900, 0.06, "sine", 0.08);
}

/** Match found — happy pair */
export function playMatchFound() {
  playMultiTone([[660, 0], [880, 0.1]], "sine", 0.12);
}

/** Streak bonus */
export function playStreakBonus() {
  playMultiTone([
    [784, 0], [988, 0.1], [1175, 0.2],
  ], "triangle", 0.12);
}

// --- Haptic Feedback ---

export function hapticLight() {
  if (prefersReduced()) return;
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch {}
}

export function hapticMedium() {
  if (prefersReduced()) return;
  try {
    if (navigator.vibrate) navigator.vibrate(25);
  } catch {}
}

export function hapticHeavy() {
  if (prefersReduced()) return;
  try {
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
  } catch {}
}

export function hapticError() {
  if (prefersReduced()) return;
  try {
    if (navigator.vibrate) navigator.vibrate(50);
  } catch {}
}

export function hapticCelebration() {
  if (prefersReduced()) return;
  try {
    if (navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 20, 30, 50]);
  } catch {}
}