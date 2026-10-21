# INVICTORS — Official Student Club Website (v2)
### Department of Computer Science & Engineering | Vidyavardhaka College of Engineering, Mysuru

> **"Unravel the Clues. Hack the Rules. Build the Future."**  
> *Motto: DECODE. INNOVATE. OVERCOME.*

An award-winning, cinematic, fully responsive web application engineered for the **INVICTORS** student club. Built with deliberate, non-compromised distinct dashboard architectures for Desktop (3D Rotational Drum & Ring Wheel) and Mobile (Curved Roll-down Left Disk with Centered Hero Logo).

---

## 🌟 Key Highlights & Architectural Features

1. **Horizontal Scroll Timeline on Mission Page (`/mission`)**
   - **Hyperiux Timeline Engine**: Horizontal scroll driven by vertical page scroll using GSAP `ScrollTrigger` with `scrub: 1` and smoothed with `Lenis`.
   - **Milestones 00–05**:
     * `00`: Core Motto & Official Slogan
     * `01`: Unconventional Pedagogy
     * `02`: Practical Deconstruction
     * `03`: Sustainable Innovation
     * `04`: Next-Gen Skill Adaptation
     * `05`: Industry Connection
   - **Dynamic Reveal & Circuit Stems**: As each milestone crosses the viewport center, its vertical circuit stem draws itself down to the gold rail, and the milestone node pulses with gold glow.
   - **Reduced Motion Fallback**: Fully accessible fallback to a clean static stacked list without scrubbing when `prefers-reduced-motion` is detected.
   - **Lifecycle Isolation**: `Lenis` and `ScrollTrigger` instances are scoped strictly to the `/mission` component lifecycle, cleanly killed and reverted on unmount.

2. **One-Frame Main Page (No Page Scroll)**
   - The `/` route fits in exactly one viewport (`100dvh`) with `overflow: hidden` on both `html` and `body` while mounted.
   - Fixed 3-row layout: slim header, flexible dashboard stage (`flex-1 min-h-0`), and a single-line footer overlaid at the bottom so it adds zero height.
   - Tested across all breakpoints (1366x768, 1440x900, 1920x1080, 360x640, 390x844, 430x932, and landscape mobile) with zero page scrolling.
   - Wheel gesture on desktop turns the wheel only (`preventDefault` on wheel events) and is clamped between the ring (`turn = 0`) and the last card.

3. **Contextual Navigation (Hidden at Rest)**
   - On laptop, while in the resting circular ring state (`turn = 0`), the right-hand index of card names is completely hidden (`opacity: 0`, `pointer-events: none`).
   - As the wheel opens into the 3D drum (`turn > 0`), the right-hand gold index smoothly fades in (`opacity = clamp(turn, 0, 1)`) and becomes interactive when `m > 0.6`.
   - The central logo and slogan remain prominent in the ring state and fade out as the drum opens.

4. **Title-Only Dashboard Cards**
   - In accordance with clean UI hierarchy, cards in the ring show **only** their short title (e.g. *"Why INVICTORS"*), index number (`01`–`06`), and icon.
   - No descriptions or subtitles are rendered inside the cards on the main dashboard; descriptions appear only on the subpages.
   - Ring radius and card proportions are tuned to guarantee that cards never overlap each other or the central emblem.

5. **Cinematic 5-Stage Intro Animation (`components/intro-animation.tsx`)**
   - **0.0s**: Central gold spark materializes.
   - **0.3s - 1.4s**: SVG gold circular trace (`stroke-dashoffset`) draws itself around the badge; chrome rotating conic-gradient pass; 4 crosshair node dots pop at 12, 3, 6, and 9 o'clock.
   - **1.2s - 2.6s**: High-resolution INVICTORS emblem emerges from radial blur; circuit traces draw in; `010101 // SECURE DECRYPT` binary flicker.
   - **2.4s - 3.4s**: Diagonal specular shine sweep; motto `"DECODE. INNOVATE. OVERCOME."` animates from wide to normal letter-spacing.
   - **3.4s - 4.6s**: Smooth handover into the active dashboard with session persistence (`sessionStorage`), a 1-second delayed **Skip Intro** control, and strict `prefers-reduced-motion` compliance.

