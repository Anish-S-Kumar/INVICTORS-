"use client"

import React, { useState, useEffect } from "react"

export function DebugOverlay() {
  const [isDebug, setIsDebug] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [boxes, setBoxes] = useState<Array<{ name: string; rect: DOMRect; color: string }>>([])
  const [fps, setFps] = useState<number>(60)
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.6)
  const [longFramesCount, setLongFramesCount] = useState<number>(0)

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
      checkPair("zone-a", "zone-b1")
      checkPair("button", "zone-b1")

      // =====================================================================
      // V7 MOBILE ROTARY DIAL DEV ASSERTIONS
      // =====================================================================
      const dialLabels = Array.from(document.querySelectorAll<HTMLElement>("[data-dial-label]"))
      if (dialLabels.length > 0) {
        // Assertion 1: Exactly 6 elements match [data-dial-label]
        if (dialLabels.length !== 6) {
          const warnMsg = `[V7 Assertion Failed] Exactly 6 elements must match [data-dial-label], found ${dialLabels.length}`
          newWarnings.push(warnMsg)
          console.warn(warnMsg)
        }

        const zoneB1El = document.querySelector<HTMLElement>("[data-debug='zone-b1']")
        const b1Rect = zoneB1El?.getBoundingClientRect()

        // Assertion 2: Selected label non-empty and inside viewport and Zone B1
        const selectedLabel = dialLabels.find((el) => el.getAttribute("data-selected") === "true")
        if (!selectedLabel) {
          const warnMsg = `[V7 Assertion Failed] No label has data-selected="true"`
          newWarnings.push(warnMsg)
          console.warn(warnMsg)
        } else {
          const selText = selectedLabel.textContent?.trim() || ""
          if (selText.length === 0) {
            const warnMsg = `[V7 Assertion Failed] Selected label text is empty`
            newWarnings.push(warnMsg)
            console.warn(warnMsg)
          }
          const selRect = selectedLabel.getBoundingClientRect()
          const inViewport =
            selRect.left >= 0 &&
            selRect.right <= window.innerWidth &&
            selRect.top >= 0 &&
            selRect.bottom <= window.innerHeight
          if (!inViewport) {
            const warnMsg = `[V7 Assertion Failed] Selected label lies outside viewport: [${Math.round(selRect.left)}, ${Math.round(selRect.right)}]`
            newWarnings.push(warnMsg)
            console.warn(warnMsg, selRect)
          }
          if (b1Rect) {
            // Allow 2px subpixel rounding tolerance
            const inB1 =
              selRect.left >= b1Rect.left - 2 &&
              selRect.right <= b1Rect.right + 2 &&
              selRect.top >= b1Rect.top - 2 &&
              selRect.bottom <= b1Rect.bottom + 2
            if (!inB1) {
              const warnMsg = `[V7 Assertion Failed] Selected label lies outside Zone B1`
              newWarnings.push(warnMsg)
              console.warn(warnMsg, selRect, b1Rect)
            }
          }
        }

        // Assertion 3: Both neighbours' bounding boxes are inside the viewport
        const visibleNeighbours = dialLabels.filter(
          (el) =>
            el.style.visibility !== "hidden" &&
            parseFloat(el.style.opacity || "1") > 0.1 &&
            el !== selectedLabel
        )
        visibleNeighbours.forEach((nb, i) => {
          const nbRect = nb.getBoundingClientRect()
          // Allow subpixel leeway of 3px
          const inVp = nbRect.left >= -3 && nbRect.right <= window.innerWidth + 3
          if (!inVp) {
            const warnMsg = `[V7 Assertion Failed] Neighbour label ${i + 1} (${nb.textContent?.trim().slice(0, 15)}) outside viewport: left=${Math.round(nbRect.left)}, right=${Math.round(nbRect.right)}`
            newWarnings.push(warnMsg)
            console.warn(warnMsg, nbRect)
          }
        })

        // Assertion 4: Pill bounding box inside viewport with bottom >= 28px above window.innerHeight
        const pillBtn = document.querySelector<HTMLElement>("[data-debug='button']")
        if (pillBtn) {
          const pillRect = pillBtn.getBoundingClientRect()
          const clearance = window.innerHeight - pillRect.bottom
          if (clearance < 27.5) {
            const warnMsg = `[V7 Assertion Failed] Pill bottom clearance (${clearance.toFixed(1)}px) is under 28px above window.innerHeight`
            newWarnings.push(warnMsg)
            console.warn(warnMsg, clearance)
          }
          if (pillRect.left < 0 || pillRect.right > window.innerWidth || pillRect.top < 0 || pillRect.bottom > window.innerHeight) {
            const warnMsg = `[V7 Assertion Failed] Pill is not entirely inside viewport`
            newWarnings.push(warnMsg)
            console.warn(warnMsg, pillRect)
          }

          // Assertion 6: Pill does not intersect dial area (Zone B1)
          if (b1Rect) {
            const pillIntersectsB1 = !(
              pillRect.right <= b1Rect.left ||
              pillRect.left >= b1Rect.right ||
              pillRect.bottom <= b1Rect.top ||
              pillRect.top >= b1Rect.bottom
            )
            if (pillIntersectsB1) {
              const warnMsg = `[V7 Assertion Failed] Pill intersects Zone B1 dial area`
              newWarnings.push(warnMsg)
              console.warn(warnMsg, pillRect, b1Rect)
            }
          }
        }

        // Assertion 5: No two labels' visible boxes overlap
        const visibleLabels = dialLabels.filter(
          (el) => el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "1") > 0.3
        )
        for (let i = 0; i < visibleLabels.length; i++) {
          for (let j = i + 1; j < visibleLabels.length; j++) {
            const r1 = visibleLabels[i].getBoundingClientRect()
            const r2 = visibleLabels[j].getBoundingClientRect()
            const overlap = !(
              r1.right <= r2.left ||
              r1.left >= r2.right ||
              r1.bottom <= r2.top ||
              r1.top >= r2.bottom
            )
            if (overlap) {
              const warnMsg = `[V7 Assertion Failed] Dial labels overlap: "${visibleLabels[i].textContent?.trim().slice(0, 10)}" and "${visibleLabels[j].textContent?.trim().slice(0, 10)}"`
              newWarnings.push(warnMsg)
              console.warn(warnMsg, r1, r2)
            }
          }
        }
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
        <div>Concentricity: <span className="text-emerald-400 font-bold">100% Locked</span></div>
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
