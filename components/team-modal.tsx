"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  GraduationCap,
  Users,
  UserPlus,
  ExternalLink,
  Shield,
  Award,
  Terminal,
  Calendar,
  Wand2,
  Megaphone,
  Code,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import {
  FACULTY_COORDINATORS,
  CORE_COMMITTEE,
  CoreTeamMember,
} from "@/lib/team-data"
import {
  MEMBERSHIP_GOOGLE_FORM_URL,
  MEMBERSHIP_DETAILS,
} from "@/lib/membership-config"

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
}

function getCoreIcon(iconName?: string) {
  const cls = "w-4 h-4 text-amber-300"
  switch (iconName) {
    case "Shield":
      return <Shield className={cls} />
    case "Award":
      return <Award className={cls} />
    case "Terminal":
      return <Terminal className={cls} />
    case "Calendar":
      return <Calendar className={cls} />
    case "Wand2":
      return <Wand2 className={cls} />
    case "Megaphone":
      return <Megaphone className={cls} />
    case "Code":
      return <Code className={cls} />
    default:
      return <Users className={cls} />
  }
}

export function TeamModal({ isOpen, onClose }: TeamModalProps) {
  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop with cyber blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#070708] border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(212,162,76,0.25)] flex flex-col overflow-hidden z-10 my-auto"
          >
            {/* Top Circuit Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-7 border-b border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-transparent shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/60 text-amber-300 text-[10px] font-mono tracking-widest uppercase mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
                  VVCE CSE · INVICTORS SOCIETY
                </div>
                <h2
                  id="team-modal-title"
                  className="font-display text-xl sm:text-3xl font-extrabold text-gradient-gold uppercase tracking-tight"
                >
                  Core Team & Faculty Coordinators
                </h2>
                <p className="text-xs sm:text-sm text-silver-300/80 font-body mt-0.5">
                  The leadership, faculty mentors, and student executive committee steering INVICTORS.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full border border-amber-500/30 bg-black/60 hover:bg-amber-950/60 hover:border-amber-400 text-silver-300 hover:text-amber-200 transition-all cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8 custom-scrollbar">
              {/* ============================================================== */}
              {/* SECTION 1: FACULTY COORDINATORS                                */}
              {/* ============================================================== */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 tracking-wide uppercase">
                      Faculty Coordinators & Mentors
                    </h3>
                    <p className="text-[11px] sm:text-xs text-silver-400 font-body">
                      Department of Computer Science & Engineering, Vidyavardhaka College of Engineering
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FACULTY_COORDINATORS.map((fac) => (
                    <div
                      key={fac.id}
                      className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/25 bg-black/40 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(212,162,76,0.15)] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-600/30 via-black to-black flex items-center justify-center font-display font-bold text-xs text-amber-300">
                            {fac.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          {fac.badge && (
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/70 text-amber-300 uppercase">
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
                    </div>
                  ))}
                </div>
              </section>

              {/* ============================================================== */}
              {/* SECTION 2: CORE COMMITTEE                                      */}
              {/* ============================================================== */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-amber-300 tracking-wide uppercase">
                      Core Committee (Student Leadership)
                    </h3>
                    <p className="text-[11px] sm:text-xs text-silver-400 font-body">
                      Executive committee managing strategic initiatives, tech challenges, and operations
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CORE_COMMITTEE.map((member: CoreTeamMember) => (
                    <div
                      key={member.id}
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
                    </div>
                  ))}
                </div>
              </section>

              {/* ============================================================== */}
              {/* SECTION 3: MEMBERSHIP APPLICATION (BELOW CORE COMMITTEE)       */}
              {/* ============================================================== */}
              <section className="relative rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-black/80 to-black p-5 sm:p-8 shadow-[0_0_36px_rgba(212,162,76,0.25)] overflow-hidden">
                {/* Circuit overlay aesthetic */}
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

                    {/* Member Benefits Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-amber-500/20">
                      {MEMBERSHIP_DETAILS.benefits.slice(0, 4).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-silver-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call-to-Action Link / Button */}
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
                      * Opens official Google Form in a new tab. Link can be updated in{" "}
                      <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded">lib/membership-config.ts</code>
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-amber-500/20 bg-black/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-mono text-silver-400">
                INVICTORS · Dept. of Computer Science & Engineering · VVCE Mysuru
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 rounded-full border border-amber-500/30 bg-black/60 hover:bg-amber-950/40 text-amber-300 hover:text-amber-100 text-xs font-display tracking-wider transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
