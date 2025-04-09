"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckCircle, ExternalLink, LineChart } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"

export function NavReports() {
  const pathname = usePathname()

  const reportItems = [
    {
      title: "All Reports",
      url: "/reports",
      icon: LineChart,
      isActive: pathname === "/reports",
    },
    {
      title: "Campaign Reports",
      url: "/reports/campaign",
      icon: BarChart3,
      isActive: pathname === "/reports/campaign",
    },
    {
      title: "Click Reports",
      url: "/reports/clicks",
      icon: ExternalLink,
      isActive: pathname === "/reports/clicks",
    },
    {
      title: "Conversion Reports",
      url: "/reports/conversions",
      icon: CheckCircle,
      isActive: pathname === "/reports/conversions",
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Reports</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {reportItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                className={item.isActive ? "text-primary" : ""}
              >
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
