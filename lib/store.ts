import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CandidateDataset,
  LightCurvePoint,
  LightCurveTelemetry,
  SpectrumPoint,
  GasDetection,
  TrainingConfig,
  TrainingMetrics,
  AnalysisResult,
} from "@/types";
import {
  PRESET_CANDIDATES,
  findStarDef,
  generateCandidateSpectrum,
  buildCompleteAnalysis,
} from "./mockAnalysis";
import { DEFAULT_N } from "./astronomy/constants";
import { genLC, noise } from "./astronomy/lightcurve-math";
import { photoF, GasRetrievalResult } from "./astronomy/features";
import { calculatePeriodRange, computeBLSSpectrum, PeriodRange, BLSPoint } from "./astronomy/bls";
import { retrieveAtmos } from "./astronomy/retrieval";
import { getActiveCNNModel } from "./tfjs-model";

interface ExoplanetStore {
  // Step 1: Light Curve
  selectedCandidate: CandidateDataset;
  lightCurvePoints: LightCurvePoint[];
  rawFlux: number[];
  timeData: number[] | null;
  periodRange: PeriodRange;
  blsSpectrum: BLSPoint[];
  telemetry: LightCurveTelemetry;
  isLightCurveLoaded: boolean;
  activeStep: number;

  // Step 2: Spectrum
  spectrumPoints: SpectrumPoint[];
  detectedGases: GasDetection[];
  gasResults: GasRetrievalResult[] | null;
  spectrumR2: number | null;
  isSpectrumGenerated: boolean;

  // Step 3: Training
  trainingConfig: TrainingConfig;
  trainingMetrics: TrainingMetrics[];
  isTraining: boolean;
  isTrainingComplete: boolean;
  trainingSpeedSamplesPerSec: number;
  cnnModelAccuracy: number;
  llmReasoning: string[];
  groqApiKey: string;
  groqModel: string;

  // Step 4: Results
  currentAnalysis: AnalysisResult | null;
  pastAnalyses: AnalysisResult[];

  // Actions
  setActiveStep: (step: number) => void;
  selectCandidate: (candidate: CandidateDataset) => void;
  setCustomLightCurve: (
    points: LightCurvePoint[],
    telemetry: LightCurveTelemetry,
    customName?: string,
    rawFlux?: number[],
    times?: number[] | null
  ) => void;
  generateSpectrum: () => void;
  setCustomSpectrum: (points: SpectrumPoint[], rawWls?: number[], rawDepth?: number[]) => void;
  updateTrainingConfig: (config: Partial<TrainingConfig>) => void;
  startTraining: () => void;
  appendTrainingMetric: (metric: TrainingMetrics, samplesPerSec?: number) => void;
  completeTraining: (valAccuracy: number) => void;
  finalizeAnalysis: () => AnalysisResult;
  resetWorkflow: () => void;
  setGroqApiKey: (key: string) => void;
  setGroqModel: (model: string) => void;
  checkCnnValidity: () => boolean;
}

const defaultCandidate = PRESET_CANDIDATES[0]; // TRAPPIST-1e
const defaultStar = findStarDef(defaultCandidate.id);
const initialRaw = genLC(defaultStar, DEFAULT_N);
const initialPRange = calculatePeriodRange(initialRaw.length, null);
const initialBLS = computeBLSSpectrum(initialRaw, initialPRange, defaultCandidate.orbitalPeriodDays);
const initialPoints: LightCurvePoint[] = initialRaw.map((flux, i) => ({
  time: Number(((i / initialRaw.length) * defaultCandidate.orbitalPeriodDays).toFixed(4)),
  flux: Number(flux.toFixed(6)),
  error: 0.0011,
}));

