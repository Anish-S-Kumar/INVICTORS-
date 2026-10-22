"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { getDialAnchor, subscribeDialAnchor, DialAnchorState, Anchor } from "@/lib/dial-anchor"
import { generateCircuitFieldGeometry, CircuitFieldGeometry } from "./ring-field-geometry"

interface RingFieldProps {
  isMobile?: boolean
  isSubpage?: boolean
  isRankPage?: boolean
  isIntroPlaying?: boolean
  className?: string
}

export function RingField({
  isMobile = false,
  isSubpage = false,
  isRankPage = false,
  isIntroPlaying = false,
  className = "",
}: RingFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const [anchorState, setAnchorState] = useState<DialAnchorState>(getDialAnchor())
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Subscribe to anchor store
  useEffect(() => {
    setMounted(true)

    const unsubscribe = subscribeDialAnchor((state) => {
      setAnchorState(state)
    })

    try {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(media.matches)
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      media.addEventListener("change", handler)
    } catch {
      // ignore
    }

    return () => unsubscribe()
  }, [])

  // Measure stage size
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setStageSize({
          width: Math.round(rect.width) || window.innerWidth,
          height: Math.round(rect.height) || window.innerHeight,
        })
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Effective anchor
  const effectiveAnchor: Anchor = useMemo(() => {
    if (isSubpage) {
      const cx = stageSize.width * 0.5
      const cy = stageSize.height * 0.38
      const R = isRankPage
        ? Math.min(stageSize.width * 0.24, stageSize.height * 0.28, 220)
        : Math.min(stageSize.width * 0.20, stageSize.height * 0.24, 180)
      return { cx, cy, R }
    }
    return anchorState.anchor
  }, [isSubpage, isRankPage, stageSize, anchorState.anchor])

  const { cx, cy, R } = effectiveAnchor

  // Generate geometry
  const geom: CircuitFieldGeometry | null = useMemo(() => {
    if (!mounted || R <= 0) return null
    return generateCircuitFieldGeometry({
      cx,
      cy,
      R,
      width: stageSize.width,
      height: stageSize.height,
      isMobile,
    })
  }, [mounted, cx, cy, R, stageSize, isMobile])

  // Canvas particle layer: 40-60 tiny gold particles drifting slowly and twinkling
  useEffect(() => {
    if (!mounted || prefersReducedMotion || isSubpage) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = stageSize.width
    const h = stageSize.height

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const particleCount = isMobile ? 30 : 55
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.45,
      alpha: 0.2 + Math.random() * 0.7,
      alphaSpeed: 0.008 + Math.random() * 0.015,
      alphaPhase: Math.random() * Math.PI * 2,
    }))

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alphaPhase += p.alphaSpeed

        if (p.y < -10) p.y = h + 10
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        const currentAlpha = Math.max(0.1, Math.min(0.85, p.alpha + Math.sin(p.alphaPhase) * 0.3))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 215, 110, ${currentAlpha})`
        ctx.shadowColor = "#ffc83d"
        ctx.shadowBlur = 6
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [mounted, stageSize, isMobile, prefersReducedMotion, isSubpage])

  // Ring dimension calculations
  const ringRadius = R * (isMobile ? 1.08 : 1.04)
  const ringDiameter = Math.round(ringRadius * 2)
  const ringThickness = Math.max(10, Math.round(R * 0.045)) // ~14-22px thick, glowing border

  const techRingDiameter = Math.round(R * 1.12 * 2)

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-700 ${
        isIntroPlaying ? "opacity-0" : "opacity-100"
      } ${className}`}
      aria-hidden="true"
    >
      {/* ==================================================================== */}
      {/* 1. BACKGROUND GRADIENTS                                              */}
      {/* ==================================================================== */}
      {/* Base: dark brown-black gradient, #0a0703 at edges to #2a1b05 near center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, #2a1b05 0%, #170f03 48%, #0a0703 100%)`,
        }}
      />

      {/* Large soft golden radial glow behind the ring */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,190,60,0.35) 0%, rgba(180,120,20,0.18) 35%, transparent 70%)`,
        }}
      />

      {/* Light vignette on far edges only so center stays bright */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(5,4,2,0.6) 88%, #050402 100%)",
        }}
      />

      {/* ==================================================================== */}
      {/* 2. CIRCUIT TRACES & ANIMATED LIGHT PULSES (SVG LAYER)                */}
      {/* ==================================================================== */}
      {geom && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{
            filter: "drop-shadow(0 0 4px rgba(255, 200, 80, 0.6))",
          }}
        >
          {/* Base PCB Gold Circuit Traces */}
          <g>
            {geom.traces.map((trace) => (
              <path
                key={`base-trace-${trace.id}`}
                d={trace.d}
                stroke="#d4a03a"
                strokeWidth={trace.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={trace.opacity}
              />
            ))}
          </g>

          {/* Animated Energy Pulses travelling along EVERY circuit trace */}
          {!prefersReducedMotion && (
            <g>
              {geom.traces.map((trace) => (
                <path
                  key={`pulse-trace-${trace.id}`}
                  d={trace.d}
                  strokeWidth={trace.width + 0.6}
                  strokeLinecap="round"
                  strokeDasharray={trace.dashArray}
                  className="circuit-pulse-line"
                  fill="none"
                  style={
                    {
                      "--pulse-dur": `${trace.duration}s`,
                      "--pulse-delay": `${trace.delay}s`,
                      animationDirection: trace.reverse ? "reverse" : "normal",
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>
          )}

          {/* End-Node Dots with Soft Glowing Pulse */}
          <g>
            {geom.traces.map((trace) => (
              <circle
                key={`node-${trace.id}`}
                cx={trace.endNode.x}
                cy={trace.endNode.y}
                r={trace.endNode.r}
                fill="#ffc83d"
                className="circuit-node-dot"
                style={
                  {
                    "--node-dur": `${trace.endNode.duration}s`,
                    "--node-delay": `${trace.endNode.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>

          {/* Segmented Tech Ring Outline & Ticks */}
          <path
            d={geom.segmentedRingPath}
            stroke="#d4a03a"
            strokeWidth="1.2"
            fill="none"
            opacity="0.65"
          />
          <path
            d={geom.tickRingPath}
            stroke="#d4a03a"
            strokeWidth="1.0"
            fill="none"
            opacity="0.45"
          />
        </svg>
      )}

      {/* Floating Canvas Dust Particles */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      )}

      {/* ==================================================================== */}
      {/* 3. GOLDEN RING (ANIMATED, GLOWING, ROTATING CONIC-GRADIENT)          */}
      {/* ==================================================================== */}
      {/* Outer Rotating Conic-Gradient Ring */}
      <div
        className="absolute rounded-full animate-spin-sweep animate-ring-breathe"
        style={{
          width: `${ringDiameter}px`,
          height: `${ringDiameter}px`,
          left: `${cx}px`,
          top: `${cy}px`,
          transform: "translate(-50%, -50%)",
          background: "conic-gradient(from 0deg, #7a5210 0%, #ffd36b 25%, #fff1b8 35%, #ffd36b 45%, #c8901f 70%, #7a5210 100%)",
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px + 1px), #000 calc(100% - 1px), transparent)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px + 1px), #000 calc(100% - 1px), transparent)`,
        }}
      />

      {/* Second Thin Dashed/Segmented Tech Ring rotating in opposite direction (~25s) */}
      <div
        className="absolute rounded-full animate-spin-sweep-reverse"
        style={{
          width: `${techRingDiameter}px`,
          height: `${techRingDiameter}px`,
          left: `${cx}px`,
          top: `${cy}px`,
          transform: "translate(-50%, -50%)",
          border: "1.5px dashed rgba(255, 210, 100, 0.45)",
          boxShadow: "0 0 15px rgba(255, 190, 60, 0.25)",
        }}
      />

      {/* Two Bright Lens-Flare Highlights Orbiting Along the Ring (Top-Right & Bottom-Left) */}
      {!prefersReducedMotion && (
        <div
          className="absolute animate-spin-sweep"
          style={{
            width: `${ringDiameter}px`,
            height: `${ringDiameter}px`,
            left: `${cx}px`,
            top: `${cy}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Flare 1: Top-Right Highlight */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${ringDiameter / 2 + (ringRadius - ringThickness / 2) * Math.cos((45 * Math.PI) / 180)}px`,
              top: `${ringDiameter / 2 + (ringRadius - ringThickness / 2) * Math.sin((45 * Math.PI) / 180)}px`,
            }}
          >
            {/* Bright radial flare dot */}
            <div
              className="rounded-full bg-white shadow-[0_0_20px_#fff3c4]"
              style={{
                width: "12px",
                height: "12px",
                background: "radial-gradient(circle, #ffffff 0%, #fff1b8 45%, rgba(255,200,80,0) 80%)",
              }}
            />
            {/* 4-point star streaks */}
            <div className="absolute w-8 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute h-8 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>

          {/* Flare 2: Bottom-Left Highlight (Opposite at ~225°) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${ringDiameter / 2 + (ringRadius - ringThickness / 2) * Math.cos((225 * Math.PI) / 180)}px`,
              top: `${ringDiameter / 2 + (ringRadius - ringThickness / 2) * Math.sin((225 * Math.PI) / 180)}px`,
            }}
          >
            <div
              className="rounded-full bg-white shadow-[0_0_16px_#fff3c4]"
              style={{
                width: "9px",
                height: "9px",
                background: "radial-gradient(circle, #ffffff 0%, #fff1b8 45%, rgba(255,200,80,0) 80%)",
              }}
            />
            <div className="absolute w-6 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute h-6 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </div>
      )}

      {/* Inside the Ring: Subtle glass-like dark-gold radial gradient for perfect readability */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${Math.round(R * 1.96)}px`,
          height: `${Math.round(R * 1.96)}px`,
          left: `${cx}px`,
          top: `${cy}px`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(20, 13, 4, 0.72) 0%, rgba(10, 7, 3, 0.90) 82%, transparent 100%)",
        }}
      />
    </div>
  )
}
