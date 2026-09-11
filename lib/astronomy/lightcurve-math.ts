import { StarDef, DEFAULT_N } from "./constants";

/**
 * Generates synthetic light curve points for a known star candidate.
 */
export function genLC(s: StarDef, n: number = DEFAULT_N): number[] {
  const f: number[] = [];
  const tc = Math.floor(n * 0.5);
  const tw = Math.max(8, Math.round(n * 0.12));
  const depth = s.depth || 0.005;

  for (let i = 0; i < n; i++) {
    let v =
      1 +
      0.0015 * Math.sin((2 * Math.PI * i) / n * 3.2) +
      0.0008 * Math.sin(((2 * Math.PI * i) / n) * 7.8 + 1.1) +
      (Math.random() - 0.5) * 2 * 0.0011;
    const dx = i - tc;
    if (Math.abs(dx) <= tw) {
      v -= depth * Math.max(0, 1 - ((dx * dx) / (tw * tw)) * 1.25);
    }
    f.push(v);
  }
  return f;
}

/**
 * Generates a synthetic light curve for training/validation (positive or negative candidate).
 */
export function genSynthLC(hasTransit: boolean, n: number = DEFAULT_N): number[] {
  const noiseLevel = 0.0008 + Math.random() * 0.002;
  const f: number[] = [];

  for (let i = 0; i < n; i++) {
    f.push(
      1 +
        (0.001 + Math.random() * 0.003) *
          Math.sin(((2 * Math.PI * i) / n) * (1.5 + Math.random() * 5)) +
        (Math.random() - 0.5) * 2 * noiseLevel
    );
  }

  if (hasTransit) {
    const d = 0.0008 + Math.random() * 0.04;
    const c = Math.floor(n * (0.3 + Math.random() * 0.4));
    const w = 5 + Math.floor(Math.random() * 22);
    for (let i = 0; i < n; i++) {
      const dx = i - c;
      if (Math.abs(dx) <= w) {
        f[i] -= d * Math.max(0, 1 - ((dx * dx) / (w * w)) * 1.25);
      }
    }
  } else {
    const t = Math.floor(Math.random() * 3);
    if (t === 0) {
      const c = Math.floor(Math.random() * n);
      const a = 0.002 + Math.random() * 0.015;
      for (let i = Math.max(0, c - 2); i < Math.min(n, c + 20); i++) {
        const x = i - c;
        f[i] += a * Math.exp((-x * x) / 20) * (x >= 0 ? 1 : 0.2);
      }
    } else if (t === 1) {
      const c = Math.floor(n * (0.3 + Math.random() * 0.4));
      const d = 0.001 + Math.random() * 0.025;
      const w = 15 + Math.floor(Math.random() * 30);
      for (let i = Math.max(0, c - w); i < Math.min(n, c + w); i++) {
        f[i] -= d * (1 - Math.abs(i - c) / w);
      }
    }
  }
  return f;
}

/**
 * Computes Median Absolute Deviation (MAD) noise of a flux sequence.
 */
export function noise(f: number[]): number {
  if (!f || f.length === 0) return 0;
  const srt = f.slice().sort((a, b) => a - b);
  const m = srt[Math.floor(srt.length / 2)];
  return f.map((v) => Math.abs(v - m)).reduce((a, b) => a + b, 0) / f.length;
}
