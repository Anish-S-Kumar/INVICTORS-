"use client"

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Volume2, VolumeX, ArrowRight, CornerRightDown } from "lucide-react"
import { NAVIGATION_CARDS, CLUB_METADATA } from "@/lib/content"
import {
  initDialAudio,
  playDialTick,
  playDialDetent,
  playOpenChime,
  setDialSoundMuted,
  isDialSoundMuted,
} from "@/lib/dial-sound"
import { smoothDamp } from "@/lib/smooth-damp"
import { updateDialAnchor } from "@/lib/dial-anchor"

const DIAL_ITEMS = [
  { id: "overview", number: "01", title: "Club Overview", href: "/overview", iconName: "Compass" },
  { id: "mission", number: "02", title: "Mission Statement", href: "/mission", iconName: "Target" },
  { id: "unique", number: "03", title: "Why INVICTORS", href: "/unique", iconName: "Fingerprint" },
  { id: "pillars", number: "04", title: "Core Club Pillars", href: "/pillars", iconName: "Layers" },
  { id: "events", number: "05", title: "Upcoming Events", href: "/events", iconName: "CalendarDays" },
  { id: "rank", number: "06", title: "Rank", href: "/rank", iconName: "Trophy" },
]

export function MobileRotaryDial() {
  const router = useRouter()

  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState({ width: 390, height: 750, isLandscape: false })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const zoneBRef = useRef<HTMLDivElement | null>(null)
  const dialSvgRef = useRef<SVGSVGElement | null>(null)
  const labelsGroupRef = useRef<SVGGElement | null>(null)
  const labelGroupRefs = useRef<(SVGGElement | null)[]>([])

  // Physics & Animation tracking
  const rotationAngleRef = useRef<number>(0) // in degrees
  const targetAngleRef = useRef<number>(0)
  const velocityRef = useRef<{ value: number }>({ value: 0 })
  const lastTickDegRef = useRef<number>(0)
  const selectedIndexRef = useRef<number>(0)
  const isDraggingRef = useRef<boolean>(false)
  const dragCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const lastPointerAngleRef = useRef<number>(0)
  const pointerHistoryRef = useRef<Array<{ angle: number; time: number }>>([])
  const animFrameRef = useRef<number | null>(null)

  // Measure screen dimensions and orientation
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setDimensions({
        width: w,
        height: h,
        isLandscape: w > h && h < 600,
      })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    window.addEventListener("orientationchange", updateSize)

    // Load initial mute state
    setIsMuted(isDialSoundMuted())

    return () => {
      window.removeEventListener("resize", updateSize)
      window.removeEventListener("orientationchange", updateSize)
    }
  }, [])

  // Calculate Dial Radius R: min(0.48 * width, 0.30 * height, 185)
  // Under 640px height or landscape: shrink to 0.25 * height
  const isShortScreen = dimensions.height < 640 || dimensions.isLandscape
  const maxHFactor = isShortScreen ? 0.25 : 0.30
  const R = Math.round(Math.min(0.48 * dimensions.width, maxHFactor * dimensions.height, 185))

  // Measure and publish mobile anchors (Anchor L for logo, Anchor D for dial)
  useLayoutEffect(() => {
    const publishMobileAnchors = () => {
      if (!containerRef.current) return
      const stageRect = containerRef.current.getBoundingClientRect()

      // Logo Anchor L
      let anchorL = { cx: stageRect.width / 2, cy: stageRect.height * 0.35, R: 90 }
      if (logoRef.current) {
        const lRect = logoRef.current.getBoundingClientRect()
        anchorL = {
          cx: Math.round((lRect.left - stageRect.left + lRect.width / 2) * 2) / 2,
          cy: Math.round((lRect.top - stageRect.top + lRect.height / 2) * 2) / 2,
          R: Math.round((lRect.width / 2) * 2) / 2,
        }
      }

      // Dial Anchor D
      let anchorD = { cx: stageRect.width / 2, cy: stageRect.height, R }
      if (zoneBRef.current) {
        const zRect = zoneBRef.current.getBoundingClientRect()
        anchorD = {
          cx: Math.round((zRect.left - stageRect.left + zRect.width / 2) * 2) / 2,
          cy: Math.round((zRect.bottom - stageRect.top) * 2) / 2,
          R,
        }
      }

      updateDialAnchor(
        {
          anchor: anchorD,
          anchorL,
          anchorD,
        },
        containerRef.current
      )
    }

    publishMobileAnchors()
    const ro = new ResizeObserver(publishMobileAnchors)
    if (containerRef.current) ro.observe(containerRef.current)
    if (logoRef.current) ro.observe(logoRef.current)
    if (zoneBRef.current) ro.observe(zoneBRef.current)

    return () => ro.disconnect()
  }, [R, dimensions])

  // ---------------------------------------------------------------------------
  // MAIN PHYSICS LOOP (SmoothDamp snapping & continuous rotation)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let lastTime = performance.now()

    const animateLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 1 / 30)
      lastTime = time

      if (!isDraggingRef.current) {
        // Smoothly snap to target detent
        const prevAngle = rotationAngleRef.current
        const nextAngle = smoothDamp(
          prevAngle,
          targetAngleRef.current,
          velocityRef.current,
          0.10, // smoothTime ~0.10s
          Infinity,
          dt
        )
        rotationAngleRef.current = nextAngle

        // Tick sounds during snapping movement
        const degDiff = nextAngle - lastTickDegRef.current
        if (Math.abs(degDiff) >= 10) {
          const ticks = Math.floor(Math.abs(degDiff) / 10)
          for (let i = 0; i < Math.min(3, ticks); i++) {
            playDialTick(velocityRef.current.value / 100)
          }
          lastTickDegRef.current = nextAngle
        }

        // Check if settled on detent
        if (
          Math.abs(nextAngle - targetAngleRef.current) < 0.1 &&
          Math.abs(velocityRef.current.value) < 0.5
        ) {
          rotationAngleRef.current = targetAngleRef.current
          velocityRef.current.value = 0
        }
      }

      const curAngle = rotationAngleRef.current

      // Calculate current item at 12 o'clock pointer (normalized to 0..5)
      const rawDetent = -curAngle / 60
      const normalizedDetent = ((Math.round(rawDetent) % 6) + 6) % 6

      if (normalizedDetent !== selectedIndexRef.current) {
        selectedIndexRef.current = normalizedDetent
        setSelectedIndex(normalizedDetent)
        playDialDetent()
      }

      // Update SVG rotation directly (bypassing React re-renders)
      if (labelsGroupRef.current) {
        labelsGroupRef.current.setAttribute("transform", `rotate(${curAngle.toFixed(2)} 500 500)`)
      }

      // Update per-label opacity ONLY (DO NOT touch style.transform, which destroys SVG rotate!)
      labelGroupRefs.current.forEach((el, idx) => {
        if (!el) return
        const angleRel = (((idx * 60 + curAngle) % 360) + 540) % 360 - 180
        const absAngle = Math.abs(angleRel)

        if (absAngle <= 35) {
          // Selected label at 12 o'clock notch: full 100% opacity
          el.style.opacity = "1"
        } else if (absAngle <= 100) {
          // Visible adjacent options on the dial face: clearly visible at 85% opacity
          el.style.opacity = "0.85"
        } else if (absAngle <= 145) {
          // Lower visible marks along the dial rim: 65% opacity
          el.style.opacity = "0.65"
        } else {
          // Hidden below horizon
          el.style.opacity = "0"
        }
      })

      animFrameRef.current = requestAnimationFrame(animateLoop)
    }

    animFrameRef.current = requestAnimationFrame(animateLoop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // ANGULAR DRAG GESTURE (atan2 with pointer capture)
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    initDialAudio() // Unlock Web Audio context on mobile touch
    setHasInteracted(true)

    const zoneEl = zoneBRef.current
    if (!zoneEl) return

    const rect = zoneEl.getBoundingClientRect()
    // Dial center sits on the bottom edge horizontally centered
    const cx = rect.left + rect.width / 2
    const cy = rect.bottom
    dragCenterRef.current = { x: cx, y: cy }

    // Pointer angle around dial center: atan2(x - cx, cy - y) in degrees
    const dx = e.clientX - cx
    const dy = cy - e.clientY // dy is positive upwards
    const angleDeg = (Math.atan2(dx, dy) * 180) / Math.PI

    lastPointerAngleRef.current = angleDeg
    isDraggingRef.current = true
    velocityRef.current.value = 0
    pointerHistoryRef.current = [{ angle: angleDeg, time: performance.now() }]

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    const { x: cx, y: cy } = dragCenterRef.current
    const dx = e.clientX - cx
    const dy = cy - e.clientY
    const angleDeg = (Math.atan2(dx, dy) * 180) / Math.PI

    let dAngle = angleDeg - lastPointerAngleRef.current
    // Unwrap across +-180 degrees
    if (dAngle > 180) dAngle -= 360
    if (dAngle < -180) dAngle += 360

    lastPointerAngleRef.current = angleDeg
    rotationAngleRef.current += dAngle

    // Tick sound every 10 degrees during drag
    const degFromLastTick = rotationAngleRef.current - lastTickDegRef.current
    if (Math.abs(degFromLastTick) >= 10) {
      playDialTick(1)
      lastTickDegRef.current = rotationAngleRef.current
    }

    // Keep history for momentum flick calculation
    const now = performance.now()
    pointerHistoryRef.current.push({ angle: angleDeg, time: now })
    pointerHistoryRef.current = pointerHistoryRef.current.filter((p) => now - p.time <= 80)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    // Calculate angular velocity from last 80ms (degrees per second)
    const history = pointerHistoryRef.current
    let angularVel = 0
    if (history.length >= 2) {
      const oldest = history[0]
      const newest = history[history.length - 1]
      const dt = (newest.time - oldest.time) / 1000
      let dAng = newest.angle - oldest.angle
      if (dAng > 180) dAng -= 360
      if (dAng < -180) dAng += 360
      if (dt > 0.01) {
        angularVel = dAng / dt
      }
    }

    // Cap flick to at most 2 detents (120 degrees)
    const flickDetents = Math.max(-2, Math.min(2, Math.round(angularVel * 0.15 / 60)))
    const currentAngle = rotationAngleRef.current
    const currentDetent = -currentAngle / 60
    const targetDetent = Math.round(currentDetent) + flickDetents

    targetAngleRef.current = -targetDetent * 60
    velocityRef.current.value = angularVel
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    initDialAudio()
    setHasInteracted(true)

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const nextIdx = (selectedIndex + 1) % 6
      targetAngleRef.current = -nextIdx * 60
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prevIdx = ((selectedIndex - 1) % 6 + 6) % 6
      targetAngleRef.current = -prevIdx * 60
    } else if (e.key === "Enter") {
      e.preventDefault()
      handleOpenPage()
    }
  }

  // Handle opening selected section
  const handleOpenPage = () => {
    playOpenChime()
    const activeItem = DIAL_ITEMS[selectedIndex]
    if (activeItem) {
      router.push(activeItem.href)
    }
  }

  // Toggle Mute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    setDialSoundMuted(nextMuted)
  }

  const selectedItem = DIAL_ITEMS[selectedIndex] || DIAL_ITEMS[0]

  // Render SVG icons inside medallion
  const renderIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return (
          <path
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 6.2-2.1 5.7a1 1 0 0 1-.6.6l-5.7 2.1 2.1-5.7a1 1 0 0 1 .6-.6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      case "Target":
        return (
          <>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </>
        )
      case "Fingerprint":
        return (
          <path
            d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M2 16h.01M21.8 16c.2-2 .131-5.354 0-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2M8.65 22c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2v2M18 12a2 2 0 0 0 2-2c0-3.3-2.7-6-6-6a6 6 0 0 0-6 6M12 2a10 10 0 0 0-10 10c0 3.3 1 6.5 2.5 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      case "Layers":
        return (
          <>
            <path
              d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </>
        )
      case "CalendarDays":
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="14" r="1" fill="currentColor" />
            <circle cx="8" cy="18" r="1" fill="currentColor" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </>
        )
      case "Trophy":
        return (
          <path
            d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34M7 2h10v7a5 5 0 0 1-10 0Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      default:
        return <circle cx="12" cy="12" r="5" fill="currentColor" />
    }
  }

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="INVICTORS Navigation Rotary Dial"
      aria-activedescendant={`dial-item-${selectedIndex}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full flex select-none overflow-hidden outline-none ${
        dimensions.isLandscape ? "flex-row" : "flex-col justify-between"
      }`}
      style={{
        height: "100%",
        maxHeight: "100%",
      }}
    >
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        Selected: {selectedItem.number} {selectedItem.title}
      </div>

      {/* =================================================================== */}
      {/* ZONE A: IDENTITY BLOCK (Centred vertically between header and dial)  */}
      {/* =================================================================== */}
      <div
        data-debug="zone-a"
        className={`flex flex-col items-center justify-center px-4 z-10 transition-all ${
          dimensions.isLandscape
            ? "w-1/2 h-full justify-center"
            : "flex-1 min-h-0 w-full py-1"
        }`}
      >
        {/* INVICTORS Logo Emblem - Enlarged for crisp text readability inside symbol */}
        <div
          ref={logoRef}
          data-debug="logo"
          className="relative rounded-full overflow-hidden shadow-[0_0_36px_rgba(212,162,76,0.5)] border-2 border-amber-400/80 shrink-0"
          style={{
            width: isShortScreen ? "clamp(120px, 36vw, 145px)" : "clamp(160px, 50vw, 210px)",
            height: isShortScreen ? "clamp(120px, 36vw, 145px)" : "clamp(160px, 50vw, 210px)",
          }}
        >
          <Image
            src="/assets/invictors-logo.png"
            alt="INVICTORS Emblem"
            fill
            priority
            sizes="(max-width: 640px) 240px, 320px"
            className="object-cover"
          />
        </div>

        {/* MOTTO: ONE Line in Gold */}
        <div data-debug="motto" className="mt-2 text-center shrink-0">
          <span
            className="font-display font-bold text-gradient-gold uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(212,162,76,0.4)]"
            style={{ fontSize: isShortScreen ? "10px" : "clamp(11px, 2.9vw, 13px)" }}
          >
            {CLUB_METADATA.motto}
          </span>
        </div>

        {/* SLOGAN: Exactly TWO balanced lines in Silver-100 */}
        <div data-debug="slogan" className="mt-0.5 text-center font-display font-medium text-silver-100 flex flex-col leading-tight shrink-0">
          <span style={{ fontSize: isShortScreen ? "10px" : "clamp(10.5px, 2.8vw, 12.5px)", letterSpacing: "0.02em" }}>
            Unravel the Clues. Hack the Rules.
          </span>
          <span style={{ fontSize: isShortScreen ? "10px" : "clamp(10.5px, 2.8vw, 12.5px)", letterSpacing: "0.02em" }} className="text-silver-300">
            Build the Future.
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ZONE B: ROTARY DIAL AT BOTTOM (Semicircle rising from bottom edge)  */}
      {/* =================================================================== */}
      <div
        ref={zoneBRef}
        data-debug="zone-b"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative z-20 flex flex-col items-center justify-end overflow-visible touch-none cursor-grab active:cursor-grabbing shrink-0 ${
          dimensions.isLandscape ? "w-1/2 h-full" : "w-full"
        }`}
        style={{
          height: `${R + 12}px`,
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 10px)",
        }}
      >
        {/* Mute / Unmute Toggle Button (Top-Right of Zone B, above rim) */}
        <button
          onClick={handleToggleMute}
          aria-label={isMuted ? "Unmute dial sound" : "Mute dial sound"}
          aria-pressed={isMuted}
          className="absolute top-0 right-4 z-30 w-9 h-9 rounded-full border border-amber-500/30 bg-black/80 flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-400 transition-all backdrop-blur-md cursor-pointer shadow-lg active:scale-95"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-silver-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* "Turn the dial" Curved Hint above rim (Fades after first interaction) */}
        {!hasInteracted && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-black/85 text-amber-300/90 text-[10.5px] font-display tracking-widest backdrop-blur-md animate-bounce shadow-md">
            <span>Turn the dial</span>
            <CornerRightDown className="w-3 h-3 text-amber-400" />
          </div>
        )}

        {/* 12 o'clock Fixed Gold Pointer Notch */}
        <div
          className="absolute z-30 pointer-events-none flex flex-col items-center"
          style={{
            top: "2px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* Triangular notch */}
          <div
            className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-400 drop-shadow-[0_0_6px_rgba(212,162,76,0.8)]"
          />
        </div>

        {/* ================================================================= */}
        {/* ONE CONCENTRIC SVG FOR THE ROTARY DIAL (viewBox 0 0 1000 1000)   */}
        {/* Center: (500, 500) positioned at bottom center of Zone B          */}
        {/* ================================================================= */}
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            width: `${2 * R}px`,
            height: `${2 * R}px`,
            left: "50%",
            bottom: "0px",
            transform: "translate(-50%, 50%)", // Bottom edge is at center (500, 500)
          }}
        >
          <svg
            ref={dialSvgRef}
            viewBox="0 0 1000 1000"
            className="w-full h-full overflow-visible pointer-events-auto"
          >
            <defs>
              {/* Gold gradient for inner rim & text */}
              <linearGradient id="mobileDialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="50%" stopColor="#f1d58a" />
                <stop offset="100%" stopColor="#d4a24c" />
              </linearGradient>

              {/* Chrome rim gradient */}
              <linearGradient id="mobileChromeRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#cfcfcf" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7a7a7a" stopOpacity="0.8" />
              </linearGradient>

              {/* Soft gold glow for selected 12 o'clock notch */}
              <radialGradient id="notchGlow" cx="50%" cy="12%" r="20%">
                <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dial Face Background (Black glass) */}
            <circle cx="500" cy="500" r="490" fill="#08080a" />
            <circle cx="500" cy="500" r="490" fill="url(#notchGlow)" />

            {/* Chrome Outer Rim */}
            <circle cx="500" cy="500" r="490" stroke="url(#mobileChromeRim)" strokeWidth="4" fill="none" />

            {/* Gold Inner Rim */}
            <circle cx="500" cy="500" r="474" stroke="url(#mobileDialGold)" strokeWidth="2.5" fill="none" opacity="0.85" />

            {/* Inner Face Division Line (r = 310 = 0.62 R) */}
            <circle cx="500" cy="500" r="310" stroke="rgba(212, 162, 76, 0.4)" strokeWidth="1.5" strokeDasharray="6 4" fill="#050507" />

            {/* ROTATING ELEMENTS GROUP: Ticks, Nodes, Circuit Traces & Labels */}
            <g ref={labelsGroupRef}>
              {/* 36 Tick Marks (every 10 degrees) */}
              {Array.from({ length: 36 }).map((_, i) => {
                const deg = i * 10
                const isItemPos = i % 6 === 0
                const rad = (deg * Math.PI) / 180
                const r1 = isItemPos ? 438 : 455
                const r2 = 472
                const strokeColor = isItemPos ? "#fff3c4" : "rgba(212, 162, 76, 0.35)"
                const strokeW = isItemPos ? 2.5 : 1.2

                return (
                  <line
                    key={i}
                    x1={500 + r1 * Math.sin(rad)}
                    y1={500 - r1 * Math.cos(rad)}
                    x2={500 + r2 * Math.sin(rad)}
                    y2={500 - r2 * Math.cos(rad)}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                  />
                )
              })}

              {/* Gold Node at each of the 6 item positions */}
              {Array.from({ length: 6 }).map((_, i) => {
                const deg = i * 60
                const rad = (deg * Math.PI) / 180
                const nx = 500 + 430 * Math.sin(rad)
                const ny = 500 - 430 * Math.cos(rad)
                return (
                  <circle
                    key={`node-${i}`}
                    cx={nx}
                    cy={ny}
                    r="4"
                    fill="#fff3c4"
                    stroke="#d4a24c"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 0 4px rgba(212,162,76,0.8))"
                  />
                )
              })}

              {/* Faint Concentric Circuit Ring */}
              <circle cx="500" cy="500" r="360" stroke="rgba(212, 162, 76, 0.15)" strokeWidth="1" strokeDasharray="8 6" fill="none" />

              {/* THE 6 LABELS: Tangent to radius 400 (0.80 R) at 60-degree intervals */}
              {DIAL_ITEMS.map((item, idx) => {
                const itemAngle = idx * 60

                return (
                  <g
                    key={item.id}
                    ref={(el) => {
                      labelGroupRefs.current[idx] = el
                    }}
                    transform={`rotate(${itemAngle} 500 500)`}
                    role="option"
                    aria-selected={selectedIndex === idx}
                    onClick={() => {
                      if (selectedIndex === idx) {
                        handleOpenPage()
                      } else {
                        targetAngleRef.current = -idx * 60
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {/* Index "01"-"06" directly below inside of the dial stick at radius 412 */}
                    <text
                      x="500"
                      y={500 - 410}
                      textAnchor="middle"
                      fill="#f1d58a"
                      className="font-mono font-bold tracking-widest uppercase select-none"
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      {item.number}
                    </text>

                    {/* Full Dashboard Name Centred along tangent at radius 365 below inside dial stick */}
                    <text
                      x="500"
                      y={500 - 365}
                      textAnchor="middle"
                      fill="#fff3c4"
                      className="font-display font-bold select-none transition-colors"
                      style={{
                        fontSize: "34px",
                        letterSpacing: "0.03em",
                        paintOrder: "stroke fill",
                        stroke: "#08080a",
                        strokeWidth: "6px",
                        strokeLinejoin: "round",
                      }}
                    >
                      {item.title}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* ================================================================= */}
        {/* INNER DIAL FACE (HTML Elements inside radius 0.62 R)              */}
        {/* Centered with clear spacing: Medallion + OPEN Pill                */}
        {/* ================================================================= */}
        <div
          className="absolute z-20 flex flex-col items-center justify-between pointer-events-none"
          style={{
            bottom: "max(env(safe-area-inset-bottom, 0px), 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(88vw, 290px)",
            height: `${R * 0.58}px`,
          }}
        >
          {/* 48px-52px Gold-ringed Medallion with crossfading icon */}
          <div
            data-debug="medallion"
            className="w-12 h-12 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/80 to-black flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(212,162,76,0.45)] transition-transform duration-300 pointer-events-auto"
            onClick={handleOpenPage}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="transition-all duration-300">
              {renderIcon(selectedItem.iconName)}
            </svg>
          </div>

          {/* ONE Gold Gradient Pill: "OPEN <SELECTED NAME> ->" */}
          <button
            data-debug="button"
            onClick={handleOpenPage}
            className="w-full max-w-[270px] h-10 sm:h-11 px-4 rounded-full border border-amber-400 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(212,162,76,0.5)] transition-all duration-200 active:scale-95 pointer-events-auto cursor-pointer"
          >
            <span className="truncate">OPEN {selectedItem.title.toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}
