"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Target,
  Sparkles,
  Layers,
  CalendarDays,
  Trophy,
  Fingerprint,
} from "lucide-react"
import { NAVIGATION_CARDS, CLUB_METADATA } from "@/lib/content"

interface WheelCarouselProps {
  items?: typeof NAVIGATION_CARDS
  className?: string
}

export function WheelCarousel({
  items = NAVIGATION_CARDS,
  className = "",
}: WheelCarouselProps) {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [snapPulse, setSnapPulse] = useState(false)
  const [isSmallHeight, setIsSmallHeight] = useState(false)

  const pointerStartY = useRef(0)
  const pointerStartTime = useRef(0)
  const currentOffset = useRef(0)
  const velocity = useRef(0)
  const animFrame = useRef<number | null>(null)
  const lastIndex = useRef(0)

  // Track small height viewports (< 640px)
  useEffect(() => {
    const checkHeight = () => {
      setIsSmallHeight(window.innerHeight < 640)
    }
    checkHeight()
    window.addEventListener("resize", checkHeight)
    return () => window.removeEventListener("resize", checkHeight)
  }, [])

  // Vibrate / haptic helper
  const triggerHaptic = useCallback(() => {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(8)
      }
    } catch {
      // ignore
    }
    setSnapPulse(true)
    setTimeout(() => setSnapPulse(false), 200)
  }, [])

  // Snap to closest integer index with smooth dampening
  const snapToNearest = useCallback(
    (targetVal: number) => {
      const nearest = Math.round(targetVal)
      const duration = 280
      const startTime = performance.now()
      const startVal = currentOffset.current

      const animateSnap = (time: number) => {
        const elapsed = time - startTime
        const progress = Math.min(1, elapsed / duration)
        const ease = 1 - Math.pow(1 - progress, 3)
        const nextVal = startVal + (nearest - startVal) * ease

        currentOffset.current = nextVal
        setScrollOffset(nextVal)

        const total = items.length
        const normIdx = ((Math.round(nextVal) % total) + total) % total
        if (normIdx !== lastIndex.current) {
          lastIndex.current = normIdx
          setSelectedIndex(normIdx)
          triggerHaptic()
        }

        if (progress < 1) {
          animFrame.current = requestAnimationFrame(animateSnap)
        } else {
          currentOffset.current = nearest
          setScrollOffset(nearest)
          const finalIdx = ((nearest % total) + total) % total
          setSelectedIndex(finalIdx)
        }
      }

      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      animFrame.current = requestAnimationFrame(animateSnap)
    },
    [items.length, triggerHaptic]
  )

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current)
    setIsDragging(true)
    setHasInteracted(true)
    pointerStartY.current = e.clientY
    pointerStartTime.current = performance.now()
    velocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const deltaY = e.clientY - pointerStartY.current
    const itemHeight = isSmallHeight ? 48 : 56
    const deltaItems = -deltaY / itemHeight

    const nextVal = currentOffset.current + deltaItems
    setScrollOffset(nextVal)

    const now = performance.now()
    const dt = now - pointerStartTime.current
    if (dt > 10) {
      velocity.current = deltaItems / dt
      pointerStartY.current = e.clientY
      pointerStartTime.current = now
      currentOffset.current = nextVal

      const total = items.length
      const normIdx = ((Math.round(nextVal) % total) + total) % total
      if (normIdx !== lastIndex.current) {
        lastIndex.current = normIdx
        setSelectedIndex(normIdx)
        triggerHaptic()
      }
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    const throwDistance = velocity.current * 160
    const targetOffset = currentOffset.current + throwDistance
    snapToNearest(targetOffset)
  }

  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [])

  // Icon mapping for selected card medallion
  const getMedallionIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="w-8 h-8 text-amber-300" />
      case "Target":
        return <Target className="w-8 h-8 text-amber-300" />
      case "Fingerprint":
        return <Fingerprint className="w-8 h-8 text-amber-300" />
      case "Sparkles":
        return <Sparkles className="w-8 h-8 text-amber-300" />
      case "Layers":
        return <Layers className="w-8 h-8 text-amber-300" />
      case "CalendarDays":
        return <CalendarDays className="w-8 h-8 text-amber-300" />
      case "Trophy":
        return <Trophy className="w-8 h-8 text-amber-300" />
      default:
        return <Sparkles className="w-8 h-8 text-amber-300" />
    }
  }

  const selectedCard = items[selectedIndex]
  const total = items.length
  // 5 visible names normally, 3 on very small screens
  const visibleSlots = isSmallHeight ? [-1, 0, 1] : [-2, -1, 0, 1, 2]

  return (
    <div
      className={`relative w-full h-full grid grid-rows-[minmax(0,1.05fr)_minmax(0,1fr)] px-5 select-none overflow-hidden touch-none ${className}`}
    >
      {/* =================================================================== */}
      {/* ZONE A (TOP, IDENTITY BLOCK): Centered, fills space under header     */}
      {/* Logo, 12px gap, Motto on ONE line, 8px gap, Slogan in 2 lines       */}
      {/* =================================================================== */}
      <div
        data-debug="zone-a"
        className="relative w-full h-full flex flex-col items-center justify-center min-h-0 pt-0.5 pb-2.5 z-10"
      >
        {/* Logo Emblem: Diameter = min(54vw, 0.62 * zoneA height) */}
        <div
          data-debug="logo"
          className="relative flex items-center justify-center shrink-0"
          style={{
            width: isSmallHeight ? "min(38vw, 130px)" : "min(50vw, 24vh, 205px)",
            height: isSmallHeight ? "min(38vw, 130px)" : "min(50vw, 24vh, 205px)",
          }}
        >
          {/* Masked Breathing Glow so it never bleeds into Header or Zone B */}
          <div
            className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse-gold pointer-events-none"
            style={{
              maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
            }}
          />

          {/* Rotating thin rings */}
          <div className="absolute inset-[-8%] rounded-full border border-amber-500/25 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-[-4%] rounded-full border border-dashed border-amber-400/20 animate-spin-reverse pointer-events-none" />

          {/* Logo container */}
          <div
            className={`relative w-full h-full rounded-full overflow-hidden border-2 border-amber-500/60 shadow-[0_0_25px_rgba(212,162,76,0.4)] transition-transform duration-200 ${
              snapPulse ? "scale-[1.03]" : "scale-100"
            }`}
          >
            <Image
              src="/assets/invictors-logo.png"
              alt="INVICTORS Emblem"
              fill
              priority
              sizes="185px"
              className="object-cover"
            />
          </div>
        </div>

        {/* 12px Gap -> Motto "DECODE. INNOVATE. OVERCOME." (ONE line, gold) */}
        <div data-debug="motto" className="mt-3 text-center px-2">
          <p className="font-display font-bold tracking-[0.2em] text-gradient-gold uppercase whitespace-nowrap text-[clamp(11px,3.4vw,13.5px)] drop-shadow-[0_0_8px_rgba(212,162,76,0.35)]">
            {CLUB_METADATA.motto}
          </p>
        </div>

        {/* 8px Gap -> Slogan "Unravel the Clues. Hack the Rules. Build the Future." */}
        {/* Exactly TWO balanced lines in silver-100, max-width 86vw */}
        <div data-debug="slogan" className="mt-2 text-center max-w-[86vw] px-2">
          <p className="font-display font-bold text-silver-100 leading-snug text-balance text-[clamp(13px,3.8vw,15px)] drop-shadow-md">
            Unravel the Clues. Hack the Rules.
            <br />
            Build the Future.
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ZONE B (BOTTOM, DISK + MEDALLION + BUTTON): Confined strictly here   */}
      {/* Left: Curved Disk (apex at 14vw, labels <= 52vw)                    */}
      {/* Right: 64px Icon Medallion + 2-digit index underneath               */}
      {/* Bottom: Full-width tactile Open Button                              */}
      {/* =================================================================== */}
      <div
        data-debug="zone-b"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-full flex flex-col justify-between min-h-0 overflow-hidden z-20"
      >
        {/* Main interactive area containing Disk on left and Medallion on right */}
        <div className="relative w-full flex-1 min-h-0 flex items-center">
          {/* LEFT CURVED DISK: Confined to Zone B, apex at 14vw */}
          <div
            data-debug="disk"
            className="absolute left-0 inset-y-0 w-[58vw] max-w-[260px] pointer-events-auto flex items-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
            }}
          >
            <div className="relative w-full h-full flex items-center">
              {visibleSlots.map((slot) => {
                const rawIndex = Math.round(scrollOffset) + slot
                const actualIndex = ((rawIndex % total) + total) % total
                const card = items[actualIndex]

                const offsetFromCenter = rawIndex - scrollOffset
                const itemSpacing = isSmallHeight ? 46 : 56
                const y = offsetFromCenter * itemSpacing

                // Apex reaches farthest right (14vw from left) when offsetFromCenter is 0
                // Curvature drops off smoothly as you move above/below center
                const curveFactor = Math.cos(offsetFromCenter * (Math.PI / 6))
                const x = Math.max(0, curveFactor * 18) // apex shift

                const isSelected = Math.abs(offsetFromCenter) < 0.4
                const distance = Math.abs(offsetFromCenter)
                const opacity = isSelected ? 1 : Math.max(0.18, 0.55 - distance * 0.16)
                const scale = Math.max(0.78, 1 - distance * 0.08)

                const cardTitle = card.shortTitle || card.title

                return (
                  <div
                    key={`${slot}-${actualIndex}`}
                    onClick={() => {
                      if (isSelected) {
                        router.push(card.href)
                      } else {
                        snapToNearest(rawIndex)
                      }
                    }}
                    style={{
                      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                      opacity: opacity,
                      transition: isDragging
                        ? "none"
                        : "transform 0.22s ease-out, opacity 0.22s ease-out",
                    }}
                    className="absolute left-1 flex items-center gap-2.5 py-2 px-1 cursor-pointer max-w-[52vw]"
                  >
                    {/* Gold marker dot on selected */}
                    {isSelected ? (
                      <motion.div
                        layoutId="mobile-marker-dot"
                        className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#d4a24c] shrink-0"
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/25 shrink-0" />
                    )}

                    {/* Label (Left-aligned, never wider than 52vw, one line each, NO truncation) */}
                    <span
                      className={`font-display tracking-wide whitespace-nowrap overflow-visible ${
                        isSelected
                          ? "text-[20px] font-semibold text-amber-100"
                          : "text-[15px] font-medium text-amber-400/50"
                      }`}
                      style={{
                        textShadow: isSelected
                          ? "0 0 14px rgba(212,162,76,0.6), 0 2px 10px rgba(0,0,0,0.95)"
                          : "0 2px 8px rgba(0,0,0,0.9)",
                      }}
                    >
                      {cardTitle}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT SIDE MEDALLION: 64px gold-ringed circle with selected icon + 2-digit index */}
          <div
            data-debug="medallion"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10"
          >
            <div className="relative w-16 h-16 rounded-full border-2 border-amber-400/60 bg-black/70 backdrop-blur-md shadow-[0_0_20px_rgba(212,162,76,0.35)] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCard.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center justify-center"
                >
                  {getMedallionIcon(selectedCard.iconName)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Two-digit index ("01") in small gold font underneath medallion */}
            <span className="font-mono text-[11px] font-bold text-amber-400 tracking-wider mt-1.5 drop-shadow">
              {selectedCard.number}
            </span>
          </div>

          {/* Swipe Hint at bottom-left of Zone B (fades away after first interaction) */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-2 bottom-1 flex items-center gap-1 text-[10px] font-display text-amber-300/70 tracking-widest pointer-events-none animate-pulse"
              >
                <ChevronDown className="w-3 h-3 text-amber-400" />
                <span>Swipe the disk</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FULL-WIDTH TACTILE OPEN BUTTON: 52px height, placed 16px above safe-area inset */}
        {/* Name appears once in disk and once in button (no separate duplicate caption) */}
        <div data-debug="button" className="w-full pb-[max(env(safe-area-inset-bottom,0px),12px)] pt-1 flex justify-center">
          <Link
            href={selectedCard.href}
            className="w-full h-[52px] rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 active:scale-95 text-black font-display font-bold tracking-[0.12em] flex items-center justify-center gap-2 shadow-[0_0_22px_rgba(212,162,76,0.45)] transition-all cursor-pointer px-4"
            style={{ fontSize: "clamp(11px, 3.3vw, 13px)" }}
          >
            <span className="truncate">
              OPEN {(selectedCard.shortTitle || selectedCard.title).toUpperCase()}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
