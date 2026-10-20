"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import {
  Puzzle,
  Cpu,
  Leaf,
  Sparkles,
  Building2,
  Target,
  Layers,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface Milestone {
  year?: string
  number?: string
  title: string
  description: string
  iconName?: string
  takeaway?: string
}

export interface TimelineProps {
  title?: string
  periodLabel?: string
  backgroundColor?: string
  textColor?: string
  mutedTextColor?: string
  activeColor?: string
  imageUrl?: string
  imageAlt?: string
  duration?: number
  milestones?: Milestone[]
  className?: string
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    number: "00",
    title: 'CORE MOTTO & SLOGAN',
    description: 'CORE MOTTO: "Decode. Innovate. Overcome."\nOFFICIAL CLUB SLOGAN: "Unravel the Clues. Hack the Rules. Build the Future."',
    iconName: "Target",
    takeaway: "The guiding charter of INVICTORS.",
  },
  {
    number: "01",
    title: "Unconventional Pedagogy",
    description: "Teach technical concepts through creative storytelling, puzzle-solving, escape rooms, and gamified challenges.",
    iconName: "Puzzle",
    takeaway: "Story-driven computing mechanics replace sterile lectures.",
  },
  {
    number: "02",
    title: "Practical Deconstruction",
    description: "Foster deep hardware and software intuition by backtracking everyday devices (e.g., decoding embedded systems in daily gadgets).",
    iconName: "Cpu",
    takeaway: "Tear down real circuits to master embedded architecture.",
  },
  {
    number: "03",
    title: "Sustainable Innovation",
    description: "Address pressing real-world issues like e-waste management through creative upcycling hackathons and eco-tech initiatives.",
    iconName: "Leaf",
    takeaway: "Transform discarded silicon into functional engineering prototypes.",
  },
  {
    number: "04",
    title: "Next-Gen Skill Adaptation",
    description: "Pioneer contemporary tech trends including AI prompt engineering, reverse image generation, and forensic data tracing.",
    iconName: "Sparkles",
    takeaway: "Master prompt crafting, neural latent spaces, and memory forensics.",
  },
  {
    number: "05",
    title: "Industry Connection",
    description: "Organize targeted industrial visits and expert interactions to bridge academic theory with real-world corporate execution.",
    iconName: "Building2",
    takeaway: "Direct access to enterprise engineering hubs and industrial facilities.",
  },
]

