let audio: AudioContext | null = null;
let ringTimer = 0;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (window.localStorage.getItem("closcam-sound") === "off") return null;
  if (!audio) audio = new AudioContext();
  if (audio.state === "suspended") void audio.resume();
  return audio;
}

function tone(frequency: number, duration: number, gainValue: number) {
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = frequency;
  osc.type = "sine";
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

export function blip() {
  tone(520, 0.05, 0.03);
}

export function lossTone() {
  tone(180, 0.12, 0.04);
}

export function startRing() {
  stopRing();
  const tick = () => {
    tone(440, 0.12, 0.03);
    window.setTimeout(() => tone(480, 0.12, 0.03), 160);
  };
  tick();
  ringTimer = window.setInterval(tick, 1400);
}

export function stopRing() {
  if (ringTimer) window.clearInterval(ringTimer);
  ringTimer = 0;
}

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("closcam-sound") !== "off";
}

export function setSoundEnabled(on: boolean) {
  window.localStorage.setItem("closcam-sound", on ? "on" : "off");
  if (!on) stopRing();
}
