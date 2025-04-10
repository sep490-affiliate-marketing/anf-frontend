"use client"

import Link from "next/link"

import {
  BarChart3,
  Command,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
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

const advertiserNavData = {
  user: {
    name: "Advertiser User",
    email: "advertiser@example.com",
    avatar: "/avatars/advertiser.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/advertiser",
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
          url: "/advertiser/campaigns",
        },
        {
          title: "Create Campaign",
          url: "/advertiser/campaigns/create",
        },
      ],
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Payment Methods",
          url: "/advertiser/billing/payment-methods",
        },
        {
          title: "Invoices",
          url: "/advertiser/billing/invoices",
        },
      ],
    },
    {
      title: "Settings",
      url: "/advertiser/settings",
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

export function AdvertiserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/advertiser">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Affiliate Network
                  </span>
                  <span className="truncate text-xs">Advertiser Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={advertiserNavData.navMain} />
        <NavReports />
        <NavSecondary
          items={advertiserNavData.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={advertiserNavData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
