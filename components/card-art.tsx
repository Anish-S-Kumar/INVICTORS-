import React from "react"

interface CardArtProps {
  id: string
  number: string
  title: string
  iconName: string
  className?: string
}

export function CardArt({ id, number, title, className = "" }: CardArtProps) {
  // Bespoke SVG graphics matching the INVICTORS badge aesthetic:
  // Pure black base, gold circuit paths, silver accents, node dots, and symbolic emblems
  const renderGraphic = () => {
    switch (id) {
      case "overview":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-gold-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="50%" stopColor="#d4a24c" />
                <stop offset="100%" stopColor="#9a6f1f" />
              </linearGradient>
              <linearGradient id="grad-silver-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cfcfcf" />
                <stop offset="100%" stopColor="#6e6e6e" />
              </linearGradient>
            </defs>
            {/* Background circuit grid */}
            <path d="M20 30 H100 V70 H180 V120 H280" stroke="#d4a24c" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
            <path d="M10 160 H80 V110 H150" stroke="#cfcfcf" strokeWidth="1" strokeOpacity="0.2" />
            <circle cx="100" cy="70" r="3" fill="#d4a24c" />
            <circle cx="180" cy="120" r="3" fill="#d4a24c" />
            <circle cx="80" cy="110" r="2.5" fill="#cfcfcf" />
            {/* Central Compass / Radar motif */}
            <circle cx="150" cy="95" r="45" stroke="url(#grad-silver-1)" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="150" cy="95" r="32" stroke="url(#grad-gold-1)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="150" cy="95" r="16" stroke="#d4a24c" strokeWidth="1" strokeOpacity="0.8" />
            {/* Crosshair ticks */}
            <line x1="150" y1="40" x2="150" y2="52" stroke="#d4a24c" strokeWidth="2" />
            <line x1="150" y1="138" x2="150" y2="150" stroke="#d4a24c" strokeWidth="2" />
            <line x1="95" y1="95" x2="107" y2="95" stroke="#d4a24c" strokeWidth="2" />
            <line x1="193" y1="95" x2="205" y2="95" stroke="#d4a24c" strokeWidth="2" />
            {/* Compass needle */}
            <polygon points="150,65 156,95 150,125 144,95" fill="url(#grad-gold-1)" />
            <polygon points="150,65 144,95 150,95" fill="#fff3c4" />
            <circle cx="150" cy="95" r="4" fill="#050505" stroke="#fff3c4" strokeWidth="1.5" />
          </svg>
        )

      case "mission":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-target" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="60%" stopColor="#d4a24c" />
                <stop offset="100%" stopColor="#5b3f0c" />
              </linearGradient>
            </defs>
            {/* Binary strip */}
            <text x="30" y="45" fill="#d4a24c" opacity="0.35" fontSize="10" fontFamily="monospace">010101 001010 110101</text>
            <text x="30" y="170" fill="#cfcfcf" opacity="0.25" fontSize="10" fontFamily="monospace">DECODE.INNOVATE.OVERCOME</text>
            {/* Concentric Mission Target */}
            <circle cx="150" cy="100" r="58" stroke="#d4a24c" strokeWidth="1" strokeOpacity="0.2" />
            <circle cx="150" cy="100" r="44" stroke="url(#grad-target)" strokeWidth="1.5" strokeDasharray="6 3" />
            <circle cx="150" cy="100" r="28" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="150" cy="100" r="12" fill="#d4a24c" fillOpacity="0.3" stroke="#fff3c4" strokeWidth="2" />
            <circle cx="150" cy="100" r="4" fill="#fff3c4" />
            {/* Crosshair with 4 node points */}
            <line x1="150" y1="30" x2="150" y2="170" stroke="#d4a24c" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="80" y1="100" x2="220" y2="100" stroke="#d4a24c" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="150" cy="30" r="3" fill="#fff3c4" />
            <circle cx="150" cy="170" r="3" fill="#fff3c4" />
            <circle cx="80" cy="100" r="3" fill="#fff3c4" />
            <circle cx="220" cy="100" r="3" fill="#fff3c4" />
          </svg>
        )

      case "unique":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-split" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4a24c" />
                <stop offset="50%" stopColor="#fff3c4" />
                <stop offset="100%" stopColor="#cfcfcf" />
              </linearGradient>
            </defs>
            {/* Split emblem: Left circuit, Right biometric fingerprint */}
            <path d="M120 40 H70 V80 H40 V120 H90 V160" stroke="#d4a24c" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="40" cy="120" r="3" fill="#fff3c4" />
            <circle cx="90" cy="160" r="3" fill="#d4a24c" />
            <text x="60" y="65" fill="#d4a24c" opacity="0.4" fontSize="9" fontFamily="monospace">0101</text>
            <text x="60" y="105" fill="#d4a24c" opacity="0.4" fontSize="9" fontFamily="monospace">1010</text>
            
            {/* Fingerprint ridges on right */}
            <path d="M170 60 A 25 25 0 0 1 205 95" stroke="#cfcfcf" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            <path d="M165 72 A 35 35 0 0 1 215 110" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
            <path d="M160 84 A 45 45 0 0 1 225 125" stroke="#cfcfcf" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
            
            {/* Central Magnifying Glass */}
            <circle cx="150" cy="95" r="30" stroke="url(#grad-split)" strokeWidth="2.5" />
            <line x1="172" y1="117" x2="202" y2="147" stroke="url(#grad-split)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="150" cy="95" r="22" fill="#d4a24c" fillOpacity="0.08" />
            <path d="M142 85 L158 105 M158 85 L142 105" stroke="#fff3c4" strokeWidth="1.5" strokeOpacity="0.7" />
          </svg>
        )

      case "pillars":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-gear" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="60%" stopColor="#d4a24c" />
                <stop offset="100%" stopColor="#9a6f1f" />
              </linearGradient>
            </defs>
            {/* Interlocking Puzzle + Gear System */}
            {/* Hexagonal / Puzzle node */}
            <path d="M110 80 L130 65 L150 80 L150 105 L130 120 L110 105 Z" stroke="url(#grad-gear)" strokeWidth="2" fill="#d4a24c" fillOpacity="0.1" />
            <path d="M150 80 L170 65 L190 80 L190 105 L170 120 L150 105 Z" stroke="#cfcfcf" strokeWidth="2" strokeOpacity="0.5" fill="#ffffff" fillOpacity="0.05" />
            <path d="M130 120 L150 105 L170 120 L170 145 L150 160 L130 145 Z" stroke="url(#grad-gear)" strokeWidth="2" fill="#d4a24c" fillOpacity="0.15" />
            {/* Eco Leaf motif */}
            <path d="M70 130 C70 100, 100 100, 100 130 C100 145, 85 145, 70 130 Z" stroke="#d4a24c" strokeWidth="1.5" fill="#d4a24c" fillOpacity="0.2" />
            <line x1="70" y1="130" x2="95" y2="115" stroke="#fff3c4" strokeWidth="1" />
            {/* Small Gear */}
            <circle cx="215" cy="75" r="16" stroke="#cfcfcf" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="215" cy="75" r="6" fill="#cfcfcf" fillOpacity="0.4" />
          </svg>
        )

      case "events":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-cal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="50%" stopColor="#d4a24c" />
                <stop offset="100%" stopColor="#6b4e12" />
              </linearGradient>
            </defs>
            {/* Pulse waveform & calendar grid */}
            <path d="M20 100 H80 L95 65 L110 135 L125 80 L140 115 L150 100 H280" stroke="#d4a24c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="95" cy="65" r="3.5" fill="#fff3c4" />
            <circle cx="110" cy="135" r="3.5" fill="#d4a24c" />
            <circle cx="125" cy="80" r="3.5" fill="#fff3c4" />
            {/* Calendar / Fest Frame */}
            <rect x="180" y="40" width="80" height="70" rx="6" stroke="url(#grad-cal)" strokeWidth="1.5" fill="#050505" fillOpacity="0.7" />
            <line x1="180" y1="58" x2="260" y2="58" stroke="#d4a24c" strokeWidth="1" />
            <text x="195" y="52" fill="#fff3c4" fontSize="8" fontFamily="sans-serif" fontWeight="bold">INVICTUS</text>
            <text x="198" y="85" fill="#d4a24c" fontSize="18" fontFamily="monospace" fontWeight="bold">3D</text>
            <text x="198" y="98" fill="#cfcfcf" fontSize="7" fontFamily="sans-serif">FEST 2026-27</text>
          </svg>
        )

      case "rank":
        return (
          <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-trophy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="35%" stopColor="#f1d58a" />
                <stop offset="70%" stopColor="#d4a24c" />
                <stop offset="100%" stopColor="#9a6f1f" />
              </linearGradient>
            </defs>
            {/* Trophy & Laurel art */}
            <ellipse cx="150" cy="155" rx="35" ry="8" stroke="#d4a24c" strokeWidth="1.5" fill="#5b3f0c" fillOpacity="0.3" />
            <rect x="142" y="125" width="16" height="30" stroke="url(#grad-trophy)" strokeWidth="1.5" fill="#050505" />
            <path d="M120 60 H180 V95 C180 115 165 125 150 125 C135 125 120 115 120 95 Z" stroke="url(#grad-trophy)" strokeWidth="2" fill="#d4a24c" fillOpacity="0.12" />
            {/* Trophy Handles */}
            <path d="M120 70 H105 C95 70 95 95 110 98 L122 96" stroke="url(#grad-trophy)" strokeWidth="1.5" fill="none" />
            <path d="M180 70 H195 C205 70 205 95 190 98 L178 96" stroke="url(#grad-trophy)" strokeWidth="1.5" fill="none" />
            {/* Crown Star */}
            <polygon points="150,42 153,49 160,50 155,55 157,62 150,58 143,62 145,55 140,50 147,49" fill="#fff3c4" />
            <circle cx="150" cy="85" r="14" stroke="#fff3c4" strokeWidth="1" strokeDasharray="2 2" />
            <text x="146" y="90" fill="#fff3c4" fontSize="12" fontWeight="bold">#1</text>
          </svg>
        )

      default:
        return null
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black/90 rounded-xl border border-amber-500/25 ${className}`}>
      {/* Subtle circuit backdrop */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        {renderGraphic()}
      </div>

      {/* Card number badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <span className="font-display text-xs font-bold tracking-widest text-amber-300/90 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
          {number}
        </span>
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-amber-400/50" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-amber-400/50" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-amber-400/50" />
    </div>
  )
}
