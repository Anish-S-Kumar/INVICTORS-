"use client"

import React, { useEffect, useState, useRef } from "react"

/**
 * CONFIGURATION & LINKS
 * You can edit URLs, timings, and delays here.
 */
interface SocialConfig {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  brandGradient: string
  glowColor: string
  trailGradient: string
  duration: number // Drift loop duration in seconds (18s - 25s)
  delay: number // Stagger start delay in seconds
}

export function FloatingSocials() {
  const [isPaused, setIsPaused] = useState(false)
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPressRef = useRef(false)

  // Global press-and-hold pause listener
  useEffect(() => {
    const handleStart = () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      isLongPressRef.current = false

      // Pause if held longer than 140ms
      pressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true
        setIsPaused(true)
      }, 140)
    }

    const handleEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
      setIsPaused(false)
      setTimeout(() => {
        isLongPressRef.current = false
      }, 60)
    }

    window.addEventListener("mousedown", handleStart)
    window.addEventListener("mouseup", handleEnd)
    window.addEventListener("touchstart", handleStart, { passive: true })
    window.addEventListener("touchend", handleEnd)
    window.addEventListener("touchcancel", handleEnd)

    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      window.removeEventListener("mousedown", handleStart)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchstart", handleStart)
      window.removeEventListener("touchend", handleEnd)
      window.removeEventListener("touchcancel", handleEnd)
    }
  }, [])

  const socials: SocialConfig[] = [
    {
      id: "instagram",
      name: "Instagram",
      href: "https://www.instagram.com/theinvictors.vvce?vrfl=bTlkaHVkY3MzaTdz",
      brandGradient:
        "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
      glowColor: "rgba(238, 42, 123, 0.65)",
      trailGradient:
        "radial-gradient(circle, rgba(238,42,123,0.45) 0%, rgba(98,40,215,0.15) 50%, transparent 75%)",
      duration: 20, // 20s pass
      delay: 0, // starts immediately
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="social-svg"
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      href: "https://linkedin.com/in/invictors-club-423576445",
      brandGradient:
        "linear-gradient(135deg, #0077b5 0%, #00a0dc 60%, #004182 100%)",
      glowColor: "rgba(0, 160, 220, 0.7)",
      trailGradient:
        "radial-gradient(circle, rgba(0,160,220,0.5) 0%, rgba(0,65,130,0.18) 55%, transparent 75%)",
      duration: 24, // 24s pass
      delay: 7, // starts 7s after
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="social-svg"
          aria-hidden="true"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      id: "gmail",
      name: "Gmail",
      href: "mailto:invictorsofficial@gmail.com",
      brandGradient:
        "linear-gradient(135deg, #ea4335 0%, #fbbc05 45%, #4285f4 100%)",
      glowColor: "rgba(234, 67, 53, 0.65)",
      trailGradient:
        "radial-gradient(circle, rgba(234,67,53,0.5) 0%, rgba(251,188,5,0.18) 50%, transparent 75%)",
      duration: 22, // 22s pass
      delay: 14, // starts 14s after
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="social-svg"
          aria-hidden="true"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
  ]

  return (
    <div className="smoke-socials-wrapper" aria-label="Social media channels">
      <style jsx>{`
        /* =========================================================================
           CONTAINER SIZING:
           Vertical room for 15-25px wave + glows without vertical clipping.
           Horizontal overflow is hidden so icons drift across screen edges.
           ========================================================================= */
        .smoke-socials-wrapper {
          position: relative;
          width: 100%;
          height: 96px; /* Desktop height */
          overflow-x: hidden;
          overflow-y: visible;
          pointer-events: none;
          user-select: none;
          display: flex;
          align-items: center;
          margin: 4px 0;
        }

        @media (max-width: 768px) {
          .smoke-socials-wrapper {
            height: 118px; /* Extra height on mobile for 80-90px icons + waves */
            margin: 6px 0;
          }
        }

        /* =========================================================================
           SMOKY DRIFT KEYFRAMES:
           - Enters left: blur(12px), opacity: 0
           - Mid screen: blur(0px), opacity: 1, sharp, full glow
           - Waves: 15px - 24px vertical drift with subtle 2deg - 4deg rotation
           - Exits right: blur(14px), opacity: 0, dissolving smoke
           ========================================================================= */
        @keyframes smokeDrift {
          0% {
            transform: translate3d(-120px, 0px, 0) rotate(-3deg) scale(0.85);
            opacity: 0;
            filter: blur(12px);
          }
          12% {
            opacity: 0.95;
            filter: blur(2px);
          }
          25% {
            transform: translate3d(calc(25vw - 40px), -18px, 0) rotate(3deg) scale(1.02);
            filter: blur(0px);
          }
          50% {
            transform: translate3d(calc(50vw - 40px), 16px, 0) rotate(-2deg) scale(0.98);
            opacity: 1;
            filter: blur(0px);
          }
          75% {
            transform: translate3d(calc(75vw - 40px), -14px, 0) rotate(4deg) scale(1.01);
            opacity: 0.95;
            filter: blur(1px);
          }
          88% {
            opacity: 0.65;
            filter: blur(6px);
          }
          100% {
            transform: translate3d(calc(100vw + 100px), 6px, 0) rotate(-3deg) scale(0.88);
            opacity: 0;
            filter: blur(14px);
          }
        }

        /* Pulsing brand aura glow */
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        .smoke-drift-item {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          animation-name: smokeDrift;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
          will-change: transform, opacity, filter;
        }

        /* =========================================================================
           ICON STYLES & SIZING:
           Desktop: ~64px x 64px
           Mobile (<768px): 84px x 84px
           Min touch target: 48px+ guaranteed
           ========================================================================= */
        .smoke-link-btn {
          position: relative;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.25s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;

          /* Desktop dimensions: 64px */
          width: 64px;
          height: 64px;
        }

        .smoke-link-btn :global(.social-svg) {
          width: 30px;
          height: 30px;
          color: #ffffff;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
        }

        /* Mobile dimensions: 84px (>80px mobile target) */
        @media (max-width: 768px) {
          .smoke-link-btn {
            width: 84px;
            height: 84px;
            border-radius: 28px;
            border-width: 2px;
          }

          .smoke-link-btn :global(.social-svg) {
            width: 40px;
            height: 40px;
          }
        }

        /* Hover & Tap scale */
        .smoke-link-btn:hover {
          transform: scale(1.12);
          border-color: rgba(255, 255, 255, 0.85);
        }

        .smoke-link-btn:active {
          transform: scale(0.94);
        }

        /* =========================================================================
           SMOKE TRAIL PSEUDO-ELEMENT (::before):
           Faint blurred circular/radial smoke tail trailing behind motion
           ========================================================================= */
        .smoke-link-btn::before {
          content: "";
          position: absolute;
          inset: -14px -32px -14px -48px;
          border-radius: 50%;
          background: var(--trail-gradient);
          filter: blur(16px);
          opacity: 0.7;
          pointer-events: none;
          z-index: -1;
          animation: glowPulse 3s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .smoke-link-btn::before {
            inset: -18px -42px -18px -60px;
            filter: blur(22px);
          }
        }

        /* =========================================================================
           PREFERS-REDUCED-MOTION:
           Slows or halts animation for accessibility
           ========================================================================= */
        @media (prefers-reduced-motion: reduce) {
          .smoke-drift-item {
            animation: none !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
          }
          .smoke-socials-wrapper {
            justify-content: center;
            gap: 20px;
            height: auto;
            overflow: visible;
          }
        }
      `}</style>

      {socials.map((item) => (
        <div
          key={item.id}
          className="smoke-drift-item"
          style={{
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          <a
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={item.name}
            title={item.name}
            className="smoke-link-btn"
            style={
              {
                background: item.brandGradient,
                boxShadow: `0 0 26px ${item.glowColor}, inset 0 1px 2px rgba(255,255,255,0.4)`,
                "--trail-gradient": item.trailGradient,
              } as React.CSSProperties
            }
            onClick={(e) => {
              // Ignore navigation if user is executing a press-and-hold pause
              if (isLongPressRef.current) {
                e.preventDefault()
              }
            }}
          >
            {item.icon}
          </a>
        </div>
      ))}
    </div>
  )
}
