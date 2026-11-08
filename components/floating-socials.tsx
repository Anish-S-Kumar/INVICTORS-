"use client"

import React, { useEffect, useState, useRef } from "react"

/**
 * CONFIGURATION & LINKS
 * Gold & cyber-amber aesthetic harmonized with the website's dark luxury palette.
 * Grouped drifting strip with direct label buttons for Instagram, Gmail & LinkedIn.
 */
interface SocialConfig {
  id: string
  name: string
  label: string
  href: string
  icon: React.ReactNode
  goldGradient: string
  glowColor: string
  trailGradient: string
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
      label: "Follow Us",
      href: "https://www.instagram.com/theinvictors.vvce?vrfl=bTlkaHVkY3MzaTdz",
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(42, 30, 12, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(230, 190, 90, 0.85)",
      trailGradient:
        "radial-gradient(circle, rgba(230, 190, 90, 0.45) 0%, rgba(180, 130, 40, 0.18) 50%, transparent 75%)",
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
      id: "gmail",
      name: "Gmail",
      label: "Contact Us",
      href: "mailto:invictorsofficial@gmail.com",
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(45, 32, 14, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(235, 195, 95, 0.85)",
      trailGradient:
        "radial-gradient(circle, rgba(235, 195, 95, 0.45) 0%, rgba(185, 135, 42, 0.18) 50%, transparent 75%)",
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
    {
      id: "linkedin",
      name: "LinkedIn",
      label: "LinkedIn Profile",
      href: "https://linkedin.com/in/invictors-club-423576445",
      goldGradient:
        "linear-gradient(135deg, rgba(24, 18, 8, 0.92) 0%, rgba(45, 32, 14, 0.95) 50%, rgba(15, 12, 6, 0.96) 100%)",
      glowColor: "rgba(240, 205, 110, 0.88)",
      trailGradient:
        "radial-gradient(circle, rgba(240, 205, 110, 0.45) 0%, rgba(190, 140, 45, 0.18) 50%, transparent 75%)",
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
           Wide drifting lane with smooth continuous loop
           ========================================================================= */
        .smoke-socials-wrapper {
          position: relative;
          width: 100%;
          height: 38px;
          overflow-x: hidden;
          overflow-y: visible;
          pointer-events: auto;
          user-select: none;
          display: flex;
          align-items: center;
          margin: 2px 0;
        }

        /* Desktop hover-to-pause: When cursor is placed anywhere on the strip, freeze motion */
        @media (hover: hover) and (pointer: fine) {
          .smoke-socials-wrapper:hover .socials-convoy-track {
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
           GROUP MOVEMENT (CONVOY DRIFT):
           All items move together in a unified convoy from left to right,
           fading in softly from the left edge and fading out at the right.
           ========================================================================= */
        @keyframes convoyDrift {
          0% {
            transform: translate3d(-100%, 0, 0);
            opacity: 0;
            filter: blur(8px);
          }
          10% {
            opacity: 0.95;
            filter: blur(1px);
          }
          25% {
            filter: blur(0px);
          }
          50% {
            transform: translate3d(calc(50vw - 50%), 0, 0);
            opacity: 1;
            filter: blur(0px);
          }
          75% {
            filter: blur(0px);
          }
          90% {
            opacity: 0.8;
            filter: blur(2px);
          }
          100% {
            transform: translate3d(calc(100vw + 60px), 0, 0);
            opacity: 0;
            filter: blur(10px);
          }
        }

        .socials-convoy-track {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          /* Wide space between the items */
          gap: 24px;
          white-space: nowrap;
          animation: convoyDrift 22s linear infinite;
          will-change: transform, opacity, filter;
        }

        @media (max-width: 768px) {
          .socials-convoy-track {
            gap: 16px;
            animation-duration: 20s;
          }
        }

        /* Breathing radiance for gold aura */
        @keyframes goldAuraGlow {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.08);
          }
        }

        /* =========================================================================
           SOCIAL PILL / CARD WITH TEXT:
           Direct clickable pill with logo and label text
           ========================================================================= */
        .smoke-social-pill {
          position: relative;
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 6px;
          border-radius: 9999px;
          border: 1px solid rgba(230, 190, 80, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.2s ease,
                      box-shadow 0.2s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Icon round badge inside pill */
        .social-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(240, 205, 110, 0.4);
          shrink: 0;
        }

        /* Pure golden SVG with bright glow */
        .smoke-social-pill :global(.social-svg) {
          width: 14px;
          height: 14px;
          color: #fce494;
          filter: drop-shadow(0 0 5px rgba(245, 205, 110, 0.85));
          transition: color 0.2s ease, filter 0.2s ease;
        }

        /* Label text beside the logo */
        .social-label {
          font-family: var(--font-rajdhani), sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f5eed3;
          white-space: nowrap;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          transition: color 0.2s ease;
        }

        @media (max-width: 768px) {
          .smoke-social-pill {
            padding: 3px 10px 3px 5px;
            gap: 6px;
          }
          .social-icon-box {
            width: 22px;
            height: 22px;
          }
          .smoke-social-pill :global(.social-svg) {
            width: 12px;
            height: 12px;
          }
          .social-label {
            font-size: 10px;
            letter-spacing: 0.05em;
          }
        }

        /* Hover & Tap: Intensify gold radiance */
        .smoke-social-pill:hover {
          transform: scale(1.08);
          border-color: #ffd868;
          box-shadow: 0 0 20px rgba(250, 210, 110, 0.9),
                      inset 0 0 8px rgba(245, 205, 100, 0.4) !important;
        }

        .smoke-social-pill:hover .social-label {
          color: #ffffff;
        }

        .smoke-social-pill:hover :global(.social-svg) {
          color: #ffffff;
          filter: drop-shadow(0 0 8px rgba(255, 225, 130, 1));
        }

        .smoke-social-pill:active {
          transform: scale(0.95);
        }

        /* Golden Aura Backdrop */
        .smoke-social-pill::before {
          content: "";
          position: absolute;
          inset: -4px -10px -4px -10px;
          border-radius: 9999px;
          background: var(--trail-gradient);
          filter: blur(8px);
          opacity: 0.7;
          pointer-events: none;
          z-index: -1;
          animation: goldAuraGlow 2.5s ease-in-out infinite;
        }

        /* =========================================================================
           PREFERS-REDUCED-MOTION:
           ========================================================================= */
        @media (prefers-reduced-motion: reduce) {
          .socials-convoy-track {
            animation: none !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            margin: 0 auto;
            justify-content: center;
            opacity: 1 !important;
            filter: none !important;
          }
          .smoke-socials-wrapper {
            justify-content: center;
            height: auto;
            overflow: visible;
          }
        }
      `}</style>

      {/* Convoy Track: All 3 items move together simultaneously with wide spacing */}
      <div
        className="socials-convoy-track"
        style={{
          animationPlayState: isPaused || isHovered ? "paused" : "running",
        }}
      >
        {socials.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={`${item.label} on ${item.name}`}
            title={`${item.label} (${item.name})`}
            className="smoke-social-pill"
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
            <div className="social-icon-box">{item.icon}</div>
            <span className="social-label">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
