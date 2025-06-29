"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { navigationData } from "@/lib/navigation"

function generateBreadcrumbs(pathname: string) {
  const breadcrumbs = []
  
  // Always start with Home
  breadcrumbs.push({
    title: "Home",
    url: "/",
    isCurrent: pathname === "/",
  })

  // Find the matching navigation item
  const navItem = navigationData.find(item => {
    if (item.url === pathname) return true
    return item.items?.some(subItem => subItem.url === pathname)
  })

  if (navItem && pathname !== "/") {
    // Add the main navigation item
    breadcrumbs.push({
      title: navItem.title,
      url: navItem.url,
      isCurrent: navItem.url === pathname,
    })

    // Add the sub-item if we're on a sub-page
    if (navItem.url !== pathname) {
      const subItem = navItem.items?.find(sub => sub.url === pathname)
      if (subItem) {
        breadcrumbs.push({
          title: subItem.title,
          url: subItem.url,
          isCurrent: true,
        })
      }
    }
  }

  return breadcrumbs
}

export function PageHeader() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.url}>
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumb.isCurrent ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.url}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
} 