"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { IntroVideo } from "@/components/intro-video"
import { DashboardWrapper } from "@/components/dashboard-wrapper"
import { CLUB_METADATA } from "@/lib/content"

import { DebugOverlay } from "@/components/debug-overlay"

export default function HomePage() {
  const [introFinished, setIntroFinished] = useState<boolean>(false)

  useEffect(() => {
    // Lock html and body overflow while "/" is mounted so there is zero page scroll
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    // Bind dynamic --app-h from visualViewport to prevent dynamic Chrome toolbar resize issues
    const setAppH = () => {
      const h = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty("--app-h", `${h}px`)
    }
    setAppH()
    window.visualViewport?.addEventListener("resize", setAppH)
    window.addEventListener("resize", setAppH)
    window.addEventListener("orientationchange", setAppH)

    try {
      if (sessionStorage.getItem("invictors_intro_seen") === "true") {
        setIntroFinished(true)
      }
    } catch {
      // ignore
    }

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
      window.visualViewport?.removeEventListener("resize", setAppH)
      window.removeEventListener("resize", setAppH)
      window.removeEventListener("orientationchange", setAppH)
    }
  }, [])

  return (
    <div
      id="main-content"
      className="relative w-full flex flex-col overflow-hidden select-none bg-[#050505]"
      style={{ height: "var(--app-h, 100dvh)" }}
    >
      {/* Dev-only alignment & concentricity debug overlay (?debug=1) */}
      <DebugOverlay />

      {/* Cinematic Intro Video Overlay */}
      {!introFinished && (
        <IntroVideo onComplete={() => setIntroFinished(true)} />
      )}

      {/* Row 1: Slim Header (64px mobile, 72px laptop) - fades in when intro ends */}
      <div className={`transition-opacity duration-700 ease-out ${introFinished ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Header />
      </div>

      {/* Row 2: Dashboard Stage - mounted underneath for zero jank, fades in over 600ms */}
      <main
        className={`flex-1 min-h-0 relative w-full flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
          introFinished ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <DashboardWrapper isIntroPlaying={!introFinished} />

        {/* Row 3: One-line footer overlaid on laptop ONLY (hidden on mobile to clear gesture bar) */}
        <div className="hidden lg:flex absolute bottom-1 inset-x-0 z-20 pointer-events-none items-center justify-center px-4">
          <p className="text-[10px] sm:text-xs text-silver-300/50 font-body tracking-wider text-center drop-shadow">
            {CLUB_METADATA.footerText}
          </p>
        </div>
      </main>
    </div>
  )
}

