"use client";

import React from "react";
import Link from "next/link";
import { useExoplanetStore } from "@/lib/store";
import { ResultsDashboard } from "@/features/results/ResultsDashboard";
import { PRESET_CANDIDATES, buildCompleteAnalysis } from "@/lib/mockAnalysis";
import { Telescope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const { currentAnalysis } = useExoplanetStore();

  // If no analysis is loaded, provide clean empty state with quick sample loader
  if (!currentAnalysis) {
    // Generate fallback sample candidate for immediate preview if desired
    const sampleAnalysis = buildCompleteAnalysis(PRESET_CANDIDATES[0], 98.4);

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-md px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center space-y-4"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F8FAFC] text-[#2563EB]">
              <Telescope className="size-6" />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
                No active detection loaded
              </h2>
              <p className="mt-1.5 text-[12px] text-[#6B7280] leading-relaxed">
                Ingest photometric observations from Kepler or TESS to execute the deep learning pipeline, or inspect the validated benchmark detection.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link href="/analyze/light-curve" className="block">
                <button
                  type="button"
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Start New Detection</span>
                  <ArrowRight className="size-4" />
                </button>
              </Link>

              <Link href={`/results/${PRESET_CANDIDATES[0].id}`} className="block">
                <button
                  type="button"
                  className="w-full bg-white hover:bg-gray-50 text-[#111827] border border-[#E5E7EB] font-medium text-[14px] px-4 py-2 rounded-md transition-colors cursor-pointer"
                >
                  View Benchmark Analysis ({PRESET_CANDIDATES[0].name})
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] py-8">
      <div className="mx-auto max-w-[1200px] px-6">
        <ResultsDashboard analysis={currentAnalysis} />
      </div>
    </div>
  );
}
