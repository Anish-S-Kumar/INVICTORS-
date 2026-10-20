"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { PageShell } from "@/components/page-shell"
import {
  CLUB_METADATA,
  OVERVIEW_CONTENT,
} from "@/lib/content"
import {
  CheckCircle2,
  Sparkles,
  Award,
  GraduationCap,
  Building,
  ShieldCheck,
} from "lucide-react"

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<"students" | "institution">("students")

  return (
    <PageShell
      title="Club Overview"
      subtitle="Executive proposal, revolutionary non-conventional pedagogy, and campus impact metrics."
      badge="Proposal 2026-27"
      breadcrumb="Overview"
    >
      {/* 1. Hero Strip with Logo & Slogan */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-6 border-amber-500/30">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-[0_0_20px_rgba(212,162,76,0.35)] shrink-0">
          <Image
            src="/assets/invictors-logo.png"
            alt="INVICTORS Emblem"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <div className="font-display text-xs font-bold text-amber-400 tracking-[0.25em] uppercase mb-1">
            {CLUB_METADATA.motto}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gradient-gold">
            &ldquo;{CLUB_METADATA.slogan}&rdquo;
          </h2>
          <p className="text-sm text-silver-300/80 mt-2 max-w-2xl leading-relaxed">
            {CLUB_METADATA.shortDescription}
          </p>
        </div>
      </div>

      {/* 2. Stat Strip with Count-up/Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CLUB_METADATA.stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="glass-panel p-4 sm:p-5 rounded-xl border-amber-500/20 text-center relative overflow-hidden group hover:border-amber-400/60 transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-gradient-gold tracking-tight">
              {stat.value}
            </div>
            <div className="font-display text-xs sm:text-sm font-bold text-silver-100 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
            <div className="text-[11px] text-silver-300/60 mt-1">
              {stat.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Executive Overview & Vision Text */}
      <div className="space-y-6 mb-10">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-amber-500/25">
          <h2 className="font-display text-lg sm:text-xl font-bold text-amber-300 tracking-wide mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>1. EXECUTIVE OVERVIEW & VISION</span>
          </h2>
          <div className="space-y-4 text-base text-silver-300/90 leading-relaxed font-body">
            {OVERVIEW_CONTENT.executiveVision.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Highlight Panel: Core Philosophy */}
          <div className="mt-6 p-5 sm:p-6 rounded-xl bg-amber-950/30 border border-amber-500/40 shadow-[0_0_20px_rgba(212,162,76,0.15)] relative overflow-hidden">
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-400/60" />
            <h3 className="font-display text-sm sm:text-base font-bold text-gradient-gold uppercase tracking-wider mb-2">
              {OVERVIEW_CONTENT.corePhilosophy.title}
            </h3>
            <p className="text-sm sm:text-base text-silver-300 leading-relaxed font-body">
              {OVERVIEW_CONTENT.corePhilosophy.body}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Member Benefits & Expected Outcomes (Side-by-side on laptop, Tabs on mobile) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-silver-100 tracking-wide flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>MEMBER BENEFITS & INSTITUTIONAL OUTCOMES</span>
          </h2>

          {/* Mobile Tabs Switcher */}
          <div className="flex sm:hidden p-1 rounded-lg bg-black/60 border border-amber-500/30">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-3 py-1 rounded text-xs font-display tracking-wider transition-all ${
                activeTab === "students"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-silver-300/70"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("institution")}
              className={`px-3 py-1 rounded text-xs font-display tracking-wider transition-all ${
                activeTab === "institution"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-silver-300/70"
              }`}
            >
              Institution
            </button>
          </div>
        </div>

        {/* Desktop: 2-column glass layout. Mobile: conditional display based on activeTab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Column 1: Student Benefits */}
          <div
            className={`glass-panel p-6 sm:p-7 rounded-2xl border-amber-500/20 ${
              activeTab === "students" ? "block" : "hidden sm:block"
            }`}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/20">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-gradient-gold">
                Student Benefits
              </h3>
            </div>
            <ul className="space-y-3.5">
              {OVERVIEW_CONTENT.studentBenefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-silver-300/90 leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Institutional Outcomes */}
          <div
            className={`glass-panel p-6 sm:p-7 rounded-2xl border-amber-500/20 ${
              activeTab === "institution" ? "block" : "hidden sm:block"
            }`}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/20">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-gradient-silver">
                Institutional Outcomes
              </h3>
            </div>
            <ul className="space-y-3.5">
              {OVERVIEW_CONTENT.institutionalOutcomes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-silver-300/90 leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Conclusion & Administrative Approval */}
      <div className="glass-panel-gold p-6 sm:p-8 rounded-2xl border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="font-display text-base sm:text-lg font-bold text-amber-200 tracking-wide uppercase">
            8. Conclusion & Administrative Approval
          </h2>
        </div>
        <p className="text-sm sm:text-base text-silver-200 leading-relaxed font-body">
          {OVERVIEW_CONTENT.approvalConclusion}
        </p>
      </div>
    </PageShell>
  )
}
