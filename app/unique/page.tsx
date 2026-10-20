"use client"

import React, { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { UNIQUE_CONTENT } from "@/lib/content"
import { XCircle, CheckCircle, Sparkles, Scale, Layers } from "lucide-react"

export default function UniquePage() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [mobileMode, setMobileMode] = useState<"invictors" | "typical" | "compare">("compare")

  return (
    <PageShell
      title="Why INVICTORS Is Unique & Distinct"
      subtitle="A fundamental paradigm shift away from dogmatic competitive coding toward inclusive, detective-driven engineering."
      badge="The Distinction"
      breadcrumb="Why Unique"
    >
      {/* 1. Intro Callout */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-10 border-amber-500/30 relative">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wider mb-1">
              THE PARADIGM SHIFT
            </h2>
            <p className="font-body text-base sm:text-lg text-silver-200 leading-relaxed">
              {UNIQUE_CONTENT.intro}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. LAPTOP VIEW: Side-by-Side Synced Comparison (hidden on mobile)*/}
      {/* ============================================================== */}
      <div className="hidden lg:block mb-12">
        <div className="grid grid-cols-2 gap-8 relative">
          {/* Vertical Center Glow Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-amber-500/20 via-amber-400/50 to-amber-500/20 pointer-events-none" />

          {/* Left Column Header: Typical College Tech Club */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
            <h3 className="font-display text-base font-bold text-silver-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-zinc-500" />
              <span>Typical College Tech Club</span>
            </h3>
          </div>

          {/* Right Column Header: INVICTORS Innovation Club */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center shadow-[0_0_20px_rgba(212,162,76,0.15)]">
            <h3 className="font-display text-base font-bold text-gradient-gold uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>INVICTORS Innovation Club</span>
            </h3>
          </div>
        </div>

        {/* Rows with synchronized hover */}
        <div className="space-y-3 mt-4">
          {UNIQUE_CONTENT.comparisons.map((row, idx) => {
            const isHovered = hoveredRow === idx
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid grid-cols-2 gap-8 p-3 rounded-2xl transition-all duration-200 ${
                  isHovered ? "bg-amber-950/20 shadow-lg" : ""
                }`}
              >
                {/* Left: Typical Club (dimmed, silver, crossed out) */}
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isHovered
                      ? "border-zinc-700 bg-zinc-900/60"
                      : "border-zinc-900 bg-zinc-950/40 opacity-75"
                  }`}
                >
                  <XCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      {row.aspect}
                    </span>
                    <span className="text-sm font-body text-zinc-400 line-through decoration-zinc-600/70">
                      {row.typical}
                    </span>
                  </div>
                </div>

                {/* Right: INVICTORS (glowing gold, check icon) */}
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isHovered
                      ? "border-amber-400 bg-amber-950/60 shadow-[0_0_25px_rgba(212,162,76,0.25)] scale-[1.01]"
                      : "border-amber-500/30 bg-black/60 shadow-md"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider block">
                      {row.aspect}
                    </span>
                    <span className="text-sm font-body font-semibold text-silver-100">
                      {row.invictors}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE VIEW: Segmented Control & Comparative Cards          */}
      {/* ============================================================== */}
      <div className="block lg:hidden mb-10">
        {/* Segmented Control */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/70 border border-amber-500/30 rounded-xl mb-6">
          <button
            onClick={() => setMobileMode("compare")}
            className={`py-2 text-xs font-display tracking-wider rounded-lg transition-all ${
              mobileMode === "compare"
                ? "bg-amber-500 text-black font-bold"
                : "text-silver-300/70"
            }`}
          >
            Compare View
          </button>
          <button
            onClick={() => setMobileMode("invictors")}
            className={`py-2 text-xs font-display tracking-wider rounded-lg transition-all ${
              mobileMode === "invictors"
                ? "bg-amber-500 text-black font-bold"
                : "text-silver-300/70"
            }`}
          >
            INVICTORS
          </button>
          <button
            onClick={() => setMobileMode("typical")}
            className={`py-2 text-xs font-display tracking-wider rounded-lg transition-all ${
              mobileMode === "typical"
                ? "bg-zinc-700 text-white font-bold"
                : "text-silver-300/70"
            }`}
          >
            Typical Club
          </button>
        </div>

        {/* Mode 1: Compare Cards (Stacked side-by-side rows) */}
        {mobileMode === "compare" && (
          <div className="space-y-4">
            {UNIQUE_CONTENT.comparisons.map((row, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-xl border-amber-500/25">
                <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-wider block mb-2">
                  #{idx + 1} // {row.aspect}
                </span>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400">
                    <XCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="line-through decoration-zinc-600">{row.typical}</span>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-semibold text-amber-100">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{row.invictors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode 2: INVICTORS List */}
        {mobileMode === "invictors" && (
          <div className="space-y-3">
            {UNIQUE_CONTENT.comparisons.map((row, idx) => (
              <div key={idx} className="glass-panel-gold p-4 rounded-xl border-amber-500/40">
                <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-wider block mb-1">
                  {row.aspect}
                </span>
                <div className="flex items-start gap-2 text-sm text-silver-100 font-semibold">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{row.invictors}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode 3: Typical Club List */}
        {mobileMode === "typical" && (
          <div className="space-y-3">
            {UNIQUE_CONTENT.comparisons.map((row, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                  {row.aspect}
                </span>
                <div className="flex items-start gap-2 text-sm text-zinc-400 line-through">
                  <XCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <span>{row.typical}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
