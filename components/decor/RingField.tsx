"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { getDialAnchor, subscribeDialAnchor, DialAnchorState, Anchor } from "@/lib/dial-anchor"
import { generateRingFieldGeometry, GeneratedFieldGeometry } from "./ring-field-geometry"

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
  const [mounted, setMounted] = useState(false)
  const [anchorState, setAnchorState] = useState<DialAnchorState>(getDialAnchor())
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLowPower, setIsLowPower] = useState(false)

  // Radar ping state for ring-to-drum opening
  const [pingActive, setPingActive] = useState(false)
  const lastTurnRef = useRef<number>(0)

  // Mouse parallax offset (laptop only)
  const [parallax, setParallax] = useState({ ringsX: 0, ringsY: 0, tracesX: 0, tracesY: 0 })
  const targetParallaxRef = useRef({ x: 0, y: 0 })
  const currentParallaxRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number | null>(null)

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

      // Low power / data-saver check
      const nav = navigator as unknown as { connection?: { saveData?: boolean }; hardwareConcurrency?: number }
      if (nav.connection?.saveData || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)) {
        setIsLowPower(true)
      }
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

  // Listen for --turn / --m changes on container to trigger radar ping & comet speed adjustment
  useEffect(() => {
    if (!containerRef.current) return

    let checkAnim: number
    const checkTurnVar = () => {
      if (containerRef.current) {
        const turnStr = containerRef.current.parentElement?.style.getPropertyValue("--turn") ||
          containerRef.current.style.getPropertyValue("--turn")
        const currentTurn = parseFloat(turnStr || "0") || 0

        // If turn moved from ~0 towards 1, trigger opening radar ping once
        if (lastTurnRef.current < 0.08 && currentTurn >= 0.1) {
          setPingActive(true)
          setTimeout(() => setPingActive(false), 950)
        }
        lastTurnRef.current = currentTurn
      }
      checkAnim = requestAnimationFrame(checkTurnVar)
    }

    checkAnim = requestAnimationFrame(checkTurnVar)
    return () => cancelAnimationFrame(checkAnim)
  }, [])

  // Parallax tracking on desktop
  useEffect(() => {
    if (isMobile || prefersReducedMotion || isSubpage) return

    const onPointerMove = (e: PointerEvent) => {
      // Disabled on touch
      if (e.pointerType === "touch") return

      const w = window.innerWidth
      const h = window.innerHeight
      // Normalized pointer -1 to +1
      const nx = (e.clientX / w) * 2 - 1
      const ny = (e.clientY / h) * 2 - 1

      // Shifts opposite to pointer by at most 6px for rings and 12px for traces
      targetParallaxRef.current = {
        x: -nx * 6,
        y: -ny * 6,
      }
    }

    const onPointerLeave = () => {
      targetParallaxRef.current = { x: 0, y: 0 }
    }

    window.addEventListener("pointermove", onPointerMove)
    document.addEventListener("mouseleave", onPointerLeave)

    // Smoothly damp parallax toward target
    const loop = () => {
      const cur = currentParallaxRef.current
      const tgt = targetParallaxRef.current
      cur.x += (tgt.x - cur.x) * 0.08
      cur.y += (tgt.y - cur.y) * 0.08

      setParallax({
        ringsX: parseFloat(cur.x.toFixed(2)),
        ringsY: parseFloat(cur.y.toFixed(2)),
        tracesX: parseFloat((cur.x * 2).toFixed(2)),
        tracesY: parseFloat((cur.y * 2).toFixed(2)),
      })

      animFrameRef.current = requestAnimationFrame(loop)
    }
    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("mouseleave", onPointerLeave)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isMobile, prefersReducedMotion, isSubpage])

  // Determine active anchors
  const effectiveAnchor: Anchor = useMemo(() => {
    if (isSubpage) {
      // Subpages: centered at 50% x 38% of viewport
      const cx = stageSize.width * 0.5
      const cy = stageSize.height * 0.38
      const R = isRankPage
        ? Math.min(stageSize.width * 0.24, stageSize.height * 0.28, 220)
        : Math.min(stageSize.width * 0.20, stageSize.height * 0.24, 180)
      return { cx, cy, R }
    }
    return anchorState.anchor
  }, [isSubpage, isRankPage, stageSize, anchorState.anchor])

  // Generate geometry
  const mainGeometry: GeneratedFieldGeometry | null = useMemo(() => {
    if (!mounted) return null
    return generateRingFieldGeometry({
      cx: effectiveAnchor.cx,
      cy: effectiveAnchor.cy,
      R: effectiveAnchor.R,
      width: stageSize.width,
      height: stageSize.height,
      isMobile: isMobile || isLowPower,
      pulseCount: isSubpage ? 0 : isMobile || isLowPower ? 8 : 18,
      rayCountOverride: isSubpage ? 24 : undefined,
    })
  }, [mounted, effectiveAnchor, stageSize, isMobile, isLowPower, isSubpage])

  // Mobile Anchor L geometry (Logo)
  const mobileLogoGeom: GeneratedFieldGeometry | null = useMemo(() => {
    if (!mounted || !isMobile || !anchorState.anchorL) return null
    return generateRingFieldGeometry({
      cx: anchorState.anchorL.cx,
      cy: anchorState.anchorL.cy,
      R: anchorState.anchorL.R,
      width: stageSize.width,
      height: stageSize.height,
      isMobile: true,
      startRadiusRatio: 1.38,
      pulseCount: 6,
      rayCountOverride: 44,
    })
  }, [mounted, isMobile, anchorState.anchorL, stageSize])

  // Mobile Anchor D geometry (Dial base)
  const mobileDialGeom: GeneratedFieldGeometry | null = useMemo(() => {
    if (!mounted || !isMobile || !anchorState.anchorD) return null
    // Hide anchor D on short screens
    if (stageSize.height < 640) return null

    return generateRingFieldGeometry({
      cx: anchorState.anchorD.cx,
      cy: anchorState.anchorD.cy,
      R: anchorState.anchorD.R,
      width: stageSize.width,
      height: stageSize.height,
      isMobile: true,
      startRadiusRatio: 1.07,
      pulseCount: 2,
      rayCountOverride: 16,
    })
  }, [mounted, isMobile, anchorState.anchorD, stageSize])

  const { cx, cy, R } = effectiveAnchor
  const mainRingRadius = R * (isMobile ? 1.10 : 1.04)

  // Comet parameters
  const cometSize = Math.round(mainRingRadius * 2)
  const cometThickness = Math.max(3, Math.round(R * 0.022))

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-800 ${
        isIntroPlaying ? "opacity-0" : "opacity-100"
      } ${className}`}
      aria-hidden="true"
      data-paused={isIntroPlaying ? "true" : undefined}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
      }}
    >
      {/* ==================================================================== */}
      {/* LAYER 1: BASE WARM GLOW & NOISE DITHER PATTERN                       */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(122,84,16,${
            isSubpage ? 0.16 : 0.34
          }) 0px, rgba(70,46,8,${isSubpage ? 0.08 : 0.18}) ${Math.round(
            R * 0.9
          )}px, transparent ${Math.round(R * 1.9)}px)`,
        }}
      />

      {/* Vignette to pure black toward the stage edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(5,5,5,0.7) 80%, #050505 100%)",
        }}
      />

      {/* Tiny SVG noise/dither pattern overlay (1.5% opacity) to eliminate color banding */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* ==================================================================== */}
      {/* LAYER 2: CIRCUIT FIELD (SVG Radial Traces, End Nodes, Data Pulses)   */}
      {/* ==================================================================== */}
      {mainGeometry && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${parallax.tracesX}px, ${parallax.tracesY}px)`,
          }}
        >
          {/* Tier 0 Traces (Opacity 0.10) */}
          {mainGeometry.tierPaths[0] && (
            <path
              d={mainGeometry.tierPaths[0]}
              stroke="#c9962f"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={isSubpage ? "0.06" : "0.10"}
            />
          )}

          {/* Tier 1 Traces (Opacity 0.18) */}
          {mainGeometry.tierPaths[1] && (
            <path
              d={mainGeometry.tierPaths[1]}
              stroke="#c9962f"
              strokeWidth="1.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={isSubpage ? "0.10" : "0.18"}
            />
          )}

          {/* Tier 2 Traces (Opacity 0.30) */}
          {mainGeometry.tierPaths[2] && (
            <path
              d={mainGeometry.tierPaths[2]}
              stroke="#c9962f"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={isSubpage ? "0.15" : "0.30"}
            />
          )}

          {/* Active Data Pulses (Travelling dashes on chosen traces) */}
          {!prefersReducedMotion &&
            !isLowPower &&
            mainGeometry.pulseTraces.map((pulse, pIdx) => (
              <path
                key={`pulse-${pIdx}`}
                d={pulse.d}
                pathLength="100"
                stroke="#fff3c4"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="7 100"
                fill="none"
                className="animate-pulse-run ring-field-anim"
                style={
                  {
                    "--pulse-dur": `${pulse.duration}s`,
                    "--pulse-delay": `${pulse.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}

          {/* End Nodes */}
          {mainGeometry.allNodes.map((node, nIdx) => (
            <circle
              key={`node-${nIdx}`}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="#050505"
              stroke="#c9962f"
              strokeWidth="1"
              opacity={isSubpage ? "0.2" : "0.4"}
              className={node.twinkle && !prefersReducedMotion ? "animate-node-twinkle ring-field-anim" : ""}
              style={
                node.twinkle
                  ? ({
                      "--twinkle-dur": `${4 + (nIdx % 5)}s`,
                      "--twinkle-delay": `${(nIdx * 0.7) % 4}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          ))}

          {/* LAYER 3: TICK RING AT 1.16R */}
          <path
            d={mainGeometry.tickPath}
            stroke="#d4a24c"
            strokeWidth="1"
            fill="none"
            opacity={isSubpage ? "0.18" : "0.45"}
          />

          {/* LAYER 4: SEGMENTED RING AT 1.10R */}
          <g
            className={prefersReducedMotion ? "" : "animate-ring-ccw ring-field-anim"}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
            }}
          >
            <path
              d={mainGeometry.segmentedRingPath}
              stroke="#d4a24c"
              strokeWidth={Math.max(1, R * 0.004)}
              strokeLinecap="round"
              fill="none"
              opacity={isSubpage ? "0.25" : "0.55"}
            />
            {mainGeometry.segmentedRingNodes.map((sn, sIdx) => (
              <circle
                key={`segnode-${sIdx}`}
                cx={sn.x}
                cy={sn.y}
                r="1.6"
                fill="#fff3c4"
                opacity={isSubpage ? "0.3" : "0.7"}
              />
            ))}
          </g>

          {/* BASE OUTLINE FOR MAIN GLOWING RING */}
          <circle
            cx={cx}
            cy={cy}
            r={mainRingRadius}
            stroke="#d4a24c"
            strokeWidth={Math.max(1.2, R * 0.006)}
            fill="none"
            opacity={isSubpage ? "0.2" : "0.5"}
          />

          {/* Radar Ping on Opening */}
          {pingActive && (
            <circle
              cx={cx}
              cy={cy}
              r={mainRingRadius}
              stroke="#d4a24c"
              strokeWidth="1.5"
              fill="none"
              style={{
                animation: "radarPing 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            />
          )}
        </svg>
      )}

      {/* ==================================================================== */}
      {/* LAYER 7: HALO (Pre-blurred radial gradient ring bloom)               */}
      {/* ==================================================================== */}
      <div
        className="absolute animate-ring-halo ring-field-anim"
        style={{
          width: `${Math.round(R * 2.3)}px`,
          height: `${Math.round(R * 2.3)}px`,
          left: `${cx + parallax.ringsX}px`,
          top: `${cy + parallax.ringsY}px`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, transparent 38%, rgba(212,162,76,0.20) 47%, rgba(212,162,76,0.06) 62%, transparent 74%)",
        }}
      />

      {/* ==================================================================== */}
      {/* LAYER 5 & 6: MAIN GLOWING RING WITH COMET & LENS FLARES              */}
      {/* ==================================================================== */}
      {!isSubpage && (
        <div
          className={`absolute animate-ring-comet ring-field-anim ${
            prefersReducedMotion ? "rotate-[42deg]" : ""
          }`}
          style={{
            width: `${cometSize}px`,
            height: `${cometSize}px`,
            left: `${cx + parallax.ringsX}px`,
            top: `${cy + parallax.ringsY}px`,
            transform: "translate(-50%, -50%)",
            background:
              "conic-gradient(from 0deg, transparent 0% 38%, #5b3f0c 52%, #d4a24c 70%, #fff3c4 80%, transparent 82% 100%)",
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${cometThickness}px), #000 calc(100% - ${cometThickness}px + 1px), #000 calc(100% - 1px), transparent)`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${cometThickness}px), #000 calc(100% - ${cometThickness}px + 1px), #000 calc(100% - 1px), transparent)`,
          }}
        >
          {/* Head Lens Flare (sitting on brightest 80% arc angle ~288 deg) */}
          <div
            className="absolute"
            style={{
              left: `${cometSize / 2 + (mainRingRadius - cometThickness / 2) * Math.cos((288 * Math.PI) / 180)}px`,
              top: `${cometSize / 2 + (mainRingRadius - cometThickness / 2) * Math.sin((288 * Math.PI) / 180)}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Soft dot */}
            <div
              className="rounded-full bg-white shadow-[0_0_14px_#fff3c4]"
              style={{
                width: `${Math.round(R * 0.05)}px`,
                height: `${Math.round(R * 0.05)}px`,
                background: "radial-gradient(circle, #ffffff 0%, #fff3c4 50%, rgba(212,162,76,0) 80%)",
              }}
            />
            {/* 4-point star streaks (laptop only) */}
            {!isMobile && (
              <>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{ width: `${Math.round(R * 0.12)}px` }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"
                  style={{ height: `${Math.round(R * 0.12)}px` }}
                />
              </>
            )}
          </div>

          {/* Opposite Lens Flare (180 deg opposite at 40% intensity) */}
          <div
            className="absolute animate-flare-breathe"
            style={{
              left: `${cometSize / 2 + (mainRingRadius - cometThickness / 2) * Math.cos((108 * Math.PI) / 180)}px`,
              top: `${cometSize / 2 + (mainRingRadius - cometThickness / 2) * Math.sin((108 * Math.PI) / 180)}px`,
              transform: "translate(-50%, -50%)",
              opacity: 0.4,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${Math.round(R * 0.04)}px`,
                height: `${Math.round(R * 0.04)}px`,
                background: "radial-gradient(circle, #ffffff 0%, #fff3c4 50%, rgba(212,162,76,0) 80%)",
              }}
            />
          </div>
        </div>
      )}

      {/* TICK SCANNER HIGHLIGHT LAYER (22s slow rotating bright band over ticks) */}
      {!isSubpage && (
        <div
          className="absolute animate-ring-scanner ring-field-anim"
          style={{
            width: `${Math.round(R * 2.36)}px`,
            height: `${Math.round(R * 2.36)}px`,
            left: `${cx + parallax.ringsX}px`,
            top: `${cy + parallax.ringsY}px`,
            transform: "translate(-50%, -50%)",
            background:
              "conic-gradient(from 0deg, transparent 0% 90%, rgba(212,162,76,0.7) 96%, #fff3c4 98%, transparent 100%)",
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.round(
              R * 0.04
            )}px), #000 calc(100% - ${Math.round(R * 0.04)}px + 1px), #000 calc(100% - 1px), transparent)`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.round(
              R * 0.04
            )}px), #000 calc(100% - ${Math.round(R * 0.04)}px + 1px), #000 calc(100% - 1px), transparent)`,
          }}
        />
      )}

      {/* ==================================================================== */}
      {/* MOBILE ANCHOR L (Logo) & ANCHOR D (Dial) EXTRA LAYERS                 */}
      {/* ==================================================================== */}
      {isMobile && mobileLogoGeom && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 75%)",
          }}
        >
          {/* Logo radiating traces */}
          {mobileLogoGeom.tierPaths[0] && (
            <path
              d={mobileLogoGeom.tierPaths[0]}
              stroke="#c9962f"
              strokeWidth="0.9"
              fill="none"
              opacity="0.10"
            />
          )}
          {mobileLogoGeom.tierPaths[1] && (
            <path
              d={mobileLogoGeom.tierPaths[1]}
              stroke="#c9962f"
              strokeWidth="1.0"
              fill="none"
              opacity="0.18"
            />
          )}
          {mobileLogoGeom.tierPaths[2] && (
            <path
              d={mobileLogoGeom.tierPaths[2]}
              stroke="#c9962f"
              strokeWidth="1.2"
              fill="none"
              opacity="0.25"
            />
          )}
        </svg>
      )}

      {isMobile && mobileDialGeom && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{
            maskImage: "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 70%, transparent 100%)",
          }}
        >
          {/* Two concentric thin arcs at 1.02R and 1.07R */}
          <path
            d={`M ${mobileDialGeom.cx - mobileDialGeom.R * 1.02} ${mobileDialGeom.cy} A ${
              mobileDialGeom.R * 1.02
            } ${mobileDialGeom.R * 1.02} 0 0 1 ${mobileDialGeom.cx + mobileDialGeom.R * 1.02} ${
              mobileDialGeom.cy
            }`}
            stroke="#d4a24c"
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
          <path
            d={`M ${mobileDialGeom.cx - mobileDialGeom.R * 1.07} ${mobileDialGeom.cy} A ${
              mobileDialGeom.R * 1.07
            } ${mobileDialGeom.R * 1.07} 0 0 1 ${mobileDialGeom.cx + mobileDialGeom.R * 1.07} ${
              mobileDialGeom.cy
            }`}
            stroke="#d4a24c"
            strokeWidth="1.0"
            fill="none"
            opacity="0.20"
          />
          {/* 16 short traces fanning upward into space */}
          {mobileDialGeom.tierPaths[0] && (
            <path
              d={mobileDialGeom.tierPaths[0]}
              stroke="#c9962f"
              strokeWidth="0.9"
              fill="none"
              opacity="0.12"
            />
          )}
        </svg>
      )}
    </div>
  )
}
