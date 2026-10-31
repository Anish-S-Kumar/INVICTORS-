"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Users, UserPlus, ChevronRight, ExternalLink } from "lucide-react"
import { FloatingSocials } from "@/components/floating-socials"
import { TeamModal } from "@/components/team-modal"
import { MEMBERSHIP_GOOGLE_FORM_URL } from "@/lib/membership-config"

interface HeaderProps {
  showBack?: boolean
  backHref?: string
  backLabel?: string
}

export function Header({
  showBack = false,
  backHref = "/",
  backLabel = "Dashboard",
}: HeaderProps) {
  const middleColRef = useRef<HTMLDivElement>(null)
  const [colWidth, setColWidth] = useState<number>(300)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  // Measure middle column width to switch between full and abbreviated department line on small screens (<250px)
  useEffect(() => {
    const el = middleColRef.current
    if (!el) return

    const updateWidth = () => {
      setColWidth(el.offsetWidth)
    }

    updateWidth()

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setColWidth(entry.contentRect.width)
        }
      })
      ro.observe(el)
      return () => ro.disconnect()
    } else {
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [])

  return (
    <header
      data-debug="header"
      className="sticky top-0 z-40 w-full shrink-0 bg-gradient-to-b from-black/95 via-black/85 to-black/75 backdrop-blur-md transition-all duration-300 pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="w-full h-[74px] sm:h-[82px] lg:h-[94px] max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] gap-2.5 sm:gap-4 px-3 sm:px-4 lg:px-6 items-center">
        {/* Left: College Logo & Optional Back Button */}
        <div className="flex items-center gap-2 justify-self-start">
          {showBack && (
            <Link
              href={backHref}
              className="group flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-500/30 bg-black/60 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-950/40 transition-all text-xs font-display tracking-wider"
              aria-label={`Back to ${backLabel}`}
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-amber-400" />
              <span className="hidden md:inline">Back</span>
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center group"
            title="Vidyavardhaka College of Engineering"
            aria-label="Vidyavardhaka College of Engineering"
          >
            <div className="relative w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] lg:w-[78px] lg:h-[78px] rounded-xl sm:rounded-2xl overflow-hidden p-1 bg-white border-2 border-amber-400/60 shadow-[0_0_15px_rgba(212,162,76,0.35)] transition-all group-hover:scale-105 group-hover:border-amber-300 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/assets/college-logo.jpg"
                alt="Vidyavardhaka College of Engineering Logo"
                width={80}
                height={80}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </div>

        {/* Centre: Title & Subtitle with container query & responsive scaling */}
        <div
          ref={middleColRef}
          className="text-center min-w-0 px-1 overflow-hidden"
          style={{ containerType: "inline-size" }}
        >
          <Link
            href="/"
            className="inline-block group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 rounded max-w-full"
          >
            {/* Desktop single line (lg:block), Mobile two balanced lines (block lg:hidden) */}
            <h1 className="font-display font-extrabold uppercase tracking-[0.06em] lg:tracking-[0.08em] bg-gradient-to-r from-[#e6c875] via-[#f7e7b4] to-[#cbd5e1] bg-clip-text text-transparent">
              {/* Mobile version: Exactly two balanced lines */}
              <span className="block lg:hidden leading-[1.14] text-[clamp(12px,4.4cqw,16px)]">
                <span className="block">VIDYAVARDHAKA COLLEGE</span>
                <span className="block">OF ENGINEERING</span>
              </span>
              {/* Desktop version: Single line */}
              <span className="hidden lg:block text-[clamp(0.92rem,1.6vw,1.5rem)] leading-tight whitespace-nowrap">
                VIDYAVARDHAKA COLLEGE OF ENGINEERING
              </span>
            </h1>

            {/* Department subtitle: One single line, fitted and scaled to never clip */}
            <p className="font-display font-semibold text-slate-200 tracking-[0.09em] lg:tracking-[0.22em] uppercase mt-0.5 sm:mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(7.5px,2.6cqw,9.8px)] lg:text-[clamp(0.58rem,1.05vw,0.88rem)]">
              {colWidth < 250
                ? "DEPT. OF COMPUTER SCIENCE & ENGG."
                : "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING"}
            </p>
          </Link>
        </div>

        {/* Right: CSE Department Logo */}
        <div className="flex items-center justify-self-end">
          <Link
            href="/"
            className="flex items-center group"
            title="Department of Computer Science & Engineering"
            aria-label="Department of Computer Science and Engineering"
          >
            <div className="relative w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] lg:w-[78px] lg:h-[78px] rounded-xl sm:rounded-2xl overflow-hidden p-1 bg-white border-2 border-amber-400/60 shadow-[0_0_15px_rgba(212,162,76,0.35)] transition-all group-hover:scale-105 group-hover:border-amber-300 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/assets/cse-logo.jpg"
                alt="Department of Computer Science & Engineering Logo"
                width={80}
                height={80}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Smoky Social Media Strip directly below the header title */}
      <div className="w-full">
        <FloatingSocials />
      </div>

      {/* Option bar below header: Core Team, Faculty Coordinators & Membership */}
      <div className="w-full flex items-center justify-center gap-2 pb-2 px-3 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsTeamModalOpen(true)}
          className="group relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/50 bg-black/80 hover:bg-amber-950/60 hover:border-amber-300 text-amber-200 text-[11px] sm:text-xs font-display tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(212,162,76,0.18)] hover:shadow-[0_0_22px_rgba(212,162,76,0.4)] hover:scale-[1.02] cursor-pointer backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#d4a24c]" />
          <Users className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-amber-200 group-hover:text-amber-100 font-semibold">Core Team & Faculty Coordinators</span>
          <ChevronRight className="w-3 h-3 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <a
          href={MEMBERSHIP_GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-600/20 via-amber-500/25 to-amber-600/20 hover:border-amber-300 hover:from-amber-500/30 hover:to-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-display tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(212,162,76,0.18)] hover:shadow-[0_0_20px_rgba(212,162,76,0.4)] cursor-pointer backdrop-blur-md"
          title="Apply for INVICTORS Membership (Google Form)"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-300" />
          <span>Membership Form</span>
          <ExternalLink className="w-3 h-3 text-amber-400/80" />
        </a>
      </div>

      {/* Bottom edge: Fading gold hairline with center crosshair node */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 rotate-45 border border-amber-300 bg-amber-500/80 shadow-[0_0_6px_rgba(212,162,76,0.8)] -translate-y-[0.5px]" />
      </div>

      {/* Interactive Core Team, Faculty Coordinators & Membership Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </header>
  )
}
