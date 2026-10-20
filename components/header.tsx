"use client"

import React from "react"
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
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/75 border-b border-amber-500/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: College Logo & Optional Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showBack && (
            <Link
              href={backHref}
              className="group flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-black/50 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-950/40 transition-all text-xs sm:text-sm font-display tracking-wider"
              aria-label={`Back to ${backLabel}`}
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-amber-400" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2 group" title="Vidyavardhaka College of Engineering">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/assets/college-logo.png"
                alt="Vidyavardhaka College of Engineering Logo"
                fill
                priority
                sizes="(max-width: 640px) 36px, 44px"
                className="object-contain drop-shadow-[0_0_8px_rgba(212,162,76,0.3)]"
              />
            </div>
          </Link>
        </div>

        {/* Center: College Name & Dept with Silver/Gold Gradient */}
        <div className="flex-1 text-center px-1 sm:px-2 min-w-0">
          <Link href="/" className="inline-block group">
            <h1 className="font-display text-[11px] xs:text-xs sm:text-base md:text-lg font-bold tracking-wider leading-tight text-gradient-gold uppercase drop-shadow-[0_0_12px_rgba(212,162,76,0.25)] line-clamp-2 sm:line-clamp-1">
              VIDYAVARDHAKA COLLEGE OF ENGINEERING
            </h1>
            <p className="font-display text-[8.5px] xs:text-[9.5px] sm:text-xs tracking-widest text-silver-300/80 font-medium uppercase mt-0.5 truncate">
              DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
            </p>
          </Link>
        </div>

        {/* Right: CSE Branch Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center group" title="Dept. of Computer Science & Engineering">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/assets/cse-logo.png"
                alt="Department of Computer Science & Engineering Logo"
                fill
                priority
                sizes="(max-width: 640px) 36px, 44px"
                className="object-contain drop-shadow-[0_0_8px_rgba(212,162,76,0.3)]"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Very subtle gold glow accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
    </header>
  )
}
