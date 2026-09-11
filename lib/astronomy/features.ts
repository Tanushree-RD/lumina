export interface GasRetrievalResult {
  id: string;
  label: string;
  name: string;
  centers: number[];
  width: number;
  color: string;
  biosig: boolean;
  amplitude: number;
  vmr: number;
  detected: boolean;
  sig: number;
}

/**
 * Extracts 20 photometric features from a raw light curve array.
 */
export function photoF(raw: number[]): number[] {
  const n = raw.length;
  if (n === 0) return new Array(20).fill(0);

  const srt = raw.slice().sort((a, b) => a - b);
  const med = srt[Math.floor(n / 2)];
  const f = raw.map((v) => v / (med || 1));
  const mn2 = Math.min(...f);
  const mx = Math.max(...f);
  const rng = mx - mn2 || 1e-9;
  const mean = f.reduce((a, b) => a + b, 0) / n;
  const mi = f.indexOf(mn2);

  const thresh = mean - rng * 0.28;
  const wid = f.filter((v) => v < thresh).length / n;

  const L = f.slice(0, mi).reverse();
  const R = f.slice(mi + 1);
  const sl = Math.min(L.length, R.length, 25);
  let sym = 0;
  for (let i = 0; i < sl; i++) {
    sym += Math.abs((L[i] || mean) - (R[i] || mean));
  }
  sym = sl > 0 ? 1 - sym / (sl * rng) : 0;

  const tri = f.slice(Math.max(0, mi - 8), Math.min(n, mi + 8));
  const flat =
    tri.length > 2 ? 1 - (Math.max(...tri) - Math.min(...tri)) / rng : 0;

  const out = f.filter((_, i) => Math.abs(i - mi) > n * 0.15);
  const om = out.reduce((a, b) => a + b, 0) / (out.length || 1);
  const nz = Math.sqrt(
    out.reduce((a, v) => a + (v - om) ** 2, 0) / (out.length || 1)
  );

  const dep = mean - mn2;
  const snr = nz > 0 ? dep / nz : 0;

  const si = Math.round((mi + n / 2) % n);
  const sw = f.slice(Math.max(0, si - 7), Math.min(n, si + 7));
  const sd = mean - Math.min(...sw);
  const sr = dep > 0 ? sd / dep : 0;

  const pr = f.slice(Math.max(0, mi - 8), Math.max(0, mi - 3));
  const at = f.slice(Math.max(0, mi - 3), Math.min(n, mi + 3));
  const sh =
    Math.abs(
      (pr.length ? pr.reduce((a, b) => a + b, 0) / pr.length : mean) -
        (at.length ? at.reduce((a, b) => a + b, 0) / at.length : mean)
    ) / rng;

  const dfs = f.map((v) => v - mean);
  const sk =
    dfs.reduce((a, v) => a + v ** 3, 0) / (n * (nz ** 3 + 1e-9));
  const kt =
    dfs.reduce((a, v) => a + v ** 4, 0) / (n * (nz ** 4 + 1e-9));

  const p5 = srt[Math.floor(n * 0.05)];
  const p25 = srt[Math.floor(n * 0.25)];
  const p75 = srt[Math.floor(n * 0.75)];

  const wts = f.map((v) => Math.max(0, mean - v));
  const ws = wts.reduce((a, b) => a + b, 0) || 1;
  const ct = wts.reduce((a, w, i) => a + (w * i) / n, 0) / ws;

  return [
    dep,
    wid,
    Math.max(0, Math.min(1, sym)),
    Math.max(0, Math.min(1, flat)),
    Math.min(snr / 40, 1),
    Math.min(nz * 100, 1),
    Math.min(sr / 1.5, 1),
    Math.min(sh, 1),
    Math.min(Math.abs(sk) / 8, 1),
    Math.min(kt / 50, 1),
    mean - p5,
    mean - srt[Math.floor(n * 0.1)],
    Math.min((p75 - p25) * 10, 1),
    mi / n,
    Math.abs(ct - 0.5) * 2,
    Math.min(rng * 20, 1),
    Math.min(sym * Math.min(snr / 15, 1), 1),
    Math.min((dep * snr) / 5, 1),
    1 - Math.min(sr, 1),
    Math.min(flat * Math.min(snr / 10, 1), 1),
  ];
}

/**
 * Extracts 12 spectroscopic features from retrieved gas results.
 */
export function specF(gr: GasRetrievalResult[] | null): number[] {
  if (!gr || gr.length === 0) return new Array(12).fill(0);
  const g = Object.fromEntries(gr.map((r) => [r.id, r.amplitude]));
  const e = 1e-9;
  return [
    Math.min((g.H2O || 0) * 200, 1),
    Math.min((g.CO2 || 0) * 200, 1),
    Math.min((g.CH4 || 0) * 200, 1),
    Math.min((g.O3 || 0) * 200, 1),
    Math.min((g.O2 || 0) * 200, 1),
    Math.min((g.N2O || 0) * 200, 1),
    Math.min((g.DMS || 0) * 200, 1),
    Math.min((g.SO2 || 0) * 200, 1),
    Math.min(((g.CH4 || 0) / ((g.CO2 || 0) + e)) * 2, 1),
    Math.min(((g.O3 || 0) / ((g.H2O || 0) + e)) * 3, 1),
    Math.min((g.O2 || 0) / ((g.SO2 || 0) + e) / 10, 1),
    Math.min((g.DMS || 0) * 500, 1),
  ];
}

/**
 * Combines 20 photometric + 12 spectroscopic features = 32 features.
 */
export function allF(lc: number[], gr: GasRetrievalResult[] | null): number[] {
  return [...photoF(lc), ...specF(gr)];
}
