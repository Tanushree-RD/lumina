"use client";

import React from "react";
import { AnalysisResult } from "@/types";
import { Check } from "lucide-react";

interface ScientificReportCardsProps {
  analysis: AnalysisResult;
}

export function ScientificReportCards({ analysis }: ScientificReportCardsProps) {
  const { candidate, telemetry, detectedGases, recommendations } = analysis;

  const stellarParams = [
    { label: "Host Star", value: candidate.hostStar },
    { label: "Spectral Type", value: candidate.spectralType },
    { label: "Constellation", value: candidate.constellation },
    { label: "Distance", value: `${candidate.distanceLightYears} ly` },
    { label: "Visual Magnitude", value: `${candidate.magnitude} mag` },
  ];

  const planetaryParams = [
    { label: "Orbital Period", value: `${candidate.orbitalPeriodDays} days` },
    { label: "Transit Depth", value: `~${candidate.transitDepthPpm.toLocaleString()} ppm` },
    {
      label: "Radius",
      value: `${candidate.estimatedRadiusEarth} R⊕${
        candidate.estimatedRadiusJupiter ? ` (${candidate.estimatedRadiusJupiter} RJup)` : ""
      }`,
    },
    { label: "Transit Duration", value: `${candidate.durationHours} hours` },
    { label: "Transit Symmetry", value: `${candidate.symmetryPercent}%` },
    { label: "Photometric SNR", value: `${telemetry.snr}` },
  ];

  const modelExplanations = [
    {
      title: "1D Convolutional Neural Network (CNN)",
      detail:
        "Deep residual 1D-ConvNet extracts morphology of transit ingress and egress while robustly suppressing high-frequency photometric noise.",
    },
    {
      title: "Limb Darkening Solution Inversion",
      detail:
        "Mandel-Agol analytic model minimizes χ² residuals against quadratic stellar limb darkening parameters (u₁=0.34, u₂=0.18).",
    },
    {
      title: "Eclipsing Binary Disqualification",
      detail:
        "Absence of secondary eclipse depth asymmetry and V-shaped transit profiles strictly rules out grazing stellar binary contamination.",
    },
    {
      title: "Thermodynamic & Roche Lobe Boundary",
      detail:
        "Deduced planetary radius and bulk density conform to astrophysical boundary conditions within host star Roche limits.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
          Scientific Report
        </h2>
        <span className="text-[12px] text-[#6B7280]">
          Comprehensive Astrophysical Dossier
        </span>
      </div>

      {/* 1. Planet Parameters */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h3 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Planet Parameters
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Host star astrophysics, orbital mechanics, and companion physical constraints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stellar System */}
          <div className="space-y-2.5">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Stellar System
            </div>
            <div className="rounded-md border border-[#E5E7EB] divide-y divide-[#E5E7EB] bg-[#F8FAFC]">
              {stellarParams.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-3.5 py-2.5 text-[14px]">
                  <span className="text-[#6B7280] text-[12px]">{item.label}</span>
                  <span className="font-mono font-medium text-[#111827]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Planetary Dynamics */}
          <div className="space-y-2.5">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Planetary Dynamics
            </div>
            <div className="rounded-md border border-[#E5E7EB] divide-y divide-[#E5E7EB] bg-[#F8FAFC]">
              {planetaryParams.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-3.5 py-2.5 text-[14px]">
                  <span className="text-[#6B7280] text-[12px]">{item.label}</span>
                  <span className="font-mono font-medium text-[#111827]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Atmospheric Spectroscopy (Chemical Inventory) */}
      {detectedGases && detectedGases.length > 0 && (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 space-y-4">
          <div className="border-b border-[#E5E7EB] pb-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827] tracking-tight">
                Atmospheric Transmission Spectroscopy
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Molecular absorption band detections & biomarker chemical inventory
              </p>
            </div>
            <span className="text-[12px] font-mono text-[#6B7280]">
              {detectedGases.filter((g) => g.confidence >= 70).length} of {detectedGases.length} Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {detectedGases.map((gas) => {
              const isHigh = gas.confidence >= 75;
              return (
                <div
                  key={gas.id}
                  className="rounded-lg border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-gray-300 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-[16px] font-bold text-[#111827]">
                          {gas.formula}
                        </div>
                        <div className="text-[12px] text-[#6B7280]">
                          {gas.name}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                          isHigh
                            ? "bg-emerald-50 text-[#16A34A] border border-emerald-200"
                            : "bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]"
                        }`}
                      >
                        {gas.confidence}% Conf.
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between text-[12px]">
                      <span className="text-[#6B7280]">Abundance</span>
                      <span className="font-mono font-medium text-[#111827]">
                        {gas.abundance} {gas.abundanceUnit}
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${Math.min(100, Math.max(10, gas.confidence))}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] text-[12px] text-[#6B7280]">
                    <div className="flex justify-between font-mono text-[11px] text-[#6B7280] mb-1">
                      <span>Band</span>
                      <span>λ = {gas.absorptionPeakMicrons} µm</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed">
                      {gas.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Model Explanation */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h3 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Model Explanation
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Methodology, neural feature attribution, and astrophysical constraint verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelExplanations.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  <Check className="size-3 stroke-[2.5]" />
                </div>
                <h4 className="text-[14px] font-medium text-[#111827]">
                  {item.title}
                </h4>
              </div>
              <p className="text-[12px] text-[#6B7280] leading-relaxed pl-6">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recommended Follow-up */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 transition-colors hover:border-gray-300 space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h3 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Recommended Follow-up
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Prioritized observational protocols for independent scientific confirmation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 flex items-start gap-3 transition-colors hover:border-gray-300"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded border border-[#E5E7EB] bg-white text-[12px] font-mono font-bold text-[#2563EB]">
                {i + 1}
              </div>
              <p className="text-[14px] text-[#111827] leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
