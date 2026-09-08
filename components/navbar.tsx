"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Telescope, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Pipeline", href: "#pipeline" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Explainability", href: "#explainability" },
  { label: "Candidates", href: "#candidates" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-primary/20 bg-primary/5">
            <Telescope className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Lumina</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button size="sm" className="h-8 text-xs px-4">
          Analyze Data
        </Button>

        <button
          className="size-8 flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--secondary)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-white md:hidden">
          <div className="flex flex-col gap-0.5 px-6 py-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button className="mt-2 w-full">Analyze Data</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
