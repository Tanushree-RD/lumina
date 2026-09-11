import { GASES, NS, StarDef } from "./constants";
import { GasRetrievalResult } from "./features";

export interface SpecData {
  wls: number[];
  depth: number[];
}

export interface RetrievalResult {
  gr: GasRetrievalResult[];
  r2: number;
  model: number[];
}

/**
 * Evaluates Gaussian absorption profiles across wavelengths.
 */
export function gauss(wls: number[], c: number, w: number, a: number): number[] {
  return wls.map((v) => a * Math.exp(-Math.pow(v - c, 2) / (2 * w * w)));
}

/**
 * Generates synthetic JWST-style transmission spectrum from stellar parameters.
 */
export function genSpecFromStar(s: StarDef): SpecData {
  const depthVal = s.depth || 0.005;
  const wls: number[] = Array.from(
    { length: NS },
    (_, i) => 0.5 + ((20 - 0.5) * i) / (NS - 1)
  );
  const depth: number[] = new Array(NS).fill(depthVal);

  wls.forEach((w, i) => {
    // Rayleigh scattering slope
    depth[i] +=
      depthVal * 0.0007 * Math.pow(w / 1.0, -3.5) * (Math.min(w, 1.5) / 1.5);
  });

  GASES.forEach((g) => {
    const a = (s.gasAmp || {})[g.id] || 0;
    g.centers.forEach((c) => {
      const gVals = gauss(wls, c, g.width, a);
      gVals.forEach((v, i) => {
        depth[i] += v;
      });
    });
  });

  const n = depthVal / 45;
  depth.forEach((_, i) => {
    depth[i] += (Math.random() - 0.5) * 2 * n;
  });

  return { wls, depth };
}

/**
 * Runs 800-iteration gradient descent linear inversion of atmospheric gas templates.
 * Solves for mixing ratios (ppm), signal-to-noise significance, detection status, and model R².
 */
export function retrieveAtmos(spec: SpecData): RetrievalResult {
  const { wls, depth } = spec;
  const n = wls.length;

  const basis = GASES.map((g) => {
    const col = new Array(n).fill(0);
    g.centers.forEach((c) => {
      wls.forEach((w, i) => {
        col[i] += Math.exp(-Math.pow(w - c, 2) / (2 * g.width * g.width));
      });
    });
    return col;
  });

  const cont = new Array(n).fill(1);
  const all = [cont, ...basis];
  const K = all.length;
  let co = new Array(K).fill(0.001);

  // Gradient descent
  for (let it = 0; it < 800; it++) {
    const res = depth.map((_, i) => {
      let m = 0;
      co.forEach((c, k) => {
        m += c * all[k][i];
      });
      return depth[i] - m;
    });

    const grad = co.map((_, k) => {
      let g = 0;
      res.forEach((r, i) => {
        g -= r * all[k][i];
      });
      return g / n;
    });

    co = co.map((c, k) =>
      k === 0 ? c - 0.0001 * grad[k] : Math.max(0, c - 0.0001 * grad[k])
    );
  }

  let ss_r = 0;
  let ss_t = 0;
  const md = depth.reduce((a, b) => a + b, 0) / n;

  depth.forEach((_, i) => {
    let m = 0;
    co.forEach((c, k) => {
      m += c * all[k][i];
    });
    ss_r += Math.pow(depth[i] - m, 2);
    ss_t += Math.pow(depth[i] - md, 2);
  });

  const r2 = Math.max(0, 1 - ss_r / (ss_t || 1e-9));
  const nz = Math.sqrt(ss_r / n);

  const gr: GasRetrievalResult[] = GASES.map((g, i) => {
    const amp = co[i + 1];
    return {
      ...g,
      amplitude: amp,
      vmr: amp * 1e6 * 2.5,
      detected: amp > md * 0.003,
      sig: Math.min(amp / (nz + 1e-9), 10),
    };
  });

  const model = depth.map((_, i) => {
    let m = 0;
    co.forEach((c, k) => {
      m += c * all[k][i];
    });
    return m;
  });

  return { gr, r2, model };
}
