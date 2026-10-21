"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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
      className="sticky top-0 z-40 w-full shrink-0 bg-gradient-to-b from-black/95 via-black/85 to-black/75 backdrop-blur-md transition-all duration-300 pt-[env(safe-area-inset-top,0px)] h-[64px] lg:h-[72px]"
    >
      <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-[40px_1fr_40px] lg:grid-cols-[52px_1fr_52px] gap-3 lg:gap-4 px-4 lg:px-6 items-center">
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
            <div className="relative w-[40px] h-[40px] lg:w-[52px] lg:h-[52px] rounded-full overflow-hidden p-1 bg-black/60 border border-amber-400/40 shadow-[0_0_12px_rgba(212,162,76,0.25)] transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/assets/college-logo.png"
                alt="Vidyavardhaka College of Engineering Logo"
                width={52}
                height={52}
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
            <h1 className="font-display font-bold uppercase tracking-[0.06em] lg:tracking-[0.08em] bg-gradient-to-r from-[#e6c875] via-[#f7e7b4] to-[#cbd5e1] bg-clip-text text-transparent">
              {/* Mobile version: Exactly two balanced lines */}
              <span className="block lg:hidden leading-[1.12] text-[clamp(10.5px,4.1cqw,14.5px)]">
                <span className="block">VIDYAVARDHAKA COLLEGE</span>
                <span className="block">OF ENGINEERING</span>
              </span>
              {/* Desktop version: Single line */}
              <span className="hidden lg:block text-[clamp(0.85rem,1.5vw,1.45rem)] leading-tight whitespace-nowrap">
                VIDYAVARDHAKA COLLEGE OF ENGINEERING
              </span>
            </h1>

            {/* Department subtitle: One single line, fitted and scaled to never clip */}
            <p className="font-display font-normal text-slate-300 tracking-[0.09em] lg:tracking-[0.22em] uppercase mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(6px,2.2cqw,8.2px)] lg:text-[clamp(0.52rem,0.95vw,0.82rem)]">
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
            <div className="relative w-[40px] h-[40px] lg:w-[52px] lg:h-[52px] rounded-full overflow-hidden p-1 bg-black/60 border border-amber-400/40 shadow-[0_0_12px_rgba(212,162,76,0.25)] transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/assets/cse-logo.png"
                alt="Department of Computer Science & Engineering Logo"
                width={52}
                height={52}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom edge: Fading gold hairline with center crosshair node */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 rotate-45 border border-amber-300 bg-amber-500/80 shadow-[0_0_6px_rgba(212,162,76,0.8)] -translate-y-[0.5px]" />
      </div>
    </header>
  )
}
