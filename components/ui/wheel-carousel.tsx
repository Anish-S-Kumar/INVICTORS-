"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Compass, Target, Sparkles, Layers, CalendarDays, Trophy } from "lucide-react"
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
  const [scrollOffset, setScrollOffset] = useState(0) // fractional item offset
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [snapPulse, setSnapPulse] = useState(false)

  const pointerStartY = useRef(0)
  const pointerStartTime = useRef(0)
  const currentOffset = useRef(0)
  const velocity = useRef(0)
  const animFrame = useRef<number | null>(null)
  const lastIndex = useRef(0)

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
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3)
        const nextVal = startVal + (nearest - startVal) * ease

        currentOffset.current = nextVal
        setScrollOffset(nextVal)

        // normalize index
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
    const itemHeight = 65 // pixels per item
    const deltaItems = -deltaY / itemHeight

    const nextVal = currentOffset.current + deltaItems
    setScrollOffset(nextVal)

    // Calculate velocity for inertial throw
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

    // Apply inertia throw based on velocity
    const throwDistance = velocity.current * 180
    const targetOffset = currentOffset.current + throwDistance
    snapToNearest(targetOffset)
  }

  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [])

  // Icon mapping for selected card
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="w-12 h-12 text-amber-400" />
      case "Target":
        return <Target className="w-12 h-12 text-amber-400" />
      case "Sparkles":
        return <Sparkles className="w-12 h-12 text-amber-400" />
      case "Layers":
        return <Layers className="w-12 h-12 text-amber-400" />
      case "CalendarDays":
        return <CalendarDays className="w-12 h-12 text-amber-400" />
      case "Trophy":
        return <Trophy className="w-12 h-12 text-amber-400" />
      default:
        return <Sparkles className="w-12 h-12 text-amber-400" />
    }
  }

  const selectedCard = items[selectedIndex]

  // Visible items range [-2.5 ... 2.5]
  const total = items.length
  const visibleSlots = [-2, -1, 0, 1, 2]

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none touch-none pb-[env(safe-area-inset-bottom)] flex flex-col justify-between ${className}`}
    >
      {/* Soft icon crossfade background for selected card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCard.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            {getIcon(selectedCard.iconName)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================================== */}
      {/* CENTERPIECE: INVICTORS LOGO (60-65vw) + MOTTO + SLOGAN           */}
      {/* Sits at z=10, slightly behind left disk labels (z=20)          */}
      {/* ============================================================== */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        {/* Logo Container */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-[68vw] max-w-[280px] aspect-square rounded-full border border-amber-500/25 animate-spin-slow pointer-events-none" />
          <div className="absolute w-[64vw] max-w-[260px] aspect-square rounded-full border border-dashed border-amber-400/20 animate-spin-reverse pointer-events-none" />
          <div className="absolute w-[58vw] max-w-[240px] aspect-square rounded-full bg-amber-500/10 blur-xl animate-pulse-gold pointer-events-none" />

          <div
            className={`relative w-[60vw] max-w-[240px] aspect-square rounded-full overflow-hidden border-2 border-amber-500/60 shadow-[0_0_30px_rgba(212,162,76,0.4)] transition-transform duration-200 ${
              snapPulse ? "scale-[1.02]" : "scale-100"
            }`}
          >
            <Image
              src="/assets/invictors-logo.png"
              alt="INVICTORS Emblem"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Motto: DECODE. INNOVATE. OVERCOME. */}
        <div className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] text-gradient-gold uppercase drop-shadow-[0_0_8px_rgba(212,162,76,0.35)] text-center">
          {CLUB_METADATA.motto}
        </div>

        {/* Hero Official Club Slogan */}
        <p className="font-display text-xs sm:text-sm font-bold tracking-wider text-silver-100 text-center max-w-xs mt-1 leading-snug drop-shadow-md">
          &ldquo;{CLUB_METADATA.slogan}&rdquo;
        </p>
      </div>

      {/* ============================================================== */}
      {/* LEFT EDGE ARC DISK: Six names curving along an arc             */}
      {/* ============================================================== */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-[340px] z-20 pointer-events-auto flex items-center"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="relative w-full h-full">
          {visibleSlots.map((slot) => {
            const rawIndex = Math.round(scrollOffset) + slot
            const actualIndex = ((rawIndex % total) + total) % total
            const card = items[actualIndex]

            // Precise offset relative to continuous scroll
            const offsetFromCenter = rawIndex - scrollOffset
            const y = offsetFromCenter * 62 // vertical spacing

            // Arc geometry: apex reaches farthest right when offsetFromCenter is 0
            // Curve equation: x = cos(angle)
            const angle = (offsetFromCenter * Math.PI) / 6.5
            const arcOffset = Math.cos(angle) * 38 // shifts right toward center
            const x = Math.max(0, arcOffset)

            const isSelected = Math.abs(offsetFromCenter) < 0.4
            const distance = Math.abs(offsetFromCenter)
            const opacity = Math.max(0.15, 1 - distance * 0.38)
            const scale = Math.max(0.75, 1 - distance * 0.08)

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
                  transform: `translate3d(${x}px, ${y + 140}px, 0) scale(${scale})`,
                  opacity: opacity,
                  transition: isDragging ? "none" : "transform 0.25s ease-out, opacity 0.25s ease-out",
                }}
                className="absolute left-2 flex items-center gap-2.5 py-2.5 px-2 rounded-xl cursor-pointer min-h-[44px]"
              >
                {/* Marker dot on selected */}
                {isSelected ? (
                  <motion.div
                    layoutId="marker-dot"
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#d4a24c] shrink-0"
                  />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30 shrink-0" />
                )}

                {/* Index number & title with text shadow to ensure crisp legibility over logo */}
                <span
                  className={`font-mono text-xs font-bold ${
                    isSelected ? "text-amber-300" : "text-amber-500/40"
                  }`}
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                >
                  {card.number}
                </span>

                <span
                  className={`font-display text-xs sm:text-sm font-bold tracking-wide line-clamp-1 ${
                    isSelected
                      ? "text-amber-100 font-extrabold text-shadow-md"
                      : "text-amber-400/45"
                  }`}
                  style={{
                    textShadow: isSelected
                      ? "0 0 14px rgba(212,162,76,0.6), 0 2px 10px rgba(0,0,0,0.95)"
                      : "0 2px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  {card.shortTitle || card.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Swipe disk hint (fades out after first interaction) */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-6 top-[22%] z-20 flex items-center gap-1.5 text-[11px] font-display text-amber-300/80 tracking-widest pointer-events-none animate-pulse"
          >
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Swipe the disk</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* BOTTOM THUMB-REACH CONTROLS: Gold "Open" Button + Title Pill   */}
      {/* ============================================================== */}
      <div className="mt-auto pb-6 pt-2 px-5 flex flex-col items-center gap-2.5 z-30 pointer-events-auto">
        {/* Selected card title chip (No descriptions on dashboard) */}
        <div className="text-center">
          <div className="font-display text-xs text-amber-400 font-semibold tracking-wider">
            {selectedCard.number} // {selectedCard.shortTitle || selectedCard.title}
          </div>
        </div>

        {/* Big tactile thumb-reach Open Button */}
        <Link
          href={selectedCard.href}
          className="w-full max-w-xs h-11 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 active:scale-95 text-black font-display text-xs sm:text-sm font-bold tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,162,76,0.45)] transition-all cursor-pointer"
        >
          <span>OPEN {(selectedCard.shortTitle || selectedCard.title).toUpperCase()}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  )
}
