"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PageShell } from "@/components/page-shell"
import {
  CALENDAR_EVENTS_2026_27,
  SIGNATURE_EVENTS,
  INVICTUS_FEST,
} from "@/lib/content"
import {
  CalendarDays,
  Bell,
  Check,
  Terminal,
  Recycle,
  Award,
  KeyRound,
  Binary,
  Wand2,
  Wrench,
  Clock,
  Sparkles,
  Users,
  Cpu,
  Building2,
  ChevronRight,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
function getCalendarIcon(name: string) {
  const cls = "w-7 h-7 text-amber-400"
  switch (name) {
    case "Terminal":  return <Terminal  className={cls} />
    case "Users":     return <Users     className={cls} />
    case "Wrench":    return <Wrench    className={cls} />
    case "Recycle":   return <Recycle   className={cls} />
    case "Cpu":       return <Cpu       className={cls} />
    case "Binary":    return <Binary    className={cls} />
    case "Building2": return <Building2 className={cls} />
    default:          return <CalendarDays className={cls} />
  }
}

function getEventIcon(name: string) {
  const cls = "w-5 h-5 text-amber-400"
  switch (name) {
    case "KeyRound": return <KeyRound className={cls} />
    case "Binary":   return <Binary   className={cls} />
    case "Wand2":    return <Wand2    className={cls} />
    case "Wrench":   return <Wrench   className={cls} />
    case "Recycle":  return <Recycle  className={cls} />
    default:         return <CalendarDays className={cls} />
  }
}

function getFestIcon(name: string) {
  const cls = "w-6 h-6 text-amber-400"
  switch (name) {
    case "Terminal": return <Terminal className={cls} />
    case "Recycle":  return <Recycle  className={cls} />
    case "Award":    return <Award    className={cls} />
    default:         return <Sparkles className={cls} />
  }
}

// ── Pinned Horizontal Scroll Strip (GSAP — same as Mission Statement) ─────────
function CalendarStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReduced(mq.matches)
      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    if (!containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track     = trackRef.current!
      const container = containerRef.current!

      // total horizontal distance to scroll
      const totalScroll = Math.max(
        1000,
        track.scrollWidth - window.innerWidth + 280
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,          // pin the section while scrolling
          scrub: 1,           // smooth tie to scroll position
          start: "top top",
          end: () => `+=${Math.max(1400, totalScroll)}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              CALENDAR_EVENTS_2026_27.length - 1,
              Math.floor(self.progress * CALENDAR_EVENTS_2026_27.length)
            )
            setActiveIndex(idx)
          },
        },
      })

      // Move the track LEFT as user scrolls DOWN (reveals cards right → left)
      tl.to(track, { x: () => -totalScroll, ease: "none" })

      // Per-card reveal animations tied to the container animation.
      // Ends at 76% so that every card (especially MAY, the last card)
      // fully completes its entrance and reaches full 100% opacity & scale
      // well before track finishes scrolling.
      const cards = track.querySelectorAll<HTMLElement>(".event-card")
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 24, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: "left 96%",
              end:   "left 76%",
              scrub: true,
            },
          }
        )
      })
    }, containerRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [prefersReduced])

  // ── Reduced-motion fallback: simple vertical list ─────────────────────────
  if (prefersReduced) {
    return (
      <section className="mb-16">
        <SectionHeader />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CALENDAR_EVENTS_2026_27.map((ev, i) => (
            <StaticCard
              key={i}
              event={ev}
              active={activeIndex === i}
              onSelect={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-0">
      {/* Pinned container — full viewport height, same as Timeline */}
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-[#050505]"
        style={{ background: "var(--bg, #050505)" }}
      >
        {/* Circuit overlay */}
        <div className="absolute inset-0 circuit-bg pointer-events-none opacity-30" />

        {/* Header */}
        <div className="relative z-20 pt-6 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
          <div>
            <span className="font-display text-xs font-bold text-amber-400 tracking-[0.25em] uppercase block">
              INVICTORS · 2026–27
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-gradient-gold tracking-tight mt-0.5 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-amber-400" />
              Club Event Calendar
            </h2>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-mono text-silver-300/60">Scroll down to explore</div>
            <div className="text-[10px] font-mono text-amber-400/70 mt-0.5">OCT → MAY</div>
          </div>
        </div>

        {/* Horizontal sliding track */}
        <div className="relative z-10 flex-1 flex items-center overflow-visible">
          <div
            ref={trackRef}
            className="flex items-center gap-5 sm:gap-6 pl-6 sm:pl-16 pr-24 sm:pr-40 will-change-transform"
          >
            {CALENDAR_EVENTS_2026_27.map((ev, idx) => (
              <StaticCard
                key={idx}
                event={ev}
                active={activeIndex === idx}
                onSelect={() => setActiveIndex(idx)}
              />
            ))}
          </div>

          {/* Horizontal rail line */}
          <div className="absolute left-0 right-0 bottom-[calc(50%-1px)] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />
        </div>

        {/* Bottom — progress indicator */}
        <div className="relative z-20 pb-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-display tracking-widest text-silver-300/50 uppercase flex items-center gap-1 pointer-events-none">
            Scroll down to move through months
            <ChevronRight className="w-3 h-3 text-amber-500/50" />
          </div>

          {/* Month dots */}
          <div className="flex items-center gap-2 bg-black/70 border border-amber-500/25 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            {CALENDAR_EVENTS_2026_27.map((ev, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="flex items-center gap-1.5 cursor-pointer group/dot focus:outline-none"
              >
                <span className={`font-mono text-[10px] font-bold transition-all duration-300 ${
                  activeIndex === i ? "text-amber-300 scale-110 drop-shadow-[0_0_8px_#d4a24c]" : "text-silver-600 group-hover/dot:text-silver-300"
                }`}>
                  {ev.shortMonth}
                </span>
                {i < CALENDAR_EVENTS_2026_27.length - 1 && (
                  <span className="text-zinc-700 text-[9px] pointer-events-none">—</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Individual square card ────────────────────────────────────────────────────
function StaticCard({
  event,
  active,
  onSelect,
}: {
  event: (typeof CALENDAR_EVENTS_2026_27)[0]
  active: boolean
  onSelect?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={`event-card flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64
        glass-panel rounded-3xl border transition-all duration-300 flex flex-col justify-between
        p-4 sm:p-5 overflow-hidden relative cursor-pointer group
        hover:!opacity-100 hover:scale-[1.04] hover:border-amber-300 hover:shadow-[0_0_38px_rgba(212,162,76,0.5)] hover:bg-amber-950/40
        ${active
          ? "border-amber-400 shadow-[0_0_36px_rgba(212,162,76,0.4)] bg-amber-950/35 scale-[1.02]"
          : "border-amber-500/25 bg-black/40"
        }`}
    >
      {/* Corner glow */}
      <div className={`absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500
        ${active ? "bg-amber-500/25" : "bg-amber-500/10 group-hover:bg-amber-500/25"}`}
      />

      {/* Top: icon + category */}
      <div className="flex items-start justify-between gap-1 relative z-10">
        <div className={`p-2 rounded-xl border transition-all duration-300
          ${active
            ? "bg-amber-900/80 border-amber-400/60 shadow-[0_0_14px_rgba(212,162,76,0.45)] scale-105"
            : "bg-amber-950/70 border-amber-500/30 group-hover:scale-105 group-hover:bg-amber-900/80 group-hover:border-amber-400/60 group-hover:shadow-[0_0_12px_rgba(212,162,76,0.4)]"}`}
        >
          {getCalendarIcon(event.iconName)}
        </div>
        <span className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-right leading-tight pt-1 max-w-[5rem] transition-colors
          ${active ? "text-amber-300 font-semibold" : "text-amber-400/70 group-hover:text-amber-300"}`}
        >
          {event.category}
        </span>
      </div>

      {/* BIG month text */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <span className={`font-display font-extrabold leading-none select-none text-center
          text-5xl sm:text-6xl lg:text-7xl
          bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600
          bg-clip-text text-transparent transition-all duration-300
          ${active
            ? "drop-shadow-[0_0_36px_rgba(212,162,76,0.95)] scale-105"
            : "drop-shadow-[0_0_16px_rgba(212,162,76,0.4)] group-hover:drop-shadow-[0_0_36px_rgba(212,162,76,0.95)] group-hover:scale-105"
          }`}
        >
          {event.shortMonth}
        </span>
      </div>

      {/* Bottom: title + desc */}
      <div className="relative z-10">
        <h3 className={`font-display text-xs sm:text-sm font-bold leading-snug transition-colors
          ${active ? "text-amber-200" : "text-silver-100 group-hover:text-amber-200"}`}
        >
          {event.title}
        </h3>
        <p className={`font-body text-[9px] sm:text-[10px] leading-relaxed mt-0.5 line-clamp-2 transition-colors
          ${active ? "text-silver-200" : "text-silver-300/60 group-hover:text-silver-200"}`}
        >
          {event.description}
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({})

  const handleNotify = (id: string) => {
    setNotifiedEvents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <PageShell
      title="Upcoming Events"
      subtitle="INVICTORS Club Calendar of Events 2026–27 — from technical challenges to our 3-day flagship INVICTUS FEST."
      badge="Action Calendar"
      breadcrumb="Events"
    >
      {/* ================================================================== */}
      {/* SECTION 0: PINNED HORIZONTAL SCROLL — same as Mission Statement     */}
      {/* ================================================================== */}
      <CalendarStrip />

      {/* Spacer so content below doesn't feel glued */}
      <div className="mt-16" />

      {/* ================================================================== */}
      {/* SECTION A: SIGNATURE EXPERIENTIAL EVENTS                           */}
      {/* ================================================================== */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-gradient-gold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Section A: Signature Experiential Events</span>
            </h2>
            <p className="text-xs sm:text-sm text-silver-300/70 font-body mt-0.5">
              Five signature formats transforming technical problem-solving into experiential quests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIGNATURE_EVENTS.map((event, idx) => {
            const isNotified = !!notifiedEvents[event.id]
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="glass-panel p-6 rounded-2xl border-amber-500/25 hover:border-amber-400/70 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/30 group-hover:scale-105 transition-transform">
                      {getEventIcon(event.iconName)}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{event.status}</span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-widest block mb-1">
                    {event.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-silver-100 group-hover:text-amber-200 transition-colors mb-2">
                    {event.title}
                  </h3>
                  <p className="font-body text-sm text-silver-300/90 leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-silver-300/60 truncate">
                    // {event.format}
                  </span>
                  <button
                    onClick={() => handleNotify(event.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display tracking-wider transition-all cursor-pointer ${
                      isNotified
                        ? "bg-amber-500 text-black font-bold shadow-[0_0_12px_#d4a24c]"
                        : "bg-black/60 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:text-amber-100"
                    }`}
                  >
                    {isNotified ? (
                      <><Check className="w-3.5 h-3.5" /><span>Subscribed</span></>
                    ) : (
                      <><Bell className="w-3.5 h-3.5" /><span>Notify me</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION B: INVICTUS FEST                                           */}
      {/* ================================================================== */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border-amber-500/35 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-display tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
            <span>ANNUAL FLAGSHIP FESTIVAL</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient-gold">
            {INVICTUS_FEST.title}
          </h2>
          <p className="font-body text-sm sm:text-base text-silver-200 mt-2 leading-relaxed">
            {INVICTUS_FEST.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INVICTUS_FEST.days.map((d, idx) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.45 }}
              className="glass-panel p-6 rounded-2xl border-amber-500/25 flex flex-col justify-between group hover:border-amber-400/80 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(212,162,76,0.3)]">
                    DAY 0{d.day}
                  </span>
                  <div className="p-2 rounded-lg bg-black/70 border border-amber-500/30">
                    {getFestIcon(d.iconName)}
                  </div>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-gradient-gold mb-1">{d.title}</h3>
                <p className="font-display text-xs text-silver-300/70 mb-4 tracking-wide">{d.tagline}</p>
                <ul className="space-y-2.5">
                  {d.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-silver-200/90 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono text-amber-400/80">
                <span>SCHEDULE</span>
                <span>Dates TBA</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

// ── tiny helper used only for reduced-motion header ──────────────────────────
function SectionHeader() {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-display tracking-widest uppercase mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
        Calendar 2026–27
      </div>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-gradient-gold flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-amber-400" />
        <span>Club Event Calendar</span>
      </h2>
    </div>
  )
}
