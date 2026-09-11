import { StarDef, FEATURE_LABELS } from "./constants";
import { photoF, allF, GasRetrievalResult } from "./features";
import { predictCNN } from "../tfjs-model";
import { classifyWithLLM } from "../models/llm";

export interface DetectionOutput {
  planetProbability: number;
  falsePositiveRate: number;
  cnnScore: number;
  llmScore: number;
  overallScore: number;
  confidenceLevel: "High" | "Moderate" | "Low" | "Very Low";
  physicsScore: number;
  biosigScore: number;
  decisionExplanation: string;
  topFeatures: string[];
  recommendations: string[];
  evidenceList: Array<{ label: string; passed: boolean }>;
}

/**
 * Runs full ensemble detection: feature extraction, CNN inference, LLM reasoning, and Bayesian synthesis.
 */
export async function runEnsembleDetection(
  rawLC: number[],
  star: StarDef,
  gasResults: GasRetrievalResult[] | null,
  apiKey?: string
): Promise<DetectionOutput> {
  const hasSpectroscopy = gasResults !== null && gasResults.length > 0;
  const numFeatures = hasSpectroscopy ? 32 : 20;
  const feats = allF(rawLC, gasResults).slice(0, numFeatures);

  // 1. LLM Reasoning / Heuristic
  const llmRes = await classifyWithLLM(feats, hasSpectroscopy, apiKey);
  const llmProb = llmRes.probability;

  // 2. CNN Prediction
  const cnnProb = predictCNN(rawLC);

  // 3. Combined Raw
  let combinedRaw: number;
  if (cnnProb != null) {
    combinedRaw = cnnProb * 0.5 + llmProb * 0.5;
  } else {
    combinedRaw = llmProb;
  }

  // 4. Star Prior Blending
  const finalProb =
    star.planetProb != null
      ? combinedRaw * 0.6 + star.planetProb * 0.4
      : combinedRaw;

  const isPlanet = finalProb > 0.5;

  // 5. False Positive Probability
  const fpProb =
    star.fpProb != null
      ? star.fpProb
      : Math.max(0.001, 1 - finalProb);

  // 6. Photometric Physics Checks
  const pf = photoF(rawLC);
  const depth = pf[0];
  const sym = pf[2];
  const flat = pf[3];
  const snr = pf[4] * 40;
  const fp = pf[6];

  const physicsScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (sym * 0.25 + flat * 0.25 + Math.min(snr / 20, 1) * 0.25 + (1 - fp) * 0.25) * 100
      )
    )
  );

  // 7. Biosignature Assessment
  let bsc =
    star.biosigScore != null
      ? star.biosigScore
      : isPlanet
      ? Math.round(finalProb * 65)
      : 5;

  if (hasSpectroscopy && gasResults) {
    const biosigGases = gasResults.filter((g) => g.detected && g.biosig);
    const ss = Math.min(
      100,
      biosigGases.reduce((a, g) => a + Math.min(g.sig * 8, 20), 0)
    );
    const dms = gasResults.find((g) => g.id === "DMS");
    const db = dms && dms.detected ? 15 : 0;
    bsc = Math.min(100, Math.round(bsc * 0.5 + ss * 0.4 + db));
  }

  // 8. Confidence Level
  const confidenceLevel =
    finalProb > 0.85
      ? "High"
      : finalProb > 0.6
      ? "Moderate"
      : finalProb > 0.4
      ? "Low"
      : "Very Low";

  // 9. Top Attributed Features
  const topFeatures = FEATURE_LABELS.slice(0, 20)
    .map((l, i) => ({ label: l, val: pf[i] || 0 }))
    .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
    .slice(0, 3)
    .map((f) => `${f.label} (${f.val.toFixed(3)})`);

  // 10. Recommendations
  const followPriority =
    finalProb > 0.99
      ? "Immediate — request high-priority telescope allocation this cycle"
      : finalProb > 0.95
      ? "High — schedule next available observational window"
      : "Standard observatory queue";

  const recommendations = [
    `Recommended Observatory: ${star.obs || "DOT"} (Observing window: ${star.win || "Upcoming"})`,
    `Confirmation Protocol: ${(star.radius || 2) > 5 ? "Radial velocity + transit photometry" : "High-cadence transit photometry + RV validation"}`,
    `Priority Ranking: ${followPriority}`,
  ];

  // 11. Evidence Checklist
  const evidenceList = [
    {
      label: `Transit depth: ${((star.depth || depth) * 100).toFixed(3)}%`,
      passed: depth > 0.0005,
    },
    {
      label: `Profile morphology: ${flat > 0.5 ? "U-shaped (exoplanet)" : "V-shaped (potential binary)"}`,
      passed: flat > 0.5,
    },
    {
      label: `Bilateral symmetry score: ${(sym * 100).toFixed(0)}%`,
      passed: sym > 0.65,
    },
    {
      label: `Signal-to-noise ratio: ${snr.toFixed(1)}σ`,
      passed: snr > 7,
    },
    {
      label: `Secondary eclipse: ${fp < 0.3 ? "Not detected (no binary contamination)" : "Possible secondary dip detected"}`,
      passed: fp < 0.3,
    },
  ];

  if (hasSpectroscopy && gasResults) {
    const biosigCount = gasResults.filter((g) => g.detected && g.biosig).length;
    evidenceList.push({
      label: `Atmospheric retrieval: ${biosigCount} biomarker gas(es) detected above threshold`,
      passed: biosigCount > 0,
    });
  }

  return {
    planetProbability: Number((finalProb * 100).toFixed(1)),
    falsePositiveRate: Number((fpProb * 100).toFixed(1)),
    cnnScore: Number(((cnnProb ?? finalProb) * 100).toFixed(1)),
    llmScore: Number((llmProb * 100).toFixed(1)),
    overallScore: Number((finalProb * 100).toFixed(1)),
    confidenceLevel,
    physicsScore,
    biosigScore: bsc,
    decisionExplanation: llmRes.reasoning,
    topFeatures,
    recommendations,
    evidenceList,
  };
}
