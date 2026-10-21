import React from "react"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center select-none">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-amber-500/25 animate-spin-slow pointer-events-none" />
        <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/30 animate-spin-reverse pointer-events-none" />
        <div className="absolute inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse-gold pointer-events-none" />

        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-amber-500/50 shadow-[0_0_20px_rgba(212,162,76,0.4)]">
          <Image
            src="/assets/invictors-logo.png"
            alt="INVICTORS Loading"
            fill
            priority
            sizes="96px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="font-display text-xs text-amber-300 font-bold tracking-[0.3em] uppercase mt-4 animate-pulse">
        DECRYPTING // INVICTORS
      </div>
    </div>
  )
}
