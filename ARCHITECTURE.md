# INVICTORS System & Repository Architecture

> **Department of Computer Science & Engineering | Vidyavardhaka College of Engineering**  
> **Repository Architecture, Dashboard Ecosystem & Developer Guide**

---

## 🧭 System Overview & Dashboard Architecture

The INVICTORS web ecosystem is structured around a **Single-Frame Core Engine** accompanied by dedicated **Sub-Dashboards / Route Modules**. 

The application uses **Next.js App Router (Turbopack)** with a zero-jank hydration-safe architecture that cleanly distinguishes between desktop and mobile viewport rendering.

```
                    ┌─────────────────────────┐
                    │    Root App Layout      │
                    │   (app/layout.tsx)      │
                    └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       ┌───────────────────┐         ┌───────────────────┐
       │     Home Page     │         │   Sub-Dashboards  │
       │  (app/page.tsx)   │         │ (app/[route]/...) │
       └─────────┬─────────┘         └─────────┬─────────┘
                 │                             │
    ┌────────────┴────────────┐                ├─ /overview
    ▼                         ▼                ├─ /mission
┌─────────────────┐   ┌─────────────────┐      ├─ /unique
│ Desktop Engine  │   │  Mobile Engine  │      ├─ /pillars
│  (WorksWheel)   │   │(MobileRotaryDial│      ├─ /events
│ 3D Drum & Ring  │   │  Curved Dial)   │      ├─ /team
└─────────────────┘   └─────────────────┘      └─ /rank
```

---

## 🗂️ Repository Directory Structure

```
INVICTORS-/
├── app/                              # Next.js App Router root
│   ├── layout.tsx                    # Global wrapper, font optimization (Orbitron, Rajdhani)
│   ├── globals.css                   # Global styles, Tailwind directives, custom tokens
│   ├── page.tsx                      # Main Home Page (100dvh Single-frame dashboard)
│   ├── loading.tsx                   # Suspense loading state
│   ├── error.tsx                     # Error boundary component
│   ├── not-found.tsx                 # Custom 404 page
│   │
│   ├── api/                          # Backend API Route Handlers
│   │   └── intro-video/route.ts      # Chunked streaming video delivery endpoint
│   │
│   ├── (Sub-Dashboards & Routes)/
│   │   ├── overview/page.tsx         # Executive club overview, stats & vision
│   │   ├── mission/page.tsx          # GSAP + Lenis horizontal timeline dashboard
│   │   ├── unique/page.tsx           # Differentiation & competitive comparison
│   │   ├── pillars/page.tsx          # Technical & professional club pillars
│   │   ├── events/page.tsx           # Signature events & hackathons showcase
│   │   ├── team/page.tsx             # HOD, Faculty Coordinators & Core Committee
│   │   └── rank/page.tsx             # Academic and competition leaderboard
│   │
├── components/                       # Shared UI & Layout Components
│   ├── dashboard-wrapper.tsx         # Dynamic dashboard switcher (Desktop vs Mobile)
│   ├── header.tsx                    # Global top navigation bar & institutional identity
│   ├── floating-socials.tsx          # Brand social channels bar (Instagram, LinkedIn, Gmail)
│   ├── footer.tsx                    # Standard page footer
│   ├── page-shell.tsx                # Reusable container shell for subpages
│   ├── team-modal.tsx                # Quick-access modal for team & membership
│   ├── neural-background.tsx         # Animated canvas/SVG cyber matrix background
│   ├── intro-video.tsx               # Cinematic startup intro video player
│   ├── intro-animation.tsx           # 5-stage SVG/CSS intro animation sequence
│   ├── card-art.tsx                  # Bespoke SVG circuit/forensic panels for cards
│   ├── debug-overlay.tsx             # Visual dev grid & concentric alignment overlay
│   ├── theme-provider.tsx            # Forced dark mode theme provider
│   │
│   ├── ui/                           # Primitive & Interactive Dashboard UI components
│   │   ├── works-wheel.tsx           # Desktop 3D Rotational Drum & Ring dashboard engine
│   │   ├── mobile-rotary-dial.tsx    # Mobile rotary dial curved disk engine
│   │   ├── wheel-carousel.tsx        # Mobile carousel fallback engine
│   │   ├── timeline.tsx              # GSAP horizontal scrub timeline engine
│   │   └── button.tsx                # Reusable accessible button primitive
│   │
│   └── decor/                        # Dashboard Decorative Accents & SVG Art
│       ├── CircuitSide.tsx           # Cybernetic PCB circuit trace graphics
│       └── ForensicSide.tsx          # Digital forensic scan and fingerprint lines
│
├── lib/                              # Data Sources, Configurations & Utilities
│   ├── content.ts                    # Single typed source of truth for text & metadata
│   ├── team-data.ts                  # Faculty & student committee profiles
│   ├── membership-config.ts          # Google Form URL & recruitment settings
│   ├── intro-config.ts               # Video/animation intro toggles & timing
│   ├── dial-sound.ts                 # Web Audio API rotary click sound synthesizer
│   ├── smooth-damp.ts                # Physics dampening mathematical utilities
│   └── utils.ts                      # Tailwind clsx/twMerge utility (cn)
│
├── public/                           # Static assets served at root
│   ├── assets/                       # Club logos, backgrounds, and badges
│   └── favicon.ico                   # Club favicon
│
└── scripts/                          # Build, verification & helper scripts
```

