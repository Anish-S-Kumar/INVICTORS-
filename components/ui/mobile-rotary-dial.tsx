"use client"

import React, { useState, useEffect, useRef } from "react"
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

const DIAL_ITEMS = NAVIGATION_CARDS.map((c) => ({
  id: c.id,
  number: c.number,
  // Section C: Selected label shows full name ("Club Overview", "Mission Statement", "Why INVICTORS", "Core Club Pillars", "Upcoming Events", "Rank")
  title: c.id === "unique" ? "Why INVICTORS" : c.title,
  shortTitle: c.shortTitle || c.title,
  // Section C: Short names: "Overview", "Mission", "Why INVICTORS", "Pillars", "Events", "Rank"
  dialLabel: c.dialLabel || c.shortTitle || c.title,
  href: c.href,
  iconName: c.iconName,
}))

export function MobileRotaryDial() {
  const router = useRouter()

  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const [appH, setAppH] = useState<number>(800)
  const [viewportW, setViewportW] = useState<number>(390)
  const [isLandscape, setIsLandscape] = useState<boolean>(false)

  // Button label crossfade state
  const [buttonLabelText, setButtonLabelText] = useState<string>("OPEN CLUB OVERVIEW")
  const [buttonLabelOpacity, setButtonLabelOpacity] = useState<number>(1)

  // Layout Refs
  const zoneARef = useRef<HTMLDivElement | null>(null)
  const zoneB1Ref = useRef<HTMLDivElement | null>(null)
  const dialSvgRef = useRef<SVGSVGElement | null>(null)
  const ticksGroupRef = useRef<SVGGElement | null>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const pillBtnRef = useRef<HTMLButtonElement | null>(null)

  // Physics & Animation Tracking Refs
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

  // Measure and sync app height and width dynamically
  useEffect(() => {
    const handleResize = () => {
      const h = window.visualViewport?.height ?? window.innerHeight
      const w = window.visualViewport?.width ?? window.innerWidth
      setAppH(h)
      setViewportW(w)
      setIsLandscape(w > h && h < 640)
      document.documentElement.style.setProperty("--app-h", `${h}px`)
    }

    handleResize()
    window.visualViewport?.addEventListener("resize", handleResize)
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    // Sync initial mute preference
    setIsMuted(isDialSoundMuted())

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // SECTION B: DIAL GEOMETRY (centre on the base line, semicircle above it)
  // R = clamp(150, min(0.62 * viewportWidth, 0.36 * appHeight), 260)
  // When viewport height < 640px or landscape: 0.34 * height
  // ---------------------------------------------------------------------------
  const isShortOrLandscape = appH < 640 || isLandscape
  const maxHFactor = isShortOrLandscape ? 0.34 : 0.36
  const R = Math.round(
    Math.min(260, Math.max(150, Math.min(0.60 * viewportW, maxHFactor * appH)))
  )

  // ---------------------------------------------------------------------------
  // SECTION C: FIT RULE FOR NEIGHBOURS & RHO
  // For labels at +-60deg: rotated half-width = (w * cos 60 + h * sin 60) / 2
  // Requirement: centreX + halfWidth <= viewportWidth/2 - 10
  // centreX = rho * sin 60
  // If needed, clamp rho so neighbour label bounding boxes NEVER clip or touch screen edge
  // ---------------------------------------------------------------------------
  const sin60 = 0.8660254
  const cos60 = 0.5
  // Longest short name is "Why INVICTORS" (~84px at 13px font size, height ~20px)
  const neighbourApproxW = 84
  const neighbourApproxH = 20
  const neighbourHalfWidth = (neighbourApproxW * cos60 + neighbourApproxH * sin60) / 2
  const maxAllowedCentreX = viewportW / 2 - 10 - neighbourHalfWidth
  const maxRhoFromFitRule = Math.floor(maxAllowedCentreX / sin60)

  // Base rho is 0.80 R, capped by the fit rule
  const rho = Math.max(120, Math.min(Math.round(0.80 * R), maxRhoFromFitRule))

  // Selected full name max fitting width at top: min(0.86 * viewportWidth, chord width at rho)
  const chordWidthAtRho = 2 * rho * sin60
  const maxSelectedFullWidth = Math.min(0.86 * viewportW, chordWidthAtRho)
  const selectedFontSize = maxSelectedFullWidth < 220 ? "16px" : maxSelectedFullWidth < 260 ? "18px" : "20px"

  // ---------------------------------------------------------------------------
  // SECTION A: ZONE A SIZING (vertically centered identity block)
  // Logo diameter: min(50vw, 0.50 * zoneA height). If short/landscape: max 34vw
  // Gap 12px, motto, gap 8px, two-line slogan.
  // ---------------------------------------------------------------------------
  const zoneAHeightEstimate = Math.max(100, appH - 64 - (R + 40) - 92)
  const maxLogoVw = isShortOrLandscape ? 0.34 * viewportW : 0.50 * viewportW
  const logoDiameter = Math.round(
    Math.max(76, Math.min(maxLogoVw, 0.50 * zoneAHeightEstimate, 185))
  )

  // ---------------------------------------------------------------------------
  // BUTTON LABEL FITTING & CROSSFADE (Section A)
  // "OPEN <SELECTED NAME> ->": uppercase, letter-spacing 0.12em, one line
  // If does not fit inside pill: reduce letter spacing, then font-size down to 12px,
  // then use short name. Crossfades (opacity 120ms) on selection change.
  // ---------------------------------------------------------------------------
  const selectedItem = DIAL_ITEMS[selectedIndex] || DIAL_ITEMS[0]

  useEffect(() => {
    // Fade out (60ms)
    setButtonLabelOpacity(0)

    const timer = setTimeout(() => {
      const active = DIAL_ITEMS[selectedIndex] || DIAL_ITEMS[0]
      const maxInnerPillWidth = Math.min(360, viewportW - 40) - 72 // padding + icon
      const fullText = `OPEN ${active.title.toUpperCase()}`
      const shortText = `OPEN ${active.dialLabel.toUpperCase()}`

      // Approx width at 13px with 0.12em spacing is ~9.6px per char
      const fullWidthEst = fullText.length * 9.6
      const chosenText = fullWidthEst > maxInnerPillWidth && fullText.length > 20 ? shortText : fullText

      setButtonLabelText(chosenText)
      setButtonLabelOpacity(1)
    }, 60)

    return () => clearTimeout(timer)
  }, [selectedIndex, viewportW])

  // ---------------------------------------------------------------------------
  // MAIN PHYSICS LOOP (SmoothDamp rotation, direct HTML label updates)
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

        // Procedural tick sound every 10 degrees during snap
        const degDiff = nextAngle - lastTickDegRef.current
        if (Math.abs(degDiff) >= 10) {
          const ticks = Math.floor(Math.abs(degDiff) / 10)
          for (let i = 0; i < Math.min(3, ticks); i++) {
            playDialTick(velocityRef.current.value / 100)
          }
          lastTickDegRef.current = nextAngle
        }

        // Snap settle check
        if (
          Math.abs(nextAngle - targetAngleRef.current) < 0.05 &&
          Math.abs(velocityRef.current.value) < 0.2
        ) {
          rotationAngleRef.current = targetAngleRef.current
          velocityRef.current.value = 0
        }
      }

      const curAngle = rotationAngleRef.current

      // Calculate selected detent at 12 o'clock (0..5)
      // Angle: index 0 is at 0°, index 1 is at -60°, index 2 at -120°...
      const rawDetent = -curAngle / 60
      const normalizedDetent = ((Math.round(rawDetent) % 6) + 6) % 6

      if (normalizedDetent !== selectedIndexRef.current) {
        selectedIndexRef.current = normalizedDetent
        setSelectedIndex(normalizedDetent)
        playDialDetent()
      }

      // Rotate dial SVG ticks & nodes
      if (ticksGroupRef.current) {
        ticksGroupRef.current.setAttribute("transform", `rotate(${curAngle.toFixed(2)} 500 500)`)
      }

      // -----------------------------------------------------------------------
      // SECTION C: UPDATE HTML LABELS BY REF (No React state per frame)
      // a = index * 60 + curAngle (unwrapped to [-180, 180])
      // -----------------------------------------------------------------------
      labelRefs.current.forEach((el, idx) => {
        if (!el) return

        let a = ((idx * 60 + curAngle) % 360 + 540) % 360 - 180
        const absA = Math.abs(a)

        // Visibility: Labels with |a| > 110 get visibility hidden
        if (absA > 110) {
          el.style.visibility = "hidden"
          return
        }
        el.style.visibility = "visible"

        // Opacity: clamp(1 - (|a| - 60)/50, 0, 1) when |a| > 60; else lerp(1, 0.6, |a|/60)
        let opacity = 1
        if (absA > 60) {
          opacity = Math.max(0, Math.min(1, 1 - (absA - 60) / 50))
        } else {
          opacity = 1 - 0.4 * (absA / 60)
        }

        // Scale: lerp(1, 0.78, min(|a|/60, 1))
        const scale = 1 - 0.22 * Math.min(absA / 60, 1)

        // Write transform, opacity, and data-selected
        el.style.transform = `rotate(${a.toFixed(2)}deg) translateY(${-rho}px) translate(-50%, -50%) scale(${scale.toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)

        // Selection flag and span crossfade
        const fullSpan = el.querySelector<HTMLElement>(".label-full")
        const shortSpan = el.querySelector<HTMLElement>(".label-short")

        if (absA < 30) {
          el.setAttribute("data-selected", "true")
          if (fullSpan && shortSpan) {
            fullSpan.style.opacity = "1"
            fullSpan.style.display = "inline-block"
            shortSpan.style.opacity = "0"
            shortSpan.style.display = "none"
          }
        } else {
          el.removeAttribute("data-selected")
          if (fullSpan && shortSpan) {
            fullSpan.style.opacity = "0.75"
            fullSpan.style.display = "none"
            shortSpan.style.opacity = "1"
            shortSpan.style.display = "inline-block"
          }
        }
      })

      animFrameRef.current = requestAnimationFrame(animateLoop)
    }

    animFrameRef.current = requestAnimationFrame(animateLoop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [rho])

  // ---------------------------------------------------------------------------
  // ANGULAR DRAG GESTURE (atan2 around dial center on base line)
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    initDialAudio() // Unlock Web Audio API on gesture
    setHasInteracted(true)

    const zoneEl = zoneB1Ref.current
    if (!zoneEl) return

    const rect = zoneEl.getBoundingClientRect()
    // Dial center is on the base line (bottom of Zone B1), horizontally centered
    const cx = rect.left + rect.width / 2
    const cy = rect.bottom
    dragCenterRef.current = { x: cx, y: cy }

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

    // Keep history for release momentum flick
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

    // Momentum from last 80ms
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

    // Snap to nearest 60-degree detent, capping flick at 2 detents
    const flickDetents = Math.max(-2, Math.min(2, Math.round((angularVel * 0.15) / 60)))
    const currentAngle = rotationAngleRef.current
    const currentDetent = -currentAngle / 60
    const targetDetent = Math.round(currentDetent) + flickDetents

    targetAngleRef.current = -targetDetent * 60
    velocityRef.current.value = angularVel
  }

  // Label tap handlers: tapping neighbour rotates to it with sound and haptics
  const handleLabelClick = (idx: number) => {
    initDialAudio()
    setHasInteracted(true)
    if (selectedIndex === idx) {
      handleOpenPage()
    } else {
      playDialDetent()
      targetAngleRef.current = -idx * 60
    }
  }

  // Open page handler
  const handleOpenPage = () => {
    playOpenChime()
    const activeItem = DIAL_ITEMS[selectedIndex]
    if (activeItem) {
      router.push(activeItem.href)
    }
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

  // Mute toggle
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    setDialSoundMuted(nextMuted)
  }

  // Render SVG icons for the medallion
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
      case "Sparkles":
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
      role="listbox"
      aria-label="INVICTORS Navigation Rotary Dial"
      aria-activedescendant={`dial-item-${selectedIndex}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full select-none overflow-hidden outline-none ${
        isLandscape
          ? "flex flex-row"
          : "grid grid-rows-[minmax(0,1fr)_auto_auto]"
      }`}
      style={{
        height: "100%",
        maxHeight: "var(--app-h, 100dvh)",
      }}
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        Selected: {selectedItem.number} {selectedItem.title}
      </div>

      {/* =================================================================== */}
      {/* ROW 1 / ZONE A: IDENTITY BLOCK (Centred vertically, shares height) */}
      {/* =================================================================== */}
      <div
        ref={zoneARef}
        data-debug="zone-a"
        className={`flex flex-col items-center justify-center px-4 z-10 transition-all ${
          isLandscape ? "w-1/2 h-full" : "w-full min-h-0"
        }`}
      >
        {/* INVICTORS Logo Emblem: min(50vw, 0.50 * zoneA height) */}
        <div
          data-debug="logo"
          className="relative rounded-full overflow-hidden shadow-[0_0_35px_rgba(212,162,76,0.35)] border-2 border-amber-500/50 shrink-0"
          style={{
            width: `${logoDiameter}px`,
            height: `${logoDiameter}px`,
          }}
        >
          <Image
            src="/assets/invictors-logo.png"
            alt="INVICTORS Emblem"
            fill
            priority
            sizes={`${logoDiameter}px`}
            className="object-cover"
          />
        </div>

        {/* MOTTO: ONE Line in Gold (12px gap from logo) */}
        <div data-debug="motto" className="mt-[12px] text-center max-w-[92vw]">
          <span
            className="font-display font-bold text-gradient-gold uppercase tracking-[0.18em] drop-shadow-[0_0_8px_rgba(212,162,76,0.4)] whitespace-nowrap block"
            style={{
              fontSize: `clamp(11px, ${Math.min(15, Math.max(11, viewportW * 0.034))}px, 16px)`,
            }}
          >
            {CLUB_METADATA.motto}
          </span>
        </div>

        {/* SLOGAN: Exactly TWO balanced lines in Silver-100 (8px gap from motto) */}
        <div
          data-debug="slogan"
          className="mt-[8px] text-center font-display font-medium text-silver-100 flex flex-col leading-tight"
        >
          <span
            style={{
              fontSize: `clamp(10.5px, ${Math.min(13.5, Math.max(10.5, viewportW * 0.031))}px, 14px)`,
              letterSpacing: "0.03em",
            }}
          >
            Unravel the Clues. Hack the Rules.
          </span>
          <span
            style={{
              fontSize: `clamp(10.5px, ${Math.min(13.5, Math.max(10.5, viewportW * 0.031))}px, 14px)`,
              letterSpacing: "0.03em",
            }}
            className="text-silver-300 mt-0.5"
          >
            Build the Future.
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ROW 2 / ZONE B1: DIAL AREA (Height = R + 40px, Clipped at Base Line) */}
      {/* =================================================================== */}
      <div
        ref={zoneB1Ref}
        data-debug="zone-b1"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative z-20 overflow-hidden touch-none cursor-grab active:cursor-grabbing ${
          isLandscape ? "w-1/2" : "w-full"
        }`}
        style={{
          height: `${R + 40}px`,
        }}
      >
        {/* Mute Button (Top-Right, clear of rim) */}
        <button
          onClick={handleToggleMute}
          aria-label={isMuted ? "Unmute dial sound" : "Mute dial sound"}
          aria-pressed={isMuted}
          className="absolute top-2 right-4 z-40 w-9 h-9 rounded-full border border-amber-500/30 bg-black/85 flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-400 transition-all backdrop-blur-md cursor-pointer shadow-lg active:scale-95"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-silver-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* "Turn the dial" Curved Hint above pointer */}
        {!hasInteracted && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-black/85 text-amber-300/90 text-[10.5px] font-display tracking-widest backdrop-blur-md animate-bounce shadow-md">
            <span>Turn the dial</span>
            <CornerRightDown className="w-3 h-3 text-amber-400" />
          </div>
        )}

        {/* 12 o'clock Fixed Gold Pointer Notch */}
        <div
          className="absolute z-40 pointer-events-none flex flex-col items-center"
          style={{
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* Hairline */}
          <div className="w-[1px] h-3 bg-gradient-to-b from-transparent via-amber-300 to-amber-400 shadow-[0_0_6px_#f1d58a]" />
          {/* Triangular notch pointing down toward rim */}
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-400 drop-shadow-[0_0_6px_rgba(212,162,76,0.8)]" />
        </div>

        {/* CONCENTRIC SVG DIAL (viewBox 0 0 1000 1000, 2R x 2R, Center on base line) */}
        <div
          className="absolute pointer-events-none flex items-center justify-center z-10"
          style={{
            width: `${2 * R}px`,
            height: `${2 * R}px`,
            left: "50%",
            bottom: "0px",
            transform: "translate(-50%, 50%)",
          }}
        >
          <svg
            ref={dialSvgRef}
            viewBox="0 0 1000 1000"
            className="w-full h-full overflow-visible pointer-events-auto"
          >
            <defs>
              <linearGradient id="v7MobileDialGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="50%" stopColor="#f1d58a" />
                <stop offset="100%" stopColor="#d4a24c" />
              </linearGradient>

              <linearGradient id="v7MobileChromeRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#cfcfcf" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#7a7a7a" stopOpacity="0.85" />
              </linearGradient>

              <radialGradient id="v7NotchGlow" cx="50%" cy="12%" r="22%">
                <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dial Face Background (Black glass) */}
            <circle cx="500" cy="500" r="490" fill="#08080a" />
            <circle cx="500" cy="500" r="490" fill="url(#v7NotchGlow)" />

            {/* Chrome Outer Rim (0.97 - 1.00 R) */}
            <circle cx="500" cy="500" r="490" stroke="url(#v7MobileChromeRim)" strokeWidth="4" fill="none" />

            {/* Gold Inner Rim */}
            <circle cx="500" cy="500" r="474" stroke="url(#v7MobileDialGold)" strokeWidth="2.5" fill="none" opacity="0.85" />

            {/* Inner Face Division Line (r = 310 = 0.62 R) */}
            <circle cx="500" cy="500" r="310" stroke="rgba(212, 162, 76, 0.45)" strokeWidth="1.5" strokeDasharray="6 4" fill="#050507" />

            {/* ROTATING ELEMENTS GROUP: Ticks, Nodes, Circuit Traces */}
            <g ref={ticksGroupRef}>
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
                    r="4.5"
                    fill="#fff3c4"
                    stroke="#d4a24c"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 0 4px rgba(212,162,76,0.85))"
                  />
                )
              })}

              {/* Faint Concentric Circuit Ring */}
              <circle cx="500" cy="500" r="360" stroke="rgba(212, 162, 76, 0.18)" strokeWidth="1" strokeDasharray="8 6" fill="none" />
            </g>
          </svg>
        </div>

        {/* ================================================================= */}
        {/* SECTION C: HTML LABELS CONTAINER (Origin on Base Line Center)     */}
        {/* Placed above SVG in z-order (z-30)                                */}
        {/* ================================================================= */}
        <div
          data-debug="dial-labels-container"
          className="absolute z-30 pointer-events-none"
          style={{
            left: "50%",
            bottom: "0px",
            width: "0px",
            height: "0px",
          }}
        >
          {DIAL_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                labelRefs.current[idx] = el
              }}
              data-dial-label
              role="option"
              aria-selected={selectedIndex === idx}
              onClick={(e) => {
                e.stopPropagation()
                handleLabelClick(idx)
              }}
              className="absolute cursor-pointer pointer-events-auto select-none"
              style={{
                left: 0,
                top: 0,
                transformOrigin: "0 0",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {/* Label Title with Crossfade between Full name (top) and Short dialLabel (neighbour) */}
              <div className="relative font-display font-semibold transition-colors duration-150 flex items-center justify-center">
                <span
                  className="label-full text-gold-100 drop-shadow-[0_1px_6px_#000] tracking-wide"
                  style={{
                    fontSize: selectedFontSize,
                    textShadow: "0 1px 6px #000, 0 0 10px rgba(212,162,76,0.35)",
                    transition: "opacity 120ms ease",
                  }}
                >
                  {item.title}
                </span>
                <span
                  className="label-short text-amber-200/80 drop-shadow-[0_1px_6px_#000] text-[13.5px] tracking-wide"
                  style={{
                    display: "none",
                    opacity: 0,
                    textShadow: "0 1px 6px #000",
                    transition: "opacity 120ms ease",
                  }}
                >
                  {item.dialLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* INNER FACE: Medallion (at 0.30 R) + Index (at 12px) ABOVE BASE LINE */}
        {/* ================================================================= */}
        <div
          className="absolute z-20 pointer-events-none flex flex-col items-center"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "0px",
            width: "120px",
            height: `${Math.round(0.60 * R)}px`,
          }}
        >
          {/* 56px Gold-ringed Medallion with icon at 0.30 R */}
          <div
            data-debug="medallion"
            onClick={handleOpenPage}
            className="w-14 h-14 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/80 to-black flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(212,162,76,0.45)] transition-transform duration-200 pointer-events-auto cursor-pointer active:scale-95"
            style={{
              position: "absolute",
              bottom: `${Math.round(0.30 * R - 28)}px`,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" className="transition-all duration-300">
              {renderIcon(selectedItem.iconName)}
            </svg>
          </div>

          {/* Index "01 / 06" centered 12px above base line */}
          <div
            className="absolute bottom-3 font-mono text-[12px] font-bold text-amber-300/90 tracking-widest uppercase drop-shadow"
          >
            {selectedItem.number} / 06
          </div>
        </div>

        {/* ================================================================= */}
        {/* BASE LINE: 1px gold hairline with center node                     */}
        {/* ================================================================= */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none z-30" />
        <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#fff3c4] border border-amber-500 shadow-[0_0_6px_#f1d58a] pointer-events-none z-30" />
      </div>

      {/* =================================================================== */}
      {/* ROW 3 / ZONE B2: BUTTON ROW (Normal in-flow element on console base) */}
      {/* =================================================================== */}
      <div
        data-debug="zone-b2"
        className={`w-full flex items-center justify-center pointer-events-auto bg-gradient-to-b from-[#18130a] via-[#0d0c0a] to-[#050505] border-t border-amber-500/20 ${
          isLandscape ? "w-1/2" : ""
        }`}
        style={{
          padding: "12px 20px max(env(safe-area-inset-bottom, 0px), 28px)",
        }}
      >
        <button
          ref={pillBtnRef}
          data-debug="button"
          onClick={handleOpenPage}
          className="w-full max-w-[360px] h-[52px] px-6 rounded-full border border-amber-400 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-display font-bold flex items-center justify-center shadow-[0_0_25px_rgba(212,162,76,0.5)] transition-transform duration-200 active:scale-98 cursor-pointer"
          aria-live="polite"
        >
          <span
            className="truncate uppercase font-bold"
            style={{
              letterSpacing: "0.12em",
              fontSize: "13px",
              opacity: buttonLabelOpacity,
              transition: "opacity 60ms ease-in-out",
            }}
          >
            {buttonLabelText}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.8] shrink-0 text-black ml-1.5" />
        </button>
      </div>
    </div>
  )
}
