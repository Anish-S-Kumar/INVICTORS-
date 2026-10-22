"use client"

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown } from "lucide-react"
import { NAVIGATION_CARDS, CLUB_METADATA } from "@/lib/content"
import { smoothDamp } from "@/lib/smooth-damp"
import { updateDialAnchor } from "@/lib/dial-anchor"

interface WorksWheelProps {
  items?: typeof NAVIGATION_CARDS
  actionLabel?: string
  className?: string
}

type WheelState = "RING" | "OPENING" | "DRUM" | "CLOSING"

export function WorksWheel({
  items = NAVIGATION_CARDS,
  actionLabel = "Open",
  className = "",
}: WorksWheelProps) {
  const router = useRouter()

  // State Machine: RING (0) -> OPENING -> DRUM (1..6) -> CLOSING -> RING (0)
  const [wheelState, setWheelState] = useState<WheelState>("RING")
  const [turn, setTurn] = useState<number>(0)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false)

  // Stage size for dynamic dial diameter D
  const [stageDimensions, setStageDimensions] = useState({ width: 1200, height: 800 })

  const containerRef = useRef<HTMLDivElement>(null)
  const navIndexRef = useRef<HTMLDivElement>(null)
  const dialSvgRef = useRef<SVGSVGElement>(null)
  const outerRimRef = useRef<SVGCircleElement>(null)

  // Physics & Animation Refs
  const currentTurnRef = useRef<number>(0)
  const targetTurnRef = useRef<number>(0)
  const turnVelocityRef = useRef<{ value: number }>({ value: 0 })
  const queuedStepRef = useRef<number>(0)
  const wheelStateRef = useRef<WheelState>("RING")
  const activeIndexRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)

  // Gesture Tracking Refs (quiet gap detection & flick recognition)
  const lastWheelEventTimeRef = useRef<number>(0)
  const lastDeltaYRef = useRef<number>(0)
  const deltaDecliningRef = useRef<boolean>(false)
  const gestureHandledRef = useRef<boolean>(false)

  // Dragging Refs
  const isDraggingRef = useRef<boolean>(false)
  const dragStartYRef = useRef<number>(0)
  const dragStartTurnRef = useRef<number>(0)
  const dragStartTimeRef = useRef<number>(0)
  const dragHistoryRef = useRef<Array<{ y: number; time: number }>>([])

  // Settle & Optimization Refs
  const isMovingRef = useRef<boolean>(false)
  const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const willChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  wheelStateRef.current = wheelState
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

  // Measure stage dimensions for responsive dial fitting
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageDimensions({
          width: containerRef.current.clientWidth || window.innerWidth,
          height: containerRef.current.clientHeight || window.innerHeight - 72,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // A1. Dial Outer Diameter D Formula (v8):
  // D = min( (stageHeight - 24) / 1.17, 0.62 x stageWidth, 980 ). Pixel-snapped with Math.round.
  const stageW = stageDimensions.width
  const stageH = stageDimensions.height
  const dialDiameter = Math.round(Math.min((stageH - 24) / 1.17, 0.62 * stageW, 980))

  // Publish Dial Anchor for RingField concentric lock
  useLayoutEffect(() => {
    const publishAnchor = () => {
      if (!outerRimRef.current || !containerRef.current) return
      const rimRect = outerRimRef.current.getBoundingClientRect()
      const stageRect = containerRef.current.getBoundingClientRect()

      const cx = Math.round((rimRect.left - stageRect.left + rimRect.width / 2) * 2) / 2
      const cy = Math.round((rimRect.top - stageRect.top + rimRect.height / 2) * 2) / 2
      const R = Math.round((rimRect.width / 2) * 2) / 2

      updateDialAnchor(
        {
          anchor: { cx, cy, R },
        },
        containerRef.current
      )
    }

    publishAnchor()
    const ro = new ResizeObserver(publishAnchor)
    if (containerRef.current) ro.observe(containerRef.current)
    if (outerRimRef.current) ro.observe(outerRimRef.current)

    return () => ro.disconnect()
  }, [dialDiameter])

  // ---------------------------------------------------------------------------
  // MAIN ANIMATION LOOP (Critically Damped SmoothDamp with <=4ms scripting budget)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let lastTime = performance.now()

    const animateLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 1 / 30)
      lastTime = time

      // Pause rendering if tab is hidden to save GPU/CPU
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(animateLoop)
        return
      }

      const current = currentTurnRef.current
      const target = targetTurnRef.current
      const diff = target - current

      // Critically damped timing:
      // Open / Close (ring <-> drum): smoothTime ~0.18s (settles in ~600-650ms)
      // Card to Card: smoothTime ~0.11s (settles in ~350-400ms)
      // prefers-reduced-motion: smoothTime 0.01s
      const isTransitioning = (current < 0.98 && target >= 1) || (current > 0.02 && target <= 0.02)
      const smoothTime = prefersReducedMotion ? 0.01 : isTransitioning ? 0.18 : 0.11

      const nextTurn = smoothDamp(current, target, turnVelocityRef.current, smoothTime, Infinity, dt)
      currentTurnRef.current = nextTurn

      // Check if moving to apply data-busy and will-change attributes
      const isMoving = Math.abs(diff) > 0.003 || Math.abs(turnVelocityRef.current.value) > 0.01
      if (isMoving) {
        if (!isMovingRef.current) {
          isMovingRef.current = true
          document.documentElement.setAttribute("data-busy", "true")
          if (containerRef.current) {
            containerRef.current.style.willChange = "transform"
          }
        }
        if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current)
        if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current)
      } else if (isMovingRef.current) {
        isMovingRef.current = false
        settleTimeoutRef.current = setTimeout(() => {
          document.documentElement.removeAttribute("data-busy")
        }, 200)
        willChangeTimeoutRef.current = setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.willChange = "auto"
          }
        }, 150)
      }

      // Check and apply queued step if nearing current target
      if (Math.abs(diff) < 0.15 && queuedStepRef.current !== 0) {
        const step = queuedStepRef.current
        queuedStepRef.current = 0
        const newTarget = Math.max(1, Math.min(items.length, Math.round(targetTurnRef.current) + step))
        targetTurnRef.current = newTarget
      }

      // Only update turn state if it has changed noticeably (to avoid excessive React re-renders)
      setTurn(nextTurn)

      // Calculate active card index in Drum mode
      let newActive = 0
      if (nextTurn >= 0.5) {
        newActive = Math.max(0, Math.min(items.length - 1, Math.round(nextTurn) - 1))
      }
      if (newActive !== activeIndexRef.current) {
        activeIndexRef.current = newActive
        setActiveIndex(newActive)
      }

      // State Transitions
      if (wheelStateRef.current === "OPENING") {
        if (Math.abs(nextTurn - targetTurnRef.current) < 0.01) {
          wheelStateRef.current = "DRUM"
          setWheelState("DRUM")
        }
      } else if (wheelStateRef.current === "CLOSING") {
        if (Math.abs(nextTurn - 0) < 0.01) {
          wheelStateRef.current = "RING"
          setWheelState("RING")
          currentTurnRef.current = 0
          targetTurnRef.current = 0
        }
      }

      // Morph factor m: 0 = Ring, 1 = Drum
      const m = Math.max(0, Math.min(1, nextTurn))

      // Sync CSS variables on container for styling & side decor
      if (containerRef.current) {
        containerRef.current.style.setProperty("--turn", nextTurn.toFixed(3))
        containerRef.current.style.setProperty("--m", m.toFixed(3))
      }

      // Right-hand navigation index: hidden in RING, fades in during DRUM
      if (navIndexRef.current) {
        navIndexRef.current.style.opacity = String(m)
        navIndexRef.current.style.pointerEvents = m > 0.6 ? "auto" : "none"
        navIndexRef.current.setAttribute("aria-hidden", m < 0.6 ? "true" : "false")
      }

      // Dial SVG: Fades out and scales as drum opens
      if (dialSvgRef.current) {
        const dialAlpha = Math.max(0, 1 - m * 1.66)
        dialSvgRef.current.style.opacity = String(dialAlpha)
        dialSvgRef.current.style.pointerEvents = dialAlpha > 0.3 ? "auto" : "none"
        dialSvgRef.current.style.transform = `scale(${(1 + m * 0.05).toFixed(3)})`
      }

      animFrameRef.current = requestAnimationFrame(animateLoop)
    }

    animFrameRef.current = requestAnimationFrame(animateLoop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current)
      if (willChangeTimeoutRef.current) clearTimeout(willChangeTimeoutRef.current)
      document.documentElement.removeAttribute("data-busy")
    }
  }, [items.length, prefersReducedMotion])

  // ---------------------------------------------------------------------------
  // GESTURE DETECTION (120ms quiet gap, trackpad inertia swallow, 1-step queue)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault() // Zero page scroll on "/"
      setHasInteracted(true)

      const now = performance.now()
      const clampedDeltaY = Math.max(-120, Math.min(120, e.deltaY))
      const absDelta = Math.abs(clampedDeltaY)
      const prevAbs = Math.abs(lastDeltaYRef.current)

      // A wheel "gesture" ends after a 120ms quiet gap
      const isNewGesture = now - lastWheelEventTimeRef.current > 120
      if (isNewGesture) {
        gestureHandledRef.current = false
        deltaDecliningRef.current = false
      }

      // Check if trackpad inertia is declining
      if (prevAbs > 0 && absDelta < prevAbs) {
        deltaDecliningRef.current = true
      }

      // A clear new flick: |delta| rising above 1.5x previous value after declining
      const isNewFlick = deltaDecliningRef.current && absDelta > prevAbs * 1.5
      if (isNewFlick) {
        gestureHandledRef.current = false
        deltaDecliningRef.current = false
      }

      lastDeltaYRef.current = clampedDeltaY
      lastWheelEventTimeRef.current = now

      // If gesture was already acted upon and not a new flick, swallow inertia
      if (gestureHandledRef.current && !isNewFlick) {
        return
      }

      // STATE 1: RING (turn = 0)
      if (wheelStateRef.current === "RING") {
        if (clampedDeltaY > 8) {
          wheelStateRef.current = "OPENING"
          setWheelState("OPENING")
          targetTurnRef.current = 1 // STRICTLY CARD 01 IN FRONT!
          gestureHandledRef.current = true
          queuedStepRef.current = 0
        }
        return
      }

      // STATE 2: DRUM (turn >= 1)
      if (wheelStateRef.current === "DRUM") {
        if (absDelta > 10) {
          const dir = clampedDeltaY > 0 ? 1 : -1
          gestureHandledRef.current = true

          const currentTarget = Math.round(targetTurnRef.current)
          const isStepping = Math.abs(targetTurnRef.current - currentTurnRef.current) > 0.25

          if (dir > 0) {
            // Downward gesture -> Next card
            if (currentTarget < items.length) {
              if (isStepping) {
                queuedStepRef.current = 1
              } else {
                targetTurnRef.current = currentTarget + 1
              }
            }
          } else {
            // Upward gesture -> Previous card or close
            if (currentTarget > 1) {
              if (isStepping) {
                queuedStepRef.current = -1
              } else {
                targetTurnRef.current = currentTarget - 1
              }
            } else if (currentTarget <= 1) {
              // Upward scroll at Card 01 closes smoothly back to Ring
              wheelStateRef.current = "CLOSING"
              setWheelState("CLOSING")
              targetTurnRef.current = 0
              queuedStepRef.current = 0
            }
          }
        }
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [items.length])

  // ---------------------------------------------------------------------------
  // POINTER DRAG & KEYBOARD
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    dragStartYRef.current = e.clientY
    dragStartTurnRef.current = targetTurnRef.current
    dragStartTimeRef.current = performance.now()
    dragHistoryRef.current = [{ y: e.clientY, time: performance.now() }]
    setHasInteracted(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const diff = dragStartYRef.current - e.clientY
    const now = performance.now()

    dragHistoryRef.current.push({ y: e.clientY, time: now })
    dragHistoryRef.current = dragHistoryRef.current.filter((p) => now - p.time <= 80)

    if (wheelStateRef.current === "RING") {
      if (diff > 25) {
        wheelStateRef.current = "OPENING"
        setWheelState("OPENING")
        targetTurnRef.current = 1
        isDraggingRef.current = false
      }
    } else if (wheelStateRef.current === "DRUM") {
      const step = diff / 150
      const newTarget = Math.max(0.2, Math.min(items.length, dragStartTurnRef.current + step))
      targetTurnRef.current = newTarget
    }
  }

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    if (wheelStateRef.current === "DRUM") {
      const history = dragHistoryRef.current
      let vy = 0
      if (history.length >= 2) {
        const oldest = history[0]
        const newest = history[history.length - 1]
        const dt = (newest.time - oldest.time) / 1000
        if (dt > 0.01) {
          vy = (oldest.y - newest.y) / dt
        }
      }

      // Quick flick advances 1 extra card at most
      const flick = Math.max(-1, Math.min(1, Math.round(vy / 400)))
      const current = targetTurnRef.current + flick

      if (current < 0.6) {
        wheelStateRef.current = "CLOSING"
        setWheelState("CLOSING")
        targetTurnRef.current = 0
      } else {
        targetTurnRef.current = Math.max(1, Math.min(items.length, Math.round(current)))
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        setHasInteracted(true)

        if (wheelStateRef.current === "RING") {
          wheelStateRef.current = "OPENING"
          setWheelState("OPENING")
          targetTurnRef.current = 1
        } else if (wheelStateRef.current === "DRUM") {
          if (targetTurnRef.current < items.length) {
            targetTurnRef.current = Math.min(items.length, Math.round(targetTurnRef.current) + 1)
          }
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        setHasInteracted(true)

        if (wheelStateRef.current === "DRUM") {
          if (targetTurnRef.current > 1) {
            targetTurnRef.current = Math.max(1, Math.round(targetTurnRef.current) - 1)
          } else {
            wheelStateRef.current = "CLOSING"
            setWheelState("CLOSING")
            targetTurnRef.current = 0
          }
        }
      } else if (e.key === "Enter") {
        if (wheelStateRef.current === "RING") {
          wheelStateRef.current = "OPENING"
          setWheelState("OPENING")
          targetTurnRef.current = 1
        } else if (wheelStateRef.current === "DRUM") {
          const currentItem = items[activeIndexRef.current]
          if (currentItem) {
            router.push(currentItem.href)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [items, router])

  const m = Math.max(0, Math.min(1, turn))

  // ---------------------------------------------------------------------------
  // A2. SHARED SVG 1000x1000 VIEWBOX & CONCENTRIC GEOMETRY
  // Center: (500, 500)
  // Outer Radius: 480, Inner Radius: 330, Centerline Radius: 405
  // Segment band thickness = 150 units.
  // ---------------------------------------------------------------------------
  const CX = 500
  const CY = 500
  const R_OUTER = 480
  const R_INNER = 330
  const R_MID = 405
  const R_ICON = 356

  // Full names requested in A2: "NN · NAME" with 2-digit zero-padded numbers
  const FULL_LABELS = [
    { num: "01", name: "CLUB OVERVIEW" },
    { num: "02", name: "MISSION STATEMENT" },
    { num: "03", name: "WHY INVICTORS" },
    { num: "04", name: "CORE CLUB PILLARS" },
    { num: "05", name: "UPCOMING EVENTS" },
    { num: "06", name: "RANK" },
  ]

  // Clean SVG icons (Compass, Target, Fingerprint, Layers, CalendarDays, Trophy)
  const renderSvgIcon = (iconName: string) => {
    switch (iconName) {
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
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
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
        return <circle cx="12" cy="12" r="6" fill="currentColor" />
    }
  }

  // 6 Segments Configuration
  const sectorConfigs = items.map((card, idx) => {
    // 01: -90° (12 o'clock); 02: -30°; 03: +30°; 04: +90°; 05: +150°; 06: +210°
    const centerDeg = idx * 60 - 90
    const spanDeg = 57 // 60° minus 3° gap
    const startDeg = centerDeg - spanDeg / 2
    const endDeg = centerDeg + spanDeg / 2

    const toRad = (d: number) => (d * Math.PI) / 180
    const startRad = toRad(startDeg)
    const endRad = toRad(endDeg)

    // Annular Sector Polygon Path
    const xo1 = CX + R_OUTER * Math.cos(startRad)
    const yo1 = CY + R_OUTER * Math.sin(startRad)
    const xo2 = CX + R_OUTER * Math.cos(endRad)
    const yo2 = CY + R_OUTER * Math.sin(endRad)

    const xi1 = CX + R_INNER * Math.cos(startRad)
    const yi1 = CY + R_INNER * Math.sin(startRad)
    const xi2 = CX + R_INNER * Math.cos(endRad)
    const yi2 = CY + R_INNER * Math.sin(endRad)

    const sectorPath = `M ${xo1} ${yo1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${xo2} ${yo2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`

    // Upright centerline textPath on radius 405:
    // Segments 01, 02, 06 (top half): Clockwise
    // Segments 03, 04, 05 (bottom half): Reversed counter-clockwise so none read upside-down!
    const isBottomHalf = idx === 2 || idx === 3 || idx === 4
    const padDeg = 2.5
    const textStartRad = toRad(startDeg + padDeg)
    const textEndRad = toRad(endDeg - padDeg)

    let textArcPath = ""
    if (!isBottomHalf) {
      const tx1 = CX + R_MID * Math.cos(textStartRad)
      const ty1 = CY + R_MID * Math.sin(textStartRad)
      const tx2 = CX + R_MID * Math.cos(textEndRad)
      const ty2 = CY + R_MID * Math.sin(textEndRad)
      textArcPath = `M ${tx1} ${ty1} A ${R_MID} ${R_MID} 0 0 1 ${tx2} ${ty2}`
    } else {
      const tx1 = CX + R_MID * Math.cos(textEndRad)
      const ty1 = CY + R_MID * Math.sin(textEndRad)
      const tx2 = CX + R_MID * Math.cos(textStartRad)
      const ty2 = CY + R_MID * Math.sin(textStartRad)
      textArcPath = `M ${tx1} ${ty1} A ${R_MID} ${R_MID} 0 0 0 ${tx2} ${ty2}`
    }

    // Small gold icon on inner edge (radius 356), centered on mid-angle
    const labelRad = toRad(centerDeg)
    const iconX = CX + R_ICON * Math.cos(labelRad)
    const iconY = CY + R_ICON * Math.sin(labelRad)

    return {
      card,
      index: idx,
      centerDeg,
      sectorPath,
      textArcPath,
      iconX,
      iconY,
      label: FULL_LABELS[idx] || { num: `0${idx + 1}`, name: card.title },
    }
  })

  const handleSegmentClick = (index: number) => {
    setHasInteracted(true)
    if (wheelStateRef.current === "RING") {
      wheelStateRef.current = "OPENING"
      setWheelState("OPENING")
      targetTurnRef.current = index + 1
    } else if (wheelStateRef.current === "DRUM") {
      if (activeIndex !== index) {
        targetTurnRef.current = index + 1
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,162,76,0.1)_0%,rgba(5,5,5,0)_70%)]" />
      </div>

      {/* =================================================================== */}
      {/* A. CONCENTRIC SHARED SVG (viewBox: 0 0 1000 1000, Center: 500, 500) */}
      {/* Dial fitted to stage with diameter D = min(H - 72, 0.62 * W, 980)   */}
      {/* Vertically centered leaving 28px above header and 44px below footer  */}
      {/* =================================================================== */}
      <div
        data-debug="dial"
        className="absolute z-10 flex items-center justify-center pointer-events-none"
        style={{
          width: `${dialDiameter}px`,
          height: `${dialDiameter}px`,
          left: "50%",
          top: "calc(50% - 8px)", // Offsets +16px footer vs header difference: 28px top, 44px bottom
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          ref={dialSvgRef}
          viewBox="0 0 1000 1000"
          className="w-full h-full pointer-events-auto transition-transform duration-500 overflow-visible"
        >
          <defs>
            {/* Radial mask for logo glow to ensure it NEVER bleeds over motto */}
            <radialGradient id="logoGlowMask" cx="50%" cy="42.6%" r="28%">
              <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#d4a24c" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </radialGradient>

            {/* Circular Clip for center logo image */}
            <clipPath id="logoImageClip">
              <circle cx="500" cy="426" r="165" />
            </clipPath>

            {/* Sector Arc Paths */}
            {sectorConfigs.map((sec) => (
              <path key={`path-${sec.index}`} id={`dial-arc-path-${sec.index}`} d={sec.textArcPath} />
            ))}

            {/* Gold Gradients */}
            <linearGradient id="dialGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="50%" stopColor="#f1d58a" />
              <stop offset="100%" stopColor="#d4a24c" />
            </linearGradient>

            <linearGradient id="dialRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#cfcfcf" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9a9a9a" stopOpacity="0.75" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="dialGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 2. OUTER BEZEL RIM (radius 482) - Measured as Anchor R */}
          <circle
            ref={outerRimRef}
            id="dial-outer-chrome-rim"
            cx={CX}
            cy={CY}
            r="482"
            stroke="url(#dialRimGrad)"
            strokeWidth="2"
            fill="none"
          />

          {/* 3. 60 OUTER RIM TICK MARKS */}
          {Array.from({ length: 60 }).map((_, i) => {
            const deg = i * 6
            const isCardinal = i % 15 === 0
            const tickLen = isCardinal ? 12 : 6
            const r1 = 482
            const r2 = r1 + tickLen
            const rad = (deg * Math.PI) / 180
            return (
              <line
                key={i}
                x1={CX + r1 * Math.cos(rad)}
                y1={CY + r1 * Math.sin(rad)}
                x2={CX + r2 * Math.cos(rad)}
                y2={CY + r2 * Math.sin(rad)}
                stroke={isCardinal ? "#f7e7b4" : "rgba(212, 162, 76, 0.35)"}
                strokeWidth={isCardinal ? 2 : 1}
              />
            )
          })}

          {/* 4. 4 CROSSHAIR NODES (12, 3, 6, 9 o'clock) with hairlines extended to 1.16R (559px) */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const nodeR = 496
            const nx = CX + nodeR * Math.cos(rad)
            const ny = CY + nodeR * Math.sin(rad)
            return (
              <g key={deg}>
                <line
                  x1={CX + 478 * Math.cos(rad)}
                  y1={CY + 478 * Math.sin(rad)}
                  x2={CX + 559 * Math.cos(rad)}
                  y2={CY + 559 * Math.sin(rad)}
                  stroke="#d4a24c"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
                <rect
                  x={nx - 3.5}
                  y={ny - 3.5}
                  width="7"
                  height="7"
                  transform={`rotate(45 ${nx} ${ny})`}
                  fill="#f5e6b3"
                  stroke="#d4a24c"
                  strokeWidth="1"
                />
              </g>
            )
          })}

          {/* 5. THE 6 ANNULAR SEGMENTS (outer R: 480, inner R: 330, span: 57°, gap: 3°) */}
          {sectorConfigs.map((sec) => {
            const isHovered = hoveredIndex === sec.index
            const liftRad = (sec.centerDeg * Math.PI) / 180
            const liftX = isHovered ? Math.cos(liftRad) * 6 : 0
            const liftY = isHovered ? Math.sin(liftRad) * 6 : 0

            return (
              <g
                key={sec.card.id}
                role="button"
                tabIndex={0}
                aria-label={`${sec.label.num} ${sec.label.name}`}
                onClick={() => handleSegmentClick(sec.index)}
                onMouseEnter={() => setHoveredIndex(sec.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-300 focus-visible:outline-none"
                style={{
                  transform: `translate(${liftX}px, ${liftY}px)`,
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Annular sector shape with black glass fill and thin gold border */}
                <path
                  d={sec.sectorPath}
                  fill={isHovered ? "rgba(30, 24, 12, 0.94)" : "rgba(10, 10, 12, 0.88)"}
                  stroke={isHovered ? "#f7e7b4" : "rgba(212, 162, 76, 0.45)"}
                  strokeWidth={isHovered ? 2 : 1.2}
                  filter={isHovered ? "drop-shadow(0 0 16px rgba(212,162,76,0.5))" : "none"}
                />

                {/* Text along arc (Radius 405, upright, consistent font-size 23) */}
                <text
                  fill={isHovered ? "#ffffff" : "url(#dialGoldGrad)"}
                  className="font-display font-bold uppercase transition-colors"
                  style={{
                    fontSize: "23px",
                    letterSpacing: "0.08em",
                  }}
                >
                  <textPath
                    href={`#dial-arc-path-${sec.index}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {/* Non-slashed zero in NN via Rajdhani body font */}
                    <tspan
                      style={{
                        fontFamily: "var(--font-rajdhani), sans-serif",
                        fontWeight: 700,
                        fontSize: "24px",
                      }}
                    >
                      {sec.label.num}
                    </tspan>
                    <tspan> · {sec.label.name}</tspan>
                  </textPath>
                </text>

                {/* Small gold icon on inner edge (radius 356), rotated upright, size 28 */}
                <g
                  transform={`translate(${sec.iconX - 14}, ${sec.iconY - 14})`}
                  className={isHovered ? "text-amber-200" : "text-amber-400"}
                  style={{ transition: "color 0.25s ease" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24">
                    {renderSvgIcon(sec.card.iconName)}
                  </svg>
                </g>
              </g>
            )
          })}

          {/* 6. INNER GOLD RING (radius 330, diameter 660) */}
          <circle
            cx={CX}
            cy={CY}
            r={R_INNER}
            stroke="rgba(212, 162, 76, 0.65)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx={CX}
            cy={CY}
            r={R_INNER - 4}
            stroke="rgba(212, 162, 76, 0.25)"
            strokeWidth="1"
            fill="none"
          />

          {/* =================================================================== */}
          {/* A3. CENTER CONTENT STACK (INSIDE INNER CIRCLE R=330, d=660)         */}
          {/* Logo, Motto, Slogan all inside safe box 0.78d = 514 units wide      */}
          {/* Stack height = 462 units, perfectly centered vertically at Y = 500  */}
          {/* =================================================================== */}
          <g id="centerpiece-stack">
            {/* Clipped radial glow behind logo */}
            <circle cx="500" cy="426" r="185" fill="url(#logoGlowMask)" pointerEvents="none" />

            {/* Rotating gold rings around logo */}
            <circle
              cx="500"
              cy="426"
              r="174"
              stroke="rgba(212, 162, 76, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="6 5"
              className={prefersReducedMotion ? "" : "animate-spin-slow"}
              style={{ transformOrigin: "500px 426px" }}
            />
            <circle
              cx="500"
              cy="426"
              r="182"
              stroke="rgba(212, 162, 76, 0.2)"
              strokeWidth="1"
            />

            {/* INVICTORS Emblem Image (diameter 330 units = 0.50 d) */}
            <g data-debug="logo">
              <image
                href="/assets/invictors-logo.png"
                x="335"
                y="261"
                width="330"
                height="330"
                clipPath="url(#logoImageClip)"
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Emblem outer border */}
              <circle
                cx="500"
                cy="426"
                r="165"
                stroke="rgba(212, 162, 76, 0.85)"
                strokeWidth="2.5"
                fill="none"
                filter="url(#dialGoldGlow)"
              />
            </g>

            {/* MOTTO: "DECODE. INNOVATE. OVERCOME." (ONE line, max-width 514, gold) */}
            <g data-debug="motto">
              <text
                x="500"
                y="636"
                textAnchor="middle"
                fill="url(#dialGoldGrad)"
                className="font-display font-bold uppercase select-none"
                style={{
                  fontSize: "20.5px",
                  letterSpacing: "0.2em",
                  filter: "drop-shadow(0 0 8px rgba(212,162,76,0.35))",
                }}
              >
                {CLUB_METADATA.motto}
              </text>
            </g>

            {/* SLOGAN: "Unravel the Clues. Hack the Rules. Build the Future." */}
            {/* EXACTLY TWO balanced lines in silver-100, max-width 514 units */}
            <g data-debug="slogan">
              <text
                x="500"
                y="680"
                textAnchor="middle"
                fill="#f1f5f9"
                className="font-display font-bold select-none"
                style={{
                  fontSize: "21px",
                  letterSpacing: "0.04em",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                }}
              >
                Unravel the Clues. Hack the Rules.
              </text>
              <text
                x="500"
                y="712"
                textAnchor="middle"
                fill="#cbd5e1"
                className="font-display font-bold select-none"
                style={{
                  fontSize: "21px",
                  letterSpacing: "0.04em",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))",
                }}
              >
                Build the Future.
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* =================================================================== */}
      {/* 3D DRUM CARDS (Morphs seamlessly from dial into cards on scroll)    */}
      {/* =================================================================== */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
          opacity: m > 0.05 ? 1 : 0,
          pointerEvents: m > 0.4 ? "auto" : "none",
        }}
      >
        {items.map((card, index) => {
          const centerDeg = index * 60 - 90
          const ringRad = (centerDeg * Math.PI) / 180
          const ringRadiusPx = dialDiameter * 0.405
          const ringX = Math.cos(ringRad) * ringRadiusPx
          const ringY = Math.sin(ringRad) * ringRadiusPx
          const ringRotZ = centerDeg + 90

          const offset = index - activeIndex

          // Cull cards above Card 01 when active === 0 so nothing wraps around top
          const isAboveCardOne = activeIndex === 0 && offset < 0
          if (isAboveCardOne) return null

          const drumY = offset * 132
          const drumZ = -Math.abs(offset) * 150
          const drumRotX = -offset * 30
          const isFront = offset === 0

          // A4: Ease-in-out cubic applied to shape morph only
          const mShape = m < 0.5 ? 4 * m * m * m : 1 - Math.pow(-2 * m + 2, 3) / 2

          const posX = (1 - mShape) * ringX + mShape * 0
          const posY = (1 - mShape) * ringY + mShape * drumY
          const posZ = (1 - mShape) * 0 + mShape * drumZ
          const rotZ = (1 - mShape) * ringRotZ + mShape * 0
          const rotX = mShape * drumRotX

          const scale =
            (1 - mShape) * 0.9 + mShape * (isFront ? 1.08 : Math.max(0.7, 1 - Math.abs(offset) * 0.16))
          const opacity =
            (1 - mShape) * 0.2 + mShape * (isFront ? 1 : Math.max(0.18, 1 - Math.abs(offset) * 0.4))

          const cardTitle = card.shortTitle || card.title

          return (
            <div
              key={card.id}
              onClick={() => {
                if (wheelStateRef.current === "DRUM" && !isFront) {
                  targetTurnRef.current = index + 1
                }
              }}
              style={{
                position: "absolute",
                transform: `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${posZ.toFixed(
                  1
                )}px) rotateX(${rotX.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(
                  3
                )})`,
                opacity: opacity,
                zIndex: isFront ? 30 : 20 - Math.abs(offset),
                transformStyle: "preserve-3d",
                contain: "layout paint",
              }}
              className="pointer-events-auto cursor-pointer"
            >
              <div
                className={`group relative w-60 sm:w-68 h-22 sm:h-24 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 light-sweep-container ${
                  isFront && m > 0.5
                    ? "glass-panel-gold border-amber-400 shadow-[0_0_25px_rgba(212,162,76,0.4)] scale-105"
                    : "glass-panel hover:border-amber-400/80 hover:shadow-[0_0_15px_rgba(212,162,76,0.25)]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded">
                    {card.number}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-amber-300">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      {renderSvgIcon(card.iconName)}
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3
                    className="font-display font-bold text-gradient-gold tracking-wide leading-tight line-clamp-2"
                    style={{ fontSize: "clamp(13px, 1.15vw, 16px)" }}
                  >
                    {cardTitle}
                  </h3>

                  {isFront && m > 0.6 && (
                    <Link
                      href={card.href}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-display text-[11px] font-bold tracking-wider shadow-[0_0_12px_rgba(212,162,76,0.5)] transition-transform hover:scale-105"
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

      {/* =================================================================== */}
      {/* RIGHT-HAND NAVIGATION LIST                                          */}
      {/* Hidden in RING state, fades in during DRUM state                   */}
      {/* =================================================================== */}
      <div
        ref={navIndexRef}
        style={{ opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 shadow-2xl transition-opacity duration-300"
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
                targetTurnRef.current = idx + 1
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

      {/* =================================================================== */}
      {/* OVERLAID HINT (Fades out after first interaction)                   */}
      {/* =================================================================== */}
      {!hasInteracted && m < 0.15 && (
        <div className="absolute bottom-6 z-20 pointer-events-none flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/25 bg-black/75 text-amber-300/90 text-[11px] font-display tracking-widest backdrop-blur-md animate-bounce shadow-md">
            <ChevronDown className="w-3 h-3 text-amber-400" />
            <span>Scroll or drag to open the wheel</span>
          </div>
        </div>
      )}

      {/* Front card title indicator on bottom-left when drum is open */}
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
