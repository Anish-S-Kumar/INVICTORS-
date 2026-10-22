import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RingField } from "@/components/decor/RingField"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Leaderboard | INVICTORS",
  description: "The INVICTORS leaderboard is being forged. Check back soon.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RankPage() {
  return (
    <div id="main-content" className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <Header showBack={true} backHref="/" backLabel="Dashboard" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden">
        {/* Full-strength RingField centered behind the trophy */}
        <RingField isSubpage={true} isRankPage={true} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Floating golden particle ambiance */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,162,76,0.15)_0%,transparent_70%)] blur-2xl" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          {/* Big Animated Gold Line-Art Trophy / Crown */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/30 animate-spin-reverse pointer-events-none" />

            <svg
              className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_0_20px_rgba(212,162,76,0.6)] animate-pulse-gold"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff3c4" />
                  <stop offset="40%" stopColor="#f1d58a" />
                  <stop offset="70%" stopColor="#d4a24c" />
                  <stop offset="100%" stopColor="#9a6f1f" />
                </linearGradient>
              </defs>

              {/* Crown top peaks */}
              <polygon
                points="80,18 84,28 94,29 86,36 88,46 80,41 72,46 74,36 66,29 76,28"
                fill="url(#trophy-gold)"
              />

              {/* Trophy Cup */}
              <path
                d="M50 48 H110 V80 C110 98 96 108 80 108 C64 108 50 98 50 80 Z"
                stroke="url(#trophy-gold)"
                strokeWidth="2.5"
                fill="rgba(212,162,76,0.08)"
              />

              {/* Trophy Handles */}
              <path
                d="M50 56 H34 C24 56 24 82 40 85 L52 83"
                stroke="url(#trophy-gold)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M110 56 H126 C136 56 136 82 120 85 L108 83"
                stroke="url(#trophy-gold)"
                strokeWidth="2"
                fill="none"
              />

              {/* Stem & Pedestal Base */}
              <rect
                x="73"
                y="108"
                width="14"
                height="22"
                stroke="url(#trophy-gold)"
                strokeWidth="2"
                fill="#050505"
              />
              <path
                d="M48 130 H112 L106 142 H54 Z"
                stroke="url(#trophy-gold)"
                strokeWidth="2"
                fill="rgba(212,162,76,0.15)"
              />

              {/* Target / Crosshair center insignia */}
              <circle cx="80" cy="74" r="14" stroke="#fff3c4" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="80" cy="74" r="4" fill="#fff3c4" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-display tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#d4a24c]" />
            <span>LEADERBOARD ARENA</span>
          </div>

          {/* Heading: COMING SOON */}
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-gradient-gold uppercase tracking-wider mb-3 drop-shadow-[0_0_20px_rgba(212,162,76,0.3)]">
            COMING SOON
          </h1>

          {/* Subline */}
          <p className="font-display text-sm sm:text-base text-silver-100 font-semibold max-w-md mx-auto leading-relaxed mb-8">
            The INVICTORS leaderboard is being forged. Check back soon.
          </p>

          {/* Back to Dashboard Button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-black font-display text-xs sm:text-sm font-bold tracking-widest shadow-[0_0_20px_rgba(212,162,76,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK TO DASHBOARD</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
