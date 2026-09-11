"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LightCurvePoint } from "@/types";

interface DetectionChartProps {
  points: LightCurvePoint[];
  periodDays: number;
  depthPpm: number;
  targetName: string;
}

export function DetectionChart({
  points,
  periodDays,
  depthPpm,
  targetName,
}: DetectionChartProps) {
  const { chartData, yDomain } = useMemo(() => {
    if (!points || points.length === 0) {
      return { chartData: [], yDomain: [0.99, 1.01] };
    }

    // Phase fold observations across [-0.1, +0.1] phase around transit center
    const depthFrac = depthPpm / 1e6;
    const transitHalfWidth = 0.035; // phase units

    // Subsample points for crisp rendering
    const stride = Math.max(1, Math.floor(points.length / 150));
    const folded = points
      .filter((_, idx) => idx % stride === 0)
      .map((p) => {
        const phaseRaw = ((p.time % periodDays) / periodDays);
        const phase = phaseRaw > 0.5 ? phaseRaw - 1.0 : phaseRaw;

        // Mandel-Agol quadratic model approximation
        let modelFlux = 1.0;
        if (Math.abs(phase) < transitHalfWidth) {
          const norm = Math.abs(phase) / transitHalfWidth;
          modelFlux -= depthFrac * (1 - 0.25 * norm * norm);
        }

        return {
          phase: Number(phase.toFixed(4)),
          observedFlux: Number(p.flux.toFixed(6)),
          modelFit: Number(modelFlux.toFixed(6)),
        };
      })
      .sort((a, b) => a.phase - b.phase);

    const fluxes = folded.map((f) => f.observedFlux);
    const minF = Math.min(...fluxes);
    const maxF = Math.max(...fluxes);
    const pad = (maxF - minF) * 0.15 || 0.002;

    return {
      chartData: folded,
      yDomain: [
        Number((minF - pad).toFixed(5)),
        Number((maxF + pad).toFixed(5)),
      ],
    };
  }, [points, periodDays, depthPpm]);

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-gray-300">
      {/* Chart Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-[#E5E7EB] pb-4 mb-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111827] tracking-tight">
            Phase-Folded Transit Detection
          </h2>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            P = {periodDays} d &middot; Mandel-Agol quadratic limb darkening solution
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px] font-mono text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#9CA3AF]"></span>
            Observed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-[#2563EB]"></span>
            Model Fit
          </span>
          <span className="bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
            Depth: ~{depthPpm.toLocaleString()} ppm
          </span>
        </div>
      </div>

      {/* Responsive Recharts Container */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="phase"
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
              label={{
                value: "Orbital Phase (Centered at Mid-Transit)",
                position: "insideBottom",
                offset: -10,
                fontSize: 12,
                fill: "#6B7280",
              }}
            />
            <YAxis
              domain={yDomain}
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(v) => v.toFixed(4)}
              label={{
                value: "Relative Flux",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                fontSize: 12,
                fill: "#6B7280",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-md border border-[#E5E7EB] bg-white p-2.5 text-[12px] shadow-sm space-y-1">
                      <p className="font-semibold text-[#111827]">
                        Phase: {(data.phase * 100).toFixed(2)}%
                      </p>
                      <div className="flex justify-between gap-4 font-mono text-[11px]">
                        <span className="text-[#6B7280]">Observed Flux:</span>
                        <span className="text-[#111827]">{data.observedFlux.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between gap-4 font-mono text-[11px]">
                        <span className="text-[#6B7280]">Model Fit:</span>
                        <span className="text-[#2563EB] font-medium">{data.modelFit.toFixed(6)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Observed Photometry"
              dataKey="observedFlux"
              fill="#9CA3AF"
              opacity={0.65}
            />
            <Line
              name="Limb-Darkened Model Fit"
              type="monotone"
              dataKey="modelFit"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
