"use client"

import { useEffect, useMemo, useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Bell, ChevronDown, ExternalLink, Triangle } from "lucide-react"

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
        "group relative flex h-12 items-center px-4 text-sm font-medium text-gray-600 transition-colors hover:text-black",
        active &&
          "text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black",
        className
      )}
      onClick={onClick}
    >
      {children}
      {!active && (
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gray-300 transition-all duration-200 ease-out group-hover:w-full" />
      )}
    </Link>
  )
}

// Hook to map a value from one range to another (similar to useRange in sample code)
const useRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return useMemo(() => {
    const mappedValue =
      ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    const largest = Math.max(outMin, outMax)
    const smallest = Math.min(outMin, outMax)
    return Math.min(Math.max(mappedValue, smallest), largest)
  }, [value, inMin, inMax, outMin, outMax])
}

export function SiteHeader() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("overview")
  const [scrollY, setScrollY] = useState(0)

  // Calculate header transformations based on scroll position
  const headerOpacity = useRange(scrollY, 0, 50, 1, 0)
  const navX = useRange(scrollY, 0, 50, 0, 42)
  const logoScale = useRange(scrollY, 0, 50, 1, 0.8)
  const logoOpacity = useRange(scrollY, 30, 50, 0, 1)

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Use requestAnimationFrame for smoother updates
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollListener, { passive: true })
    return () => window.removeEventListener("scroll", scrollListener)
  }, [])

  // Navigation items for the bottom nav
  const navItems = [
    "Overview",
    "Integrations",
    "Activity",
    "Domains",
    "Usage",
    "Monitoring",
    "Observability",
    "Storage",
    "Flags",
    "AI",
    "Support",
    "Settings",
  ]

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col bg-white">
      {/* Top Navigation - fades out on scroll */}
      <div
        className="flex items-center justify-between border-b border-gray-100 px-6 transition-all duration-200 ease-out"
        style={{
          opacity: headerOpacity,
          height: `${useRange(headerOpacity, 0, 1, 0, 56)}px`,
          overflow: "hidden",
          visibility: headerOpacity < 0.05 ? "hidden" : "visible",
        }}
      >
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="flex items-center space-x-2 transition-opacity duration-200 hover:opacity-70"
          >
            <Triangle className="size-5 fill-black" />
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
        {/* Logo scales and remains visible when top nav disappears */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginRight: scrollY > 30 ? "1rem" : "0",
            position: "absolute",
            left: "24px", // Same as px-6
            willChange: "transform, opacity", // Optimization for animations
          }}
          className="transition-all duration-200 ease-out"
          aria-hidden={logoOpacity < 0.5 ? "true" : "false"}
        >
          <Triangle className="size-5 fill-black" />
        </div>

        {/* Navigation links slide right */}
        <div
          className="flex transition-transform duration-200 ease-out"
          style={{
            transform: `translateX(${navX}px)`,
            willChange: "transform", // Optimization for animations
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
