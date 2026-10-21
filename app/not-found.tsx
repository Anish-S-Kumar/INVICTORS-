import React from "react"
import Link from "next/link"
import { Home, Compass } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] circuit-bg flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl border-amber-500/30 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mb-4 text-amber-400">
          <Compass className="w-7 h-7" />
        </div>

        <div className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-1">
          404 // CLUE NOT FOUND
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gradient-gold uppercase mb-2">
          Unknown Coordinates
        </h1>

        <p className="font-body text-sm text-silver-300/80 mb-6 leading-relaxed">
          The requested forensic pathway or route does not exist in the INVICTORS database.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-display text-xs font-bold tracking-wider cursor-pointer shadow-[0_0_15px_rgba(212,162,76,0.35)] active:scale-95 transition-transform"
        >
          <Home className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </Link>
      </div>
    </div>
  )
}
