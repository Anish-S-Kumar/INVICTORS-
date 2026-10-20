"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { IntroAnimation } from "@/components/intro-animation"
import { DashboardWrapper } from "@/components/dashboard-wrapper"
import { CLUB_METADATA } from "@/lib/content"

export default function HomePage() {
  const [introFinished, setIntroFinished] = useState<boolean>(false)

  useEffect(() => {
    // Lock html and body overflow while "/" is mounted so there is zero page scroll
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

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
    }
  }, [])

  return (
    <div id="main-content" className="relative h-[100dvh] w-full flex flex-col overflow-hidden select-none bg-[#050505]">
      {/* Cinematic Intro Animation Overlay */}
      {!introFinished && (
        <IntroAnimation onComplete={() => setIntroFinished(true)} />
      )}

      {/* Row 1: Slim Header */}
      <Header />

      {/* Row 2: Dashboard Stage (flex-1 min-h-0 fits remaining viewport height) */}
      <main className="flex-1 min-h-0 relative w-full flex flex-col items-center justify-center overflow-hidden">
        <DashboardWrapper />

        {/* Row 3: One-line footer overlaid inside the stage so it adds no extra height */}
        <div className="absolute bottom-1 inset-x-0 z-20 pointer-events-none flex items-center justify-center px-4">
          <p className="text-[10px] sm:text-xs text-silver-300/50 font-body tracking-wider text-center drop-shadow">
            {CLUB_METADATA.footerText}
          </p>
        </div>
      </main>
    </div>
  )
}
