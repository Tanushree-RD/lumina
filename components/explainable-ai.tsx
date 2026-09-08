"use client";

import { motion } from "framer-motion";

interface EvidenceRow {
  label: string;
  value: string;
  detail: string;
}

const evidence: EvidenceRow[] = [
  {
    label: "Transit depth",
    value: "186 ppm",
    detail: "Dimming consistent with a planetary body blocking stellar flux.",
  },
  {
    label: "Periodicity",
    value: "3.4 days",
    detail: "Stable, repeating signal with false-alarm probability below 10⁻⁵.",
  },
  {
    label: "Signal-to-noise",
    value: "12.4",
    detail: "Well above the detection threshold of 7.0.",
  },
  {
    label: "Stellar activity",
    value: "None detected",
    detail: "No correlation with S-index or Hα variability.",
  },
  {
    label: "Orbital consistency",
    value: "Verified",
    detail: "Period matches Keplerian motion model.",
  },
];

const featureContributions: { label: string; value: number; pct: number }[] = [
  { label: "Transit depth", value: 82, pct: 32 },
  { label: "Periodicity score", value: 71, pct: 24 },
  { label: "Signal-to-noise", value: 45, pct: 18 },
  { label: "Stellar radius ratio", value: 58, pct: 15 },
  { label: "Absence of stellar activity", value: 92, pct: 11 },
];

const attentionBars = Array.from({ length: 60 }).map((_, i) => {
  const inWindow = i >= 24 && i <= 36;
  const intensity = inWindow
    ? 0.6 + Math.random() * 0.35
    : Math.random() * 0.06 + 0.01;
  return {
    intensity,
    inWindow,
  };
});

export function ExplainableAI() {
  return (
    <section id="explainability" className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-medium text-[var(--primary)]">See the reasoning</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">Explainable Predictions</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] max-w-2xl">
            Every prediction is accompanied by a chain of evidence, feature contributions,
            and an attention map — so you can understand exactly why the model reached its
            conclusion.
          </p>
        </div>

        {/* Story flow: Prediction → Evidence → Feature Contribution → Attention Map → Conclusion */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6">
          {/* Left column: Prediction + Evidence */}
          <div className="flex flex-col gap-4">
            {/* Prediction card */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                  Prediction
                </span>
                <span className="rounded bg-[var(--primary)]/5 border border-[var(--primary)]/20 px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                  LC-2024-00847
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">Exoplanet Candidate</span>
                <span className="text-xs text-green-600 font-medium">98.7% confidence</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                KIC 8462852 — G2V host star
              </p>
            </div>

            {/* Evidence chain */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h4l2-9 4 18 2-9h4" />
                </svg>
                <span className="text-xs font-medium">Evidence</span>
              </div>
              <div className="space-y-2.5">
                {evidence.map((e, i) => (
                  <div key={e.label} className="flex gap-3">
                    <div className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]/10">
                      <span className="text-[9px] font-semibold text-[var(--primary)]">{i + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium whitespace-nowrap">{e.label}</span>
                        <span className="text-xs font-semibold text-green-600">{e.value}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">{e.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Feature Contribution + Attention Map */}
          <div className="flex flex-col gap-4">
            {/* Feature contribution card */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-2 5.5" />
                </svg>
                <span className="text-xs font-medium">Feature Contribution</span>
              </div>
              <div className="space-y-2.5">
                {featureContributions.map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--muted-foreground)]">{f.label}</span>
                      <span className="text-xs font-medium text-green-600">{f.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-[var(--primary)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention map card */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <span className="text-xs font-medium">Attention Map</span>
                <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">t₀ ± 3.0 days</span>
              </div>
              <div className="rounded border border-[var(--border)] bg-[var(--secondary)] p-2">
                <div className="flex gap-0.5">
                  {attentionBars.map((bar, i) => (
                    <div
                      key={i}
                      className={`h-8 w-1 rounded-sm ${bar.inWindow ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]"}`}
                      style={{
                        opacity: bar.intensity,
                        backgroundColor: bar.inWindow
                          ? "rgba(37, 99, 235, 0.9)"
                          : "rgba(107, 114, 128, 0.12)",
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                  <span>−3.0 d</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1.5 rounded-full bg-[var(--primary)]" />
                    <span className="text-[var(--primary)]">Transit window</span>
                  </div>
                  <span>+3.0 d</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700">Conclusion</p>
              <p className="mt-0.5 text-sm text-green-800">
                Combined confidence: 98.7% — exceeds the validation threshold for spectroscopic follow-up submission.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
