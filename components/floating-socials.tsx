"use client"

import React, { useEffect, useState, useRef } from "react"

/**
 * CONFIGURATION & LINKS
 * Translucent glassmorphism with golden rim and glowing ambient aura.
 * Matches the background without any solid black blocking.
 * Spread across the screen: Left, Center, and Right.
 */
interface SocialConfig {
  id: string
  name: string
  label: string
  href: string
  icon: React.ReactNode
  glowColor: string
  trailGradient: string
  positionClass: string
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
      glowColor: "rgba(230, 190, 90, 0.6)",
      trailGradient:
        "radial-gradient(circle, rgba(230, 190, 90, 0.3) 0%, rgba(180, 130, 40, 0.1) 50%, transparent 75%)",
      positionClass: "justify-self-start",
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
      glowColor: "rgba(235, 195, 95, 0.6)",
      trailGradient:
        "radial-gradient(circle, rgba(235, 195, 95, 0.3) 0%, rgba(185, 135, 42, 0.1) 50%, transparent 75%)",
      positionClass: "justify-self-center",
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
      glowColor: "rgba(240, 205, 110, 0.6)",
      trailGradient:
        "radial-gradient(circle, rgba(240, 205, 110, 0.3) 0%, rgba(190, 140, 45, 0.1) 50%, transparent 75%)",
      positionClass: "justify-self-end",
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
    >
      <style jsx>{`
        /* =========================================================================
           CONTAINER SIZING & SPACING:
           Spans full width with left, center, and right distribution.
           Pure transparent background - no solid black box.
           ========================================================================= */
        .smoke-socials-wrapper {
          position: relative;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 2px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent !important;
          pointer-events: auto;
          user-select: none;
        }

        @media (max-width: 768px) {
          .smoke-socials-wrapper {
            padding: 2px 10px;
          }
        }

        /* Synchronized gentle floating animation: ALL logos move together simultaneously */
        @keyframes floatTogether {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* Breathing radiance for golden aura */
        @keyframes goldAuraGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        /* =========================================================================
           TRANSPARENT GOLD SOCIAL PILL:
           Directly on the home page background with NO blank black ground.
           Circuit lines, gold dust and neural network show right through!
           ========================================================================= */
        .smoke-social-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 6px;
          border-radius: 9999px;
          /* Transparent with luminous golden border and zero black fill or blur */
          border: 1px solid rgba(230, 190, 80, 0.55);
          background: rgba(212, 162, 76, 0.05);
          box-shadow: 0 0 14px rgba(212, 162, 76, 0.25), inset 0 0 6px rgba(255, 220, 120, 0.12);
          cursor: pointer;
          text-decoration: none;
          animation: floatTogether 3.5s ease-in-out infinite;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.25s ease,
                      background 0.25s ease,
                      box-shadow 0.25s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Synchronized: All items move together at the exact same time (0s delay) */
        .smoke-social-pill.item-0,
        .smoke-social-pill.item-1,
        .smoke-social-pill.item-2 {
          animation-delay: 0s;
        }

        /* Icon round translucent container */
        .social-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(230, 190, 80, 0.18);
          border: 1px solid rgba(240, 205, 110, 0.65);
          box-shadow: 0 0 8px rgba(212, 162, 76, 0.35);
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
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
          transition: color 0.2s ease;
        }

        @media (max-width: 768px) {
          .smoke-social-pill {
            padding: 3px 8px 3px 4px;
            gap: 5px;
          }
          .social-icon-box {
            width: 20px;
            height: 20px;
          }
          .smoke-social-pill :global(.social-svg) {
            width: 11px;
            height: 11px;
          }
          .social-label {
            font-size: 9.5px;
            letter-spacing: 0.04em;
          }
        }

        /* Hover & Tap: Intensify gold radiance and glow without changing blackness */
        .smoke-social-pill:hover {
          transform: scale(1.08) translateY(-2px);
          border-color: #ffd868;
          background: rgba(212, 162, 76, 0.15);
          box-shadow: 0 0 20px rgba(250, 210, 110, 0.8),
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

        /* Subtle glowing aura behind each pill to fit into the ambient background */
        .smoke-social-pill::before {
          content: "";
          position: absolute;
          inset: -4px -8px -4px -8px;
          border-radius: 9999px;
          background: var(--trail-gradient);
          filter: blur(8px);
          opacity: 0.5;
          pointer-events: none;
          z-index: -1;
          animation: goldAuraGlow 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .smoke-social-pill {
            animation: none !important;
          }
        }
      `}</style>

      {socials.map((item, index) => (
        <a
          key={item.id}
          href={item.href}
          target={item.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          aria-label={`${item.label} on ${item.name}`}
          title={`${item.label} (${item.name})`}
          className={`smoke-social-pill item-${index}`}
          style={
            {
              boxShadow: `0 0 12px ${item.glowColor}, inset 0 1px 2px rgba(250, 220, 140, 0.25)`,
              "--trail-gradient": item.trailGradient,
              animationPlayState: isPaused ? "paused" : "running",
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
  )
}
