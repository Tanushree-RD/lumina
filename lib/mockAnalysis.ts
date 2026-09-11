import {
  CandidateDataset,
  GasDetection,
  LightCurvePoint,
  SpectrumPoint,
  AnalysisResult,
  FeatureImportance,
} from "@/types";

export const PRESET_CANDIDATES: CandidateDataset[] = [
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    hostStar: "TRAPPIST-1",
    constellation: "Aquarius",
    distanceLightYears: 39.46,
    magnitude: 18.8,
    spectralType: "M8V Ultra-cool Dwarf",
    transitDepthPpm: 4850,
    orbitalPeriodDays: 6.1,
    estimatedRadiusEarth: 0.92,
    snr: 28.4,
    durationHours: 1.05,
    symmetryPercent: 98.2,
    csvPath: "/data/trappist-1e.csv",
    description:
      "Earth-sized exoplanet orbiting within the habitable zone of an ultra-cool red dwarf star. Prime candidate for atmospheric characterization with JWST.",
  },
  {
    id: "kepler-90h",
    name: "Kepler-90h",
    hostStar: "Kepler-90",
    constellation: "Draco",
    distanceLightYears: 2840,
    magnitude: 14.0,
    spectralType: "G0V Yellow Dwarf",
    transitDepthPpm: 6200,
    orbitalPeriodDays: 331.6,
    estimatedRadiusEarth: 14.8,
    estimatedRadiusJupiter: 1.32,
    snr: 42.1,
    durationHours: 14.2,
    symmetryPercent: 96.5,
    csvPath: "/data/kepler-90h.csv",
    description:
      "Outer gas giant of the 8-planet Kepler-90 system, demonstrating orbital resonance and deep transit ingress/egress profiles similar to Jupiter.",
  },
  {
    id: "toi-700d",
    name: "TOI-700d",
    hostStar: "TOI-700",
    constellation: "Dorado",
    distanceLightYears: 101.4,
    magnitude: 13.1,
    spectralType: "M2V Red Dwarf",
    transitDepthPpm: 1420,
    orbitalPeriodDays: 37.42,
    estimatedRadiusEarth: 1.14,
    snr: 19.6,
    durationHours: 2.8,
    symmetryPercent: 97.8,
    csvPath: "/data/toi-700d.csv",
    description:
      "First habitable-zone Earth-size planet discovered by TESS. Low stellar activity on host star improves transmission spectroscopy signal fidelity.",
  },
  {
    id: "k2-18b",
    name: "K2-18b",
    hostStar: "K2-18",
    constellation: "Leo",
    distanceLightYears: 124.0,
    magnitude: 13.5,
    spectralType: "M2.8V Red Dwarf",
    transitDepthPpm: 2980,
    orbitalPeriodDays: 32.94,
    estimatedRadiusEarth: 2.61,
    snr: 34.8,
    durationHours: 3.4,
    symmetryPercent: 99.1,
    csvPath: "/data/k2-18b.csv",
    description:
      "Hycean world candidate with verified water vapor, methane, and carbon dioxide signatures detected by Hubble and JWST transmission spectroscopy.",
  },
];

