"use client";

import { motion } from "framer-motion";
import { Database, BarChart3, Brain, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    icon: Database,
    title: "Data Ingestion",
    desc: "Raw light curves from Kepler, TESS, and ground observatories are ingested from the NASA MAST archive. Current corpus: 14.2 TB across 2.4M stellar targets.",
  },
  {
    icon: BarChart3,
    title: "Signal Processing",
    desc: "Each light curve undergoes detrending, normalization, and wavelet decomposition. A Box Least Squares (BLS) periodogram extracts periodicity candidates with a 0.1% false-positive rate.",
  },
  {
    icon: Brain,
    title: "Neural Detection",
    desc: "A 6-layer Transformer model evaluates each candidate, producing a confidence score and generating attention maps that highlight regions of interest in the light curve.",
  },
  {
    icon: CheckCircle2,
    title: "Physics Validation",
    desc: "Predicted candidates are validated against 12 physics constraints — stellar parameters, orbital mechanics, and false-positive classifiers — before being released to the candidate ranking.",
  },
];

export function DetectionPipeline() {
  return (
    <section id="pipeline" className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--primary)]">How it works</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Detection Pipeline
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] max-w-2xl">
              From raw photometry to validated candidates — every step is transparent and
              reproducible. Each stage produces auditable outputs.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span>4 stages</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </div>

        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-[31px] top-0 bottom-0 w-px bg-[var(--border)] sm:left-1/2 sm:-translate-x-1/2" />

          <div className="relative flex gap-12 sm:items-start sm:justify-center lg:justify-start lg:overflow-x-auto lg:px-2">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center shrink-0"
                style={{ width: "168px" }}
              >
                {/* Timeline node */}
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                    i === 0
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] bg-white hover:border-[var(--primary)]/40"
                  }`}
                >
                  <step.icon className="h-4 w-4 text-[var(--primary)]" />
                </div>

                {/* Connector dot between cards (except last) */}
                {i < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 h-2.5 w-0.5 bg-[var(--border)] sm:left-0" />
                )}

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="mt-2 flex max-w-[200px] flex-col rounded-lg border border-[var(--border)] bg-white p-3.5 shadow-sm"
                >
                  <span className="text-[10px] font-medium text-[var(--primary)] uppercase tracking-wide">
                    {i + 1}. {step.title.toUpperCase()}
                  </span>
                  <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
                    {step.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
