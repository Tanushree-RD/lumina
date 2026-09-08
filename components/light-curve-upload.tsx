"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";

const acceptedTypes = ["CSV", "FITS", "HDF5"];
const sampleObservations: Record<string, number> = {
  "kepler-442b.csv": 21500,
  "tess_lc_00847.csv": 18400,
  "coleader_data.fits": 32000,
};

export function LightCurveUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{
    filename: string;
    observations: number;
    ready: boolean;
    progress: number;
  } | null>(null);

  const simulateUpload = useCallback((f: File) => {
    setUploading(true);
    setProgress(0);
    const obs = sampleObservations[f.name] ?? Math.floor(Math.random() * 30000) + 5000;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setUploading(false);
        setProgress(100);
        setUploaded({ filename: f.name, observations: obs, ready: true, progress: 100 });
      } else {
        setProgress(Math.round(p));
      }
    }, 250);
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      const accepted = ["csv", "fits", "hdf5", "txt"];
      if (!accepted.includes(ext)) {
        setFile(null);
        setUploaded(null);
        setProgress(0);
        return;
      }
      setFile(f);
      setUploaded(null);
      setProgress(0);
      simulateUpload(f);
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFile(files[0]);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setUploaded(null);
    setProgress(0);
    setUploading(false);
  }, []);

  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: text */}
          <div className="max-w-md">
            <p className="text-xs font-medium text-[var(--primary)]">Upload your data</p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight">Upload Light Curve</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Upload a CSV containing stellar brightness observations. Lumina will automatically
              detect transit signals and provide explainable predictions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {acceptedTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-md border border-[var(--border)] bg-[var(--secondary)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]"
                >
                  .{type.toLowerCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Right: upload panel */}
          <div
            className={`relative flex w-full shrink-0 cursor-pointer flex-col items-center rounded-xl border transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-[var(--border)] hover:border-primary/40"
            }`}
            style={{ background: "#FFFFFF", maxWidth: "380px" }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".csv,.fits,.hdf5,.txt";
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files?.length) handleFile(files[0]);
              };
              input.click();
            }}
          >
            {uploading ? (
              <>
                <Loader2 className="mt-5 h-6 w-6 animate-spin text-[var(--primary)]" />
                <span className="mt-3 text-sm font-medium">{file?.name ?? "Processing..."}</span>
                <span className="mt-0.5 text-xs text-[var(--muted-foreground)]">Processing light curve data...</span>
              </>
            ) : dragOver ? (
              <>
                <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <span className="mt-3 text-sm font-medium text-[var(--primary)]">Drop file here</span>
              </>
            ) : uploaded ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2">
                  <FileText className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{uploaded.filename}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      {uploaded.observations.toLocaleString()} observations
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-[var(--secondary)]">
                    <div className="h-full w-full rounded-full bg-green-500" style={{ width: "100%" }} />
                  </div>
                  <span className="text-xs text-green-600 font-medium">Ready</span>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)]">
                  <Upload className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <span className="mt-3 text-sm text-[var(--muted-foreground)]">
                  Drag and drop a light curve file here
                </span>
                <span className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  CSV, FITS, HDF5 — up to 500 MB
                </span>
              </>
            )}

            {/* Progress bar */}
            {(uploading || progress > 0) && (
              <div className="mt-4 w-full">
                <div className="mb-1 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                  <span>Uploading</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-0.5 overflow-hidden rounded-full bg-[var(--secondary)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-[var(--primary)]"
                  />
                </div>
              </div>
            )}

            {/* Run Analysis button (shown after upload) */}
            {uploaded && uploaded.ready && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 w-full rounded-lg border border-[var(--border)] bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Run Analysis
              </motion.button>
            )}
          </div>
        </div>

        {/* Quick link */}
        <div className="mt-6 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <a href="#pipeline" className="text-[var(--primary)] hover:underline">
            View pipeline ↗
          </a>
          <span>·</span>
          <a href="#dashboard" className="text-[var(--primary)] hover:underline">
            Explore dashboard ↗
          </a>
        </div>
      </div>
    </section>
  );
}
