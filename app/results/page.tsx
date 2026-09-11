"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { PredictionCard } from "@/components/prediction-card";
import { ExplainabilityCard } from "@/components/explainability-card";
import { CandidateRanking } from "@/components/candidate-ranking";
import { LightCurveChart } from "@/components/light-curve-chart";
import { SpectrumChart } from "@/components/spectrum-chart";
import { ReportCard } from "@/components/report-card";
import {
  MOCK_PREDICTION,
  MOCK_EXPLAINABILITY,
  MOCK_RANKING,
  MOCK_LIGHT_CURVE,
  MOCK_SPECTRUM,
  MOCK_REPORT,
} from "@/lib/mock-data";

export default function ResultsPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-medium text-[var(--primary)]">
              Analysis Results
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Detection Report
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Complete analysis results for {MOCK_PREDICTION.candidateName} —{" "}
              {MOCK_PREDICTION.hostStar}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
        {/* Prediction */}
        <section>
          <PredictionCard prediction={MOCK_PREDICTION} />
        </section>

        <Separator />

        {/* Explainability + Charts side by side on desktop */}
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-lg font-bold tracking-tight"
            >
              Explainability
            </motion.h2>
            <ExplainabilityCard data={MOCK_EXPLAINABILITY} />
          </div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-lg font-bold tracking-tight"
            >
              Visualizations
            </motion.h2>
            <LightCurveChart data={MOCK_LIGHT_CURVE} />
            <SpectrumChart data={MOCK_SPECTRUM} />
          </div>
        </section>

        <Separator />

        {/* Candidate Ranking */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-lg font-bold tracking-tight"
          >
            Candidate Ranking
          </motion.h2>
          <CandidateRanking candidates={MOCK_RANKING} />
        </section>

        <Separator />

        {/* Report */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-lg font-bold tracking-tight"
          >
            Scientific Report
          </motion.h2>
          <ReportCard report={MOCK_REPORT} />
        </section>
      </div>
    </div>
  );
}
