"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { WorksWheel } from "@/components/ui/works-wheel"
import { MobileRotaryDial } from "@/components/ui/mobile-rotary-dial"
import { CLUB_METADATA } from "@/lib/content"

import { CircuitSide } from "@/components/decor/CircuitSide"
import { ForensicSide } from "@/components/decor/ForensicSide"

interface DashboardWrapperProps {
  isIntroPlaying?: boolean
}

export function DashboardWrapper({ isIntroPlaying = false }: DashboardWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkMedia = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkMedia()
    setMounted(true)

    window.addEventListener("resize", checkMedia)
    return () => window.removeEventListener("resize", checkMedia)
  }, [])

  // Hydration-safe initial state
  if (!mounted) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-[0_0_25px_rgba(212,162,76,0.3)] animate-pulse">
          <Image
            src="/assets/invictors-logo.png"
            alt="INVICTORS Emblem"
            fill
            priority
            sizes="144px"
            className="object-cover"
          />
        </div>
        <div className="font-display text-sm font-bold text-amber-300 tracking-[0.25em] uppercase mt-4">
          {CLUB_METADATA.motto}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Subtle Animated Side Backgrounds (Masked, non-competing, paused during intro) */}
      {!isIntroPlaying && (
        <>
          <CircuitSide isMobile={!isDesktop} />
          <ForensicSide isMobile={!isDesktop} />
        </>
      )}

      {/* Main Wheel Engine: WorksWheel for Desktop, MobileRotaryDial for Mobile */}
      {isDesktop ? <WorksWheel /> : <MobileRotaryDial />}
    </div>
  )
}

