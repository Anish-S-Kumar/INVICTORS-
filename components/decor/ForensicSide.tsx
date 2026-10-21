"use client"

import React, { useEffect, useState } from "react"
import { GoldDust } from "./GoldDust"

interface ForensicSideProps {
  isMobile?: boolean
  className?: string
}

export function ForensicSide({ isMobile = false, className = "" }: ForensicSideProps) {
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
      className={`absolute right-0 top-0 bottom-0 pointer-events-none select-none overflow-hidden z-0 ${
        isMobile ? "w-20 opacity-20" : "w-[30vw] max-w-[420px] opacity-30"
      } ${className}`}
      style={{
        maskImage: "linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
      }}
      aria-hidden="true"
    >
      {/* Far edge vertical gold light glow beam */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-amber-500/30 to-transparent blur-sm" />

      {/* Rising gold dust particles on right side */}
      <GoldDust count={isMobile ? 8 : 18} />

      {/* Forensic Fingerprint with Sweeping Scan Line & Drifting Magnifier */}
      {!isMobile && (
        <div className="absolute right-12 top-20 w-36 h-48 flex items-center justify-center">
          {/* Fingerprint Ridge Arcs SVG */}
          <svg
            className="w-full h-full text-amber-500/30"
            viewBox="0 0 100 130"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {/* Concentric ridge loops resembling cybersecurity digital forensic motif */}
            <path d="M 50 25 C 40 25 35 35 35 50 C 35 75 42 105 50 115" />
            <path d="M 50 15 C 32 15 25 32 25 55 C 25 85 34 110 44 125" />
            <path d="M 50 35 C 44 35 42 42 42 52 C 42 70 48 95 54 105" />
            <path d="M 50 5 C 25 5 15 28 15 60 C 15 95 26 120 38 128" />
            <path d="M 50 25 C 60 25 65 35 65 50 C 65 72 58 98 52 110" />
            <path d="M 50 15 C 68 15 75 32 75 55 C 75 82 66 108 58 120" />
            <path d="M 50 35 C 56 35 58 42 58 52 C 58 68 53 88 48 98" />
            <path d="M 50 5 C 75 5 85 28 85 60 C 85 92 74 115 66 126" />
          </svg>

          {/* Sweeping Gold Scanline */}
          {!reducedMotion && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_8px_#f5e6b3] animate-scanline" />
          )}

          {/* Drifting Magnifying Glass Reticle */}
          <div
            className={`absolute w-12 h-12 rounded-full border border-amber-400/50 shadow-[0_0_12px_rgba(212,162,76,0.3)] bg-amber-400/5 backdrop-blur-[1px] flex items-center justify-center ${
              reducedMotion ? "" : "animate-reticle-drift"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_4px_#f5e6b3]" />
            <div className="absolute top-0 bottom-0 w-[1px] bg-amber-400/30" />
            <div className="absolute left-0 right-0 h-[1px] bg-amber-400/30" />
            {/* Small handle */}
            <div className="absolute -bottom-2 -right-2 w-3.5 h-[2px] bg-amber-400/60 rotate-45" />
          </div>
        </div>
      )}

      {/* Tilted Orbit Ellipse with Travelling Satellite Dot */}
      <div
        className={`absolute ${
          isMobile ? "right-2 top-1/3 w-36 h-20" : "right-14 top-[50%] w-56 h-28"
        } -translate-y-1/2`}
      >
        <svg
          className="w-full h-full -rotate-12"
          viewBox="0 0 200 100"
          fill="none"
        >
          {/* Orbit Ellipse */}
          <ellipse
            cx="100"
            cy="50"
            rx="90"
            ry="40"
            stroke="rgba(212, 162, 76, 0.3)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />

          {/* Satellite Dot with glowing trail */}
          {!reducedMotion && (
            <g className="animate-orbit-travel">
              <circle cx="100" cy="10" r="3" fill="#f5e6b3" filter="drop-shadow(0 0 4px #d4a24c)" />
              <circle cx="94" cy="11" r="1.5" fill="#d4a24c" opacity="0.6" />
              <circle cx="89" cy="13" r="1" fill="#d4a24c" opacity="0.3" />
            </g>
          )}
        </svg>
      </div>

      {/* Desktop-only: Faint Hex Grid + Rotating Puzzle Piece + Floating Eco Leaf */}
      {!isMobile && (
        <>
          {/* Faint Hex/PCB Grid */}
          <div className="absolute right-8 bottom-32 w-44 h-40 grid grid-cols-4 gap-2 opacity-25">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 border border-amber-500/30 flex items-center justify-center transition-colors duration-1000 ${
                  idx === 3 || idx === 6 || idx === 11 || idx === 14
                    ? "bg-amber-400/20 shadow-[0_0_8px_rgba(212,162,76,0.4)] animate-pulse"
                    : "bg-transparent"
                }`}
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              />
            ))}
          </div>

          {/* Floating Eco Leaf Outline (Eco & Sustainability motif) */}
          <div
            className={`absolute right-24 bottom-16 text-amber-400/25 ${
              reducedMotion ? "" : "animate-float-leaf"
            }`}
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>

          {/* Slowly Rotating Puzzle Piece Outline */}
          <div
            className={`absolute right-6 top-[72%] text-amber-500/20 ${
              reducedMotion ? "" : "animate-spin-slow"
            }`}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19.439 7.85c-.049-.322.059-.648.289-.878l1.568-1.568c.47-.47.704-1.127.643-1.789a2.5 2.5 0 0 0-2.227-2.227c-.662-.061-1.319.173-1.789.643l-1.568 1.568c-.23.23-.556.338-.878.289A3.003 3.003 0 0 0 12 6c-.958 0-1.838-.45-2.439-1.15-.322-.049-.648.059-.878.289L7.115 6.707c-.47.47-.704 1.127-.643 1.789.061.662.428 1.258.989 1.608.28.175.45.48.45.811s-.17.636-.45.811c-.561.35-.928.946-.989 1.608-.061.662.173 1.319.643 1.789l1.568 1.568c.23.23.338.556.289.878A3.003 3.003 0 0 0 12 20c.958 0 1.838.45 2.439 1.15.322.049.648-.059.878-.289l1.568-1.568c.47-.47.704-1.127.643-1.789a2.5 2.5 0 0 0-.989-1.608c-.28-.175-.45-.48-.45-.811s.17-.636.45-.811c.561-.35.928-.946.989-1.608.061-.662-.173-1.319-.643-1.789l-1.568-1.568c-.23-.23-.338-.556-.289-.878A3.003 3.003 0 0 0 16 10c0-.773.29-1.48.77-2.02" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
