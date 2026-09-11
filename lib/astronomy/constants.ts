export interface GasDef {
  id: string;
  label: string;
  name: string;
  centers: number[];
  width: number;
  color: string;
  biosig: boolean;
}

export const GASES: GasDef[] = [
  { id: "H2O", label: "H₂O", name: "Water vapour", centers: [0.72, 0.94, 1.38, 1.87, 2.70, 6.27], width: 0.055, color: "#2563eb", biosig: true },
  { id: "CO2", label: "CO₂", name: "Carbon dioxide", centers: [1.05, 1.60, 4.26, 14.99], width: 0.065, color: "#c07840", biosig: false },
  { id: "CH4", label: "CH₄", name: "Methane", centers: [1.67, 2.31, 3.31, 7.66], width: 0.055, color: "#8060a0", biosig: true },
  { id: "O3", label: "O₃", name: "Ozone", centers: [0.60, 9.60, 14.27], width: 0.060, color: "#16a34a", biosig: true },
  { id: "O2", label: "O₂", name: "Oxygen", centers: [0.688, 0.762, 1.27], width: 0.012, color: "#b09040", biosig: true },
  { id: "N2O", label: "N₂O", name: "Nitrous oxide", centers: [2.87, 3.90, 7.78, 16.90], width: 0.050, color: "#8a4060", biosig: true },
  { id: "DMS", label: "DMS", name: "Dimethyl sulphide", centers: [3.32, 9.50], width: 0.040, color: "#0d9488", biosig: true },
  { id: "SO2", label: "SO₂", name: "Sulphur dioxide", centers: [7.30, 8.70, 19.30], width: 0.060, color: "#807040", biosig: false },
];

export interface StarDef {
  id: string;
  name: string;
  tic: string;
  period: number | null;
  depth: number | null;
  duration: number | null;
  radius: number | null;
  mass: number | null;
  teq: number | null;
  insolation: number | null;
  esi: number | null;
  zone: string;
  fpProb: number | null;
  planetProb: number | null;
  biosigScore: number | null;
  biosigs: Array<{ l: string; s: string }>;
  obs: string;
  win: string;
  accent: string;
  gasAmp: Record<string, number>;
  distance?: string;
}

