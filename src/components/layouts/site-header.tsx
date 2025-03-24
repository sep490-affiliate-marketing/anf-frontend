"use client"

import Link from "next/link"

import {
  BellIcon,
  Command,
  GridIcon,
  HelpCircleIcon,
  Settings2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

import { SearchForm } from "@/components/layouts/search-form"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-4 2xl:px-6">
        {/* Left section with search */}
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Affiliate Network</span>
              <span className="truncate text-xs">Enterprise</span>
            </div>
          </Link>
        </div>

        {/* Right section with actions */}
        <div className="flex items-center gap-3">
          <SearchForm className="w-[500px]" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={toggleSidebar}
            >
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
