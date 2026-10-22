"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { WorksWheel } from "@/components/ui/works-wheel"
import { MobileRotaryDial } from "@/components/ui/mobile-rotary-dial"
import { CLUB_METADATA } from "@/lib/content"

import { CircuitSide } from "@/components/decor/CircuitSide"
import { ForensicSide } from "@/components/decor/ForensicSide"
import { RingField } from "@/components/decor/RingField"
import { GoldDust } from "@/components/decor/GoldDust"
import { SITE_CONFIG } from "@/lib/site-config"

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
      {/* v8 Main Animated Circuit-Ring Field (concentric with dial, layer 0) */}
      <RingField isMobile={!isDesktop} isIntroPlaying={isIntroPlaying} />

      {/* Side Art: Radial mode (default) keeps subtle GoldDust and 8% binary streams at far edges */}
      {SITE_CONFIG.sideArt === "radial" && !isIntroPlaying && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden z-0">
            <GoldDust count={14} />
            <div className="absolute left-2 top-0 bottom-0 text-[10px] font-mono text-amber-500/[0.08] leading-tight select-none pointer-events-none whitespace-pre overflow-hidden">
              {"01001001\n01001110\n01010110\n01001001\n01000011\n01010100\n01001111\n01010010\n01010011\n00100000\n01000011\n01010011\n01000101\n01010110\n01000011\n01001111\n01000101\n".repeat(6)}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden z-0">
            <GoldDust count={14} />
            <div className="absolute right-2 top-0 bottom-0 text-[10px] font-mono text-amber-500/[0.08] leading-tight select-none pointer-events-none whitespace-pre overflow-hidden text-right">
              {"01000100\n01000101\n01000011\n01001111\n01000100\n01000101\n00101110\n01001001\n01001110\n01001110\n01001111\n01010110\n01000001\n01010100\n01000101\n00101110\n".repeat(6)}
            </div>
          </div>
        </>
      )}

      {/* Legacy Side Art Mode */}
      {SITE_CONFIG.sideArt === "legacy" && !isIntroPlaying && (
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

