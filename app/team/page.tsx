"use client"

import React from "react"
import { PageShell } from "@/components/page-shell"
import {
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

export default function TeamPage() {
  return (
    <PageShell
      title="Leadership & Committee"
      subtitle="The visionary faculty mentors and dedicated student executive committee powering the INVICTORS society."
      badge="Club Leadership"
      breadcrumb="Team & Committee"
    >
      <div className="space-y-12 pb-12">
        {/* ============================================================== */}
        {/* SECTION 1: FACULTY COORDINATORS                                */}
        {/* ============================================================== */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/60 shadow-[0_0_15px_rgba(212,162,76,0.2)]">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gradient-gold tracking-tight uppercase">
                Faculty Coordinators & Mentors
              </h2>
              <p className="text-xs sm:text-sm text-silver-400 font-body">
                Department of Computer Science & Engineering, Vidyavardhaka College of Engineering
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FACULTY_COORDINATORS.map((fac) => (
              <div
                key={fac.id}
                className="glass-panel p-6 rounded-2xl border border-amber-500/25 bg-black/40 hover:border-amber-400/60 hover:shadow-[0_0_24px_rgba(212,162,76,0.2)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-600/30 via-black to-black flex items-center justify-center font-display font-bold text-sm text-amber-300 shadow-[0_0_12px_rgba(212,162,76,0.2)]">
                      {fac.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    {fac.badge && (
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/70 text-amber-300 uppercase">
                        {fac.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-silver-100 group-hover:text-amber-200 transition-colors">
                    {fac.name}
                  </h3>
                  <div className="text-xs font-semibold text-amber-400 font-display mt-0.5">
                    {fac.role}
                  </div>
                  <div className="text-xs text-silver-400 font-body mt-1">
                    {fac.designation}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-amber-500/20 text-[11px] font-mono text-silver-400/80">
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/60 shadow-[0_0_15px_rgba(212,162,76,0.2)]">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gradient-gold tracking-tight uppercase">
                Core Committee (Student Leadership)
              </h2>
              <p className="text-xs sm:text-sm text-silver-400 font-body">
                Executive committee steering INVICTORS initiatives for Academic Year 2026–27
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_COMMITTEE.map((member: CoreTeamMember) => (
              <div
                key={member.id}
                className="glass-panel p-6 rounded-2xl border border-amber-500/25 bg-black/40 hover:border-amber-400/60 hover:shadow-[0_0_24px_rgba(212,162,76,0.2)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/60 group-hover:scale-105 transition-transform">
                      {getCoreIcon(member.iconName)}
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-200 font-semibold uppercase tracking-wider shadow-[0_0_10px_rgba(212,162,76,0.2)]">
                      {member.badge || member.role}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-amber-400/80 uppercase tracking-wider mb-0.5">
                    {member.role}
                  </div>
                  <h3 className="font-display text-lg font-bold text-silver-100 group-hover:text-amber-200 transition-colors">
                    {member.name}
                  </h3>
                  {member.subRole && (
                    <div className="text-xs text-silver-300/80 font-body mt-1 leading-relaxed">
                      {member.subRole}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-silver-400/70">
                  <span>{member.domain}</span>
                  <span className="text-amber-400/80">CSE · VVCE</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: MEMBERSHIP APPLICATION (BELOW CORE COMMITTEE)       */}
        {/* ============================================================== */}
        <section className="relative rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-black/85 to-black p-6 sm:p-10 shadow-[0_0_40px_rgba(212,162,76,0.3)] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/50 bg-amber-950/80 text-amber-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(212,162,76,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{MEMBERSHIP_DETAILS.academicYear} · OFFICIAL MEMBERSHIP</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-gradient-gold uppercase tracking-tight">
                {MEMBERSHIP_DETAILS.title}
              </h2>

              <p className="text-sm sm:text-base text-silver-300/90 font-body mt-3 leading-relaxed">
                {MEMBERSHIP_DETAILS.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 pt-4 border-t border-amber-500/20">
                {MEMBERSHIP_DETAILS.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-silver-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
              <div className="inline-block px-3.5 py-1 rounded-lg border border-amber-500/30 bg-black/70 text-amber-300 text-xs font-mono">
                // {MEMBERSHIP_DETAILS.status}
              </div>

              <a
                href={MEMBERSHIP_GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black font-display font-extrabold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,162,76,0.5)] hover:shadow-[0_0_40px_rgba(212,162,76,0.75)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-black stroke-[2.5]" />
                <span>Apply for Membership (Google Form)</span>
                <ExternalLink className="w-5 h-5 text-black stroke-[2.5]" />
              </a>

              <p className="text-xs text-silver-400/80 font-mono text-left lg:text-right max-w-xs">
                * Opens official Google Form in a new tab. Link can be updated in{" "}
                <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded">lib/membership-config.ts</code>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