export const STARS: Record<string, StarDef> = {
  trappist1e: {
    id: "trappist1e",
    name: "TRAPPIST-1 e",
    tic: "TIC 278956474",
    period: 6.10,
    depth: 0.00497,
    duration: 0.98,
    radius: 0.92,
    mass: 0.69,
    teq: 251,
    insolation: 1.00,
    esi: 0.97,
    zone: "Optimal habitable zone",
    fpProb: 0.004,
    planetProb: 0.996,
    biosigScore: 91,
    biosigs: [
      { l: "H₂O at 1.4 μm", s: "detected" },
      { l: "O₃ at 9.6 μm", s: "tentative" },
      { l: "CO₂ at 15 μm", s: "detected" },
    ],
    obs: "DOT",
    win: "20–26 July 2026",
    accent: "#2f6fb0",
    gasAmp: { H2O: 0.0018, CO2: 0.0008, CH4: 0.0006, O3: 0.0009, O2: 0.0004, N2O: 0.0003, DMS: 0.0002, SO2: 0.0001 },
    distance: "40.7 ly",
  },
  k218b: {
    id: "k218b",
    name: "K2-18 b",
    tic: "TIC 203143317",
    period: 32.94,
    depth: 0.0276,
    duration: 3.25,
    radius: 2.61,
    mass: 8.63,
    teq: 265,
    insolation: 1.14,
    esi: 0.63,
    zone: "Cool edge of habitable zone",
    fpProb: 0.008,
    planetProb: 0.992,
    biosigScore: 88,
    biosigs: [
      { l: "H₂O at 1.4 μm", s: "confirmed" },
      { l: "DMS at 3.3 μm", s: "tentative" },
      { l: "CH₄ at 3.3 μm", s: "detected" },
    ],
    obs: "VBO",
    win: "3–9 September 2026",
    accent: "#6a408a",
    gasAmp: { H2O: 0.0025, CO2: 0.0012, CH4: 0.0014, O3: 0.0004, O2: 0.0002, N2O: 0.0002, DMS: 0.0008, SO2: 0.0001 },
    distance: "124 ly",
  },
  toi700d: {
    id: "toi700d",
    name: "TOI-700 d",
    tic: "TIC 150428135",
    period: 37.42,
    depth: 0.00486,
    duration: 2.97,
    radius: 1.14,
    mass: 1.07,
    teq: 268,
    insolation: 0.86,
    esi: 0.89,
    zone: "Habitable zone",
    fpProb: 0.021,
    planetProb: 0.979,
    biosigScore: 73,
    biosigs: [
      { l: "H₂O at 1.4 μm", s: "detected" },
      { l: "CO₂ at 15 μm", s: "detected" },
      { l: "CH₄ at 3.3 μm", s: "tentative" },
    ],
    obs: "HCT",
    win: "12–18 August 2026",
    accent: "#2f7a4a",
    gasAmp: { H2O: 0.0015, CO2: 0.0009, CH4: 0.0004, O3: 0.0006, O2: 0.0003, N2O: 0.0002, DMS: 0.0001, SO2: 0.0001 },
    distance: "101.4 ly",
  },
  kepler90h: {
    id: "kepler90h",
    name: "Kepler-90 h",
    tic: "TIC 42723189",
    period: 14.44,
    depth: 0.0089,
    duration: 4.13,
    radius: 11.32,
    mass: 2300,
    teq: 163,
    insolation: 0.41,
    esi: 0.08,
    zone: "Cold zone",
    fpProb: 0.052,
    planetProb: 0.948,
    biosigScore: 12,
    biosigs: [
      { l: "No biosignatures above the noise floor", s: "none" },
    ],
    obs: "PARAS",
    win: "5–11 October 2026",
    accent: "#8a6030",
    gasAmp: { H2O: 0.0003, CO2: 0.0008, CH4: 0.0001, O3: 0.0001, O2: 0.0001, N2O: 0.0001, DMS: 0.0001, SO2: 0.0004 },
    distance: "2,840 ly",
  },
};

export const FEATURE_LABELS: string[] = [
  "transit depth (raw flux units)",
  "dip width (fraction of curve below threshold)",
  "symmetry score (0-1)",
  "flat-bottom / U-shape score (0-1)",
  "signal-to-noise ratio (scaled 0-1)",
  "noise level (scaled 0-1)",
  "secondary-eclipse ratio (scaled 0-1)",
  "pre/post shoulder asymmetry (0-1)",
  "skewness (scaled 0-1)",
  "kurtosis (scaled 0-1)",
  "mean minus 5th percentile flux",
  "mean minus 10th percentile flux",
  "interquartile flux spread (scaled)",
  "dip position (fraction along curve)",
  "flux centroid offset (0-1)",
  "flux range (scaled 0-1)",
  "symmetry × SNR (0-1)",
  "depth × SNR (0-1)",
  "inverse secondary-eclipse ratio (0-1)",
  "flatness × SNR (0-1)",
  "H2O gas amplitude (scaled)",
  "CO2 gas amplitude (scaled)",
  "CH4 gas amplitude (scaled)",
  "O3 gas amplitude (scaled)",
  "O2 gas amplitude (scaled)",
  "N2O gas amplitude (scaled)",
  "DMS gas amplitude (scaled)",
  "SO2 gas amplitude (scaled)",
  "CH4/CO2 ratio (scaled)",
  "O3/H2O ratio (scaled)",
  "O2/SO2 ratio (scaled)",
  "DMS amplitude, alt scaling",
];

export const DEFAULT_N = 201;
export const MAX_N = 2000;
export const NS = 280;
