"use client";

import React from "react";
import { DetectionScores } from "@/types";
import { motion } from "framer-motion";

interface ScoreCardsProps {
  scores: DetectionScores;
}

export function ScoreCards({ scores }: ScoreCardsProps) {
  const cards = [
    {
      label: "Planet Probability",
      value: `${scores.planetProbability}%`,
      description: "Bayesian likelihood",
      valueColor: "text-[#2563EB]",
    },
    {
      label: "Confidence",
      value: scores.confidenceLevel,
      description: "Multi-instrument validation",
      valueColor: scores.confidenceLevel === "High" ? "text-[#16A34A]" : "text-[#2563EB]",
    },
    {
      label: "False Positive Rate",
      value: `${scores.falsePositiveRate}%`,
      description: "Eclipsing binary probability",
      valueColor: scores.falsePositiveRate > 5 ? "text-[#DC2626]" : "text-[#111827]",
    },
    {
      label: "CNN Score",
      value: `${scores.cnnScore}%`,
      description: "1D-ConvNet classifier",
      valueColor: "text-[#2563EB]",
    },
    {
      label: "LLM Physics Score",
      value: `${scores.llmScore}%`,
      description: "Astrophysical consistency",
      valueColor: "text-[#2563EB]",
    },
    {
      label: "Overall Score",
      value: `${scores.overallScore}%`,
      description: "Composite ensemble index",
      valueColor: "text-[#2563EB]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: idx * 0.03 }}
          className="rounded-lg border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-gray-300"
        >
          <div className="text-[12px] font-medium text-[#6B7280] truncate">
            {card.label}
          </div>
          <div className={`mt-1.5 font-mono text-[26px] font-bold tracking-tight leading-none ${card.valueColor}`}>
            {card.value}
          </div>
          <div className="mt-1.5 text-[12px] text-[#6B7280] truncate">
            {card.description}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
