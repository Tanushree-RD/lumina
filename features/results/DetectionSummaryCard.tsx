"use client";

import React from "react";
import { Check } from "lucide-react";
import { LightCurveTelemetry } from "@/types";

interface DetectionSummaryCardProps {
  conclusion: string;
  candidateName: string;
  telemetry: LightCurveTelemetry;
}

export function DetectionSummaryCard({
  conclusion,
  candidateName,
  telemetry,
}: DetectionSummaryCardProps) {
  const summaryMetrics = [
    { label: "Orbital Period", value: `${telemetry.orbitalPeriodDays} d` },
    { label: "Transit Depth", value: `~${telemetry.transitDepthPpm.toLocaleString()} ppm` },
    { label: "Planet Radius", value: `${telemetry.estimatedRadiusEarth} R⊕` },
    { label: "Signal-to-Noise", value: `${telemetry.snr}` },
    { label: "Transit Duration", value: `${telemetry.durationHours} h` },
    { label: "Symmetry Fit", value: `${telemetry.symmetryPercent}%` },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
          Detection Summary
        </h2>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
          <span className="size-1.5 rounded-full bg-[#16A34A]"></span>
          Candidate Confirmed
        </span>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 space-y-4">
        <div>
          <p className="text-[14px] text-[#111827] leading-relaxed">
            {conclusion}
          </p>
        </div>

        {/* Telemetry quick-spec strip */}
        <div className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {summaryMetrics.map((item) => (
              <div key={item.label}>
                <div className="text-[12px] text-[#6B7280]">
                  {item.label}
                </div>
                <div className="font-mono text-[14px] font-medium text-[#111827] mt-0.5">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
