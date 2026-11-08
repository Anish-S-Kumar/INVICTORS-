"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageShell } from "@/components/page-shell"
import { PILLARS_CONTENT } from "@/lib/content"
import { FACULTY_COORDINATORS, CORE_COMMITTEE, CoreTeamMember } from "@/lib/team-data"
import { MEMBERSHIP_GOOGLE_FORM_URL, MEMBERSHIP_DETAILS } from "@/lib/membership-config"
import {
  Puzzle,
  Cpu,
  Leaf,
  Fingerprint,
  Sparkles,
  Building2,
  ChevronRight,
  Layers,
  GraduationCap,
  Users,
  UserPlus,
  ExternalLink,
  Crown,
  Shield,
  Award,
  FileText,
  Terminal,
  Calendar,
  Wand2,
  Megaphone,
  Share2,
  BarChart3,
  Code,
  CheckCircle2,
} from "lucide-react"

function getCoreIcon(iconName?: string) {
  const cls = "w-4 h-4 text-amber-300"
  switch (iconName) {
    case "Crown": return <Crown className={cls} />
    case "Shield": return <Shield className={cls} />
    case "Award": return <Award className={cls} />
    case "FileText": return <FileText className={cls} />
    case "Terminal": return <Terminal className={cls} />
    case "Calendar": return <Calendar className={cls} />
    case "Wand2": return <Wand2 className={cls} />
    case "Megaphone": return <Megaphone className={cls} />
    case "Share2": return <Share2 className={cls} />
    case "Cpu": return <Cpu className={cls} />
    case "BarChart3": return <BarChart3 className={cls} />
    case "Code": return <Code className={cls} />
    default: return <Users className={cls} />
  }
}

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

      {/* ============================================================== */}
      {/* 3. CORE TEAM & FACULTY COORDINATORS SECTION                    */}
      {/* ============================================================== */}
      <div className="mt-4 mb-10 space-y-10">

        {/* Section divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-950/50 shadow-[0_0_16px_rgba(212,162,76,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
            <span className="font-display text-xs font-bold text-amber-300 tracking-widest uppercase">
              Core Team & Faculty Coordinators
            </span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* HOD & Faculty Coordinators */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 tracking-wide uppercase">
                HOD & Faculty Coordinators
              </h3>
              <p className="text-[11px] sm:text-xs text-silver-400 font-body">
                Department of Computer Science & Engineering, Vidyavardhaka College of Engineering
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACULTY_COORDINATORS.map((fac) => (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                  fac.isHOD
                    ? "border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-black/60 to-black shadow-[0_0_24px_rgba(212,162,76,0.2)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(212,162,76,0.3)]"
                    : "border-amber-500/25 bg-black/40 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,162,76,0.15)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center font-display font-bold text-xs ${
                        fac.isHOD
                          ? "border-amber-400 bg-gradient-to-br from-amber-500/40 via-amber-950 to-black text-amber-200 shadow-[0_0_12px_rgba(212,162,76,0.4)]"
                          : "border-amber-500/40 bg-gradient-to-br from-amber-600/30 via-black to-black text-amber-300"
                      }`}
                    >
                      {fac.initials || fac.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    {fac.badge && (
                      <span
                        className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase ${
                          fac.isHOD
                            ? "border-amber-400/70 bg-gradient-to-r from-amber-500/25 to-amber-600/35 text-amber-200 font-semibold shadow-[0_0_8px_rgba(212,162,76,0.3)]"
                            : "border-amber-500/30 bg-amber-950/70 text-amber-300"
                        }`}
                      >
                        {fac.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-bold text-silver-100 group-hover:text-amber-200 transition-colors">
                    {fac.name}
                  </h4>
                  <div className="text-xs font-semibold text-amber-400/90 font-display mt-0.5">
                    {fac.role}
                  </div>
                  <div className="text-[11px] text-silver-400 font-body mt-1">
                    {fac.designation}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-500/15 text-[10px] font-mono text-silver-400/70">
                  {fac.department}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Committee (Student Coordinators) */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 tracking-wide uppercase">
                Core Committee (Student Coordinators)
              </h3>
              <p className="text-[11px] sm:text-xs text-silver-400 font-body">
                Student coordinators steering INVICTORS initiatives for Academic Year 2026–27
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CORE_COMMITTEE.map((member: CoreTeamMember, idx: number) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/25 bg-black/40 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,162,76,0.15)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 rounded-xl border border-amber-500/30 bg-amber-950/60 group-hover:scale-105 transition-transform">
                      {getCoreIcon(member.iconName)}
                    </div>
                    <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-200 font-semibold uppercase tracking-wider shadow-[0_0_10px_rgba(212,162,76,0.2)]">
                      {member.badge || member.role}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-amber-400/80 uppercase tracking-wider mb-0.5">
                    {member.role}
                  </div>
                  <h4 className="font-display text-base font-bold text-silver-100 group-hover:text-amber-200 transition-colors">
                    {member.name}
                  </h4>
                  {member.subRole && (
                    <div className="text-xs text-silver-300/80 font-body mt-1 leading-snug">
                      {member.subRole}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2.5 border-t border-amber-500/15 flex items-center justify-between text-[10px] font-mono text-silver-400/70">
                  <span>{member.domain}</span>
                  <span className="text-amber-400/70">CSE · VVCE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Membership CTA */}
        <section className="relative rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-black/80 to-black p-5 sm:p-8 shadow-[0_0_36px_rgba(212,162,76,0.25)] overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/50 bg-amber-950/80 text-amber-300 text-xs font-mono tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(212,162,76,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{MEMBERSHIP_DETAILS.academicYear} · MEMBERSHIP DRIVE</span>
              </div>

              <h3 className="font-display text-xl sm:text-3xl font-extrabold text-gradient-gold uppercase tracking-tight">
                {MEMBERSHIP_DETAILS.title}
              </h3>

              <p className="text-xs sm:text-sm text-silver-300/90 font-body mt-2 leading-relaxed">
                {MEMBERSHIP_DETAILS.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-amber-500/20">
                {MEMBERSHIP_DETAILS.benefits.slice(0, 4).map((benefit: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-silver-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="inline-block px-3 py-1 rounded-lg border border-amber-500/30 bg-black/60 text-amber-400 text-[11px] font-mono">
                // {MEMBERSHIP_DETAILS.status}
              </div>

              <a
                href={MEMBERSHIP_GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,162,76,0.5)] hover:shadow-[0_0_35px_rgba(212,162,76,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Apply for Membership (Google Form)</span>
                <ExternalLink className="w-4 h-4 text-black stroke-[2.5]" />
              </a>

              <p className="text-[10px] text-silver-400/80 font-mono text-left lg:text-right max-w-xs">
                * Opens official Google Form in a new tab.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