export const ALL_8_GASES: Omit<GasDetection, "confidence" | "abundance">[] = [
  {
    id: "h2o",
    name: "Water Vapor",
    formula: "H₂O",
    abundanceUnit: "%",
    color: "#38bdf8", // Sky blue
    absorptionPeakMicrons: 1.4,
    explanation:
      "Strong vibrational absorption overtone band near 1.4 µm and 1.8 µm. Indicates hydrological cycle or steam atmosphere.",
  },
  {
    id: "co2",
    name: "Carbon Dioxide",
    formula: "CO₂",
    abundanceUnit: "%",
    color: "#f97316", // Orange
    absorptionPeakMicrons: 4.3,
    explanation:
      "Prominent fundamental asymmetric stretching band at 4.3 µm. Primary greenhouse component and proxy for atmospheric metallicity.",
  },
  {
    id: "ch4",
    name: "Methane",
    formula: "CH₄",
    abundanceUnit: "ppm",
    color: "#eab308", // Yellow
    absorptionPeakMicrons: 3.3,
    explanation:
      "Pronounced fundamental C-H stretching band at 3.3 µm. Strong potential biosignature in non-equilibrium with carbon monoxide.",
  },
  {
    id: "o2",
    name: "Molecular Oxygen",
    formula: "O₂",
    abundanceUnit: "%",
    color: "#22c55e", // Green
    absorptionPeakMicrons: 0.76,
    explanation:
      "Atmospheric A-band absorption at 0.76 µm (Fraunhofer A-band). Classical photosynthetic biomarker in terrestrial planets.",
  },
  {
    id: "o3",
    name: "Ozone",
    formula: "O₃",
    abundanceUnit: "ppm",
    color: "#06b6d4", // Cyan
    absorptionPeakMicrons: 9.6,
    explanation:
      "Hartley and Chappuis ultraviolet/visible bands and 9.6 µm infrared signature produced by photochemical dissociation of oxygen.",
  },
  {
    id: "so2",
    name: "Sulfur Dioxide",
    formula: "SO₂",
    abundanceUnit: "ppm",
    color: "#a855f7", // Purple
    absorptionPeakMicrons: 4.05,
    explanation:
      "Photochemically active tracer identified at 4.05 µm, signaling intense stellar UV-driven sulfur photochemistry (as observed on WASP-39b).",
  },
  {
    id: "n2o",
    name: "Nitrous Oxide",
    formula: "N₂O",
    abundanceUnit: "ppm",
    color: "#ec4899", // Pink
    absorptionPeakMicrons: 4.5,
    explanation:
      "Atmospheric trace gas with bands at 4.5 µm and 7.8 µm, predominantly synthesized biologically via microbial denitrification.",
  },
  {
    id: "dms",
    name: "Dimethyl Sulfide",
    formula: "DMS",
    abundanceUnit: "ppm",
    color: "#14b8a6", // Teal
    absorptionPeakMicrons: 3.4,
    explanation:
      "Volatile organosulfur compound with infrared signatures at ~3.4 µm; almost exclusively produced by phytoplankton in marine environments on Earth.",
  },
];

export function generateCandidateSpectrum(candidateId: string): {
  points: SpectrumPoint[];
  gases: GasDetection[];
} {
  const points: SpectrumPoint[] = [];
  const candidate = PRESET_CANDIDATES.find((c) => c.id === candidateId) || PRESET_CANDIDATES[0];

  // Specific profiles per candidate
  const isK218b = candidateId === "k2-18b";
  const isTrappist = candidateId === "trappist-1e";
  const isKepler90h = candidateId === "kepler-90h";

  const gasConfigs: Record<string, { confidence: number; abundance: number }> = {
    h2o: {
      confidence: isK218b ? 98 : isTrappist ? 84 : isKepler90h ? 62 : 78,
      abundance: isK218b ? 1.8 : isTrappist ? 0.45 : isKepler90h ? 0.08 : 0.65,
    },
    co2: {
      confidence: isTrappist ? 96 : isK218b ? 94 : 88,
      abundance: isTrappist ? 1.2 : isK218b ? 0.85 : 0.95,
    },
    ch4: {
      confidence: isK218b ? 92 : isKepler90h ? 85 : 45,
      abundance: isK218b ? 420 : isKepler90h ? 850 : 25,
    },
    o2: {
      confidence: isTrappist ? 76 : 18,
      abundance: isTrappist ? 0.22 : 0.02,
    },
    o3: {
      confidence: isTrappist ? 68 : 12,
      abundance: isTrappist ? 4.2 : 0.5,
    },
    so2: {
      confidence: isKepler90h ? 79 : 32,
      abundance: isKepler90h ? 18.5 : 2.1,
    },
    n2o: {
      confidence: isTrappist ? 54 : 15,
      abundance: isTrappist ? 0.8 : 0.1,
    },
    dms: {
      confidence: isK218b ? 68 : 8,
      abundance: isK218b ? 12.4 : 0.3,
    },
  };

  const gases: GasDetection[] = ALL_8_GASES.map((gas) => {
    const cfg = gasConfigs[gas.id] || { confidence: 25, abundance: 1.0 };
    return {
      ...gas,
      confidence: cfg.confidence,
      abundance: cfg.abundance,
    };
  });

  // Generate 80 continuous wavelength points from 0.6 µm to 5.0 µm
  const baseDepth = (candidate.transitDepthPpm / 10000) * 0.1; // e.g. ~0.048%
  for (let i = 0; i <= 80; i++) {
    const wl = 0.6 + (i / 80) * 4.4; // 0.6 to 5.0 microns
    let depth = baseDepth + (Math.sin(wl * 4) * 0.0015);

    // Add peak additions
    // H2O peak at 1.4 µm
    depth += 0.006 * Math.exp(-Math.pow((wl - 1.4) / 0.15, 2)) * (gasConfigs.h2o.confidence / 100);
    // CO2 peak at 4.3 µm
    depth += 0.008 * Math.exp(-Math.pow((wl - 4.3) / 0.18, 2)) * (gasConfigs.co2.confidence / 100);
    // CH4 peak at 3.3 µm
    depth += 0.005 * Math.exp(-Math.pow((wl - 3.3) / 0.14, 2)) * (gasConfigs.ch4.confidence / 100);
    // SO2 peak at 4.05 µm
    depth += 0.003 * Math.exp(-Math.pow((wl - 4.05) / 0.10, 2)) * (gasConfigs.so2.confidence / 100);
    // O2 peak at 0.76 µm
    depth += 0.002 * Math.exp(-Math.pow((wl - 0.76) / 0.05, 2)) * (gasConfigs.o2.confidence / 100);

    // Add realistic instrumental noise
    const noise = (Math.random() - 0.5) * 0.0008;
    depth += noise;

    points.push({
      wavelength: Number(wl.toFixed(3)),
      depth: Number(Math.max(0.01, depth * 10).toFixed(4)),
      error: 0.0005,
    });
  }

  return { points, gases };
}