export const useExoplanetStore = create<ExoplanetStore>()(
  persist(
    (set, get) => ({
      activeStep: 1,
      selectedCandidate: defaultCandidate,
      lightCurvePoints: initialPoints,
      rawFlux: initialRaw,
      timeData: null,
      periodRange: initialPRange,
      blsSpectrum: initialBLS,
      telemetry: {
        transitDepthPpm: defaultCandidate.transitDepthPpm,
        orbitalPeriodDays: defaultCandidate.orbitalPeriodDays,
        dataPointsCount: initialRaw.length,
        snr: defaultCandidate.snr,
        durationHours: defaultCandidate.durationHours,
        symmetryPercent: defaultCandidate.symmetryPercent,
        estimatedRadiusEarth: defaultCandidate.estimatedRadiusEarth,
        noiseLevelPpt: Number((noise(initialRaw) * 1000).toFixed(2)),
      },
      isLightCurveLoaded: true,

      spectrumPoints: [],
      detectedGases: [],
      gasResults: null,
      spectrumR2: null,
      isSpectrumGenerated: false,

      trainingConfig: {
        learningRate: 0.001,
        epochs: 15,
        batchSize: 32,
        sampleCount: 600,
      },
      trainingMetrics: [],
      isTraining: false,
      isTrainingComplete: false,
      trainingSpeedSamplesPerSec: 0,
      cnnModelAccuracy: 0,
      llmReasoning: [],
      groqApiKey: "",
      groqModel: "llama-3.1-8b-instant",

      currentAnalysis: null,
      pastAnalyses: [],

      setActiveStep: (step: number) => set({ activeStep: step }),

      setGroqApiKey: (key: string) => set({ groqApiKey: key }),
      setGroqModel: (model: string) => set({ groqModel: model }),

      checkCnnValidity: () => {
        const { rawFlux } = get();
        const { trainedN } = getActiveCNNModel();
        return trainedN === rawFlux.length;
      },

      selectCandidate: (candidate: CandidateDataset) => {
        const star = findStarDef(candidate.id);
        const raw = genLC(star, DEFAULT_N);
        const pRange = calculatePeriodRange(raw.length, null);
        const bls = computeBLSSpectrum(raw, pRange, star.period);

        const points: LightCurvePoint[] = raw.map((flux, i) => ({
          time: Number(((i / raw.length) * (candidate.orbitalPeriodDays || 6.1)).toFixed(4)),
          flux: Number(flux.toFixed(6)),
          error: 0.0011,
        }));

        const nz = noise(raw);
        const pf = photoF(raw);

        set({
          selectedCandidate: candidate,
          lightCurvePoints: points,
          rawFlux: raw,
          timeData: null,
          periodRange: pRange,
          blsSpectrum: bls,
          telemetry: {
            transitDepthPpm: candidate.transitDepthPpm,
            orbitalPeriodDays: candidate.orbitalPeriodDays,
            dataPointsCount: raw.length,
            snr: Number((pf[4] * 40).toFixed(1)),
            durationHours: candidate.durationHours,
            symmetryPercent: Number((pf[2] * 100).toFixed(1)),
            estimatedRadiusEarth: candidate.estimatedRadiusEarth,
            noiseLevelPpt: Number((nz * 1000).toFixed(2)),
          },
          isLightCurveLoaded: true,
          // Reset downstream steps when candidate changes
          isSpectrumGenerated: false,
          spectrumPoints: [],
          detectedGases: [],
          gasResults: null,
          spectrumR2: null,
          isTrainingComplete: false,
          trainingMetrics: [],
          currentAnalysis: null,
        });
      },

      setCustomLightCurve: (points, telemetry, customName, rawFlux, times) => {
        const flux = rawFlux && rawFlux.length > 0
          ? rawFlux
          : points.map((p) => p.flux);

        const timeArr = times ?? (points.some((p) => p.time > 0) ? points.map((p) => p.time) : null);
        const pRange = calculatePeriodRange(flux.length, timeArr);
        const bls = computeBLSSpectrum(flux, pRange, telemetry.orbitalPeriodDays);
        const pf = photoF(flux);
        const nz = noise(flux);

        const candidate: CandidateDataset = {
          id: `custom-${Date.now().toString().slice(-4)}`,
          name: customName || "Uploaded Target",
          hostStar: "Custom Observatory Target",
          constellation: "Field Target",
          distanceLightYears: 0,
          magnitude: 12.0,
          spectralType: "Custom Photometric Source",
          transitDepthPpm: telemetry.transitDepthPpm,
          orbitalPeriodDays: telemetry.orbitalPeriodDays,
          estimatedRadiusEarth: telemetry.estimatedRadiusEarth,
          snr: Number((pf[4] * 40).toFixed(1)),
          durationHours: telemetry.durationHours,
          symmetryPercent: Number((pf[2] * 100).toFixed(1)),
          csvPath: "",
          description: "Custom user-uploaded transit observation series with dynamically scaled BLS search.",
          obs: "User Observatory",
          win: "Active Target",
          accent: "#2f6fb0",
        };

        set({
          selectedCandidate: candidate,
          lightCurvePoints: points,
          rawFlux: flux,
          timeData: timeArr,
          periodRange: pRange,
          blsSpectrum: bls,
          telemetry: {
            ...telemetry,
            snr: Number((pf[4] * 40).toFixed(1)),
            symmetryPercent: Number((pf[2] * 100).toFixed(1)),
            noiseLevelPpt: Number((nz * 1000).toFixed(2)),
            dataPointsCount: flux.length,
          },
          isLightCurveLoaded: true,
          isSpectrumGenerated: false,
          spectrumPoints: [],
          detectedGases: [],
          gasResults: null,
          spectrumR2: null,
          isTrainingComplete: false,
          trainingMetrics: [],
          currentAnalysis: null,
        });
      },

      generateSpectrum: () => {
        const { selectedCandidate } = get();
        const { points, gases, retrieval } = generateCandidateSpectrum(selectedCandidate.id);
        set({
          spectrumPoints: points,
          detectedGases: gases,
          gasResults: retrieval.gr,
          spectrumR2: Number(retrieval.r2.toFixed(3)),
          isSpectrumGenerated: true,
        });
      },

      setCustomSpectrum: (points, rawWls, rawDepth) => {
        let retrieval: ReturnType<typeof retrieveAtmos>;

        if (rawWls && rawDepth && rawWls.length >= 10) {
          retrieval = retrieveAtmos({ wls: rawWls, depth: rawDepth });
        } else {
          // Fallback to evaluating retrieval across points
          const wls = points.map((p) => p.wavelength);
          const depth = points.map((p) => p.depth / 100);
          retrieval = retrieveAtmos({ wls, depth });
        }

        const gases: GasDetection[] = retrieval.gr.map((g) => ({
          id: g.id.toLowerCase(),
          name: g.name,
          formula: g.label,
          confidence: Math.round(Math.min(100, g.sig * 10)),
          abundance: Number(g.vmr > 10 ? g.vmr.toFixed(0) : g.vmr.toFixed(2)),
          abundanceUnit: "ppm",
          color: g.color,
          absorptionPeakMicrons: g.centers[0],
          explanation: `${g.name} absorption signature at ${g.centers[0].toFixed(2)} µm (~${g.vmr.toFixed(1)} ppm, ${g.sig.toFixed(1)}σ).`,
          detected: g.detected,
          biosig: g.biosig,
          sig: g.sig,
        }));

        set({
          spectrumPoints: points,
          detectedGases: gases,
          gasResults: retrieval.gr,
          spectrumR2: Number(retrieval.r2.toFixed(3)),
          isSpectrumGenerated: true,
        });
      },

      updateTrainingConfig: (config) =>
        set((state) => ({
          trainingConfig: { ...state.trainingConfig, ...config },
        })),

      startTraining: () =>
        set({
          isTraining: true,
          isTrainingComplete: false,
          trainingMetrics: [],
          llmReasoning: [],
        }),

      appendTrainingMetric: (metric, samplesPerSec = 450) =>
        set((state) => ({
          trainingMetrics: [...state.trainingMetrics, metric],
          trainingSpeedSamplesPerSec: samplesPerSec,
        })),

      completeTraining: (valAccuracy: number) => {
        const { telemetry } = get();
        const reasoning = [
          `Transit depth (~${telemetry.transitDepthPpm.toLocaleString()} ppm) is consistent with an exoplanet.`,
          `Out-of-transit noise floor measured at ~${telemetry.noiseLevelPpt || 0.8} ppt.`,
          `Periodicity confirmed across observations (${telemetry.orbitalPeriodDays} d).`,
          `Confidence increased: bilateral symmetry (${telemetry.symmetryPercent}%) rules out grazing binaries.`,
        ];
        set({
          isTraining: false,
          isTrainingComplete: true,
          cnnModelAccuracy: Number((valAccuracy * 100).toFixed(1)),
          llmReasoning: reasoning,
        });
      },

      finalizeAnalysis: () => {
        const { selectedCandidate, cnnModelAccuracy, pastAnalyses } = get();
        const analysis = buildCompleteAnalysis(
          selectedCandidate,
          cnnModelAccuracy > 0 ? cnnModelAccuracy : 97.4
        );
        set({
          currentAnalysis: analysis,
          pastAnalyses: [analysis, ...pastAnalyses.filter((a) => a.id !== analysis.id)],
        });
        return analysis;
      },

      resetWorkflow: () => {
        set({
          activeStep: 1,
          isSpectrumGenerated: false,
          spectrumPoints: [],
          detectedGases: [],
          gasResults: null,
          spectrumR2: null,
          isTrainingComplete: false,
          trainingMetrics: [],
          currentAnalysis: null,
        });
      },
    }),
    {
      name: "lumina-exoplanet-state",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedCandidate: state.selectedCandidate,
        telemetry: state.telemetry,
        rawFlux: state.rawFlux,
        timeData: state.timeData,
        periodRange: state.periodRange,
        blsSpectrum: state.blsSpectrum,
        isLightCurveLoaded: state.isLightCurveLoaded,
        spectrumPoints: state.spectrumPoints,
        detectedGases: state.detectedGases,
        gasResults: state.gasResults,
        spectrumR2: state.spectrumR2,
        isSpectrumGenerated: state.isSpectrumGenerated,
        isTrainingComplete: state.isTrainingComplete,
        cnnModelAccuracy: state.cnnModelAccuracy,
        currentAnalysis: state.currentAnalysis,
        pastAnalyses: state.pastAnalyses,
      }),
    }
  )
);
