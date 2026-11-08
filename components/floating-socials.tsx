"use client"

import React, { useEffect, useState, useRef } from "react"

/**
 * CONFIGURATION & LINKS
 * Translucent glassmorphism with golden rim and glowing ambient aura.
 * Matches the background without any solid black blocking.
 * Moves smoothly across the screen as a synchronized trio with wide spacing.
 */
interface SocialConfig {
  id: string
  name: string
  label: string
  href: string
  icon: React.ReactNode
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
      glowColor: "rgba(230, 190, 90, 0.65)",
      trailGradient:
        "radial-gradient(circle, rgba(230, 190, 90, 0.35) 0%, rgba(180, 130, 40, 0.12) 50%, transparent 75%)",
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
      glowColor: "rgba(235, 195, 95, 0.65)",
      trailGradient:
        "radial-gradient(circle, rgba(235, 195, 95, 0.35) 0%, rgba(185, 135, 42, 0.12) 50%, transparent 75%)",
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
      glowColor: "rgba(240, 205, 110, 0.65)",
      trailGradient:
        "radial-gradient(circle, rgba(240, 205, 110, 0.35) 0%, rgba(190, 140, 45, 0.12) 50%, transparent 75%)",
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
           Wide drifting lane spanning the full width with pure transparent background.
           No plane black box to cover the background.
           ========================================================================= */
        .smoke-socials-wrapper {
          position: relative;
          width: 100%;
          height: 38px;
          overflow-x: hidden;
          overflow-y: visible;
          background: transparent !important;
          pointer-events: auto;
          user-select: none;
          display: flex;
          align-items: center;
        }

        /* Desktop hover-to-pause */
        @media (hover: hover) and (pointer: fine) {
          .smoke-socials-wrapper:hover .socials-convoy-track {
            animation-play-state: paused !important;
          }
        }

        @media (max-width: 768px) {
          .smoke-socials-wrapper {
            height: 34px;
          }
        }

        /* =========================================================================
           SYNCHRONIZED MOVEMENT (CONVOY DRIFT):
           The trio (Instagram, Gmail, LinkedIn) moves together smoothly across
           the screen in a continuous loop with soft entrance and exit fades.
           ========================================================================= */
        @keyframes convoyDrift {
          0% {
            transform: translate3d(-100%, 0, 0);
            opacity: 0;
            filter: blur(6px);
          }
          8% {
            opacity: 0.95;
            filter: blur(1px);
          }
          18% {
            filter: blur(0px);
          }
          50% {
            transform: translate3d(calc(50vw - 50%), 0, 0);
            opacity: 1;
            filter: blur(0px);
          }
          82% {
            filter: blur(0px);
          }
          92% {
            opacity: 0.85;
            filter: blur(2px);
          }
          100% {
            transform: translate3d(calc(100vw + 60px), 0, 0);
            opacity: 0;
            filter: blur(8px);
          }
        }

        .socials-convoy-track {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          /* Extra wide spacing between the 3 items */
          gap: 48px;
          white-space: nowrap;
          animation: convoyDrift 24s linear infinite;
          will-change: transform, opacity, filter;
        }

        @media (max-width: 768px) {
          .socials-convoy-track {
            gap: 28px;
            animation-duration: 22s;
          }
        }

        /* Breathing radiance for gold ambient aura */
        @keyframes goldAuraGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        /* =========================================================================
           TRANSLUCENT GLASS SOCIAL PILL:
           Blends seamlessly with the dark background — NO plane black box.
           ========================================================================= */
        .smoke-social-pill {
          position: relative;
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 4px 14px 4px 6px;
          border-radius: 9999px;
          /* Translucent glass border & background to fit the dark canvas */
          border: 1px solid rgba(230, 190, 80, 0.45);
          background: rgba(18, 14, 8, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.25s ease,
                      background 0.25s ease,
                      box-shadow 0.25s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Icon round translucent container */
        .social-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(230, 190, 80, 0.12);
          border: 1px solid rgba(240, 205, 110, 0.5);
          shrink: 0;
        }

        /* Luminous gold SVG */
        .smoke-social-pill :global(.social-svg) {
          width: 14px;
          height: 14px;
          color: #fce494;
          filter: drop-shadow(0 0 5px rgba(245, 205, 110, 0.85));
          transition: color 0.2s ease, filter 0.2s ease;
        }

        /* Label text styled with gold glow */
        .social-label {
          font-family: var(--font-rajdhani), sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f5eed3;
          white-space: nowrap;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);
          transition: color 0.2s ease;
        }

        @media (max-width: 768px) {
          .smoke-social-pill {
            padding: 3px 10px 3px 5px;
            gap: 6px;
          }
          .social-icon-box {
            width: 20px;
            height: 20px;
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

        /* Hover & Tap: Intensify gold radiance and glow */
        .smoke-social-pill:hover {
          transform: scale(1.08) translateY(-2px);
          border-color: #ffd868;
          background: rgba(45, 32, 14, 0.55);
          box-shadow: 0 0 20px rgba(250, 210, 110, 0.85),
                      inset 0 0 8px rgba(245, 205, 100, 0.3) !important;
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

        /* Ambient glowing halo behind each pill */
        .smoke-social-pill::before {
          content: "";
          position: absolute;
          inset: -4px -8px -4px -8px;
          border-radius: 9999px;
          background: var(--trail-gradient);
          filter: blur(8px);
          opacity: 0.65;
          pointer-events: none;
          z-index: -1;
          animation: goldAuraGlow 3s ease-in-out infinite;
        }

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

      {/* Convoy Track: The trio moves together smoothly with wide spacing */}
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
                boxShadow: `0 0 12px ${item.glowColor}, inset 0 1px 2px rgba(250, 220, 140, 0.25)`,
                "--trail-gradient": item.trailGradient,
              } as React.CSSProperties
            }
            onClick={(e) => {
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
