"use client";

import { motion } from "framer-motion";

const statCards = [
  { label: "Candidates", value: "12,847", change: "+234 today", color: "text-[var(--primary)]" },
  { label: "Confirmed", value: "847", change: "+12 this week", color: "text-green-600" },
  { label: "Processing", value: "1,203", change: "89% complete", color: "text-[var(--primary)]" },
  { label: "Precision", value: "94.2%", change: "+0.3% this week", color: "text-green-600" },
];

const tableRows = [
  { id: "LC-2024-00847", radius: "1.2 R⊕", period: "3.4 days", conf: 98.7 },
  { id: "LC-2024-00832", radius: "2.1 R⊕", period: "12.8 days", conf: 96.3 },
  { id: "LC-2024-00819", radius: "0.8 R⊕", period: "7.1 days", conf: 94.1 },
  { id: "LC-2024-00803", radius: "15.3 R⊕", period: "45.2 days", conf: 62.4 },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--primary)]">Monitoring</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] max-w-2xl">
              Real-time monitoring of detection runs with filterable candidate lists and
              light curve visualization.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span>Live</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          {/* Left column: charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Light curve chart card */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Light Curve — KIC 8462852</span>
                    <span className="rounded bg-green-50 border border-green-200 px-1.5 py-0.5 text-[10px] text-green-600 font-medium">
                      Transit detected
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                    Cadence: 30 min · 21,500 observations
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>Flux</span>
                </div>
              </div>

              <div className="rounded border border-[var(--border)] bg-[var(--secondary)] p-3">
                <div className="relative h-28 overflow-hidden">
                  <svg
                    viewBox="0 0 800 112"
                    className="absolute inset-0 size-full"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="fluxGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
                        <stop offset="45%" stopColor="#2563EB" stopOpacity="0.6" />
                        <stop offset="55%" stopColor="#2563EB" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    {/* Background reference line */}
                    <line
                      x1="0"
                      y1="56"
                      x2="800"
                      y2="56"
                      stroke="#D1D5DB"
                      strokeWidth="0.5"
                    />
                    {/* Main flux signal */}
                    <path
                      d="M0,56 C40,55 80,56 120,56 S200,55 240,56 T320,56 T400,56 C420,56 440,20 460,20 C480,20 500,56 520,56 T600,56 T680,56 T760,56 L800,56"
                      fill="none"
                      stroke="url(#fluxGrad)"
                      strokeWidth="2"
                    />
                    {/* Transit annotation marker */}
                    <rect
                      x="410"
                      y="20"
                      width="2"
                      height="36"
                      fill="#2563EB"
                      fillOpacity="0.15"
                    />
                    <rect
                      x="370"
                      y="20"
                      width="2"
                      height="36"
                      fill="#2563EB"
                      fillOpacity="0.15"
                    />
                    <line
                      x1="370"
                      y1="14"
                      x2="460"
                      y2="14"
                      stroke="#2563EB"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </svg>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                  <span>t₀ − 2.5 days</span>
                  <div className="flex items-center gap-1">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                    </svg>
                    <span className="text-[var(--primary)]">Transit window</span>
                  </div>
                  <span>t₀ + 2.5 days</span>
                </div>
              </div>
            </div>

            {/* Confidence gauge strip */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-medium">Confidence distribution</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">Across 3 active runs</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "KIC 8462852", value: 98.7, pct: 98.7 },
                  { label: "TOI-4519 b", value: 96.3, pct: 96.3 },
                  { label: "Kepler-186 f", value: 94.1, pct: 94.1 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded border border-[var(--border)] bg-[var(--secondary)] p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">
                        transit signal
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs font-semibold text-green-600">{item.value}%</span>
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--secondary)]">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: stats + table */}
          <div className="flex flex-col gap-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[var(--border)] bg-white p-3.5 shadow-sm"
                >
                  <p className="text-[11px] text-[var(--muted-foreground)]">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold">{stat.value}</p>
                  <p className={`mt-0.5 text-[11px] ${stat.color}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Candidates table */}
            <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm">
              <div className="px-3 py-2.5 border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  Recent candidates
                </span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {tableRows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--secondary)] transition-colors"
                  >
                    <span className="shrink-0 text-[10px] font-mono text-[var(--primary)]">
                      {row.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-[var(--muted-foreground)]">
                      {row.radius}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">{row.period}</span>
                    <span
                      className={`text-xs font-medium ${
                        row.conf >= 95 ? "text-green-600" : row.conf >= 80 ? "text-[var(--primary)]" : "text-red-500"
                      }`}
                    >
                      {row.conf.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