export function Timeline({
  title = "Our Mission",
  periodLabel = "Decode. Innovate. Overcome.",
  backgroundColor = "#050505",
  textColor = "#f5f5f5",
  mutedTextColor = "#9a9a9a",
  activeColor = "#d4a24c",
  imageUrl = "/assets/invictors-logo.png",
  imageAlt = "INVICTORS Emblem",
  milestones = DEFAULT_MILESTONES,
  className = "",
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check prefers-reduced-motion
  useEffect(() => {
    try {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(media.matches)
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    if (!containerRef.current || !trackRef.current) return

    // 1. Initialize Lenis for smooth scroll specifically within this component
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const onScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on("scroll", onScroll)

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    // 2. Setup GSAP ScrollTrigger horizontal translation
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return

      const totalScroll = track.scrollWidth - window.innerWidth + 200

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${Math.max(1200, totalScroll)}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              milestones.length - 1,
              Math.floor(self.progress * milestones.length)
            )
            setActiveIndex(idx)
          },
        },
      })

      tl.to(track, {
        x: () => -totalScroll,
        ease: "none",
      })

      // Stems and milestone reveal animations
      const milestoneElements = track.querySelectorAll(".timeline-milestone")
      milestoneElements.forEach((el, index) => {
        const stem = el.querySelector(".milestone-stem")
        const content = el.querySelector(".milestone-content")
        const node = el.querySelector(".milestone-node")

        if (stem && content && node) {
          gsap.fromTo(
            stem,
            { scaleY: 0, transformOrigin: "bottom center" },
            {
              scaleY: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: "left 75%",
                end: "left 45%",
                scrub: true,
              },
            }
          )

          gsap.fromTo(
            content,
            { opacity: 0.25, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: "left 70%",
                end: "left 40%",
                scrub: true,
              },
            }
          )

          gsap.fromTo(
            node,
            { scale: 0.8, boxShadow: "0 0 0px #d4a24c" },
            {
              scale: 1.25,
              boxShadow: "0 0 25px #d4a24c",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: "left 65%",
                end: "left 35%",
                scrub: true,
              },
            }
          )
        }
      })
    }, containerRef)

    return () => {
      ctx.revert()
      gsap.ticker.remove(tickerCb)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [milestones, prefersReducedMotion])

  const getIcon = (name?: string) => {
    switch (name) {
      case "Puzzle":
        return <Puzzle className="w-5 h-5 text-amber-300" />
      case "Cpu":
        return <Cpu className="w-5 h-5 text-amber-300" />
      case "Leaf":
        return <Leaf className="w-5 h-5 text-amber-300" />
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-300" />
      case "Building2":
        return <Building2 className="w-5 h-5 text-amber-300" />
      case "Target":
        return <Target className="w-5 h-5 text-amber-300" />
      default:
        return <Layers className="w-5 h-5 text-amber-300" />
    }
  }

  // REDUCED MOTION FALLBACK (Stacked list without scrubbing)
  if (prefersReducedMotion) {
    return (
      <div className={`w-full py-8 px-4 ${className}`} style={{ backgroundColor }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <span className="font-display text-xs text-amber-400 tracking-widest uppercase">
              {periodLabel}
            </span>
            <h2 className="font-display text-3xl font-bold text-gradient-gold mt-1">
              {title}
            </h2>
          </div>

          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border-amber-500/25 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-black flex items-center justify-center shrink-0">
                {getIcon(m.iconName)}
              </div>
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold block mb-1">
                  #{m.number || `0${idx}`}
                </span>
                <h3 className="font-display text-lg font-bold text-gradient-gold">
                  {m.title}
                </h3>
                <p className="font-body text-sm text-silver-300 mt-1 whitespace-pre-line leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden select-none flex flex-col justify-between ${className}`}
      style={{ backgroundColor }}
    >
      {/* Circuit background overlay */}
      <div className="absolute inset-0 circuit-bg pointer-events-none opacity-40" />

      {/* Top Header Bar */}
      <div className="relative z-20 pt-6 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        <div>
          <span className="font-display text-xs font-bold text-amber-400 tracking-[0.25em] uppercase block">
            {periodLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-gradient-gold tracking-tight mt-0.5">
            {title}
          </h2>
        </div>

        {/* Brand Crest watermark thumbnail */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-mono text-silver-300/70">INVICTORS</div>
            <div className="text-[10px] font-mono text-amber-400/80">DEPT. OF CSE</div>
          </div>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-amber-500/40 shadow-[0_0_15px_rgba(212,162,76,0.3)]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Horizontal Sliding Track */}
      <div className="relative z-10 flex-1 flex items-center overflow-visible">
        <div
          ref={trackRef}
          className="flex items-center gap-12 sm:gap-20 pl-8 sm:pl-24 pr-32 sm:pr-64 will-change-transform"
        >
          {milestones.map((m, idx) => {
            const isFirst = idx === 0
            const isActive = activeIndex === idx

            return (
              <div
                key={idx}
                className="timeline-milestone relative flex flex-col items-center shrink-0 w-[290px] sm:w-[420px]"
              >
                {/* Content Box */}
                <div
                  className={`milestone-content w-full glass-panel p-6 sm:p-7 rounded-2xl border transition-all duration-300 relative group ${
                    isActive
                      ? "border-amber-400 shadow-[0_0_30px_rgba(212,162,76,0.35)] bg-amber-950/40"
                      : "border-amber-500/25 hover:border-amber-400/60"
                  }`}
                >
                  {/* Decorative corner node */}
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-amber-400/60" />

                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(212,162,76,0.4)]">
                      {m.number || `0${idx}`}
                    </span>
                    <div className="p-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300">
                      {getIcon(m.iconName)}
                    </div>
                  </div>

                  <h3 className="font-display text-base sm:text-xl font-bold text-gradient-gold tracking-wide mb-2 line-clamp-2">
                    {m.title}
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-silver-200/90 leading-relaxed whitespace-pre-line">
                    {m.description}
                  </p>

                  {m.takeaway && (
                    <div className="mt-4 pt-2.5 border-t border-amber-500/20 text-[11px] font-mono text-amber-400/80">
                      // {m.takeaway}
                    </div>
                  )}
                </div>

                {/* Vertical Stem Line */}
                <div className="milestone-stem w-[2px] h-12 sm:h-16 bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_0_8px_#d4a24c] my-1" />

                {/* Track Node on the horizontal axis */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`milestone-node w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black border-2 transition-all flex items-center justify-center ${
                      isActive
                        ? "border-amber-300 shadow-[0_0_15px_#f1d58a] scale-110"
                        : "border-amber-500/60 shadow-[0_0_8px_rgba(212,162,76,0.3)]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Full-width continuous horizontal track rail behind the nodes */}
        <div className="absolute left-0 right-0 bottom-[60px] sm:bottom-[72px] h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-0" />
      </div>

      {/* Bottom Progress Bar & Milestones Indicator */}
      <div className="relative z-20 pb-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Scroll hint */}
        <div className="text-[11px] font-display tracking-widest text-silver-300/60 uppercase">
          Vertical scroll slides timeline horizontally ➔
        </div>

        {/* Milestones indicator pill */}
        <div className="flex items-center gap-2 bg-black/70 border border-amber-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className={`font-mono text-xs font-bold transition-colors ${
                  activeIndex === i ? "text-amber-300" : "text-silver-500"
                }`}
              >
                {m.number || `0${i}`}
              </span>
              {i < milestones.length - 1 && (
                <span className="text-zinc-700 text-[10px]">—</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
