"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { RotateCcw, Home, AlertTriangle } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#050505] circuit-bg flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl border-amber-500/30 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mb-4 text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="font-mono text-xs text-amber-400/80 tracking-widest uppercase mb-1">
          SYSTEM NOTICE
        </div>

        <h1 className="font-display text-2xl font-bold text-gradient-gold uppercase mb-2">
          An Anomaly Occurred
        </h1>

        <p className="font-body text-sm text-silver-300/80 mb-6 leading-relaxed">
          The decryption sequence encountered an unexpected error. You can retry the request or return to the main dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-black font-display text-xs font-bold tracking-wider cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:border-amber-400 text-xs font-display tracking-wider cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>DASHBOARD</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
