"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { PageShell } from "@/components/page-shell"
import { SIGNATURE_EVENTS, INVICTUS_FEST } from "@/lib/content"
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
} from "lucide-react"

export default function EventsPage() {
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({})

  const handleNotify = (id: string) => {
    setNotifiedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getEventIcon = (name: string) => {
    switch (name) {
      case "KeyRound":
        return <KeyRound className="w-5 h-5 text-amber-400" />
      case "Binary":
        return <Binary className="w-5 h-5 text-amber-400" />
      case "Wand2":
        return <Wand2 className="w-5 h-5 text-amber-400" />
      case "Wrench":
        return <Wrench className="w-5 h-5 text-amber-400" />
      case "Recycle":
        return <Recycle className="w-5 h-5 text-amber-400" />
      default:
        return <CalendarDays className="w-5 h-5 text-amber-400" />
    }
  }

  const getFestIcon = (name: string) => {
    switch (name) {
      case "Terminal":
        return <Terminal className="w-6 h-6 text-amber-400" />
      case "Recycle":
        return <Recycle className="w-6 h-6 text-amber-400" />
      case "Award":
        return <Award className="w-6 h-6 text-amber-400" />
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />
    }
  }

  return (
    <PageShell
      title="Upcoming Events"
      subtitle="From murder mystery logic races to our 3-day annual flagship festival INVICTUS FEST."
      badge="Action Calendar"
      breadcrumb="Events"
    >
      {/* ============================================================== */}
      {/* SECTION A: SIGNATURE EXPERIENTIAL EVENTS                        */}
      {/* ============================================================== */}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="glass-panel p-6 rounded-2xl border-amber-500/25 hover:border-amber-400/70 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon, Category & Dates Chip */}
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

                {/* Bottom: Format Tag + Visual-only Notify Me Button */}
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
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify me</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION B: 3-DAY FLAGSHIP FEST: "INVICTUS FEST"                */}
      {/* ============================================================== */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border-amber-500/35 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
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

        {/* 3-Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {INVICTUS_FEST.days.map((d, idx) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.45 }}
              className="glass-panel p-6 rounded-2xl border-amber-500/25 flex flex-col justify-between relative group hover:border-amber-400/80 transition-all"
            >
              <div>
                {/* Day Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(212,162,76,0.3)]">
                    DAY 0{d.day}
                  </span>
                  <div className="p-2 rounded-lg bg-black/70 border border-amber-500/30">
                    {getFestIcon(d.iconName)}
                  </div>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-gradient-gold mb-1">
                  {d.title}
                </h3>

                <p className="font-display text-xs text-silver-300/70 mb-4 tracking-wide">
                  {d.tagline}
                </p>

                {/* Activities list */}
                <ul className="space-y-2.5">
                  {d.activities.map((act, actIdx) => (
                    <li key={actIdx} className="flex items-start gap-2.5 text-xs text-silver-200/90 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status footer */}
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
