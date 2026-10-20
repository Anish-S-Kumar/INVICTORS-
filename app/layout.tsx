import type { Metadata, Viewport } from "next"
import { Orbitron, Rajdhani } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://invictors.vvce.ac.in"),
  title: "INVICTORS | Vidyavardhaka College of Engineering - Dept. of CSE",
  description: "Unravel the Clues. Hack the Rules. Build the Future. Official student club proposal by the Department of Computer Science & Engineering, Vidyavardhaka College of Engineering, Mysuru.",
  keywords: [
    "INVICTORS",
    "VVCE",
    "Vidyavardhaka College of Engineering",
    "Computer Science and Engineering",
    "CSE Club",
    "Decode Innovate Overcome",
    "Cyber Forensics",
    "AI Prompt Crafting",
    "Hardware Reverse-Engineering",
    "E-Waste Hackathon",
  ],
  authors: [{ name: "INVICTORS Club, Dept. of CSE, VVCE" }],
  openGraph: {
    title: "INVICTORS | Vidyavardhaka College of Engineering",
    description: "Decode. Innovate. Overcome. Unravel the Clues. Hack the Rules. Build the Future.",
    url: "https://invictors-vvce.edu",
    siteName: "INVICTORS Club",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "INVICTORS Official Club Emblem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} dark`}
      suppressHydrationWarning
    >
      <body className="circuit-bg min-h-screen text-silver-300 font-body antialiased selection:bg-gold-500/30 selection:text-gold-100 flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-black border border-amber-400 text-amber-200 rounded-md font-display text-xs tracking-wider shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
