"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { Bell, ChevronDown, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

// NavLink component replacing the TabsTrigger
interface NavLinkProps {
  active?: boolean
  children: React.ReactNode
  href: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

const NavLink = ({
  active,
  children,
  className,
  href,
  onClick,
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-12 items-center px-4 text-sm font-medium text-gray-600 transition-colors hover:text-primary",
        active &&
          "text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

// Helper function to map a value from one range to another
const mapRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const mappedValue =
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  const largest = Math.max(outMin, outMax)
  const smallest = Math.min(outMin, outMax)
  return Math.min(Math.max(mappedValue, smallest), largest)
}

export function SiteHeader() {
  const [activeTab, setActiveTab] = useState("overview")
  const [scrollY, setScrollY] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Custom scroll handler that's more predictable and performant
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    // Detect scroll direction
    if (currentScrollY < lastScrollY) {
      setIsScrollingUp(true)
    } else if (currentScrollY > lastScrollY) {
      setIsScrollingUp(false)
    }

    setLastScrollY(currentScrollY)
    setScrollY(currentScrollY)
  }, [lastScrollY])

  // Set up scroll listener with requestAnimationFrame
  useEffect(() => {
    let rafId: number | null = null

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll()
          rafId = null
        })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [handleScroll])

  // Compute all the animation values based on scroll position and direction
  const headerOpacity = useMemo(() => {
    if (isScrollingUp) {
      return mapRange(scrollY, 0, 40, 1, 0)
    }
    return mapRange(scrollY, 0, 60, 1, 0)
  }, [isScrollingUp, scrollY])

  const navX = useMemo(() => {
    if (isScrollingUp) {
      return mapRange(scrollY, 0, 40, 0, 42)
    }
    return mapRange(scrollY, 0, 60, 0, 42)
  }, [isScrollingUp, scrollY])

  const logoOpacity = useMemo(() => {
    if (isScrollingUp) {
      return mapRange(scrollY, 10, 40, 0, 1)
    }
    return mapRange(scrollY, 20, 60, 0, 1)
  }, [isScrollingUp, scrollY])

  // Navigation items for the bottom nav
  const navItems = ["Overview", "Campaigns", "Analytics", "Settings"]

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col bg-white">
      {/* Top Navigation - fades out on scroll */}
      <div
        className="flex items-center justify-between px-6 transition-all duration-200"
        style={{
          opacity: headerOpacity,
          height: headerOpacity < 0.05 ? 0 : 56,
          overflow: "hidden",
          pointerEvents: headerOpacity < 0.1 ? "none" : "auto",
        }}
      >
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="flex items-center space-x-2 transition-opacity duration-200 hover:opacity-70"
          >
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
          </Link>
          <div className="group flex cursor-pointer items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="size-5 rounded-full bg-orange-400"></div>
              <span className="text-sm font-medium">L3oN projects</span>
            </div>
            <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              Hobby
            </div>
            <ChevronDown className="size-4 text-gray-500 transition-transform duration-200 group-hover:translate-y-0.5" />
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-normal text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-black"
          >
            Feedback
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-normal text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-black"
          >
            Changelog
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-normal text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-black"
          >
            Help
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-sm font-normal text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-black"
          >
            <span>Docs</span>
            <ExternalLink className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-black"
          >
            <Bell className="size-5" />
          </Button>
          <div className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-sm text-white transition-opacity duration-200 hover:opacity-90">
            L
          </div>
        </div>
      </div>

      {/* Secondary Navigation - slides right on scroll */}
      <div className="flex h-12 items-center border-b border-gray-200 bg-white px-6">
        {/* Logo container - always present but with opacity/scale changes */}
        <div
          className="pointer-events-none absolute left-6 select-none"
          style={{
            opacity: logoOpacity,
            transition: isScrollingUp
              ? "all 0.15s ease-out"
              : "all 0.25s ease-in-out",
          }}
        >
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
        </div>

        {/* Navigation links slide right */}
        <div
          className="flex"
          style={{
            transform: `translateX(${navX}px)`,
            transition: isScrollingUp
              ? "transform 0.15s ease-out"
              : "transform 0.25s ease-in-out",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item}
              href={`#${item.toLowerCase()}`}
              active={activeTab === item.toLowerCase()}
              onClick={(e) => {
                e.preventDefault()
                setActiveTab(item.toLowerCase())
              }}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
