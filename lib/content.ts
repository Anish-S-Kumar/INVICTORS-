export interface NavigationCard {
  id: string
  number: string
  title: string
  shortTitle?: string
  subtitle: string
  href: string
  iconName: string
  motif: "compass" | "target" | "fingerprint" | "puzzle" | "calendar" | "trophy"
  description: string
  highlight: string
}

export interface ClubPillar {
  id: string
  number: string
  title: string
  summary: string
  details: string
  iconName: string
  badge: string
}

export interface EventItem {
  id: string
  title: string
  category: string
  description: string
  format: string
  status: string
  iconName: string
}

export interface FestDay {
  day: number
  title: string
  tagline: string
  activities: string[]
  iconName: string
}

export interface ComparisonRow {
  typical: string
  invictors: string
  aspect: string
}

export interface MissionPillar {
  number: string
  title: string
  description: string
  iconName: string
  takeaway: string
}

export const CLUB_METADATA = {
  clubName: "INVICTORS",
  collegeName: "VIDYAVARDHAKA COLLEGE OF ENGINEERING",
  departmentName: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
  academicYear: "ACADEMIC YEAR 2026-27",
  proposalTag: "OFFICIAL STUDENT CLUB PROPOSAL",
  motto: "DECODE. INNOVATE. OVERCOME.",
  slogan: "Unravel the Clues. Hack the Rules. Build the Future.",
  shortDescription: "A revolutionary student club by the Department of Computer Science & Engineering, Vidyavardhaka College of Engineering, transforming abstract engineering into gamified mystery solving, forensic backtracking, and impactful real-world innovation.",
  stats: [
    { value: "100%", label: "Interactive", description: "Hands-on gamified challenges" },
    { value: "6+", label: "Core Pillars", description: "Comprehensive multidisciplinary scope" },
    { value: "12+", label: "Events / Year", description: "Workshops, hackathons & mysteries" },
    { value: "All", label: "Years & Branches", description: "Inclusive to every engineering discipline" },
  ],
  footerText: "INVICTORS Club | Dept. of CSE | Academic Year 2026-27",
}

export const NAVIGATION_CARDS: NavigationCard[] = [
  {
    id: "overview",
    number: "01",
    title: "Club Overview",
    subtitle: "Vision & Philosophy",
    href: "/overview",
    iconName: "Compass",
    motif: "compass",
    description: "Executive vision, experiential tech philosophy, and multidimensional student outcomes.",
    highlight: "Gamified & Impact-Driven Tech",
  },
  {
    id: "mission",
    number: "02",
    title: "Mission Statement",
    subtitle: "Core Mandate",
    href: "/mission",
    iconName: "Target",
    motif: "target",
    description: "Five core pedagogical vectors deconstructing dogma through practical empowerment.",
    highlight: "Decode. Innovate. Overcome.",
  },
  {
    id: "unique",
    number: "03",
    title: "Why INVICTORS Is Unique & Distinct",
    shortTitle: "Why INVICTORS",
    subtitle: "The Paradigm Shift",
    href: "/unique",
    iconName: "Sparkles",
    motif: "fingerprint",
    description: "Direct side-by-side contrast against traditional siloed college technical clubs.",
    highlight: "100% Active Hands-on Learning",
  },
  {
    id: "pillars",
    number: "04",
    title: "Core Club Pillars",
    subtitle: "Architectural Focus",
    href: "/pillars",
    iconName: "Layers",
    motif: "puzzle",
    description: "From murder-mystery cryptography and IoT reverse-labs to neural prompt crafting.",
    highlight: "6 Deep Practical Domains",
  },
  {
    id: "events",
    number: "05",
    title: "Upcoming Events",
    subtitle: "Action & Competitions",
    href: "/events",
    iconName: "CalendarDays",
    motif: "calendar",
    description: "The Code Heist, Data Trace, E-Waste Hackathons, and the 3-day INVICTUS FEST.",
    highlight: "Experiential Flagship Calendar",
  },
  {
    id: "rank",
    number: "06",
    title: "Rank",
    subtitle: "Honor & Leaderboard",
    href: "/rank",
    iconName: "Trophy",
    motif: "trophy",
    description: "The competitive arena where detectives, hackers, and builders rise to glory.",
    highlight: "Coming Soon",
  },
]

