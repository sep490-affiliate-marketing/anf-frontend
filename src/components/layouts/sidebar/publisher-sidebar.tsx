"use client"

import Link from "next/link"
import {
  BarChart3,
  Command,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Send,
  Settings,
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
import { NavReports } from "@/components/layouts/sidebar/nav-reports"
import { NavSecondary } from "@/components/layouts/sidebar/nav-secondary"
import { NavUser } from "@/components/layouts/sidebar/nav-user"

const publisherNavData = {
  user: {
    name: "Publisher User",
    email: "publisher@example.com",
    avatar: "/avatars/publisher.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/publisher",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Campaigns",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Browse Campaigns",
          url: "/publisher/campaigns",
        },
        {
          title: "Joined Campaigns",
          url: "/publisher/campaigns/joined",
        },
      ],
    },
    {
      title: "Earnings",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Payment History",
          url: "/publisher/earnings/history",
        },
        {
          title: "Payment Settings",
          url: "/publisher/earnings/settings",
        },
      ],
    },
    {
      title: "Settings",
      url: "/publisher/settings",
      icon: Settings,
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
}

export function PublisherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/publisher">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Affiliate Network
                  </span>
                  <span className="truncate text-xs">Publisher Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={publisherNavData.navMain} />
        <NavReports />
        <NavSecondary items={publisherNavData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={publisherNavData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
