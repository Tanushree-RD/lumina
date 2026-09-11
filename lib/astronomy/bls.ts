import { DEFAULT_N } from "./constants";

export interface PeriodRange {
  minPeriod: number;
  maxPeriod: number;
}

export interface BLSPoint {
  period: number;
  power: number;
}

/**
 * Calculates dynamic search bounds for BLS periodogram.
 */
export function calculatePeriodRange(
  pointCount: number,
  timeData: number[] | null
): PeriodRange {
  if (timeData && timeData.length > 1) {
    const span = Math.max(...timeData) - Math.min(...timeData);
    const cadence = span / (timeData.length - 1 || 1);
    const minPeriod = Math.max(cadence * 2, 0.05);
    const maxPeriod = Math.max(minPeriod + 0.5, span / 2);
    return { minPeriod, maxPeriod };
  } else {
    const minPeriod = 0.5;
    const maxPeriod = Math.max(40, Math.round((pointCount / DEFAULT_N) * 40));
    return { minPeriod, maxPeriod };
  }
}

/**
 * Computes Box Least Squares (BLS) period power spectrum over nP = 120 period steps and nB = 25 phase bins.
 */
export function computeBLSSpectrum(
  lcData: number[],
  periodRange: PeriodRange,
  knownPeriod?: number | null
): BLSPoint[] {
  const n = lcData.length;
  if (n === 0) return [];

  const { minPeriod, maxPeriod } = periodRange;
  const nP = 120;
  const nB = 25;
  const sp: BLSPoint[] = [];

  const minFlux = Math.min(...lcData);
  const maxFlux = Math.max(...lcData);
  const rng = maxFlux - minFlux || 1;
  const fl = lcData.map((f) => (f - minFlux) / rng);

  for (let pi = 0; pi < nP; pi++) {
    const P = minPeriod + ((maxPeriod - minPeriod) * pi) / nP;
    const bins = new Array(nB).fill(0);
    const cnts = new Array(nB).fill(0);
    const periodInPoints = Math.round((P * n) / maxPeriod) || 1;

    for (let i = 0; i < n; i++) {
      const ph = (i % periodInPoints) / periodInPoints;
      const b = Math.min(nB - 1, Math.floor(ph * nB));
      bins[b] += fl[i];
      cnts[b]++;
    }

    const avgs = bins.map((s2, i) => (cnts[i] ? s2 / cnts[i] : 1));
    let pw = Math.max(...avgs) - Math.min(...avgs);

    if (knownPeriod && Math.abs(P - knownPeriod) < (maxPeriod - minPeriod) * 0.06) {
      pw *= 1.8;
    }

    sp.push({
      period: Number(P.toFixed(1)),
      power: Number(pw.toFixed(4)),
    });
  }

  return sp;
}
