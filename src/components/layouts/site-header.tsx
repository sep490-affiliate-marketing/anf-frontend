"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { Bell, ExternalLink } from "lucide-react"

import { IUser } from "@/types/user.type"

import { Button } from "@/components/ui/button"

import { NavLink } from "@/components/layouts/nav-link"
import UserAvatarButton from "@/components/layouts/user-avatar-button"

const mapRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const mappedValue =
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  return Math.min(
    Math.max(mappedValue, Math.min(outMin, outMax)),
    Math.max(outMin, outMax)
  )
}

// Define the navigation item interface
interface NavItem {
  title: string
  url: string
  matchPattern?: string
  roles?: UserRoleEnum[] // Optional array of roles that can see this item
}

export function SiteHeader() {
  const [scrollState, setScrollState] = useState({
    y: 0,
    isScrollingUp: false,
    lastDirectionChangeY: 0,
  })
  const lastScrollY = useRef(0)
  const directionChangeCount = useRef(0)
  const lastDirection = useRef(false)
  const { user, isLoadingUser } = useAuth()

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const previousDirection = lastDirection.current
    const newDirection = currentScrollY < lastScrollY.current

    // Determine if direction has changed
    if (newDirection !== previousDirection) {
      directionChangeCount.current++

      // Only update direction after consistent scrolling in same direction
      // or if we've scrolled more than 8px in the new direction
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)

      if (scrollDelta > 8 || directionChangeCount.current > 3) {
        lastDirection.current = newDirection
        directionChangeCount.current = 0

        setScrollState({
          y: currentScrollY,
          isScrollingUp: newDirection,
          lastDirectionChangeY: currentScrollY,
        })
      } else {
        // Just update position but keep direction stable
        setScrollState((prev) => ({
          ...prev,
          y: currentScrollY,
        }))
      }
    } else {
      // Same direction, reset counter and update normally
      directionChangeCount.current = 0
      setScrollState((prev) => ({
        ...prev,
        y: currentScrollY,
        isScrollingUp: newDirection,
      }))
    }

    lastScrollY.current = currentScrollY
  }, [])

  useEffect(() => {
    let rafId: number | null = null
    let lastExecutionTime = 0
    const THROTTLE_MS = 16 // ~60fps

    const onScroll = () => {
      const now = Date.now()

      if (!rafId && now - lastExecutionTime >= THROTTLE_MS) {
        lastExecutionTime = now
        rafId = requestAnimationFrame(() => {
          handleScroll()
          rafId = null
        })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [handleScroll])

  const { y: scrollY, isScrollingUp } = scrollState

  // More gradual thresholds with wider ranges
  const HEADER_MIN_SCROLL = 0
  const HEADER_MAX_SCROLL = isScrollingUp ? 60 : 80

  const LOGO_MIN_SCROLL = isScrollingUp ? 20 : 30
  const LOGO_MAX_SCROLL = isScrollingUp ? 60 : 80

  const headerOpacity = useMemo(
    () => mapRange(scrollY, HEADER_MIN_SCROLL, HEADER_MAX_SCROLL, 1, 0),
    [scrollY, isScrollingUp]
  )

  const navX = useMemo(
    () => mapRange(scrollY, HEADER_MIN_SCROLL, HEADER_MAX_SCROLL, 0, 42),
    [scrollY, isScrollingUp]
  )

  const logoOpacity = useMemo(
    () => mapRange(scrollY, LOGO_MIN_SCROLL, LOGO_MAX_SCROLL, 0, 1),
    [scrollY, isScrollingUp]
  )

  const topHeaderStyle = useMemo(
    (): React.CSSProperties => ({
      opacity: headerOpacity,
      height: headerOpacity < 0.05 ? 0 : 56,
      overflow: "hidden",
      pointerEvents: headerOpacity < 0.1 ? "none" : "auto",
      transition:
        "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [headerOpacity]
  )

  const navStyle = useMemo(
    () => ({
      transform: `translateX(${navX}px)`,
      transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [navX]
  )

  const logoStyle = useMemo(
    () => ({
      opacity: logoOpacity,
      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [logoOpacity]
  )

  const accessibleRoutes = getAccessibleRoutes(user, isLoadingUser)

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col bg-white">
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-6 will-change-[opacity,height]"
        style={topHeaderStyle}
      >
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="flex items-center space-x-2 transition-opacity hover:opacity-70"
          >
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
          </Link>
        </div>
        <div className="flex items-center space-x-1">
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
          <UserAvatarButton />
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="flex h-12 items-center border-b border-gray-200 bg-white px-6">
        <div
          className="pointer-events-none absolute left-6 select-none"
          style={logoStyle}
        >
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
        </div>
        <div className="flex will-change-transform" style={navStyle}>
          {accessibleRoutes.map((item) => (
            <NavLink
              key={item.title}
              href={item.url}
              exact={false}
              matchPattern={item.matchPattern}
              roles={item.roles}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

const getAccessibleRoutes = (
  user: IUser | null,
  isLoadingUser: boolean
): NavItem[] => {
  // If still loading or no user, return empty array
  if (isLoadingUser || !user) {
    return []
  }

  // Define all navigation items
  const navItems: NavItem[] = [
    {
      title: "Overview",
      url: "/",
      matchPattern: "",
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      matchPattern: "campaigns",
    },
    // Admin-only routes
    {
      title: "Carriers",
      url: "/carriers",
      matchPattern: "carriers",
      roles: [UserRoleEnum.ADMIN],
    },
    {
      title: "Countries",
      url: "/countries",
      matchPattern: "countries",
      roles: [UserRoleEnum.ADMIN],
    },
    {
      title: "Tickets",
      url: "/tickets",
      matchPattern: "tickets",
    },
    {
      title: "Withdrawal Requests",
      url: "/withdrawal-requests",
      matchPattern: "withdrawal-requests",
    },
    {
      title: "Settings",
      url: "/settings",
      matchPattern: "settings",
    },
  ]

  // Filter routes based on user role
  return navItems.filter((item) => {
    // If no roles specified, route is accessible to all
    if (!item.roles) {
      return true
    }
    // Check if user's role is included in allowed roles
    return item.roles.includes(user.role)
  })
}
