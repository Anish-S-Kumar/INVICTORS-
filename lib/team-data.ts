/**
 * INVICTORS CLUB — LEADERSHIP & COMMITTEE DATA
 * Department of Computer Science & Engineering | VVCE Mysuru
 * 
 * Edit names, designations, and roles here as needed.
 */

export interface FacultyCoordinator {
  id: string
  name: string
  role: string
  designation: string
  department: string
  email?: string
  badge?: string
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
    id: "fac-1",
    name: "Dr. Paramesha K",
    role: "Chief Patron & Head of Department",
    designation: "Professor & Head",
    department: "Department of Computer Science & Engineering",
    badge: "HOD, Dept. of CSE",
  },
  {
    id: "fac-2",
    name: "Faculty Coordinator",
    role: "Chief Faculty Coordinator",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    badge: "Faculty Lead",
  },
  {
    id: "fac-3",
    name: "Faculty Co-Coordinator",
    role: "Faculty Co-Coordinator & Mentor",
    designation: "Assistant Professor",
    department: "Department of Computer Science & Engineering",
    badge: "Faculty Mentor",
  },
]

export const CORE_COMMITTEE: CoreTeamMember[] = [
  {
    id: "core-1",
    name: "Student Lead",
    role: "President",
    subRole: "Club Head & Strategic Lead",
    domain: "Executive Leadership",
    department: "Dept. of Computer Science & Engineering",
    badge: "President",
    iconName: "Shield",
  },
  {
    id: "core-2",
    name: "Student Co-Lead",
    role: "Vice President",
    subRole: "Operations & Governance",
    domain: "Operations & Management",
    department: "Dept. of Computer Science & Engineering",
    badge: "Vice President",
    iconName: "Award",
  },
  {
    id: "core-3",
    name: "Technical Lead",
    role: "Technical Head",
    subRole: "Competitive Coding, CTFs & AI",
    domain: "Technical & Development",
    department: "Dept. of Computer Science & Engineering",
    badge: "Tech Lead",
    iconName: "Terminal",
  },
  {
    id: "core-4",
    name: "Events Lead",
    role: "Events & Logistics Head",
    subRole: "Experiential Challenges & Fest",
    domain: "Events & Execution",
    department: "Dept. of Computer Science & Engineering",
    badge: "Events Lead",
    iconName: "Calendar",
  },
  {
    id: "core-5",
    name: "Creative Lead",
    role: "Design & Media Head",
    subRole: "UI/UX, Branding & Visual Media",
    domain: "Design & Creative Media",
    department: "Dept. of Computer Science & Engineering",
    badge: "Creative Lead",
    iconName: "Wand2",
  },
  {
    id: "core-6",
    name: "Outreach Lead",
    role: "PR & Sponsorship Head",
    subRole: "Corporate Linkages & Publicity",
    domain: "Public Relations & Outreach",
    department: "Dept. of Computer Science & Engineering",
    badge: "PR & Outreach",
    iconName: "Megaphone",
  },
  {
    id: "core-7",
    name: "Web & Platform Lead",
    role: "Webmaster & Platforms Head",
    subRole: "Digital Infrastructure & Systems",
    domain: "Digital Systems",
    department: "Dept. of Computer Science & Engineering",
    badge: "Webmaster",
    iconName: "Code",
  },
]
