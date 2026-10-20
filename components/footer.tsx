import React from "react"
import { CLUB_METADATA } from "@/lib/content"

export function Footer() {
  return (
    <footer className="w-full border-t border-amber-500/15 bg-black/80 backdrop-blur-md py-4 px-4 text-center mt-auto z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400/80 font-display tracking-widest text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#d4a24c]" />
          <span>{CLUB_METADATA.motto}</span>
        </div>

        <p className="text-silver-300/60 font-body tracking-wider text-xs">
          {CLUB_METADATA.footerText}
        </p>

        <div className="flex items-center gap-2 text-silver-300/50 text-[10px] font-mono">
          <span>VVCE MYSURU</span>
          <span className="text-amber-500/60">◆</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </footer>
  )
}