export const OVERVIEW_CONTENT = {
  executiveVision: [
    "INVICTORS is a dynamic student club created to revolutionize how technical knowledge is acquired and applied. Standard academic curriculum often emphasizes theoretical abstraction; INVICTORS bridges this gap by rendering complex computing and engineering concepts deeply engaging, creative, and accessible to everyone.",
    "Our philosophy centers on non-conventional learning. By turning coding into mystery-solving riddles, algorithms into forensic investigations, and hardware systems into interactive deconstruction challenges, we cultivate authentic curiosity. Rather than viewing engineering as dry syntax and circuit diagrams, students experience technology as an empowering toolkit for creativity, crime-solving scenarios, real-world sustainability, and impactful problem-solving.",
  ],
  corePhilosophy: {
    title: "Core Philosophy: Gamified & Impact-Driven Tech",
    body: "We transform abstract engineering into gamified adventures, forensic investigations, prompt crafting, hands-on hardware backtracking, and social eco-innovations like e-waste recycling hackathons.",
  },
  studentBenefits: [
    "Elimination of 'code-phobia' through friendly gamified challenges.",
    "Practical hardware-software intuition applicable to capstone projects.",
    "Proficiency in modern tools (GenAI, Cyber Forensics, IoT).",
    "Leadership, team collaboration, and creative problem-solving skills.",
    "Industrial exposure and networking with technical experts.",
  ],
  institutionalOutcomes: [
    "Higher engagement rates across cross-disciplinary departments.",
    "Unique campus culture blending sustainability with technology.",
    "Enhanced portfolio of student eco-innovations & patentable ideas.",
    "Position college as a leader in modern hands-on technical pedagogy.",
  ],
  approvalConclusion:
    "INVICTORS is more than a technical society; it is an incubation ground for curious minds who seek to understand, create, and solve real-world problems through creative engagement. We respectfully request the college administration to grant official approval to launch INVICTORS.",
}

export const MISSION_CONTENT: MissionPillar[] = [
  {
    number: "01",
    title: "Unconventional Pedagogy",
    description: "Teach technical concepts through creative storytelling, puzzle-solving, escape rooms, and gamified challenges.",
    iconName: "Puzzle",
    takeaway: "Story-driven computing mechanics replace sterile lectures.",
  },
  {
    number: "02",
    title: "Practical Deconstruction",
    description: "Foster deep hardware and software intuition by backtracking everyday devices (e.g., decoding embedded systems in daily gadgets).",
    iconName: "Cpu",
    takeaway: "Tear down real circuits to master embedded architecture.",
  },
  {
    number: "03",
    title: "Sustainable Innovation",
    description: "Address pressing real-world issues like e-waste management through creative upcycling hackathons and eco-tech initiatives.",
    iconName: "Leaf",
    takeaway: "Transform discarded silicon into functional engineering prototypes.",
  },
  {
    number: "04",
    title: "Next-Gen Skill Adaptation",
    description: "Pioneer contemporary tech trends including AI prompt engineering, reverse image generation, and forensic data tracing.",
    iconName: "Sparkles",
    takeaway: "Master prompt crafting, neural latent spaces, and memory forensics.",
  },
  {
    number: "05",
    title: "Industry Connection",
    description: "Organize targeted industrial visits and expert interactions to bridge academic theory with real-world corporate execution.",
    iconName: "Building2",
    takeaway: "Direct access to enterprise engineering hubs and industrial facilities.",
  },
]