---

## 🖥️ Dashboard Breakdown

### 1. The Main Dashboard (`app/page.tsx`)
- **Container**: `100dvh` viewport, `overflow: hidden` on both `html` and `body` while mounted to ensure zero scroll.
- **Dynamic Switcher** (`components/dashboard-wrapper.tsx`):
  - **Desktop (>= 1024px)**: Renders `components/ui/works-wheel.tsx`.
    - **Resting State (`turn = 0`)**: Symmetrical circular ring of 6 cards with central INVICTORS emblem and motto. Right-hand index is hidden.
    - **Expanded Drum State (`turn > 0`)**: Cards transition into a 3D cylindrical drum. Right-hand gold index smoothly appears.
  - **Mobile (< 1024px)**: Renders `components/ui/mobile-rotary-dial.tsx`.
    - Arc-based rotary dial on the left edge with touch gestures, momentum physics, and haptic feedback.
    - Centered emblem with glowing gold halo and thumb-reach navigation trigger.

### 2. Subpage Dashboards (`app/[route]/page.tsx`)
Every subpage uses `components/page-shell.tsx` to maintain unified layout, styling, and navigation:

| Route | Dashboard Name | Primary Component / Technology | Data Source |
|---|---|---|---|
| `/overview` | Executive Overview | `app/overview/page.tsx` + `card-art.tsx` | `lib/content.ts` (`OVERVIEW_CONTENT`) |
| `/mission` | Mission & Timeline | `app/mission/page.tsx` + `ui/timeline.tsx` (GSAP + Lenis) | `lib/content.ts` (`MISSION_CONTENT`) |
| `/unique` | Competitive Edge | `app/unique/page.tsx` | `lib/content.ts` (`UNIQUE_CONTENT`) |
| `/pillars` | Core Pillars | `app/pillars/page.tsx` | `lib/content.ts` (`PILLARS_CONTENT`) |
| `/events` | Signature Events | `app/events/page.tsx` | `lib/content.ts` (`SIGNATURE_EVENTS`) |
| `/team` | Leadership & Committee | `app/team/page.tsx` | `lib/team-data.ts` |
| `/rank` | Leaderboard | `app/rank/page.tsx` | `lib/content.ts` (`RANK_PAGE_CONTENT`) |

---

## 🔄 Making Updates: Developer Guide

### Updating Text, Stats & Event Details
> **Do not edit UI components directly for text changes.**
1. Open [`lib/content.ts`](file:///lib/content.ts).
2. Locate the corresponding section (`OVERVIEW_CONTENT`, `MISSION_CONTENT`, `SIGNATURE_EVENTS`, etc.).
3. Edit the strings or arrays. Both desktop and mobile dashboards update automatically.

### Updating Faculty & Student Committee
1. Open [`lib/team-data.ts`](file:///lib/team-data.ts).
2. Update `FACULTY_COORDINATORS` or `CORE_COMMITTEE`.
3. The `/team` page and `components/team-modal.tsx` will reflect the changes instantly.

### Updating the Membership Google Form Link
1. Open [`lib/membership-config.ts`](file:///lib/membership-config.ts).
2. Change `MEMBERSHIP_GOOGLE_FORM_URL` to the new Google Form URL.

### Modifying Social Links or Social Bar
1. Open [`components/floating-socials.tsx`](file:///components/floating-socials.tsx).
2. Adjust the links or styling in the `socials` array.

---

## 🛠️ Verification & Build Commands

Always run a production build test before pushing code:

```bash
# Check code formatting & TypeScript compilation
npm run build

# Run local development server
npm run dev

# Run local network development server (for testing on mobile)
npm run dev:lan
```
