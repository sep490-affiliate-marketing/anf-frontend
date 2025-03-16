"use client"

import * as React from "react"

import {
  AudioWaveform,
  BarChart3,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Globe2,
  LayoutDashboard,
  Map,
  Network,
  PieChart,
  Radio,
  Settings2,
  SquareTerminal,
  Target,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
          url: "/admin/campaign",
        },
        {
          title: "Campaign Verification",
          url: "/admin/campaign/verify",
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
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  trackingSystem: [
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Network className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Affiliate Network</span>
            <span className="truncate text-xs">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.trackingSystem} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
