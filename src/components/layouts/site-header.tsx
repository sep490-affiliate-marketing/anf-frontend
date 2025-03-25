"use client"

import {
  BellIcon,
  GridIcon,
  HelpCircleIcon,
  Settings2Icon,
  SidebarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

import { SearchForm } from "@/components/layouts/search-form"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-4 2xl:px-6">
        {/* Left section with search */}
        <div className="flex items-center gap-3">
          <Button
            className="size-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>

        {/* Right section with actions */}
        <div className="flex items-center gap-3">
          <SearchForm className="hidden w-[500px] lg:block" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-9">
              <GridIcon className="size-[18px] text-muted-foreground" />
            </Button>

            <Button variant="ghost" size="icon" className="size-9">
              <HelpCircleIcon className="size-[18px] text-muted-foreground" />
            </Button>

            <Button variant="ghost" size="icon" className="size-9">
              <BellIcon className="size-[18px] text-muted-foreground" />
            </Button>

            <Button variant="ghost" size="icon" className="size-9">
              <Settings2Icon className="size-[18px] text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
