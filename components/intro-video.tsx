"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Volume2, VolumeX, FastForward } from "lucide-react"
import { INTRO_CONFIG } from "@/lib/intro-config"
import { initDialAudio } from "@/lib/dial-sound"
import { IntroAnimation } from "@/components/intro-animation"

interface IntroVideoProps {
  onComplete: () => void
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const [videoSrc, setVideoSrc] = useState<string>("")
  const [isBuffering, setIsBuffering] = useState<boolean>(true)
  const [showSkip, setShowSkip] = useState<boolean>(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [fadeVideoOut, setFadeVideoOut] = useState<boolean>(false)
  const [useFallback, setUseFallback] = useState<boolean>(false)
  const [isExited, setIsExited] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const skipBtnRef = useRef<HTMLButtonElement | null>(null)
  const hasFinishedRef = useRef<boolean>(false)

  // Complete and handoff to dashboard
  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return
    hasFinishedRef.current = true

    try {
      sessionStorage.setItem("invictors_intro_seen", "true")
    } catch {
      // ignore
    }

    // Trigger 500ms crossfade
    setFadeVideoOut(true)

    // Release video after crossfade finishes
    setTimeout(() => {
      if (videoRef.current) {
        try {
          videoRef.current.pause()
          videoRef.current.removeAttribute("src")
          videoRef.current.load()
        } catch {
          // ignore
        }
      }
      setIsExited(true)
      onComplete()
    }, 500)
  }, [onComplete])

  useEffect(() => {
    // Check ?intro=1 force replay
    let forceReplay = false
    try {
      const params = new URLSearchParams(window.location.search)
      forceReplay = params.get("intro") === "1"
    } catch {
      // ignore
    }

    // Check prefers-reduced-motion
    try {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReduced && !forceReplay) {
        handleFinish()
        return
      }
    } catch {
      // ignore
    }

    // Check sessionStorage
    try {
      const seen = sessionStorage.getItem("invictors_intro_seen")
      if (seen === "true" && !forceReplay) {
        setIsExited(true)
        onComplete()
        return
      }
    } catch {
      // ignore
    }

    // Choose video source based on screen width
    const isMobile = window.innerWidth < 1024
    const src = isMobile && INTRO_CONFIG.mobileSrc ? INTRO_CONFIG.mobileSrc : INTRO_CONFIG.desktopSrc
    setVideoSrc(src)

    // Show skip button after 0.8s
    const skipTimer = setTimeout(() => {
      setShowSkip(true)
      skipBtnRef.current?.focus()
    }, 800)

    // 4.0s buffering timeout fallback: switch to coded animation if video hasn't started
    const bufferTimeout = setTimeout(() => {
      if (videoRef.current && (videoRef.current.paused || videoRef.current.readyState < 3)) {
        console.warn("[IntroVideo] Video buffering timed out (>4s). Falling back to coded intro.")
        setUseFallback(true)
      }
    }, INTRO_CONFIG.bufferTimeoutMs)

    // 15.0s hard safety cap
    const hardTimeout = setTimeout(() => {
      handleFinish()
    }, INTRO_CONFIG.maxDurationMs)

    // Keyboard handlers (Escape, Enter, Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleFinish()
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearTimeout(skipTimer)
      clearTimeout(bufferTimeout)
      clearTimeout(hardTimeout)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleFinish, onComplete])

  // Try to start muted autoplay once src is set
  useEffect(() => {
    if (!videoSrc || !videoRef.current || useFallback) return

    const video = videoRef.current
    video.muted = true

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsBuffering(false)
          setAutoplayBlocked(false)
        })
        .catch((err) => {
          console.warn("[IntroVideo] Autoplay blocked or deferred:", err)
          setIsBuffering(false)
          setAutoplayBlocked(true)
        })
    }
  }, [videoSrc, useFallback])

  // Monitor playback progress to initiate smooth crossfade 500ms before end
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || hasFinishedRef.current) return

    if (video.duration && video.duration > 0) {
      const remainingTime = video.duration - video.currentTime
      if (remainingTime <= 0.5) {
        handleFinish()
      }
    }
  }

  // Handle unmute / manual play
  const handleUserPlayOrUnmute = () => {
    initDialAudio() // Unlock dial audio context on this user gesture
    if (videoRef.current) {
      if (autoplayBlocked) {
        videoRef.current.muted = false
        videoRef.current.play().catch(() => {
          videoRef.current!.muted = true
          videoRef.current!.play().catch(() => {})
        })
        setAutoplayBlocked(false)
        setIsMuted(false)
      } else {
        const nextMuted = !isMuted
        videoRef.current.muted = nextMuted
        setIsMuted(nextMuted)
      }
    }
  }

  if (isExited) return null

  // Fallback to coded intro if video failed, timed out, or not found
  if (useFallback) {
    return <IntroAnimation onComplete={onComplete} />
  }

  return (
    <div
      role="dialog"
      aria-label="INVICTORS introduction"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ease-out select-none ${
        fadeVideoOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        height: "100dvh",
        maxHeight: "100vh",
      }}
    >
      {/* Video Element */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            autoPlay
            muted={isMuted}
            preload="auto"
            poster={INTRO_CONFIG.posterSrc}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate"
            onPlaying={() => setIsBuffering(false)}
            onWaiting={() => setIsBuffering(true)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleFinish}
            onError={() => {
              console.warn("[IntroVideo] Video error occurred. Switching to coded fallback.")
              setUseFallback(true)
            }}
            className="w-full h-full"
            style={{
              objectFit: INTRO_CONFIG.fit,
              // Soft radial gradient mask to feather video bounds into pure black
              maskImage: "radial-gradient(circle at center, black 85%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 85%, transparent 100%)",
            }}
          />
        )}

        {/* Buffering Indicator: Thin Gold Ring */}
        {isBuffering && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
            <div className="w-14 h-14 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
            <span className="mt-3 text-[11px] font-mono tracking-widest text-amber-300/80 uppercase">
              Initializing...
            </span>
          </div>
        )}

        {/* Autoplay blocked: TAP TO ENTER Overlay */}
        {autoplayBlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-20">
            <button
              onClick={handleUserPlayOrUnmute}
              className="px-6 py-3 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 text-amber-200 font-display font-bold text-sm tracking-widest hover:border-amber-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,162,76,0.4)] cursor-pointer"
            >
              TAP TO ENTER ➔
            </button>
            <span className="mt-3 text-xs text-silver-300/60 font-mono">
              Audio will play
            </span>
          </div>
        )}

        {/* Sound Toggle (if audio is enabled in config) */}
        {INTRO_CONFIG.hasAudio && !autoplayBlocked && (
          <button
            onClick={handleUserPlayOrUnmute}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-black/60 text-amber-300 hover:text-amber-100 hover:border-amber-400 text-xs font-display tracking-wider transition-all backdrop-blur-md cursor-pointer"
            aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tap for sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            )}
          </button>
        )}

        {/* Skip Button (bottom-right with 44px touch target & safe-area insets) */}
        {showSkip && (
          <button
            ref={skipBtnRef}
            onClick={handleFinish}
            className="absolute bottom-6 right-6 z-20 min-h-[44px] min-w-[44px] px-4 py-2 flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-black/70 text-amber-300 hover:text-white hover:border-amber-300 hover:bg-amber-950/40 text-xs font-display font-medium tracking-widest transition-all backdrop-blur-md cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            style={{
              marginBottom: "env(safe-area-inset-bottom, 0px)",
              marginRight: "env(safe-area-inset-right, 0px)",
            }}
            aria-label="Skip Introduction Video"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
