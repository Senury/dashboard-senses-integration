"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navigationData } from "@/lib/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center w-full py-6 pl-6">
          <Image src="/logo.svg" alt="Logo" width={120} height={38} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData} />
        {/* <NavProjects projects={projectsData} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
