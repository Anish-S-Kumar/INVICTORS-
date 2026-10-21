"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { CLUB_METADATA } from "@/lib/content"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<number>(0)
  const [showSkip, setShowSkip] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    try {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReduced) {
        // Quick 600ms fade
        const timer = setTimeout(() => {
          setIsDone(true)
          onComplete()
        }, 600)
        return () => clearTimeout(timer)
      }
    } catch {
      // fallback
    }

    // 2. Check sessionStorage
    try {
      const seen = sessionStorage.getItem("invictors_intro_seen")
      if (seen === "true") {
        setIsDone(true)
        onComplete()
        return
      }
    } catch {
      // ignore storage restriction
    }

    // Preload logo
    const img = new window.Image()
    img.src = "/assets/invictors-logo.png"

    // Lock scroll during intro
    document.body.style.overflow = "hidden"

    // Sequence timelines
    // 0.0s - Single gold spark
    setStage(1)

    // Show skip after 1s
    const skipTimer = setTimeout(() => {
      setShowSkip(true)
    }, 1000)

    // 0.3s - 1.4s Rings and crosshair nodes
    const t2 = setTimeout(() => setStage(2), 350)

    // 1.2s - 2.6s Logo materializes + circuit traces + binary flicker
    const t3 = setTimeout(() => setStage(3), 1250)

    // 2.4s - 3.4s Specular shine + Tagline wide-to-normal
    const t4 = setTimeout(() => setStage(4), 2400)

    // 3.4s - 4.6s Logo glides to dashboard, backdrop dissolves
    const t5 = setTimeout(() => setStage(5), 3600)

    // Hard 7.0s safety timeout to guarantee the user is never trapped
    const hardTimeout = setTimeout(() => {
      finishIntro()
    }, 7000)

    // Finish handover at ~4.8s
    const tEnd = setTimeout(() => {
      finishIntro()
    }, 4800)

    return () => {
      clearTimeout(hardTimeout)
      clearTimeout(skipTimer)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(tEnd)
      document.body.style.overflow = ""
    }
  }, [onComplete])

  const finishIntro = () => {
    try {
      sessionStorage.setItem("invictors_intro_seen", "true")
    } catch {
      // ignore
    }
    document.body.style.overflow = ""
    setIsDone(true)
    onComplete()
  }

  if (isDone) return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
      >
        {/* Background radial depth glow */}
        <motion.div
          animate={{
            scale: stage >= 3 ? [1, 1.2, 1] : 0.8,
            opacity: stage >= 2 ? 0.35 : 0.1,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,162,76,0.3)_0%,rgba(5,5,5,0)_70%)] pointer-events-none"
        />

        {/* Central Stage Container */}
        <div className="relative flex flex-col items-center justify-center">
          {/* 0.0s Stage 1: Central gold spark */}
          {stage >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage === 1 ? [0, 1.8, 1] : 1,
                opacity: [0, 1, 0.8],
              }}
              transition={{ duration: 0.4 }}
              className="absolute w-2 h-2 rounded-full bg-[#fff3c4] shadow-[0_0_20px_6px_#f1d58a]"
            />
          )}

          {/* 0.3s - Stage 2: Outer SVG Rings & 12, 3, 6, 9 nodes */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* SVG drawing circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
              {/* Outer gold ring stroke-dashoffset */}
              <motion.circle
                cx="160"
                cy="160"
                r="145"
                fill="none"
                stroke="#d4a24c"
                strokeWidth="1.5"
                strokeDasharray="911"
                initial={{ strokeDashoffset: 911 }}
                animate={{ strokeDashoffset: stage >= 2 ? 0 : 911 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {/* Inner chrome/silver dashed ring */}
              <motion.circle
                cx="160"
                cy="160"
                r="135"
                fill="none"
                stroke="#cfcfcf"
                strokeWidth="1"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* 4 Crosshair nodes at 12, 3, 6, 9 o'clock */}
              {stage >= 2 && (
                <>
                  {/* 12 o'clock */}
                  <motion.circle
                    cx="160"
                    cy="15"
                    r="4"
                    fill="#fff3c4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.6, 1] }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                  {/* 3 o'clock */}
                  <motion.circle
                    cx="305"
                    cy="160"
                    r="4"
                    fill="#fff3c4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.6, 1] }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  />
                  {/* 6 o'clock */}
                  <motion.circle
                    cx="160"
                    cy="305"
                    r="4"
                    fill="#fff3c4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.6, 1] }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  />
                  {/* 9 o'clock */}
                  <motion.circle
                    cx="15"
                    cy="160"
                    r="4"
                    fill="#fff3c4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.6, 1] }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  />
                </>
              )}
            </svg>

            {/* Rotating Conic Chrome / Gold Sweep */}
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: [0, 0.7, 0.4], rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-amber-400/30 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,162,76,0.3)_180deg,transparent_360deg)] pointer-events-none"
              />
            )}

            {/* 1.2s - Stage 3: Logo materializes with blur and scale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.65, filter: "blur(14px)" }}
              animate={
                stage >= 3
                  ? {
                      opacity: 1,
                      scale: stage >= 5 ? 0.95 : 1,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-[0_0_35px_rgba(212,162,76,0.4)]"
            >
              <Image
                src="/assets/invictors-logo.png"
                alt="INVICTORS Emblem"
                fill
                priority
                sizes="(max-width: 640px) 192px, 240px"
                className="object-cover"
              />

              {/* 2.4s Stage 4: Diagonal specular light sweep */}
              {stage >= 4 && (
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 0.85, 0] }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 pointer-events-none"
                />
              )}
            </motion.div>
          </div>

          {/* Binary "010101" flicker */}
          {stage >= 3 && stage < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.2, 0.9, 0.4] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="absolute -top-7 font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-400/80"
            >
              010101 // SECURE DECRYPT
            </motion.div>
          )}

          {/* 2.4s Stage 4: Tagline "DECODE. INNOVATE. OVERCOME." */}
          <div className="h-10 mt-6 flex items-center justify-center overflow-hidden">
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.45em", y: 10 }}
                animate={{ opacity: 1, letterSpacing: "0.25em", y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="font-display text-sm sm:text-base font-bold text-gradient-gold tracking-widest text-center"
              >
                {CLUB_METADATA.motto}
              </motion.div>
            )}
          </div>
        </div>

        {/* Skip button after 1s */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              key="skip-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={finishIntro}
              className="absolute bottom-8 right-6 sm:right-10 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-amber-950/40 text-xs font-display tracking-widest transition-all backdrop-blur-md cursor-pointer"
              aria-label="Skip Introduction Animation"
            >
              SKIP INTRO ➔
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