export const UNIQUE_CONTENT = {
  intro:
    "Traditional technical clubs cater primarily to advanced programmers through rigid coding contests. INVICTORS democratizes tech by making curiosity and logic the entry point for all students, regardless of prior experience.",
  comparisons: [
    {
      aspect: "Learning Format",
      typical: "Theoretical workshops & competitive coding",
      invictors: "Gamified mystery solving, riddles & forensic decoding",
    },
    {
      aspect: "Technical Scope",
      typical: "Focus strictly on software syntax",
      invictors: "Hardware deconstruction & real system backtracking",
    },
    {
      aspect: "Inclusivity & Access",
      typical: "Siloed, technical-only audience",
      invictors: "Creative tech open to all engineering streams & years",
    },
    {
      aspect: "Eco-Awareness",
      typical: "Ignores environmental impact",
      invictors: "E-Waste management & sustainable eco-hackathons",
    },
    {
      aspect: "Curricular Relevance",
      typical: "Conventional event formats",
      invictors: "Cutting-edge trends: AI Prompt Crafting & Data Tracing",
    },
    {
      aspect: "Student Engagement",
      typical: "Passive classroom listener format",
      invictors: "100% active, hands-on interactive participation",
    },
  ],
}

export const PILLARS_CONTENT: ClubPillar[] = [
  {
    id: "interactive-tech",
    number: "01",
    title: "Interactive Tech",
    summary: "Code Logic via Murder Mysteries",
    details: "Learning code logic via murder mystery clues, cryptography puzzles, and escape room challenges.",
    iconName: "Puzzle",
    badge: "Forensic Logic",
  },
  {
    id: "hardware-reverse-lab",
    number: "02",
    title: "Hardware Reverse-Lab",
    summary: "Physical Gadget Deconstruction",
    details: "Deconstructing gadgets (torches, IoT devices) to understand component interaction and design.",
    iconName: "Cpu",
    badge: "Hardware Teardown",
  },
  {
    id: "eco-tech-ewaste",
    number: "03",
    title: "Eco-Tech & E-Waste",
    summary: "Sustainable Hardware Upcycling",
    details: "Transforming electronic waste into functional prototypes and sustainable hackathon builds.",
    iconName: "Leaf",
    badge: "Green Innovation",
  },
  {
    id: "forensic-cyber-trace",
    number: "04",
    title: "Forensic Cyber Trace",
    summary: "Digital Evidence & Log Mining",
    details: "Digging through code logs, memory dumps, and hidden digital evidence to solve cyber mysteries.",
    iconName: "Fingerprint",
    badge: "Cyber Forensics",
  },
  {
    id: "ai-prompt-crafting",
    number: "05",
    title: "AI Prompt Crafting",
    summary: "Precision Neural Generation",
    details: "Mastering prompt engineering to recreate specific complex images and precise neural outputs.",
    iconName: "Sparkles",
    badge: "Generative AI",
  },
  {
    id: "industry-linkage",
    number: "06",
    title: "Industry Linkage",
    summary: "Corporate Tech Park Immersion",
    details: "Field visits to tech parks, industrial labs, and embedded manufacturing facilities.",
    iconName: "Building2",
    badge: "Corporate Bridge",
  },
]

export interface CalendarEvent {
  month: string
  shortMonth: string
  title: string
  category: string
  description: string
  iconName: string
}

export const CALENDAR_EVENTS_2026_27: CalendarEvent[] = [
  {
    month: "October",
    shortMonth: "OCT",
    title: "Technical Events",
    category: "Technical",
    description: "Kick off the academic year with competitive technical challenges and problem-solving events.",
    iconName: "Terminal",
  },
  {
    month: "November",
    shortMonth: "NOV",
    title: "Membership Drive & Events",
    category: "Recruitment",
    description: "Open recruitment drive for new members along with introductory events to showcase the club's culture.",
    iconName: "Users",
  },
  {
    month: "December",
    shortMonth: "DEC",
    title: "Workshop",
    category: "Hands-on Learning",
    description: "Hands-on technical workshop sessions covering emerging technologies and practical skill-building.",
    iconName: "Wrench",
  },
  {
    month: "February",
    shortMonth: "FEB",
    title: "2-Day E-Waste Hackathon",
    category: "Sustainable Innovation",
    description: "A 2-day hackathon where participants build innovative solutions from scavenged e-waste components.",
    iconName: "Recycle",
  },
  {
    month: "March",
    shortMonth: "MAR",
    title: "Workshop",
    category: "Hands-on Learning",
    description: "Advanced workshop sessions bridging academic theory with industry-relevant hands-on projects.",
    iconName: "Cpu",
  },
  {
    month: "April",
    shortMonth: "APRIL",
    title: "Technical Events",
    category: "Technical",
    description: "High-intensity technical competitions including coding challenges, forensics, and AI events.",
    iconName: "Binary",
  },
  {
    month: "May",
    shortMonth: "MAY",
    title: "Industry Visit",
    category: "Corporate Bridge",
    description: "Curated field visits to tech parks, industrial labs, and embedded manufacturing facilities.",
    iconName: "Building2",
  },
]

