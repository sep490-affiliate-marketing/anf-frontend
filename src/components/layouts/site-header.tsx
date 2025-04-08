"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { Bell, ChevronDown, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import UserAvatar from "@/components/layouts/user-avatar"

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

export function SiteHeader() {
  const [activeTab, setActiveTab] = useState("overview")
  const [scrollState, setScrollState] = useState({ y: 0, isScrollingUp: false })
  const lastScrollY = useRef(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const isScrollingUp = currentScrollY < lastScrollY.current

    setScrollState({ y: currentScrollY, isScrollingUp })
    lastScrollY.current = currentScrollY
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    const onScroll = () => {
      if (!rafId) {
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

  const headerOpacity = useMemo(
    () => mapRange(scrollY, 0, isScrollingUp ? 40 : 60, 1, 0),
    [scrollY, isScrollingUp]
  )

  const navX = useMemo(
    () => mapRange(scrollY, 0, isScrollingUp ? 40 : 60, 0, 42),
    [scrollY, isScrollingUp]
  )

  const logoOpacity = useMemo(
    () =>
      mapRange(scrollY, isScrollingUp ? 10 : 20, isScrollingUp ? 40 : 60, 0, 1),
    [scrollY, isScrollingUp]
  )

  const topHeaderStyle = useMemo(
    (): React.CSSProperties => ({
      opacity: headerOpacity,
      height: headerOpacity < 0.05 ? 0 : 56,
      overflow: "hidden",
      pointerEvents: headerOpacity < 0.1 ? "none" : "auto",
    }),
    [headerOpacity]
  )

  const navStyle = useMemo(
    () => ({
      transform: `translateX(${navX}px)`,
      transition: "transform 0.2s ease-out",
    }),
    [navX]
  )

  const logoStyle = useMemo(
    () => ({
      opacity: logoOpacity,
      transition: "opacity 0.2s ease-out",
    }),
    [logoOpacity]
  )

  const navItems = ["Overview", "Campaigns", "Analytics", "Settings"]

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col bg-white">
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-6 transition-all duration-200 will-change-[opacity,height]"
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
          <UserAvatar />
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
