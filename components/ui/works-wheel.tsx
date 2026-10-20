"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Compass, Target, Sparkles, Layers, CalendarDays, Trophy, ChevronDown } from "lucide-react"
import { NAVIGATION_CARDS, CLUB_METADATA } from "@/lib/content"

interface WorksWheelProps {
  items?: typeof NAVIGATION_CARDS
  actionLabel?: string
  className?: string
}

export function WorksWheel({
  items = NAVIGATION_CARDS,
  actionLabel = "Open",
  className = "",
}: WorksWheelProps) {
  const router = useRouter()

  // turn represents continuous animation progress:
  // 0 = resting ring, 1 = drum open at item 0, 2 = drum at item 1, etc.
  const [turn, setTurn] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Move settling ref above effects as required by specification
  const settling = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navIndexRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const turnRef = useRef(0)
  const activeIndexRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  turnRef.current = turn
  activeIndexRef.current = activeIndex

  // Check prefers-reduced-motion
  useEffect(() => {
    try {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(media.matches)
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {
      // ignore
    }
  }, [])

  // Non-passive wheel listener attached to container to prevent page scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault() // Strictly stop wheel from scrolling page on "/"
      setHasInteracted(true)

      const delta = e.deltaY
      if (Math.abs(delta) < 8) return

      const step = delta > 0 ? 0.35 : -0.35
      // Clamp between 0 (ring) and items.length - 1 (last drum item)
      const targetTurn = Math.max(0, Math.min(items.length - 1, turnRef.current + step))
      
      setTurn(targetTurn)
      const newActive = Math.min(items.length - 1, Math.max(0, Math.round(targetTurn)))
      setActiveIndex(newActive)
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [items.length])

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    setHasInteracted(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const diff = e.clientY - dragStartY.current
    if (Math.abs(diff) > 15) {
      const step = diff < 0 ? 0.25 : -0.25
      const targetTurn = Math.max(0, Math.min(items.length - 1, turnRef.current + step))
      setTurn(targetTurn)
      const newActive = Math.min(items.length - 1, Math.max(0, Math.round(targetTurn)))
      setActiveIndex(newActive)
      dragStartY.current = e.clientY
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        setHasInteracted(true)
        setTurn((prev) => {
          const next = Math.min(items.length - 1, prev < 0.5 ? 1 : Math.floor(prev) + 1)
          setActiveIndex(Math.round(next))
          return next
        })
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        setHasInteracted(true)
        setTurn((prev) => {
          const next = Math.max(0, prev <= 1 ? 0 : Math.ceil(prev) - 1)
          setActiveIndex(Math.round(next))
          return next
        })
      } else if (e.key === "Enter") {
        const currentItem = items[activeIndexRef.current]
        if (currentItem) {
          router.push(currentItem.href)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [items, router])

  // Sync right-hand navigation index and center logo visibility in rAF (Change 3)
  useEffect(() => {
    const updateOverlays = () => {
      const m = Math.max(0, Math.min(1, turnRef.current))

      if (navIndexRef.current) {
        navIndexRef.current.style.opacity = String(m)
        navIndexRef.current.style.pointerEvents = m > 0.6 ? "auto" : "none"
        navIndexRef.current.setAttribute("aria-hidden", m < 0.6 ? "true" : "false")
      }

      if (logoRef.current) {
        logoRef.current.style.opacity = String(Math.max(0, 1 - m * 1.5))
        logoRef.current.style.pointerEvents = m > 0.4 ? "none" : "auto"
      }

      animFrameRef.current = requestAnimationFrame(updateOverlays)
    }

    animFrameRef.current = requestAnimationFrame(updateOverlays)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Icon mapping
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="w-4 h-4 text-amber-300" />
      case "Target":
        return <Target className="w-4 h-4 text-amber-300" />
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-amber-300" />
      case "Layers":
        return <Layers className="w-4 h-4 text-amber-300" />
      case "CalendarDays":
        return <CalendarDays className="w-4 h-4 text-amber-300" />
      case "Trophy":
        return <Trophy className="w-4 h-4 text-amber-300" />
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />
    }
  }

  // Morph factor m: 0 = Ring, 1 = Drum
  const m = Math.max(0, Math.min(1, turn))
  const total = items.length

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ perspective: "1100px" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,162,76,0.1)_0%,rgba(5,5,5,0)_70%)]" />
      </div>

      {/* ============================================================== */}
      {/* 1. CENTERPIECE: INVICTORS LOGO + MOTTO + SLOGAN                */}
      {/* Visible in Ring state (turn = 0), fades out as drum opens      */}
      {/* ============================================================== */}
      <div
        ref={logoRef}
        className="absolute z-10 flex flex-col items-center justify-center text-center px-4 max-w-lg transition-transform duration-300 pointer-events-auto"
        style={{
          transform: `scale(${1 - m * 0.15})`,
          transition: prefersReducedMotion ? "none" : "transform 0.4s ease-out",
        }}
      >
        {/* Emblem with breathing glow and rotating thin rings */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute w-44 h-44 rounded-full border border-amber-500/25 animate-spin-slow pointer-events-none" />
          <div className="absolute w-40 h-40 rounded-full border border-dashed border-amber-400/20 animate-spin-reverse pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full bg-amber-500/10 blur-xl animate-pulse-gold pointer-events-none" />

          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-[0_0_30px_rgba(212,162,76,0.4)]">
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
        <div className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] text-gradient-gold uppercase drop-shadow-[0_0_8px_rgba(212,162,76,0.3)]">
          {CLUB_METADATA.motto}
        </div>

        {/* Hero Official Club Slogan */}
        <h2 className="font-display text-sm sm:text-base font-bold tracking-wider text-silver-100 mt-1 px-2 leading-snug drop-shadow-md max-w-md">
          &ldquo;{CLUB_METADATA.slogan}&rdquo;
        </h2>
      </div>

      {/* ============================================================== */}
      {/* 2. THE SIX CARDS (RING / 3D DRUM MORPHING)                       */}
      {/* ONLY TITLE + NUMBER + ICON (NO DESCRIPTIONS)                   */}
      {/* ============================================================== */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((card, index) => {
          // Circular Ring calculations:
          // Tuned radius (250px) and card size (200x78) ensures NO overlap with central logo even on 1366x768
          const ringRadius = 255
          const angleDeg = (index * 360) / total - 90
          const angleRad = (angleDeg * Math.PI) / 180
          const ringX = Math.cos(angleRad) * ringRadius
          const ringY = Math.sin(angleRad) * ringRadius
          const ringRotate = angleDeg + 90

          // Vertical 3D Drum calculations:
          let offset = index - activeIndex
          if (offset > total / 2) offset -= total
          if (offset < -total / 2) offset += total

          const drumY = offset * 130
          const drumZ = -Math.abs(offset) * 150
          const drumRotateX = -offset * 32
          const isFront = offset === 0

          // Interpolation based on morph factor m
          const posX = (1 - m) * ringX + m * 0
          const posY = (1 - m) * ringY + m * drumY
          const posZ = (1 - m) * 0 + m * drumZ
          const rotZ = (1 - m) * ringRotate + m * 0
          const rotX = m * drumRotateX

          const scale = (1 - m) * 0.95 + m * (isFront ? 1.08 : Math.max(0.68, 1 - Math.abs(offset) * 0.16))
          const opacity = (1 - m) * 0.95 + m * (isFront ? 1 : Math.max(0.18, 1 - Math.abs(offset) * 0.42))

          // Short card title for clean legibility without wrapping overflow
          const cardTitle = card.shortTitle || card.title

          return (
            <div
              key={card.id}
              onClick={() => {
                if (m < 0.5) {
                  // If in ring, open drum focused on that card
                  setActiveIndex(index)
                  setTurn(Math.max(1, index))
                  setHasInteracted(true)
                } else if (!isFront) {
                  setActiveIndex(index)
                  setTurn(index)
                }
              }}
              style={{
                position: "absolute",
                transform: `translate3d(${posX}px, ${posY}px, ${posZ}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: isFront ? 30 : 20 - Math.abs(offset),
                transformStyle: "preserve-3d",
                transition: prefersReducedMotion
                  ? "opacity 0.2s"
                  : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
              }}
              className="pointer-events-auto cursor-pointer"
            >
              {/* Card Face: Sleek, compact high-tech capsule showing ONLY Title, Number, and Icon */}
              <div
                className={`group relative w-48 sm:w-56 h-20 sm:h-22 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 light-sweep-container ${
                  isFront && m > 0.5
                    ? "glass-panel-gold border-amber-400 shadow-[0_0_25px_rgba(212,162,76,0.35)] scale-105"
                    : "glass-panel hover:border-amber-400/80 hover:shadow-[0_0_15px_rgba(212,162,76,0.25)]"
                }`}
              >
                {/* Top Row: Index number & Icon */}
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    {card.number}
                  </span>
                  <div className="p-1 rounded-md bg-black/60 border border-amber-500/20 text-amber-300">
                    {getIcon(card.iconName)}
                  </div>
                </div>

                {/* Card Title (Legible, balanced, counter-scaled clamp) */}
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className="font-display font-bold text-gradient-gold tracking-wide leading-tight line-clamp-2"
                    style={{ fontSize: "clamp(12px, 1.1vw, 15px)" }}
                  >
                    {cardTitle}
                  </h3>

                  {/* Open Pill when front card */}
                  {isFront && m > 0.5 && (
                    <Link
                      href={card.href}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display text-[11px] font-bold tracking-wider shadow-[0_0_10px_rgba(212,162,76,0.4)]"
                    >
                      <span>{actionLabel}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. RIGHT-HAND INDEX LIST (CHANGE 3)                            */}
      {/* Hidden when ring is at rest (turn=0), fades in as drum opens   */}
      {/* ============================================================== */}
      <div
        ref={navIndexRef}
        style={{ opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-amber-500/25 shadow-2xl transition-opacity duration-200"
      >
        <div className="text-[10px] font-display tracking-widest text-silver-300/60 uppercase pb-1 border-b border-amber-500/20 px-2">
          NAVIGATION
        </div>

        {items.map((card, idx) => {
          const isActive = activeIndex === idx
          return (
            <button
              key={card.id}
              onClick={() => {
                setActiveIndex(idx)
                setTurn(Math.max(1, idx))
              }}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer font-display text-xs tracking-wider ${
                isActive
                  ? "bg-amber-950/70 border border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(212,162,76,0.3)]"
                  : "text-silver-300/70 hover:text-amber-300 hover:bg-black/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-transform ${
                  isActive
                    ? "bg-amber-400 scale-125 shadow-[0_0_8px_#d4a24c]"
                    : "bg-silver-500/40"
                }`}
              />
              <span className="font-mono text-[10px] text-amber-500/80">{card.number}</span>
              <span className="line-clamp-1">{card.shortTitle || card.title}</span>
            </button>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. OVERLAID HINT (Fades out after first interaction)           */}
      {/* ============================================================== */}
      {!hasInteracted && m < 0.2 && (
        <div className="absolute bottom-6 z-20 pointer-events-none flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/25 bg-black/70 text-amber-300/90 text-[11px] font-display tracking-widest backdrop-blur-md animate-bounce shadow-md">
            <ChevronDown className="w-3 h-3 text-amber-400" />
            <span>Scroll or drag to turn the wheel</span>
          </div>
        </div>
      )}

      {/* Front card title indicator on bottom-left when drum is open (NO description) */}
      {m > 0.5 && (
        <div className="absolute left-6 sm:left-10 bottom-6 z-30 flex flex-col pointer-events-none animate-fadeIn">
          <div className="font-display text-[10px] text-amber-400/90 tracking-[0.2em] uppercase">
            SELECTED SECTION
          </div>
          <div className="font-display text-lg sm:text-2xl font-bold text-gradient-gold">
            {items[activeIndex]?.title}
          </div>
        </div>
      )}
    </div>
  )
}
