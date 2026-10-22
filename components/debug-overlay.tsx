"use client"

import React, { useState, useEffect } from "react"
import { getDialAnchor } from "@/lib/dial-anchor"

export function DebugOverlay() {
  const [isDebug, setIsDebug] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [boxes, setBoxes] = useState<Array<{ name: string; rect: DOMRect; color: string }>>([])
  const [fps, setFps] = useState<number>(60)
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.6)
  const [longFramesCount, setLongFramesCount] = useState<number>(0)

  const [concentricity, setConcentricity] = useState<{
    delta: number
    radiusDiff: number
    sameContainer: boolean
    cx: number
    cy: number
    R: number
  }>({ delta: 0, radiusDiff: 0, sameContainer: true, cx: 0, cy: 0, R: 0 })

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        setIsDebug(params.get("debug") === "1")
      }
    } catch {
      // ignore
    }
  }, [])

  // rAF loop to track FPS and long frames (>20ms) when debug is active
  useEffect(() => {
    if (!isDebug) return

    let animId: number
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdateTime = performance.now()

    const measureFrame = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (delta > 20) {
        setLongFramesCount((prev) => prev + 1)
      }

      frameCount++
      if (time - lastFpsUpdateTime >= 500) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdateTime)))
        setFrameTimeMs(parseFloat(delta.toFixed(1)))
        frameCount = 0
        lastFpsUpdateTime = time
      }

      animId = requestAnimationFrame(measureFrame)
    }

    animId = requestAnimationFrame(measureFrame)
    return () => cancelAnimationFrame(animId)
  }, [isDebug])

  useEffect(() => {
    if (!isDebug) return

    const colorMap: Record<string, string> = {
      header: "#06b6d4", // Cyan
      dial: "#f59e0b", // Amber
      logo: "#10b981", // Emerald
      motto: "#eab308", // Yellow
      slogan: "#a855f7", // Purple
      "zone-a": "#3b82f6", // Blue
      "zone-b": "#ec4899", // Pink
      disk: "#f97316", // Orange
      medallion: "#e11d48", // Rose
      button: "#22c55e", // Green
    }

    const checkOverlapsAndClipping = () => {
      const foundBoxes: Array<{ name: string; rect: DOMRect; color: string }> = []
      const newWarnings: string[] = []

      const debugElements = document.querySelectorAll<HTMLElement>("[data-debug]")

      debugElements.forEach((el) => {
        // Skip hidden or unmounted elements
        if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) return

        const name = el.getAttribute("data-debug") || "element"
        const rect = el.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          foundBoxes.push({
            name,
            rect,
            color: colorMap[name] || "#ffffff",
          })
        }

        // Text clipping check
        const textElements = el.querySelectorAll<HTMLElement>("p, h1, h2, h3, span, a")
        textElements.forEach((txt) => {
          if (txt.scrollWidth > txt.clientWidth + 2 && txt.clientWidth > 0) {
            const warningMsg = `[DebugOverlay] Clipped text in <${name}>: "${txt.textContent?.slice(
              0,
              25
            )}..." (scrollWidth: ${txt.scrollWidth}px > clientWidth: ${txt.clientWidth}px)`
            newWarnings.push(warningMsg)
            console.warn(warningMsg, txt)
          }
        })
      })

      // Collision checks between pairs that must NEVER overlap
      const checkPair = (name1: string, name2: string) => {
        const b1 = foundBoxes.find((b) => b.name === name1)
        const b2 = foundBoxes.find((b) => b.name === name2)
        if (b1 && b2) {
          const intersects = !(
            b1.rect.right <= b2.rect.left ||
            b1.rect.left >= b2.rect.right ||
            b1.rect.bottom <= b2.rect.top ||
            b1.rect.top >= b2.rect.bottom
          )
          if (intersects) {
            const warnMsg = `[DebugOverlay] Collision detected between <${name1}> and <${name2}>!`
            newWarnings.push(warnMsg)
            console.warn(warnMsg, b1.rect, b2.rect)
          }
        }
      }

      // Check mobile zones
      checkPair("zone-a", "zone-b")
      checkPair("disk", "logo")
      checkPair("button", "disk")

      // Concentricity and Alignment Contract check (v8)
      const anchorState = getDialAnchor()
      const { cx, cy, R } = anchorState.anchor
      const dialRimEl = document.getElementById("dial-outer-chrome-rim")
      const ringContainerEl = document.querySelector(".animate-ring-comet")?.parentElement

      let delta = 0
      let radiusDiff = 0
      let sameContainer = true

      if (dialRimEl && ringContainerEl) {
        const rimRect = dialRimEl.getBoundingClientRect()
        const stageRect = ringContainerEl.getBoundingClientRect()
        const measuredCx = rimRect.left - stageRect.left + rimRect.width / 2
        const measuredCy = rimRect.top - stageRect.top + rimRect.height / 2
        const measuredR = rimRect.width / 2

        delta = Math.hypot(measuredCx - cx, measuredCy - cy)
        radiusDiff = Math.abs(measuredR - R)
        sameContainer = dialRimEl.closest(".relative") === ringContainerEl.closest(".relative")

        if (delta > 0.5) {
          newWarnings.push(`[Alignment] Field centre delta > 0.5px: ${delta.toFixed(2)}px`)
        }
        if (radiusDiff > 0.5) {
          newWarnings.push(`[Alignment] Rim radius mismatch > 0.5px: ${radiusDiff.toFixed(2)}px`)
        }
        if (!sameContainer) {
          newWarnings.push(`[Alignment] RingField is not a child of the same container as the dial!`)
        }

        setConcentricity({
          delta: parseFloat(delta.toFixed(2)),
          radiusDiff: parseFloat(radiusDiff.toFixed(2)),
          sameContainer,
          cx: Math.round(rimRect.left + rimRect.width / 2),
          cy: Math.round(rimRect.top + rimRect.height / 2),
          R: Math.round(measuredR),
        })
      }

      setBoxes(foundBoxes)
      setWarnings(newWarnings)
    }

    // Run check initially and on interval to adapt to view changes
    checkOverlapsAndClipping()
    const interval = setInterval(checkOverlapsAndClipping, 800)
    window.addEventListener("resize", checkOverlapsAndClipping)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkOverlapsAndClipping)
    }
  }, [isDebug])

  if (!isDebug) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Screen Center Crosshairs */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-500/30" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-500/30" />

      {/* Dial Anchor Crosshairs & 1.04R Ring Outline (v8 check) */}
      {concentricity.cx > 0 && (
        <>
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-cyan-400/50 pointer-events-none"
            style={{ left: `${concentricity.cx}px` }}
          />
          <div
            className="absolute left-0 right-0 h-[1.5px] bg-cyan-400/50 pointer-events-none"
            style={{ top: `${concentricity.cy}px` }}
          />
          <div
            className="absolute rounded-full border-2 border-dashed border-cyan-400/60 pointer-events-none"
            style={{
              left: `${concentricity.cx}px`,
              top: `${concentricity.cy}px`,
              width: `${concentricity.R * 2 * 1.04}px`,
              height: `${concentricity.R * 2 * 1.04}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-900/90 text-cyan-200 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap">
              1.04R Ring ({Math.round(concentricity.R * 1.04)}px)
            </span>
          </div>
        </>
      )}

      {/* Render Bounding Boxes */}
      {boxes.map((b, idx) => (
        <div
          key={`${b.name}-${idx}`}
          style={{
            position: "absolute",
            left: `${b.rect.left}px`,
            top: `${b.rect.top}px`,
            width: `${b.rect.width}px`,
            height: `${b.rect.height}px`,
            border: `1.5px dashed ${b.color}`,
            backgroundColor: `${b.color}10`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-18px",
              left: "0",
              backgroundColor: b.color,
              color: "#000",
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 4px",
              borderRadius: "2px",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {b.name} ({Math.round(b.rect.width)}x{Math.round(b.rect.height)})
          </span>
        </div>
      ))}

      {/* Floating Debug Status Badge */}
      <div className="absolute top-16 right-4 pointer-events-auto bg-black/90 border border-amber-500/60 p-3 rounded-lg shadow-2xl font-mono text-[11px] text-amber-200 max-w-xs">
        <div className="font-bold text-amber-400 border-b border-amber-500/30 pb-1 mb-1.5 flex items-center justify-between">
          <span>DEBUG OVERLAY (?debug=1)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-center justify-between py-0.5 border-b border-white/10">
          <span>FPS:</span>
          <span className={`font-bold ${fps >= 55 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-red-400"}`}>
            {fps} fps ({frameTimeMs} ms)
          </span>
        </div>
        <div className="flex items-center justify-between py-0.5 border-b border-white/10">
          <span>Long Frames (&gt;20ms):</span>
          <span className={`font-bold ${longFramesCount === 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {longFramesCount}
          </span>
        </div>
        <div>
          Concentricity:{" "}
          <span className={concentricity.delta <= 0.5 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {concentricity.delta <= 0.5 ? "Locked" : "Drift"} (Δ: {concentricity.delta}px, R: {concentricity.R}px)
          </span>
        </div>
        <div>Active Boxes: <span className="text-white">{boxes.length}</span></div>
        <div>
          Overlaps / Clipping:{" "}
          <span className={warnings.length > 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
            {warnings.length} issues
          </span>
        </div>
        {warnings.length > 0 && (
          <div className="mt-2 text-[9px] text-red-300 max-h-24 overflow-y-auto">
            {warnings.map((w, i) => (
              <div key={i}>• {w}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
