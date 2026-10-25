"use client"

import React, { useEffect, useState, useRef } from "react"

/**
 * CONFIGURATION & LINKS
 * Gold & cyber-amber aesthetic harmonized with the website's dark luxury palette.
 */
interface SocialConfig {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  goldGradient: string
  glowColor: string
  trailGradient: string
  duration: number // Drift duration in seconds
  delay: number // Stagger start delay in seconds
}

export function FloatingSocials() {
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
      // Luxurious dark amber-gold radial fill with gleaming golden border & accent
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(42, 30, 12, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(230, 190, 90, 0.85)",
      trailGradient:
        "radial-gradient(circle, rgba(230, 190, 90, 0.45) 0%, rgba(180, 130, 40, 0.18) 50%, transparent 75%)",
      duration: 20,
      delay: 0,
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
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(45, 32, 14, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(240, 205, 110, 0.88)",
      trailGradient:
        "radial-gradient(circle, rgba(240, 205, 110, 0.45) 0%, rgba(190, 140, 45, 0.18) 50%, transparent 75%)",
      duration: 24,
      delay: 7,
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
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(45, 32, 14, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(235, 195, 95, 0.85)",
      trailGradient:
        "radial-gradient(circle, rgba(235, 195, 95, 0.45) 0%, rgba(185, 135, 42, 0.18) 50%, transparent 75%)",
      duration: 22,
      delay: 14,
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
    <div
      className="smoke-socials-wrapper"
      aria-label="Social media channels"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        /* =========================================================================
           CONTAINER SIZING:
           Sleek height matching the original layout with no overflow clipping
           ========================================================================= */
        .smoke-socials-wrapper {
          position: relative;
          width: 100%;
          height: 38px;
          overflow-x: hidden;
          overflow-y: visible;
          pointer-events: auto; /* Allow hovering anywhere in the space */
          user-select: none;
          display: flex;
          align-items: center;
          margin: 2px 0;
        }

        /* Desktop hover-to-pause: When cursor is placed anywhere on the strip or icons, freeze motion */
        @media (hover: hover) and (pointer: fine) {
          .smoke-socials-wrapper:hover .smoke-drift-item {
            animation-play-state: paused !important;
          }
        }

        @media (max-width: 768px) {
          .smoke-socials-wrapper {
            height: 36px;
            margin: 2px 0;
          }
        }

        /* =========================================================================
           SMOKY DRIFT KEYFRAMES:
           - Enters left: blur(10px), opacity: 0, subdued glow
           - Towards center: sharp (blur 0px), 100% visible, bright pulsing gold glow
           - Wave: smooth 8px to 10px sinusoidal drift with subtle tilt
           - Exits right: dissolves out with blur(12px) and opacity 0
           ========================================================================= */
        @keyframes smokeDrift {
          0% {
            transform: translate3d(-60px, 0px, 0) rotate(-2deg) scale(0.9);
            opacity: 0;
            filter: blur(10px);
          }
          10% {
            opacity: 0.95;
            filter: blur(1.5px);
          }
          25% {
            transform: translate3d(calc(25vw - 16px), -8px, 0) rotate(2deg) scale(1.02);
            filter: blur(0px);
          }
          50% {
            /* Center of the screen: Peak sharpness & peak gold glow */
            transform: translate3d(calc(50vw - 16px), 8px, 0) rotate(-1.5deg) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          75% {
            transform: translate3d(calc(75vw - 16px), -6px, 0) rotate(2deg) scale(1.01);
            opacity: 0.95;
            filter: blur(0.5px);
          }
          90% {
            opacity: 0.65;
            filter: blur(4px);
          }
          100% {
            transform: translate3d(calc(100vw + 60px), 3px, 0) rotate(-2deg) scale(0.9);
            opacity: 0;
            filter: blur(12px);
          }
        }

        /* Continuous breathing radiance for the gold aura while visible */
        @keyframes goldAuraGlow {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
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
           ICON STYLES & GOLD COLORING:
           - Pill in deep obsidian/amber glass
           - Solid 24k gold border: rgba(230, 190, 80, 0.7)
           - Icon SVG: Pure luminous amber-gold with drop-shadow glow
           - Desktop: 32px x 32px | Mobile: 28px x 28px
           ========================================================================= */
        .smoke-link-btn {
          position: relative;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1px solid rgba(230, 190, 80, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.2s ease,
                      box-shadow 0.2s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;

          width: 32px;
          height: 32px;
        }

        /* Pure golden SVG with bright glow */
        .smoke-link-btn :global(.social-svg) {
          width: 16px;
          height: 16px;
          color: #fce494; /* Radiant 24k warm gold */
          filter: drop-shadow(0 0 6px rgba(245, 205, 110, 0.85))
                  drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
          transition: color 0.2s ease, filter 0.2s ease;
        }

        /* Mobile sizing */
        @media (max-width: 768px) {
          .smoke-link-btn {
            width: 28px;
            height: 28px;
          }

          .smoke-link-btn :global(.social-svg) {
            width: 14px;
            height: 14px;
          }
        }

        /* Hover & Tap: Intensify gold radiance */
        .smoke-link-btn:hover {
          transform: scale(1.22);
          border-color: #ffd868;
          box-shadow: 0 0 20px rgba(250, 210, 110, 0.9),
                      inset 0 0 8px rgba(245, 205, 100, 0.4) !important;
        }

        .smoke-link-btn:hover :global(.social-svg) {
          color: #ffffff;
          filter: drop-shadow(0 0 8px rgba(255, 225, 130, 1));
        }

        .smoke-link-btn:active {
          transform: scale(0.92);
        }

        /* =========================================================================
           GOLDEN SMOKE TRAIL (::before):
           Casts a warm glowing golden cloud behind each icon
           ========================================================================= */
        .smoke-link-btn::before {
          content: "";
          position: absolute;
          inset: -6px -16px -6px -22px;
          border-radius: 50%;
          background: var(--trail-gradient);
          filter: blur(10px);
          opacity: 0.75;
          pointer-events: none;
          z-index: -1;
          animation: goldAuraGlow 2.5s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .smoke-link-btn::before {
            inset: -5px -14px -5px -18px;
            filter: blur(8px);
          }
        }

        /* =========================================================================
           PREFERS-REDUCED-MOTION:
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
            animationPlayState: isPaused || isHovered ? "paused" : "running",
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
                background: item.goldGradient,
                boxShadow: `0 0 16px ${item.glowColor}, inset 0 1px 3px rgba(250, 220, 140, 0.35)`,
                "--trail-gradient": item.trailGradient,
              } as React.CSSProperties
            }
            onClick={(e) => {
              // Avoid accidental navigation on a long press hold
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
