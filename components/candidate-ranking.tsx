"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  host: string;
  radius: string;
  period: string;
  confidence: number;
  status: "high" | "medium" | "low";
  chips: string[];
}

const candidates: Candidate[] = [
  {
    id: "LC-2024-00847",
    name: "KIC 8462852 b",
    host: "KIC 8462852",
    radius: "1.2 R⊕",
    period: "3.4 days",
    confidence: 98.7,
    status: "high",
    chips: ["Stable periodicity", "Low stellar noise", "Transit symmetry", "Physics validated"],
  },
  {
    id: "LC-2024-00832",
    name: "Kepler-442b analog",
    host: "Kepler-442",
    radius: "2.1 R⊕",
    period: "12.8 days",
    confidence: 96.3,
    status: "high",
    chips: ["Stable periodicity", "Habitable zone orbit", "Transit symmetry"],
  },
  {
    id: "LC-2024-00819",
    name: "Sub-Earth candidate",
    host: "Kepler-186",
    radius: "0.8 R⊕",
    period: "7.1 days",
    confidence: 94.1,
    status: "medium",
    chips: ["Stable periodicity", "Low stellar noise", "Requires follow-up"],
  },
  {
    id: "LC-2024-00803",
    name: "Uncertain — possible EB",
    host: "TOI-700",
    radius: "15.3 R⊕",
    period: "45.2 days",
    confidence: 62.4,
    status: "low",
    chips: ["Eclipsing binary likelihood 38%", "Asymmetric transit", "Secondary eclipse present"],
  },
];

const statusConfig = {
  high: {
    label: "High Priority",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
    Icon: CheckCircle2,
  },
  medium: {
    label: "Needs Follow-up",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    Icon: Clock,
  },
  low: {
    label: "Likely False Positive",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    Icon: AlertTriangle,
  },
};

export function CandidateRanking() {
  return (
    <section id="candidates" className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--primary)]">Ranked candidates</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Candidate Ranking</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] max-w-2xl">
              Every candidate is scored, ranked, and accompanied by the reasoning behind
              its classification. Reasoning chips show the key factors for each.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span>{candidates.length} candidates</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {candidates.map((c, i) => {
            const status = statusConfig[c.status];
            const StatusIcon = status.Icon;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm"
              >
                {/* Left: ID + name + details */}
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-[var(--primary)]">{c.id}</span>
                    <span className="truncate text-sm font-medium">{c.name}</span>
                    <span className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                      {c.host}
                    </span>
                  </div>

                  {/* Details row */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <span className="text-[var(--foreground)]">Radius</span>
                      {c.radius}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[var(--foreground)]">Period</span>
                      {c.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-[var(--primary)]" />
                      <span className={`font-mono ${c.confidence >= 95 ? "text-green-600" : c.confidence >= 80 ? "text-[var(--primary)]" : "text-red-500"}`}>
                        {c.confidence.toFixed(1)}%
                      </span>
                    </span>
                  </div>

                  {/* Reasoning chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded border border-[var(--border)] bg-[var(--secondary)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: status badge */}
                <div className="shrink-0 ml-4">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.border}`}
                  >
                    <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                    {status.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
