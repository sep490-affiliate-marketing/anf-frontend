"use client"

import Image from "next/image"
import Link from "next/link"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { Bell } from "lucide-react"

import { IUser } from "@/types/user.type"

import { Button } from "@/components/ui/button"

import { NavLink } from "@/components/layouts/nav-link"

import UserAvatarButton from "./user-avatar-button"

// Define the navigation item interface
interface NavItem {
  title: string
  url: string
  matchPattern?: string
  roles?: UserRoleEnum[]
}

export function SiteHeader() {
  const { user, isLoadingUser } = useAuth()
  const accessibleRoutes = getAccessibleRoutes(user, isLoadingUser)

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-70"
          >
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>

          <nav className="flex h-full items-center">
            {accessibleRoutes.map((item) => (
              <NavLink
                key={item.title}
                href={item.url}
                exact={false}
                matchPattern={item.matchPattern}
                roles={item.roles}
                className=""
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
          >
            <Bell className="size-5" />
          </Button>
          <UserAvatarButton />
        </div>
      </div>
      <div className="h-px w-full bg-gray-200"></div>
    </header>
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
    {
      title: "Transactions",
      url: "/transactions",
      matchPattern: "transactions",
      roles: [UserRoleEnum.ADVERTISER, UserRoleEnum.PUBLISHER],
    },
    {
      title: "Tickets",
      url: "/tickets",
      matchPattern: "tickets",
    },

    {
      title: "Profile",
      url: "/profile",
      matchPattern: "profile",
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