6. **Mobile Dashboard Engine (`components/ui/wheel-carousel.tsx` < 1024px)**
   - **Curved Roll-Down Disk**: Positioned on the left edge with continuous infinite wrapping along an arc (apex pointing right towards the center, gold marker dot).
   - **Inertial Momentum & Haptic Snap**: Physics-based scroll and drag with velocity throw, snap dampening, and `navigator.vibrate(8)` tactile pulses.
   - **Centered Hero Centerpiece**: Centered 60–65vw INVICTORS badge with slow breathing gold glow and prominent motto and slogan.
   - **Thumb-Reach Open Button**: Bottom-center tactile pill button (`44px`+ height) for effortless one-handed thumb interaction.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Custom Metallic / Circuit Token Design System
- **Animation**: [GSAP](https://greensock.com/) (ScrollTrigger), [Lenis](https://github.com/darkroomengineering/lenis), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts via `next/font/google` (`Orbitron` for futuristic headings, `Rajdhani` for high-tech body)
- **Theming**: Dark mode forced via `next-themes`

---

## 📂 Project Structure

```
INVICTORS-/
├── app/
│   ├── layout.tsx            # Global metadata, fonts (Orbitron + Rajdhani), theme provider
│   ├── globals.css           # Design tokens, gold/silver gradients, circuit SVG background
│   ├── page.tsx              # Main page (100dvh single frame, Intro + DashboardWrapper)
│   ├── overview/page.tsx     # /overview route
│   ├── mission/page.tsx      # /mission route (Horizontal Scroll Timeline)
│   ├── unique/page.tsx       # /unique route
│   ├── pillars/page.tsx      # /pillars route
│   ├── events/page.tsx       # /events route
│   └── rank/page.tsx         # /rank route (robots: noindex)
├── components/
│   ├── header.tsx            # Slim header: VVCE logo, centered college/CSE title, CSE logo
│   ├── footer.tsx            # Club proposal footer & metadata
│   ├── intro-animation.tsx   # 5-stage cinematic entrance
│   ├── card-art.tsx          # Bespoke SVG circuit/forensic panels for cards
│   ├── dashboard-wrapper.tsx # Hydration-safe desktop/mobile layout switch
│   └── ui/
│       ├── timeline.tsx      # Horizontal-scroll GSAP + Lenis timeline
│       ├── works-wheel.tsx   # Desktop 3D drum & ring engine (clamped, title-only)
│       ├── wheel-carousel.tsx# Mobile left-curved roll-down disk engine
│       └── button.tsx        # shadcn button component
├── lib/
│   ├── content.ts            # Single typed source-of-truth for all proposal content
│   └── utils.ts              # cn helper (clsx + tailwind-merge)
└── public/
    ├── assets/
    │   ├── invictors-logo.png# INVICTORS high-resolution circular badge
    │   ├── college-logo.png  # Vidyavardhaka College of Engineering emblem
    │   └── cse-logo.png      # Dept. of CSE hexagonal logo
    ├── favicon.ico           # Multi-resolution club favicon
    ├── apple-touch-icon.png  # Apple touch icon
    └── og-image.png          # Social preview OpenGraph image (1200x630)
```

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <repo-url>
cd INVICTORS-

# Install dependencies
npm install
```

### 2. Running Locally (Development Mode)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm run start
```

---

## 📱 OPEN ON YOUR PHONE (Mobile & Local Network Testing)

Follow these steps to access and test the website directly from an Android or iOS smartphone over your local Wi-Fi:

### Step 1: Connect to the Same Wi-Fi
Ensure your phone and computer are connected to the exact same Wi-Fi network. For testing:
- Temporarily disable VPNs, mobile data (cellular), and custom Private DNS on your phone.

### Step 2: Start the LAN Development Server
Run the LAN-enabled dev script:
```bash
npm run dev:lan
```
The terminal will automatically detect your private IPv4 address (e.g. `http://192.168.1.7:3000`) and render an interactive ASCII QR code directly in the terminal!

### Step 3: Open in Chrome Address Bar or Scan QR Code
- Scan the printed QR code using your phone's camera app.
- **OR** open Chrome on your phone, tap the **top URL / ADDRESS BAR** (not the in-page Google search widget), type `http://<your-lan-ip>:3000`, and tap Go.

### Step 4: Troubleshooting Connection Timeouts
If the page times out or fails to load on your phone:
1. **Windows Firewall Rule**: Run PowerShell as Administrator and allow incoming connections on port 3000:
   ```powershell
   netsh advfirewall firewall add rule name="Next3000" dir=in action=allow protocol=TCP localport=3000
   ```
2. **Network Profile**: Ensure your Windows network connection is set to **Private Network** (not Public).
3. **Router AP Isolation**: Ensure your Wi-Fi router does not have "AP Isolation", "Client Isolation", or "Guest Network" enabled, which blocks device-to-device communication.
4. **macOS**: When prompted, allow incoming network connections for Node.js.

### Step 5: High-Performance Production Preview on Mobile
To test 60fps animations and smooth physics on mobile without dev-mode overhead:
```bash
npm run preview:lan
```

### Step 6: College Wi-Fi / Restricted Networks (Cloudflare Tunnel & ngrok)
If you are on a university or campus network that strictly blocks device-to-device communication:
```bash
# Using Cloudflare Tunnel (Free, no account needed)
npx cloudflared tunnel --url http://localhost:3000

# OR using ngrok
npx ngrok http 3000
```
Open the generated HTTPS URL on your phone!

---


## 🖼️ Where to Drop / Replace Logo Assets

If you wish to update or swap any of the official crests, replace the files directly inside `/public/assets/`:

1. **Club Emblem**:  
   `/public/assets/invictors-logo.png`  
   *(Circular badge on black background, high resolution 1024x1024 recommended)*

2. **College Crest**:  
   `/public/assets/college-logo.png`  
   *(Vidyavardhaka College of Engineering gear emblem with transparent background)*

3. **CSE Department Logo**:  
   `/public/assets/cse-logo.png`  
   *(Hexagonal "CS" Dept. of CSE logo with transparent background)*

---

## 📝 How to Edit Club Content

All text, pillars, events, mission statements, comparisons, and numbers live in **a single typed file**:  
[`/lib/content.ts`](file:///lib/content.ts)

To modify any copy:
1. Open `/lib/content.ts`.
2. Edit the corresponding typed object (`CLUB_METADATA`, `OVERVIEW_CONTENT`, `MISSION_CONTENT`, `UNIQUE_CONTENT`, `PILLARS_CONTENT`, `SIGNATURE_EVENTS`, `INVICTUS_FEST`, or `RANK_PAGE_CONTENT`).
3. Changes will instantly update across both desktop and mobile dashboards and all subpages without having to modify UI components.

---

## 🏆 Acceptance Checklist Verification

- [x] **Mission Statement**: Pinned horizontal-scroll timeline with GSAP ScrollTrigger, Lenis smoothing, gold styling, and milestones 00–05.
- [x] **Accessibility**: Reduced-motion fallback to a clean static list without scrubbed animations.
- [x] **One-Frame Main Page**: `/` fits one screen with zero vertical/horizontal scroll on all viewports (1366x768 to 1920x1080 and mobile).
- [x] **Contextual Navigation**: Right-hand navigation index is hidden in the resting ring state and fades in smoothly as the drum opens.
- [x] **Title-Only Cards**: Main page cards show only titles, numbers, and icons (no descriptions anywhere on the dashboard).
- [x] **Memory & Performance**: Lenis and ScrollTrigger instances cleanly destroyed on unmount; zero console or hydration errors.
- [x] **Production Build**: `npm run build` passes with zero errors.
