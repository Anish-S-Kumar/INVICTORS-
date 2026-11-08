"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"

interface PageShellProps {
  title: string
  subtitle: string
  badge?: string
  breadcrumb?: string
  children: React.ReactNode
}

export function PageShell({
  title,
  subtitle,
  badge,
  breadcrumb,
  children,
}: PageShellProps) {
  return (
    <div id="main-content" className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">

      {/* =====================================================================
          SUBPAGE TOP BAR
          Slim navigation bar for sub-dashboards only.
          Does NOT show social media strip, team/membership bar, or gold socials.
          ===================================================================== */}
      <header className="sticky top-0 z-40 w-full shrink-0 bg-gradient-to-b from-black/95 via-black/85 to-black/75 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 px-3 sm:px-4 lg:px-6 items-center h-[60px] sm:h-[68px] lg:h-[76px]">

          {/* Left: Back button + College Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-black/60 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-950/40 transition-all text-xs font-display tracking-wider"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-amber-400" />
              <span>Back</span>
            </Link>

            <Link href="/" title="Vidyavardhaka College of Engineering" aria-label="Vidyavardhaka College of Engineering">
              <div className="relative w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] rounded-xl overflow-hidden p-1 bg-white border-2 border-amber-400/60 shadow-[0_0_12px_rgba(212,162,76,0.3)] hover:border-amber-300 hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/college-logo.jpg"
                  alt="VVCE Logo"
                  width={48}
                  height={48}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>
          </div>

          {/* Centre: Club identity */}
          <div className="text-center min-w-0 px-1">
            <Link href="/" className="inline-block group">
              <p className="font-display font-extrabold uppercase tracking-[0.06em] text-[clamp(10px,2.4vw,14px)] bg-gradient-to-r from-[#e6c875] via-[#f7e7b4] to-[#cbd5e1] bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
                VIDYAVARDHAKA COLLEGE OF ENGINEERING
              </p>
              <p className="font-display font-semibold text-slate-300/80 tracking-[0.14em] uppercase text-[clamp(6.5px,1.5vw,9px)] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
              </p>
            </Link>
          </div>

          {/* Right: CSE logo */}
          <div className="flex items-center justify-self-end">
            <Link href="/" title="Department of Computer Science & Engineering" aria-label="CSE Department">
              <div className="relative w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] rounded-xl overflow-hidden p-1 bg-white border-2 border-amber-400/60 shadow-[0_0_12px_rgba(212,162,76,0.3)] hover:border-amber-300 hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/cse-logo.jpg"
                  alt="CSE Department Logo"
                  width={48}
                  height={48}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom gold divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </header>

      {/* Main Content with Entrance Animation */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-display tracking-widest text-silver-300/60 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-amber-500/70" />
            <span>HOME</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500/40" />
          <span className="text-amber-300/90 font-semibold uppercase">
            {breadcrumb || title}
          </span>
        </nav>

        {/* Page Header Banner */}
        <div className="mb-10 lg:mb-12 border-b border-amber-500/20 pb-6 sm:pb-8">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-display tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(212,162,76,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
              {badge}
            </div>
          )}

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gradient-gold uppercase drop-shadow-[0_0_20px_rgba(212,162,76,0.25)]">
            {title}
          </h1>

          <p className="font-body text-base sm:text-lg text-silver-300/90 mt-2 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Page Body */}
        {children}
      </motion.main>

      <Footer />
    </div>
  )
}