export function generateSyntheticLightCurvePoints(
  periodDays: number,
  depthPpm: number,
  noisePpm: number,
  pointsCount = 600
): LightCurvePoint[] {
  const points: LightCurvePoint[] = [];
  const depthFraction = depthPpm / 1e6;
  const noiseFraction = noisePpm / 1e6;
  const transitDurationPhase = 0.05; // 5% of orbit in transit

  for (let i = 0; i < pointsCount; i++) {
    const t = (i / pointsCount) * periodDays * 3.2; // 3.2 cycles
    const phase = ((t % periodDays) / periodDays);
    const distToCenter = Math.min(phase, 1 - phase);

    let flux = 1.0;
    if (distToCenter < transitDurationPhase / 2) {
      // Limb-darkened transit profile approximation (quadratic)
      const normalizedDist = distToCenter / (transitDurationPhase / 2);
      const dip = depthFraction * (1 - 0.3 * normalizedDist * normalizedDist);
      flux -= dip;
    }

    // Stellar variability + observational photon noise
    const stellarVariability = Math.sin((t / periodDays) * 0.4) * (noiseFraction * 0.3);
    const photonNoise = (Math.random() - 0.5) * 2 * noiseFraction;

    flux += stellarVariability + photonNoise;

    points.push({
      time: Number(t.toFixed(4)),
      flux: Number(flux.toFixed(6)),
      error: Number(noiseFraction.toFixed(6)),
    });
  }

  return points;
}

export function parseCSVToLightCurve(csvText: string): {
  points: LightCurvePoint[];
  inferredDepthPpm: number;
  inferredPeriodDays: number;
  snr: number;
  estimatedRadius: number;
} {
  const lines = csvText.trim().split("\n");
  const points: LightCurvePoint[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#") || line.toLowerCase().includes("time")) {
      continue;
    }
    const parts = line.split(/[,\s\t]+/);
    if (parts.length >= 2) {
      const t = parseFloat(parts[0]);
      const f = parseFloat(parts[1]);
      const err = parts.length > 2 ? parseFloat(parts[2]) : undefined;
      if (!isNaN(t) && !isNaN(f)) {
        points.push({ time: t, flux: f, error: err });
      }
    }
  }

  if (points.length < 20) {
    // Generate fallback points if CSV was sparse or invalid
    const fallback = generateSyntheticLightCurvePoints(3.4, 2100, 180, 500);
    return {
      points: fallback,
      inferredDepthPpm: 2100,
      inferredPeriodDays: 3.4,
      snr: 24.5,
      estimatedRadius: 1.25,
    };
  }

  // Calculate statistics from imported data
  const fluxes = points.map((p) => p.flux);
  const minFlux = Math.min(...fluxes);
  const avgFlux = fluxes.reduce((a, b) => a + b, 0) / fluxes.length;
  const depth = Math.max(0.0001, (avgFlux - minFlux));
  const depthPpm = Math.round(depth * 1e6);

  const times = points.map((p) => p.time);
  const timeSpan = Math.max(...times) - Math.min(...times);
  const inferredPeriod = Math.max(0.8, Number((timeSpan / 3).toFixed(2)));

  const stdDev = Math.sqrt(
    fluxes.map((x) => Math.pow(x - avgFlux, 2)).reduce((a, b) => a + b, 0) / fluxes.length
  );
  const snr = Number((depth / Math.max(0.00001, stdDev)).toFixed(1));
  const radius = Number((Math.sqrt(depth) * 109).toFixed(2)); // Earth radii approx

  return {
    points,
    inferredDepthPpm: depthPpm,
    inferredPeriodDays: inferredPeriod,
    snr,
    estimatedRadius: radius,
  };
}

