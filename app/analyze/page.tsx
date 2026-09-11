"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCard } from "@/components/upload-card";
import { CandidateSelector } from "@/components/candidate-selector";
import { LightCurveChart } from "@/components/light-curve-chart";
import { SpectrumGenerator } from "@/components/spectrum-generator";
import { PipelineStepper } from "@/components/pipeline-stepper";
import { PredictionCard } from "@/components/prediction-card";
import {
  MOCK_LIGHT_CURVE,
  MOCK_PREDICTION,
} from "@/lib/mock-data";
import type {
  LightCurveData,
  SpectrumData,
  CandidateInfo,
} from "@/lib/types";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Waves,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const stepMeta = [
  { step: 1 as Step, label: "Upload Light Curve", icon: Upload },
  { step: 2 as Step, label: "Spectrum", icon: Waves },
  { step: 3 as Step, label: "Analysis", icon: BarChart3 },
  { step: 4 as Step, label: "Results", icon: CheckCircle2 },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [lightCurve, setLightCurve] = useState<LightCurveData | null>(null);
  const [spectrum, setSpectrum] = useState<SpectrumData | null>(null);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );

  const goTo = useCallback(
    (next: Step) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step]
  );

  const handleCandidateSelect = useCallback(
    (candidate: CandidateInfo) => {
      setSelectedCandidateId(candidate.id);
      const lc: LightCurveData = {
        ...MOCK_LIGHT_CURVE,
        observations: candidate.observations,
        noiseLevel: candidate.noiseLevel,
        transitDepth: candidate.transitDepth,
        orbitalPeriod: candidate.orbitalPeriod,
        targetName: candidate.hostStar,
      };
      setLightCurve(lc);
    },
    []
  );

  const handleUpload = useCallback((data: LightCurveData) => {
    setLightCurve(data);
    setSelectedCandidateId(null);
  }, []);

  const handleSpectrumComplete = useCallback((data: SpectrumData) => {
    setSpectrum(data);
  }, []);

  const handlePipelineComplete = useCallback(() => {
    setPipelineComplete(true);
    goTo(4);
  }, [goTo]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Stepper header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <div className="flex items-center gap-2">
            {stepMeta.map((s, i) => {
              const isActive = step === s.step;
              const isComplete = step > s.step;
              const Icon = s.icon;

              return (
                <div key={s.step} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`h-px w-6 sm:w-10 ${
                        isComplete
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--border)]"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => {
                      if (isComplete) goTo(s.step);
                    }}
                    disabled={!isComplete && !isActive}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-[var(--primary)]"
                        : isComplete
                          ? "text-[var(--primary)] hover:bg-primary/5 cursor-pointer"
                          : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.step}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* ───── Step 1: Upload ───── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-[var(--primary)]">
                    Step 1
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Upload Light Curve
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Select a preloaded candidate or upload your own CSV data.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <CandidateSelector
                    onSelect={handleCandidateSelect}
                    selectedId={selectedCandidateId}
                  />
                  <UploadCard onUpload={handleUpload} />
                </div>

                {/* Light curve stats */}
                {lightCurve && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <Card>
                        <CardContent className="pt-4 pb-4">
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            Observations
                          </p>
                          <p className="mt-0.5 text-lg font-bold">
                            {lightCurve.observations.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4">
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            Noise Level
                          </p>
                          <p className="mt-0.5 text-lg font-bold">
                            {(lightCurve.noiseLevel * 1e6).toFixed(0)} ppm
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4">
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            Transit Depth
                          </p>
                          <p className="mt-0.5 text-lg font-bold">
                            {(lightCurve.transitDepth * 1e6).toFixed(0)} ppm
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-4">
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            Orbital Period
                          </p>
                          <p className="mt-0.5 text-lg font-bold">
                            {lightCurve.orbitalPeriod.toFixed(2)} days
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <LightCurveChart data={lightCurve} />
                  </motion.div>
                )}

                {/* Next button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => goTo(2)}
                    disabled={!lightCurve}
                    size="lg"
                  >
                    Next
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ───── Step 2: Spectrum ───── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-[var(--primary)]">
                    Step 2
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Transmission Spectrum
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Generate a simulated spectrum or upload a wavelength/depth
                    CSV.
                  </p>
                </div>

                <SpectrumGenerator onComplete={handleSpectrumComplete} />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => goTo(1)}
                    size="lg"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => goTo(3)}
                    disabled={!spectrum}
                    size="lg"
                  >
                    Next
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ───── Step 3: Analysis Pipeline ───── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-[var(--primary)]">
                    Step 3
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Analysis Pipeline
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Running automated analysis through 7 pipeline stages.
                  </p>
                </div>

                <PipelineStepper onComplete={handlePipelineComplete} />

                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    onClick={() => goTo(2)}
                    size="lg"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* ───── Step 4: Results Preview ───── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-[var(--primary)]">
                    Step 4
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Results
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Analysis complete. Review the prediction below.
                  </p>
                </div>

                <PredictionCard prediction={MOCK_PREDICTION} />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => goTo(3)}
                    size="lg"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => router.push("/results")}
                    size="lg"
                  >
                    View Full Results
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
