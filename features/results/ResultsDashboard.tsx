"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types";
import { ScoreCards } from "./ScoreCards";
import { DetectionChart } from "./DetectionChart";
import { ExplainabilityBars } from "./ExplainabilityBars";
import { ExplanationCards } from "./ExplanationCards";
import { DetectionSummaryCard } from "./DetectionSummaryCard";
import { ScientificReportCards } from "./ScientificReportCards";
import { generateExoplanetPDF } from "@/lib/pdf-generator";
import { useExoplanetStore } from "@/lib/store";
import { FileDown, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ResultsDashboardProps {
  analysis: AnalysisResult;
}

export function ResultsDashboard({ analysis }: ResultsDashboardProps) {
  const router = useRouter();
  const { lightCurvePoints, resetWorkflow } = useExoplanetStore();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    toast.info("Generating official NASA-standard validation PDF...");
    try {
      await generateExoplanetPDF(analysis);
      toast.success(`Downloaded report for ${analysis.candidate.name}`);
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF document.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleStartNew = () => {
    resetWorkflow();
    router.push("/analyze/light-curve");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <span className="size-1.5 rounded-full bg-[#16A34A]"></span>
              Mission Status: Validated Candidate
            </span>
            <span className="text-[12px] font-mono text-[#6B7280]">
              Mission ID: {analysis.id}
            </span>
          </div>

          <h1 className="text-[30px] font-bold text-[#111827] tracking-tight leading-tight">
            {analysis.candidate.name}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleStartNew}
            className="bg-white hover:bg-gray-50 text-[#111827] border border-[#E5E7EB] font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="size-3.5 text-[#6B7280]" />
            <span>New Detection</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileDown className="size-4" />
            <span>{isGeneratingPdf ? "Building PDF..." : "Download Report"}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (6 Identical White Cards) */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Key Metrics
          </h2>
          <span className="text-[12px] text-[#6B7280]">
            Ensemble Detection Confidence
          </span>
        </div>
        <ScoreCards scores={analysis.scores} />
      </div>

      {/* 3. Large Transit Graph (70% left) & Feature Importance (30% right) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <DetectionChart
            points={lightCurvePoints}
            periodDays={analysis.telemetry.orbitalPeriodDays}
            depthPpm={analysis.telemetry.transitDepthPpm}
            targetName={analysis.candidate.name}
          />
        </div>

        <div className="lg:col-span-3">
          <ExplainabilityBars
            transitDepthPpm={analysis.telemetry.transitDepthPpm}
            periodDays={analysis.telemetry.orbitalPeriodDays}
          />
        </div>
      </div>

      {/* 4. Explainability */}
      <ExplanationCards
        transitDepthPpm={analysis.telemetry.transitDepthPpm}
        periodDays={analysis.telemetry.orbitalPeriodDays}
        snr={analysis.telemetry.snr}
        cnnScore={analysis.scores.cnnScore}
        llmScore={analysis.scores.llmScore}
      />

      {/* 5. Detection Summary */}
      <DetectionSummaryCard
        conclusion={analysis.decisionConclusion}
        candidateName={analysis.candidate.name}
        telemetry={analysis.telemetry}
      />

      {/* 6. Scientific Report (Planet Parameters, Spectroscopy, Model Explanation, Recommendations) */}
      <ScientificReportCards analysis={analysis} />

      {/* 7. Download PDF */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Download Scientific Report
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Export comprehensive peer-reviewed NASA-standard validation PDF dossier with all photometric telemetry and spectroscopic parameters.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleStartNew}
            className="bg-white hover:bg-gray-50 text-[#111827] border border-[#E5E7EB] font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            New Detection
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileDown className="size-4" />
            <span>{isGeneratingPdf ? "Building PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
