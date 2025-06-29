"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Copy } from "lucide-react"
import Link from "next/link"

// Sample project data - in a real app this would come from an API or database
const projectsData = [
  {
    id: "proj-001",
    projectName: "E-commerce Platform",
    projectClient: "TechCorp Inc.",
    projectId: "ECOM-2024-001",
    description: "A comprehensive e-commerce platform with advanced features including inventory management, payment processing, and analytics dashboard.",
    status: "In Progress",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    budget: "$150,000",
    team: ["John Smith", "Sarah Johnson", "Mike Davis"],
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "proj-002",
    projectName: "Mobile Banking App",
    projectClient: "FinanceBank Ltd.",
    projectId: "MOB-2024-002",
    description: "Secure mobile banking application with biometric authentication, real-time transactions, and financial planning tools.",
    status: "Completed",
    startDate: "2023-09-01",
    endDate: "2024-02-28",
    budget: "$200,000",
    team: ["Alex Chen", "Emily Wilson", "David Brown"],
    technologies: ["React Native", "Firebase", "Stripe", "Google Cloud"],
  },
  {
    id: "proj-003",
    projectName: "Healthcare Dashboard",
    projectClient: "MediCare Solutions",
    projectId: "HC-2024-003",
    description: "Healthcare analytics dashboard for patient monitoring, treatment tracking, and medical data visualization.",
    status: "Planning",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    budget: "$120,000",
    team: ["Lisa Wang", "Tom Anderson", "Rachel Green"],
    technologies: ["Vue.js", "Python", "MongoDB", "Azure"],
  },
  {
    id: "proj-004",
    projectName: "Inventory Management System",
    projectClient: "RetailPlus Corp.",
    projectId: "INV-2024-004",
    description: "Comprehensive inventory management system with barcode scanning, automated reordering, and warehouse optimization.",
    status: "In Progress",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    budget: "$180,000",
    team: ["Chris Lee", "Maria Garcia", "James Wilson"],
    technologies: ["Angular", "Java", "MySQL", "Docker"],
  },
  {
    id: "proj-005",
    projectName: "Customer Support Portal",
    projectClient: "ServiceHub LLC",
    projectId: "CSP-2024-005",
    description: "Multi-channel customer support portal with ticket management, live chat, and knowledge base integration.",
    status: "Completed",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    budget: "$90,000",
    team: ["Anna Kim", "Robert Taylor", "Jennifer Lopez"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Vercel"],
  },
  {
    id: "proj-006",
    projectName: "Analytics Dashboard",
    projectClient: "DataInsight Pro",
    projectId: "AD-2024-006",
    description: "Real-time analytics dashboard with data visualization, custom reports, and predictive analytics capabilities.",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-05-31",
    budget: "$160,000",
    team: ["Kevin Zhang", "Sophie Martin", "Daniel White"],
    technologies: ["React", "D3.js", "Python", "PostgreSQL"],
  },
  {
    id: "proj-007",
    projectName: "Learning Management System",
    projectClient: "EduTech Academy",
    projectId: "LMS-2024-007",
    description: "Comprehensive learning management system with course creation, student tracking, and assessment tools.",
    status: "Planning",
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    budget: "$140,000",
    team: ["Amanda Foster", "Brian Clark", "Nicole Rodriguez"],
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
  },
  {
    id: "proj-008",
    projectName: "Real Estate Platform",
    projectClient: "PropertyMax Realty",
    projectId: "REP-2024-008",
    description: "Real estate platform with property listings, virtual tours, mortgage calculator, and agent management.",
    status: "In Progress",
    startDate: "2024-02-15",
    endDate: "2024-08-15",
    budget: "$220,000",
    team: ["Mark Thompson", "Jessica Adams", "Ryan Miller"],
    technologies: ["React", "GraphQL", "MongoDB", "AWS"],
  },
]

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = React.use(params)
  const project = projectsData.find(p => p.id === resolvedParams.id)

  if (!project) {
    notFound()
  }

  const copyProjectId = () => {
    navigator.clipboard.writeText(project.projectId)
  }

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/questionnaire">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-semibold">{project.projectName}</h1>
                <p className="text-gray-600">Project ID: {project.projectId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyProjectId}>
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Project Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="text-lg">{project.projectClient}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Budget</label>
                  <p className="text-lg font-semibold">{project.budget}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Timeline</label>
                  <p className="text-sm">{project.startDate} - {project.endDate}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          </div>

          {/* Team and Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <div className="space-y-2">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 