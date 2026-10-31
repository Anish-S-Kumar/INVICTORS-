/**
 * INVICTORS CLUB — LEADERSHIP & COMMITTEE DATA
 * Department of Computer Science & Engineering | VVCE Mysuru
 * 
 * Order of leadership:
 * 1. HOD (Head of Department)
 * 2. Faculty Coordinators
 * 3. Student Coordinators (Core Committee)
 */

export interface FacultyCoordinator {
  id: string
  name: string
  role: string
  designation: string
  department: string
  email?: string
  badge?: string
  initials?: string
  isHOD?: boolean
}

export interface CoreTeamMember {
  id: string
  name: string
  role: string
  subRole?: string
  domain: string
  department: string
  semester?: string
  badge?: string
  iconName?: string
}

export const FACULTY_COORDINATORS: FacultyCoordinator[] = [
  {
    id: "fac-hod",
    name: "Dr. Pooja M R",
    role: "Head of Department (CSE)",
    designation: "Professor & Head",
    department: "Department of Computer Science & Engineering",
    badge: "HOD · Dept. of CSE",
    initials: "PM",
    isHOD: true,
  },
  {
    id: "fac-1",
    name: "Prof. Likitha B",
    role: "Faculty Coordinator",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    badge: "Faculty Coordinator",
    initials: "LB",
  },
  {
    id: "fac-2",
    name: "Prof. Dharmaraj K B",
    role: "Faculty Coordinator",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    badge: "Faculty Coordinator",
    initials: "DK",
  },
  {
    id: "fac-3",
    name: "Prof. Shivani T J",
    role: "Faculty Coordinator",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    badge: "Faculty Coordinator",
    initials: "ST",
  },
]

export const CORE_COMMITTEE: CoreTeamMember[] = [
  {
    id: "core-1",
    name: "AKUL P YADAV",
    role: "President",
    subRole: "Executive Leadership & Society Direction",
    domain: "Executive Leadership",
    department: "Dept. of Computer Science & Engineering",
    badge: "President",
    iconName: "Crown",
  },
  {
    id: "core-2",
    name: "GAGAN S URS",
    role: "Vice President",
    subRole: "Operational Strategy & Club Affairs",
    domain: "Operations & Governance",
    department: "Dept. of Computer Science & Engineering",
    badge: "Vice President",
    iconName: "Award",
  },
  {
    id: "core-3",
    name: "MN SHASHANK",
    role: "Secretary 1",
    subRole: "Administrative Operations & Coordination",
    domain: "Administration",
    department: "Dept. of Computer Science & Engineering",
    badge: "Secretary 1",
    iconName: "FileText",
  },
  {
    id: "core-4",
    name: "VISHNU VARDHANA M",
    role: "Secretary 2",
    subRole: "Internal Governance & Communications",
    domain: "Administration",
    department: "Dept. of Computer Science & Engineering",
    badge: "Secretary 2",
    iconName: "FileText",
  },
  {
    id: "core-5",
    name: "DHANUSH KP",
    role: "Technical Head",
    subRole: "Technical Systems, Hackathons & Dev",
    domain: "Technical & Systems",
    department: "Dept. of Computer Science & Engineering",
    badge: "Technical Head",
    iconName: "Terminal",
  },
  {
    id: "core-6",
    name: "M PUNYA SAGAR",
    role: "Event Management",
    subRole: "Event Execution, Logistics & Planning",
    domain: "Events & Operations",
    department: "Dept. of Computer Science & Engineering",
    badge: "Event Management",
    iconName: "Calendar",
  },
  {
    id: "core-7",
    name: "VANDHANA V",
    role: "Marketing Lead",
    subRole: "Campaigns, Brand Outreach & PR",
    domain: "Marketing & Outreach",
    department: "Dept. of Computer Science & Engineering",
    badge: "Marketing Lead",
    iconName: "Megaphone",
  },
  {
    id: "core-8",
    name: "SKANDA BV RAO",
    role: "Social Media Head",
    subRole: "Digital Presence, Media & Content",
    domain: "Social Media & Media",
    department: "Dept. of Computer Science & Engineering",
    badge: "Social Media Head",
    iconName: "Share2",
  },
  {
    id: "core-9",
    name: "AYUSH P",
    role: "Club Community Lead",
    subRole: "Member Engagement & Community Growth",
    domain: "Community Relations",
    department: "Dept. of Computer Science & Engineering",
    badge: "Community Lead",
    iconName: "Users",
  },
  {
    id: "core-10",
    name: "MN SHASHANK",
    role: "Documentation Head",
    subRole: "Official Records, Reports & Archives",
    domain: "Documentation",
    department: "Dept. of Computer Science & Engineering",
    badge: "Documentation Head",
    iconName: "FileText",
  },
  {
    id: "core-11",
    name: "ABHIRAM BS / ANIRUDDH M",
    role: "R&D Head",
    subRole: "Research, Innovation & Emerging Tech",
    domain: "Research & Development",
    department: "Dept. of Computer Science & Engineering",
    badge: "R&D Head",
    iconName: "Cpu",
  },
  {
    id: "core-12",
    name: "ANISH S KUMAR",
    role: "Analytical Lead",
    subRole: "Data Analytics, Performance & Metrics",
    domain: "Analytics & Strategy",
    department: "Dept. of Computer Science & Engineering",
    badge: "Analytical Lead",
    iconName: "BarChart3",
  },
]
