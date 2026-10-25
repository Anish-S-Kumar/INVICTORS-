"use client"

import React, { useEffect, useState, useRef } from "react"

interface SocialItem {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  bgClass: string
  glowClass: string
  duration: number // seconds
  delay: number // seconds
}

export function FloatingSocials() {
  const [isPaused, setIsPaused] = useState(false)
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPressRef = useRef(false)

  useEffect(() => {
    // When pressing and holding anywhere on the screen:
    // Mouse: mousedown / mouseup
    // Touch: touchstart / touchend
    // Only pause if held longer than 150ms so simple taps still work cleanly
    const handleStart = (e: MouseEvent | TouchEvent) => {
      // Clear any existing timer
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      isLongPressRef.current = false

      pressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true
        setIsPaused(true)
      }, 150)
    }

    const handleEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
      setIsPaused(false)
      // reset after slight tick
      setTimeout(() => {
        isLongPressRef.current = false
      }, 50)
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

  const socials: SocialItem[] = [
    {
      id: "instagram",
      name: "Instagram",
      href: "https://www.instagram.com/theinvictors.vvce?vrfl=bTlkaHVkY3MzaTdz",
      bgClass:
        "bg-gradient-to-tr from-[#f9ce34]/80 via-[#ee2a7b]/80 to-[#6228d7]/80 border-pink-400/50 hover:border-pink-300",
      glowClass: "shadow-[0_0_18px_rgba(238,42,123,0.45)]",
      duration: 18,
      delay: 0,
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
      bgClass: "bg-[#0077b5]/85 border-sky-400/60 hover:border-sky-300",
      glowClass: "shadow-[0_0_18px_rgba(0,119,181,0.5)]",
      duration: 22,
      delay: 6,
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current"
          viewBox="0 0 24 24"
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
      bgClass:
        "bg-gradient-to-br from-red-600/85 via-red-500/85 to-amber-600/85 border-red-400/50 hover:border-red-300",
      glowClass: "shadow-[0_0_18px_rgba(234,67,53,0.5)]",
      duration: 20,
      delay: 12,
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
      className="relative w-full h-8 sm:h-9 overflow-hidden pointer-events-none select-none z-30 flex items-center"
      aria-label="Social media links"
    >
      <style jsx>{`
        @keyframes driftSmoke {
          0% {
            transform: translate3d(-100px, 0px, 0) scale(0.9);
            opacity: 0;
            filter: blur(4px);
          }
          8% {
            opacity: 0.95;
            filter: blur(0px);
          }
          25% {
            transform: translate3d(calc(25vw - 20px), -6px, 0) scale(1.02);
          }
          50% {
            transform: translate3d(calc(50vw - 20px), 6px, 0) scale(0.98);
          }
          75% {
            transform: translate3d(calc(75vw - 20px), -4px, 0) scale(1.01);
            opacity: 0.95;
            filter: blur(0px);
          }
          92% {
            opacity: 0.7;
            filter: blur(2px);
          }
          100% {
            transform: translate3d(calc(100vw + 60px), 2px, 0) scale(0.9);
            opacity: 0;
            filter: blur(5px);
          }
        }

        .floating-icon {
          animation-name: driftSmoke;
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
          animation-iteration-count: infinite;
          will-change: transform, opacity, filter;
        }
      `}</style>

      {socials.map((item) => (
        <div
          key={item.id}
          className="absolute left-0 top-1/2 -translate-y-1/2 floating-icon"
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
            className={`pointer-events-auto flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border backdrop-blur-md transition-transform duration-200 hover:scale-125 active:scale-95 cursor-pointer ${item.bgClass} ${item.glowClass}`}
            onClick={(e) => {
              // If user was doing a long-press hold to freeze, avoid navigation
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
