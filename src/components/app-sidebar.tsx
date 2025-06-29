"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navigationData, userData, teamsData, projectsData } from "@/lib/navigation"

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
