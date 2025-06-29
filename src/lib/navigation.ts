import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

export const navigationData = [
  {
    title: "Questionnaire",
    url: "/questionnaire",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Management",
        url: "/questionnaire",
      },
    ],
  },
  // {
  //   title: "Models",
  //   url: "#",
  //   icon: Bot,
  //   items: [
  //     {
  //       title: "Genesis",
  //       url: "#",
  //     },
  //     {
  //       title: "Explorer",
  //       url: "#",
  //     },
  //     {
  //       title: "Quantum",
  //       url: "#",
  //     },
  //   ],
  // },
  // {
  //   title: "Documentation",
  //   url: "#",
  //   icon: BookOpen,
  //   items: [
  //     {
  //       title: "Introduction",
  //       url: "#",
  //     },
  //     {
  //       title: "Get Started",
  //       url: "#",
  //     },
  //     {
  //       title: "Tutorials",
  //       url: "#",
  //     },
  //     {
  //       title: "Changelog",
  //       url: "#",
  //     },
  //   ],
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings2,
  //   items: [
  //     {
  //       title: "General",
  //       url: "#",
  //     },
  //     {
  //       title: "Team",
  //       url: "#",
  //     },
  //     {
  //       title: "Billing",
  //       url: "#",
  //     },
  //     {
  //       title: "Limits",
  //       url: "#",
  //     },
  //   ],
  // },
]

export const userData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export const teamsData = [
  {
    name: "Senses-Integration",
    logo: GalleryVerticalEnd,
    plan: "Management",
  },
]

export const projectsData = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
] 