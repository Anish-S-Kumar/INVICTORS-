"use client"

import React, { useEffect, useState } from "react"
import { GoldDust } from "./GoldDust"

interface CircuitSideProps {
  isMobile?: boolean
  className?: string
}

export function CircuitSide({ isMobile = false, className = "" }: CircuitSideProps) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`absolute left-0 top-0 bottom-0 pointer-events-none select-none overflow-hidden z-0 ${
        isMobile ? "w-20 opacity-20" : "w-[30vw] max-w-[420px] opacity-30"
      } ${className}`}
      style={{
        maskImage: "linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
      }}
      aria-hidden="true"
    >
      {/* Far edge vertical gold light glow beam */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-amber-500/30 to-transparent blur-sm" />

      {/* Rising gold dust particles on left side */}
      <GoldDust count={isMobile ? 8 : 18} />

      {/* SVG Circuit Traces & Pulses */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 300 800"
      >
        <defs>
          <linearGradient id="circuitGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f3e3a9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4a24c" stopOpacity="0.1" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Trace 1 - Vertical stepped line with nodes */}
        <path
          d="M 40 0 L 40 220 L 70 250 L 70 480 L 30 520 L 30 800"
          fill="none"
          stroke="rgba(212, 162, 76, 0.25)"
          strokeWidth="1.5"
        />
        {/* Trace 1 pulse */}
        {!reducedMotion && (
          <path
            d="M 40 0 L 40 220 L 70 250 L 70 480 L 30 520 L 30 800"
            fill="none"
            stroke="#f5e6b3"
            strokeWidth="2.5"
            strokeDasharray="40 360"
            className="animate-circuit-pulse-1"
            filter="url(#goldGlow)"
          />
        )}
        <circle cx="70" cy="250" r="3" fill="#d4a24c" />
        <circle cx="30" cy="520" r="3.5" fill="#f5e6b3" />

        {/* Trace 2 - Parallel circuit line */}
        <path
          d="M 110 0 L 110 160 L 140 190 L 140 380 L 90 430 L 90 700 L 120 730 L 120 800"
          fill="none"
          stroke="rgba(212, 162, 76, 0.2)"
          strokeWidth="1.5"
        />
        {!reducedMotion && (
          <path
            d="M 110 0 L 110 160 L 140 190 L 140 380 L 90 430 L 90 700 L 120 730 L 120 800"
            fill="none"
            stroke="#d4a24c"
            strokeWidth="2"
            strokeDasharray="60 420"
            className="animate-circuit-pulse-2"
            filter="url(#goldGlow)"
          />
        )}
        <circle cx="140" cy="190" r="3" fill="#d4a24c" />
        <circle cx="90" cy="430" r="3" fill="#d4a24c" />
        <circle cx="120" cy="730" r="2.5" fill="#f5e6b3" />

        {/* Trace 3 - Deeper inner trace */}
        <path
          d="M 180 80 L 180 320 L 220 360 L 220 620 L 170 670"
          fill="none"
          stroke="rgba(212, 162, 76, 0.15)"
          strokeWidth="1.2"
        />
        {!reducedMotion && (
          <path
            d="M 180 80 L 180 320 L 220 360 L 220 620 L 170 670"
            fill="none"
            stroke="#f7e7b4"
            strokeWidth="2"
            strokeDasharray="30 300"
            className="animate-circuit-pulse-3"
            filter="url(#goldGlow)"
          />
        )}
        <circle cx="180" cy="80" r="2.5" fill="#d4a24c" />
        <circle cx="220" cy="360" r="3" fill="#f5e6b3" />
        <circle cx="170" cy="670" r="3" fill="#d4a24c" />
      </svg>

      {/* Binary Columns Drifting Upward */}
      <div className="absolute left-6 top-0 bottom-0 flex gap-6 font-mono text-[9px] tracking-widest text-amber-400/35 overflow-hidden">
        <div className={`flex flex-col gap-1.5 ${reducedMotion ? "" : "animate-binary-drift-1"}`}>
          {"01010110010100101101010101001010101101010100101011010101".split("").map((b, i) => (
            <span key={i} className={i % 4 === 0 ? "text-amber-300 font-bold" : ""}>
              {b}
            </span>
          ))}
        </div>
        {!isMobile && (
          <div className={`flex flex-col gap-1.5 ${reducedMotion ? "" : "animate-binary-drift-2"}`}>
            {"11001010101101010010101011010101010100101011010101001010".split("").map((b, i) => (
              <span key={i} className={i % 5 === 0 ? "text-amber-200/90 font-bold" : ""}>
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Desktop-only: Interlocking Gears and Microchip Outline */}
      {!isMobile && (
        <>
          {/* Interlocking Gears */}
          <div className="absolute left-16 top-[35%] -translate-y-1/2 flex items-center">
            {/* Gear 1 (Clockwise) */}
            <svg
              className={`w-20 h-20 text-amber-500/25 ${reducedMotion ? "" : "animate-spin-slow"}`}
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeDasharray="4 2" />
              <circle cx="50" cy="50" r="14" stroke="currentColor" />
              <circle cx="50" cy="50" r="6" fill="currentColor" />
              {/* Gear Teeth */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <rect
                  key={deg}
                  x="47"
                  y="12"
                  width="6"
                  height="10"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
            </svg>

            {/* Gear 2 (Counter-Clockwise, meshed) */}
            <svg
              className={`w-14 h-14 -ml-4 mt-6 text-amber-400/20 ${reducedMotion ? "" : "animate-spin-reverse"}`}
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="50" cy="50" r="26" stroke="currentColor" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="10" stroke="currentColor" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="47"
                  y="14"
                  width="6"
                  height="10"
                  rx="1"
                  fill="currentColor"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
            </svg>
          </div>

          {/* Microchip Outline with Pulsing Pins */}
          <div className="absolute left-8 bottom-28 flex flex-col items-center">
            <div className="relative w-14 h-14 border border-amber-500/35 rounded-sm bg-black/40 flex items-center justify-center shadow-[0_0_10px_rgba(212,162,76,0.15)]">
              {/* Chip Core Symbol */}
              <div className="w-6 h-6 border border-dashed border-amber-400/40 rounded-xs flex items-center justify-center">
                <span className="font-mono text-[7px] text-amber-400 font-bold">INV</span>
              </div>

              {/* Pins Top/Bottom/Left/Right */}
              {[-12, -4, 4, 12].map((offset) => (
                <React.Fragment key={offset}>
                  {/* Left pins */}
                  <span
                    className="absolute -left-2 w-2 h-[1.5px] bg-amber-400/40 animate-pulse"
                    style={{ top: `calc(50% + ${offset}px)` }}
                  />
                  {/* Right pins */}
                  <span
                    className="absolute -right-2 w-2 h-[1.5px] bg-amber-400/40 animate-pulse"
                    style={{ top: `calc(50% + ${offset}px)` }}
                  />
                  {/* Top pins */}
                  <span
                    className="absolute -top-2 h-2 w-[1.5px] bg-amber-400/40 animate-pulse"
                    style={{ left: `calc(50% + ${offset}px)` }}
                  />
                  {/* Bottom pins */}
                  <span
                    className="absolute -bottom-2 h-2 w-[1.5px] bg-amber-400/40 animate-pulse"
                    style={{ left: `calc(50% + ${offset}px)` }}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
