import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"

import { cn } from "@/lib/utils"

interface NavLinkProps {
  active?: boolean
  children: React.ReactNode
  href: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  exact?: boolean
  matchPattern?: string
  roles?: UserRoleEnum[]
}

export const NavLink = ({
  active: activeProp,
  children,
  className,
  href,
  onClick,
  exact = false,
  matchPattern,
  roles,
}: NavLinkProps) => {
  const { user } = useAuth()
  const pathname = usePathname()

  // If roles are specified and user's role is not in the list, don't render the link
  if (roles && user && !roles.includes(user.role)) {
    return null
  }

  // Get the appropriate route based on user role
  const getRoleBasedRoute = (baseRoute: string): string => {
    if (!user) return href

    // Special case for root route
    if (baseRoute === "/") {
      switch (user.role) {
        case UserRoleEnum.ADVERTISER:
          return "/advertiser"
        case UserRoleEnum.PUBLISHER:
          return "/publisher"
        case UserRoleEnum.ADMIN:
          return "/admin"
        default:
          return "/"
      }
    }

    switch (user.role) {
      case UserRoleEnum.ADVERTISER:
        return `/advertiser${baseRoute}`
      case UserRoleEnum.PUBLISHER:
        return `/publisher${baseRoute}`
      case UserRoleEnum.ADMIN:
        return `/admin${baseRoute}`
      default:
        return href
    }
  }

  const roleBasedHref = getRoleBasedRoute(href)

  // Extract the key segment from the href (remove leading slash and get the path segment)
  const keySegment = href.startsWith("/")
    ? href.substring(1).split("/")[0]
    : href.split("/")[0]

  // Use the provided match pattern if available, otherwise use the key segment
  const patternToMatch = matchPattern || keySegment

  // Determine if the link is active based on the current pathname
  const isActive =
    activeProp !== undefined
      ? activeProp
      : exact
        ? pathname === roleBasedHref
        : patternToMatch === ""
          ? pathname === roleBasedHref || pathname === `${roleBasedHref}/`
          : pathname.includes(`/${patternToMatch}`)

  return (
    <Link
      href={roleBasedHref}
      className={cn(
        "group relative flex h-14 items-center px-4 text-sm font-medium text-gray-600 transition-colors hover:text-primary",
        isActive &&
          "text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
