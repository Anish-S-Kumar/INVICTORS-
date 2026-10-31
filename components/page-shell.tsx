"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronRight, Home } from "lucide-react"

interface PageShellProps {
  title: string
  subtitle: string
  badge?: string
  breadcrumb?: string
  children: React.ReactNode
}

export function PageShell({
  title,
  subtitle,
  badge,
  breadcrumb,
  children,
}: PageShellProps) {
  return (
    <div id="main-content" className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Header with back button to dashboard */}
      <Header showBack={true} backHref="/" backLabel="Dashboard" />

      {/* Main Content with Entrance Animation */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-display tracking-widest text-silver-300/60 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-amber-500/70" />
            <span>HOME</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500/40" />
          <span className="text-amber-300/90 font-semibold uppercase">
            {breadcrumb || title}
          </span>
        </nav>

        {/* Page Header Banner */}
        <div className="mb-10 lg:mb-12 border-b border-amber-500/20 pb-6 sm:pb-8">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-display tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(212,162,76,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#d4a24c]" />
              {badge}
            </div>
          )}

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gradient-gold uppercase drop-shadow-[0_0_20px_rgba(212,162,76,0.25)]">
            {title}
          </h1>

          <p className="font-body text-base sm:text-lg text-silver-300/90 mt-2 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Page Body */}
        {children}
      </motion.main>

      <Footer />
    </div>
  )
}
