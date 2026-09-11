import { MAX_N } from "./constants";

export interface ParsedLightCurveCSV {
  flux: number[];
  times: number[] | null;
  pointCount: number;
}

export interface ParsedSpectrumCSV {
  wls: number[];
  depth: number[];
}

/**
 * Parses light curve CSV (single flux column or time, flux columns).
 * Handles dynamic resampling up to MAX_N points.
 */
export function parseLightCurveCSV(csvText: string): ParsedLightCurveCSV {
  const lines = csvText.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  const flux: number[] = [];
  const times: number[] = [];
  let hasTime = true;

  lines.forEach((l) => {
    // Split by comma, tab, or space
    const parts = l.split(/[,\t]+/).map((x) => x.trim()).filter((x) => x.length > 0);
    if (!parts.length) return;
    const v = parseFloat(parts[parts.length - 1]);
    if (isNaN(v)) return;
    flux.push(v);
    if (parts.length >= 2) {
      const t = parseFloat(parts[0]);
      if (!isNaN(t)) {
        times.push(t);
      } else {
        hasTime = false;
      }
    } else {
      hasTime = false;
    }
  });

  if (flux.length < 50) {
    throw new Error("Light curve requires at least 50 flux values.");
  }

  const validTimes = hasTime && times.length === flux.length ? times : null;
  const t = flux.length;
  let outFlux: number[];
  let outTimes: number[] | null = null;
  let finalN: number;

  if (t <= MAX_N) {
    outFlux = flux;
    outTimes = validTimes;
    finalN = t;
  } else {
    // Resample down to MAX_N points
    outFlux = [];
    if (validTimes) outTimes = [];
    for (let i = 0; i < MAX_N; i++) {
      const p = (i / (MAX_N - 1)) * (t - 1);
      const lo = Math.floor(p);
      const hi = Math.ceil(p);
      const frac = p - lo;
      outFlux.push(flux[lo] + (flux[hi] - flux[lo]) * frac);
      if (validTimes && outTimes) {
        outTimes.push(validTimes[lo] + (validTimes[hi] - validTimes[lo]) * frac);
      }
    }
    finalN = MAX_N;
  }

  return {
    flux: outFlux,
    times: outTimes,
    pointCount: finalN,
  };
}

/**
 * Parses transmission spectrum CSV (wavelength, depth columns).
 */
export function parseSpectrumCSV(csvText: string): ParsedSpectrumCSV {
  const lines = csvText.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  const wls: number[] = [];
  const depth: number[] = [];

  lines.forEach((l) => {
    const parts = l.split(/[,\t]+/).map((x) => x.trim());
    if (parts.length < 2) return;
    const w = parseFloat(parts[0]);
    const d = parseFloat(parts[1]);
    if (!isNaN(w) && !isNaN(d)) {
      wls.push(w);
      depth.push(d);
    }
  });

  if (wls.length < 10) {
    throw new Error("Spectrum requires at least 10 wavelength/depth rows.");
  }

  // Sort ascending by wavelength
  const idx = wls.map((_, i) => i).sort((a, b) => wls[a] - wls[b]);
  return {
    wls: idx.map((i) => wls[i]),
    depth: idx.map((i) => depth[i]),
  };
}
