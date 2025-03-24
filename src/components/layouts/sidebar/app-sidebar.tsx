"use client"

import * as React from "react"

import Link from "next/link"

import {
  BarChart3,
  Command,
  Globe2,
  LayoutDashboard,
  LifeBuoy,
  Network,
  Radio,
  Send,
  Target,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/layouts/sidebar/nav-main"
import { NavProjects } from "@/components/layouts/sidebar/nav-projects"
import { NavSecondary } from "@/components/layouts/sidebar/nav-secondary"
import { NavUser } from "@/components/layouts/sidebar/nav-user"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Campaigns",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "All Campaigns",
          url: "/admin/campaigns",
        },
        {
          title: "Campaign Verification",
          url: "/admin/campaigns?status=1",
        },
      ],
    },
    {
      title: "Countries",
      url: "#",
      icon: Globe2,
      items: [
        {
          title: "Add Country",
          url: "/admin/countries/create",
        },
        {
          title: "All Countries",
          url: "/admin/countries",
        },
      ],
    },
    {
      title: "Carriers",
      url: "#",
      icon: Radio,
      items: [
        {
          title: "Add Carrier",
          url: "/admin/carriers/create",
        },
        {
          title: "All Carriers",
          url: "/admin/carriers",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Affiliate Source",
      url: "/admin/tracking/affiliate",
      icon: Target,
    },
    {
      name: "Offer Tracking",
      url: "/admin/tracking/offers",
      icon: BarChart3,
    },
    {
      name: "Postbacks",
      url: "/admin/tracking/postbacks",
      icon: Network,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Affiliate Network
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
