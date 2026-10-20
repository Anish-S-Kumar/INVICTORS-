"use client"

import React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Timeline, Milestone } from "@/components/ui/timeline"
import { ArrowLeft, Target, ChevronRight, Home, ArrowRight } from "lucide-react"
import { CLUB_METADATA } from "@/lib/content"

const MISSION_TIMELINE_MILESTONES: Milestone[] = [
  {
    number: "00",
    title: 'CORE MOTTO & SLOGAN',
    description: `CORE MOTTO: "Decode. Innovate. Overcome."\nOFFICIAL CLUB SLOGAN: "Unravel the Clues. Hack the Rules. Build the Future."`,
    iconName: "Target",
    takeaway: "The foundational compass of the INVICTORS society.",
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

export default function MissionPage() {
  return (
    <div id="main-content" className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Standard Header with VVCE & CSE logos, centered title, and gold Back button */}
      <Header showBack={true} backHref="/" backLabel="Dashboard" />

      {/* Lead-in Section (Short, one screen at most) */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-display tracking-widest text-silver-300/60 mb-4">
          <Link href="/" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
            <Home className="w-3.5 h-3.5 text-amber-500/70" />
            <span>HOME</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500/40" />
          <span className="text-amber-300/90 font-semibold uppercase">MISSION TIMELINE</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-display tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
              CLUB CHARTER
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-gradient-gold uppercase">
              Mission Statement
            </h1>
            <p className="font-body text-sm sm:text-base text-silver-300/90 max-w-2xl mt-1">
              Scroll down to travel through our horizontal mission timeline — from the core charter to five non-conventional pillars.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <div className="font-display text-xs text-amber-400 tracking-[0.25em] uppercase">
              {CLUB_METADATA.motto}
            </div>
            <div className="text-xs text-silver-300/60 font-mono mt-0.5">
              6 CORE MILESTONES // 00—05
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Horizontal Scroll Timeline Section */}
      <section className="w-full">
        <Timeline
          title="Our Mission"
          periodLabel="Decode. Innovate. Overcome."
          milestones={MISSION_TIMELINE_MILESTONES}
          imageUrl="/assets/invictors-logo.png"
        />
      </section>

      {/* Closing Section: Call to action back to Dashboard */}
      <section className="max-w-4xl w-full mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-amber-500/30 relative overflow-hidden">
          <div className="font-display text-xs font-bold text-amber-400 tracking-[0.25em] uppercase mb-2">
            EXPLORE THE ECOSYSTEM
          </div>
          <h2 className="font-display text-xl sm:text-3xl font-extrabold text-gradient-gold uppercase mb-3">
            Ready to Hack the Rules?
          </h2>
          <p className="text-sm sm:text-base text-silver-300 max-w-xl mx-auto mb-6 leading-relaxed">
            Discover why INVICTORS is unique, explore the six practical pillars, or preview the signature experiential hackathons.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-display text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(212,162,76,0.4)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>RETURN TO DASHBOARD</span>
            </Link>

            <Link
              href="/unique"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:border-amber-400 text-xs sm:text-sm font-display tracking-wider transition-all cursor-pointer"
            >
              <span>WHY UNIQUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