export const SIGNATURE_EVENTS: EventItem[] = [
  {
    id: "code-heist",
    title: "The Code Heist",
    category: "Murder Mystery & Logic",
    description: "Participants crack encrypted clues, debug scripts left by a fictional suspect, and solve riddles to identify the culprit before time runs out.",
    format: "Timed Team Investigation",
    status: "Dates to be announced",
    iconName: "KeyRound",
  },
  {
    id: "data-trace",
    title: "Data Trace",
    category: "Cyber Forensics",
    description: "A criminal leaves a compromised binary/program. Teams analyze logs, extract hidden strings, and backtrack code to recover stolen data.",
    format: "Binary Backtracking Challenge",
    status: "Dates to be announced",
    iconName: "Binary",
  },
  {
    id: "prompt-craft",
    title: "Prompt Craft",
    category: "Generative AI Challenge",
    description: "Given a complex visual target, participants must craft precise AI prompts to generate an exact matching image, testing modern prompt engineering skills.",
    format: "Reverse Neural Synthesis",
    status: "Dates to be announced",
    iconName: "Wand2",
  },
  {
    id: "deconstruct-decode",
    title: "Deconstruct & Decode",
    category: "Hands-on Workshop",
    description: "Taking apart consumer electronics (e.g., smart torches, sensor nodes) to map their schematics, microcontrollers, and system architecture.",
    format: "Hardware Teardown Lab",
    status: "Dates to be announced",
    iconName: "Wrench",
  },
  {
    id: "ewaste-hackathon",
    title: "E-Waste Hackathon",
    category: "Sustainable Innovation",
    description: "A multi-hour competition where students build innovative tech solutions using scavenged electronic waste components.",
    format: "Hardware Hackathon",
    status: "Dates to be announced",
    iconName: "Recycle",
  },
]

export const INVICTUS_FEST = {
  title: "INVICTUS FEST",
  subtitle: "3-Day Annual Flagship Festival",
  intro: "INVICTORS proposes a signature 3-day annual festival designed to showcase the club's interactive philosophy across campus, engaging students, alumni, and industry pioneers.",
  days: [
    {
      day: 1,
      title: "DECODE & DECONSTRUCT",
      tagline: "Forensic Investigation & Neural Reverse-Engineering",
      activities: [
        "'Data Trace' Cyber Investigation & binary analysis.",
        "Hardware Teardown Station: Analyzing microcontrollers & PCB layouts.",
        "AI 'Prompt Crafting' competitions for visual neural synthesis.",
      ],
      iconName: "Terminal",
    },
    {
      day: 2,
      title: "ECO-HACKATHON & CODE MYSTERY",
      tagline: "Sustainable Upcycling & Narrative Deduction",
      activities: [
        "E-Waste Hackathon: Building functional working models from discarded electronics.",
        "'The Code Heist' murder mystery logic race across campus.",
        "Cross-department team collaboration sprint.",
      ],
      iconName: "Recycle",
    },
    {
      day: 3,
      title: "INDUSTRY CONNECT & SHOWCASE",
      tagline: "Grand Expo, Keynotes & Honors",
      activities: [
        "Project Expo of student e-waste prototypes & innovative builds.",
        "Industrial Visit Keynotes from enterprise engineering leads.",
        "Alumni interactive panel on cutting-edge industry trends.",
        "Grand Awards Ceremony celebrating top solvers and innovators.",
      ],
      iconName: "Award",
    },
  ],
}

export const RANK_PAGE_CONTENT = {
  badge: "COMPETITIVE ARENA",
  title: "COMING SOON",
  subline: "The INVICTORS leaderboard is being forged. Check back soon.",
  details: "The cryptographic challenge matrix, bounty tiers, and detective point-tables will activate upon official club launch.",
}
