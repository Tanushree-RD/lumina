"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ExplanationCardsProps {
  transitDepthPpm: number;
  periodDays: number;
  snr: number;
  cnnScore: number;
  llmScore: number;
}

export function ExplanationCards({
  transitDepthPpm,
  periodDays,
  snr,
  cnnScore,
  llmScore,
}: ExplanationCardsProps) {
  const explanations = [
    {
      title: "Transit depth matches expected exoplanet signature",
      detail: `Depth of ~${transitDepthPpm.toLocaleString()} ppm conforms to sub-stellar planetary disc occultation.`,
    },
    {
      title: "Stable orbital period detected",
      detail: `Phase-folded ephemeris verifies periodic recurrence at P = ${periodDays} days with zero TTV anomaly.`,
    },
    {
      title: "Low stellar variability",
      detail: `High photometric signal-to-noise ratio (${snr.toFixed(1)}) rules out stellar flare and sunspot contamination.`,
    },
    {
      title: "High confidence from CNN and LLM ensemble",
      detail: `1D-ConvNet (${cnnScore}%) and astrophysical validation (${llmScore}%) confirm planetary hypothesis.`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
          Explainability
        </h2>
        <span className="text-[12px] text-[#6B7280]">
          Model Verification Highlights
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {explanations.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="rounded-lg border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-gray-300 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  <Check className="size-3 stroke-[2.5]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#111827] leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed pl-6.5">
                {item.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