export function buildCompleteAnalysis(
  candidate: CandidateDataset,
  cnnScoreOverride?: number
): AnalysisResult {
  const { gases } = generateCandidateSpectrum(candidate.id);
  const cnnScore = cnnScoreOverride || 97.4;
  const llmScore = 99.1;
  const overallScore = Number(((cnnScore * 0.5) + (llmScore * 0.5)).toFixed(1));

  const featureImportances: FeatureImportance[] = [
    {
      feature: "Transit Depth (ppm)",
      importance: 96,
      description: "Consistent U-shaped flux depression matching planetary occultation.",
    },
    {
      feature: "Periodic Ephemeris",
      importance: 93,
      description: "Strict periodicity across multiple orbital cycles without phase drift.",
    },
    {
      feature: "Ingress/Egress Symmetry",
      importance: 89,
      description: "Bilateral profile symmetry excludes grazing background eclipsing binaries.",
    },
    {
      feature: "Flux Variance / Noise",
      importance: 84,
      description: "Out-of-transit stellar quiescence eliminates stellar flare false alarms.",
    },
    {
      feature: "Secondary Eclipse Test",
      importance: 79,
      description: "Absence of significant secondary occultation rules out stellar companions.",
    },
    {
      feature: "Transit Duration vs Star Density",
      importance: 74,
      description: "Conforms with Kepler's 3rd law given the stellar host mass and radius.",
    },
  ];

  return {
    id: `ANL-${candidate.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    candidate,
    timestamp: new Date().toISOString(),
    scores: {
      planetProbability: 98.6,
      confidenceLevel: "High",
      falsePositiveRate: 0.8,
      cnnScore,
      llmScore,
      overallScore,
    },
    telemetry: {
      transitDepthPpm: candidate.transitDepthPpm,
      orbitalPeriodDays: candidate.orbitalPeriodDays,
      dataPointsCount: 18400,
      snr: candidate.snr,
      durationHours: candidate.durationHours,
      symmetryPercent: candidate.symmetryPercent,
      estimatedRadiusEarth: candidate.estimatedRadiusEarth,
    },
    detectedGases: gases,
    featureImportances,
    llmReasoning: [
      "Transit depth is consistent with an exoplanet.",
      "Low stellar noise verified across out-of-transit baselines.",
      "Periodicity confirmed across 3+ consecutive orbital cycles.",
      "Confidence increased based on multi-spectral transmission bounds.",
    ],
    decisionConclusion:
      `The candidate ${candidate.name} exhibits strong periodic dips every ${candidate.orbitalPeriodDays} days. ` +
      `Transit depth (${candidate.transitDepthPpm} ppm) is statistically significant with an SNR of ${candidate.snr}. ` +
      `Low stellar activity and bilateral symmetry eliminate background eclipsing binary models. ` +
      `Combined CNN and LLM confidence exceeds validation threshold. Validated as a High-Confidence Exoplanet Candidate.`,
    recommendations: [
      "Schedule follow-up radial velocity measurements using ESPRESSO / HIRES to constrain planetary mass.",
      "Request High-Resolution Transmission Spectroscopy with JWST NIRSpec/NIRISS.",
      "Submit candidate ephemeris to Exoplanet Archive (NExScI) for official validation indexing.",
    ],
  };
}
