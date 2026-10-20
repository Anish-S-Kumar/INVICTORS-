"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageShell } from "@/components/page-shell"
import { PILLARS_CONTENT } from "@/lib/content"
import {
  Puzzle,
  Cpu,
  Leaf,
  Fingerprint,
  Sparkles,
  Building2,
  ChevronRight,
  Layers,
} from "lucide-react"

export default function PillarsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getIcon = (name: string) => {
    switch (name) {
      case "Puzzle":
        return <Puzzle className="w-6 h-6 text-amber-400" />
      case "Cpu":
        return <Cpu className="w-6 h-6 text-amber-400" />
      case "Leaf":
        return <Leaf className="w-6 h-6 text-amber-400" />
      case "Fingerprint":
        return <Fingerprint className="w-6 h-6 text-amber-400" />
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-amber-400" />
      case "Building2":
        return <Building2 className="w-6 h-6 text-amber-400" />
      default:
        return <Layers className="w-6 h-6 text-amber-400" />
    }
  }

  return (
    <PageShell
      title="Core Club Pillars"
      subtitle="Six multidisciplinary engineering domains merging storytelling, physical tearing down, and modern AI."
      badge="Architectural Pillars"
      breadcrumb="Pillars"
    >
      {/* ============================================================== */}
      {/* 1. LAPTOP VIEW: 3x2 Grid with 3D Tilt Hover & Light-Sweep       */}
      {/* ============================================================== */}
      <div className="hidden lg:grid grid-cols-3 gap-6 mb-12">
        {PILLARS_CONTENT.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative glass-panel p-6 rounded-2xl border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(212,162,76,0.3)] transition-all duration-300 light-sweep-container flex flex-col justify-between"
          >
            {/* Top Row: Number & Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-500/30 px-2.5 py-1 rounded-md">
                  {pillar.number}
                </span>
                <span className="font-display text-[11px] font-semibold text-amber-300/80 tracking-wider bg-black/50 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {pillar.badge}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  {getIcon(pillar.iconName)}
                </div>
                <h3 className="font-display text-lg font-bold text-gradient-gold">
                  {pillar.title}
                </h3>
              </div>

              <div className="font-display text-xs text-silver-300/80 font-medium mb-3">
                {pillar.summary}
              </div>

              <p className="font-body text-sm text-silver-300 leading-relaxed">
                {pillar.details}
              </p>
            </div>

            {/* Bottom accent node */}
            <div className="mt-6 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono text-amber-400/70">
              <span>DOMAIN // ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#d4a24c]" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE VIEW: Expand-on-Tap Stacked List                     */}
      {/* ============================================================== */}
      <div className="block lg:hidden space-y-3.5 mb-10">
        {PILLARS_CONTENT.map((pillar) => {
          const isExpanded = expandedId === pillar.id
          return (
            <div
              key={pillar.id}
              className={`glass-panel rounded-xl border transition-all ${
                isExpanded
                  ? "border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(212,162,76,0.25)]"
                  : "border-amber-500/25"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : pillar.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-500/30 shrink-0">
                    {getIcon(pillar.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {pillar.number}
                      </span>
                      <h3 className="font-display text-sm sm:text-base font-bold text-gradient-gold">
                        {pillar.title}
                      </h3>
                    </div>
                    <div className="text-xs text-silver-300/70 truncate max-w-[200px]">
                      {pillar.summary}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-1 rounded-full text-amber-400 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden px-4 pb-4 pt-1 border-t border-amber-500/15"
                  >
                    <p className="font-body text-sm text-silver-200 leading-relaxed">
                      {pillar.details}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-amber-400/80">
                      <span>{pillar.badge}</span>
                      <span className="text-amber-500">READY</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
