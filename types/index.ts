export interface LightCurvePoint {
  time: number; // Barycentric Julian Date (days) or phase
  flux: number; // Normalized relative flux
  error?: number;
}

export interface CandidateDataset {
  id: string;
  name: string;
  hostStar: string;
  constellation: string;
  distanceLightYears: number;
  magnitude: number;
  spectralType: string;
  transitDepthPpm: number;
  orbitalPeriodDays: number;
  estimatedRadiusEarth: number;
  estimatedRadiusJupiter?: number;
  snr: number;
  durationHours: number;
  symmetryPercent: number;
  csvPath: string;
  description: string;
  // Astrophysical fields ported from exoplanet-app
  tic?: string;
  mass?: number | null;
  teq?: number | null;
  insolation?: number | null;
  esi?: number | null;
  zone?: string;
  fpProb?: number | null;
  planetProb?: number | null;
  biosigScore?: number | null;
  obs?: string;
  win?: string;
  accent?: string;
  gasAmp?: Record<string, number>;
}

export interface LightCurveTelemetry {
  transitDepthPpm: number;
  orbitalPeriodDays: number;
  dataPointsCount: number;
  snr: number;
  durationHours: number;
  symmetryPercent: number;
  estimatedRadiusEarth: number;
  noiseLevelPpt?: number;
}

export interface SpectrumPoint {
  wavelength: number; // Microns (µm)
  depth: number; // Relative transit depth %
  modelDepth?: number; // Fitted model transit depth %
  error?: number;
}

export interface GasDetection {
  id: string;
  name: string;
  formula: string;
  confidence: number; // 0 - 100
  abundance: number; // ppm or %
  abundanceUnit: "ppm" | "%";
  color: string;
  absorptionPeakMicrons: number;
  explanation: string;
  detected?: boolean;
  biosig?: boolean;
  sig?: number;
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

export interface TrainingConfig {
  learningRate: number;
  epochs: number;
  batchSize: number;
  sampleCount: number;
}

export interface LLMReasoningItem {
  stage: string;
  observation: string;
  status: "verified" | "warning" | "optimal";
  timestamp: string;
}

export interface DetectionScores {
  planetProbability: number; // e.g. 98.6%
  confidenceLevel: "High" | "Moderate" | "Low" | "Very Low" | "Very low";
  falsePositiveRate: number; // e.g. 0.8%
  cnnScore: number; // e.g. 97.4%
  llmScore: number; // e.g. 99.1%
  overallScore: number; // e.g. 98.3%
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0 - 100
  description: string;
}

export interface EvidenceItem {
  label: string;
  passed: boolean;
}

export interface AnalysisResult {
  id: string;
  candidate: CandidateDataset;
  timestamp: string;
  scores: DetectionScores;
  telemetry: LightCurveTelemetry;
  detectedGases: GasDetection[];
  featureImportances: FeatureImportance[];
  llmReasoning: string[];
  decisionConclusion: string;
  recommendations: string[];
  physicsScore?: number;
  biosigScore?: number;
  topFeatures?: string[];
  evidenceList?: EvidenceItem[];
}
