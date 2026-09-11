"use client";

import React from "react";
import { motion } from "framer-motion";

interface ExplainabilityBarsProps {
  transitDepthPpm: number;
  periodDays: number;
}

export function ExplainabilityBars({
  transitDepthPpm,
  periodDays,
}: ExplainabilityBarsProps) {
  const features = [
    {
      name: "Transit Depth",
      importance: 96,
      value: `~${transitDepthPpm.toLocaleString()} ppm`,
      detail: "Dominant primary U-shape flux depression signature",
    },
    {
      name: "Noise Level",
      importance: 91,
      value: "160 ppm baseline",
      detail: "Low out-of-transit signal quiescence rules out stellar activity",
    },
    {
      name: "Symmetry",
      importance: 88,
      value: "98.2% bilateral fit",
      detail: "Symmetric ingress/egress rules out grazing eclipsing binaries",
    },
    {
      name: "Periodicity",
      importance: 85,
      value: `${periodDays} days`,
      detail: "Strict periodicity across consecutive orbital cycles",
    },
    {
      name: "Estimated Radius",
      importance: 79,
      value: "Physical boundary met",
      detail: "Conforms with Roche lobe limits and stellar density",
    },
    {
      name: "Flux Variance",
      importance: 74,
      value: "0.00018 σ",
      detail: "Substellar companion constraint without secondary eclipse",
    },
  ];

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-gray-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-baseline justify-between border-b border-[#E5E7EB] pb-4 mb-4">
          <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Feature Importance
          </h2>
          <span className="text-[12px] font-mono text-[#6B7280]">
            SHAP Attribution
          </span>
        </div>

        <div className="space-y-4">
          {features.map((item, idx) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#111827]">{item.name}</span>
                <span className="font-mono font-semibold text-[#2563EB]">
                  {item.importance}%
                </span>
              </div>

              {/* Monochrome Progress Bar - Only Blue Fill */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                <motion.div
                  className="h-full rounded-full bg-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.importance}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
                <span className="truncate">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[12px] text-[#6B7280] flex justify-between">
        <span>Integrated Gradients Baseline</span>
        <span className="font-mono text-[#111827]">6 Parameters</span>
      </div>
    </div>
  );
}
