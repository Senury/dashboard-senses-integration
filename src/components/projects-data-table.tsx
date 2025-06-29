"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTable } from "@/components/data-table"

// Sample data for projects
const data: Project[] = [
  {
    id: "proj-001",
    projectName: "E-commerce Platform",
    projectClient: "TechCorp Inc.",
    projectId: "ECOM-2024-001",
  },
  {
    id: "proj-002",
    projectName: "Mobile Banking App",
    projectClient: "FinanceBank Ltd.",
    projectId: "MOB-2024-002",
  },
  {
    id: "proj-003",
    projectName: "Healthcare Dashboard",
    projectClient: "MediCare Solutions",
    projectId: "HC-2024-003",
  },
  {
    id: "proj-004",
    projectName: "Inventory Management System",
    projectClient: "RetailPlus Corp.",
    projectId: "INV-2024-004",
  },
  {
    id: "proj-005",
    projectName: "Customer Support Portal",
    projectClient: "ServiceHub LLC",
    projectId: "CSP-2024-005",
  },
  {
    id: "proj-006",
    projectName: "Analytics Dashboard",
    projectClient: "DataInsight Pro",
    projectId: "AD-2024-006",
  },
  {
    id: "proj-007",
    projectName: "Learning Management System",
    projectClient: "EduTech Academy",
    projectId: "LMS-2024-007",
  },
  {
    id: "proj-008",
    projectName: "Real Estate Platform",
    projectClient: "PropertyMax Realty",
    projectId: "REP-2024-008",
  },
]

export type Project = {
  id: string
  projectName: string
  projectClient: string
  projectId: string
}

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("projectName")}</div>,
  },
  {
    accessorKey: "projectClient",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("projectClient")}</div>,
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("projectId")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.projectId)}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View project details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>Delete project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ProjectsDataTable() {
  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} />
    </div>
  )
} 