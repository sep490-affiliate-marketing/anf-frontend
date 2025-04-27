"use client"

import { useState } from "react"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { ChevronDown, Layers2Icon, LogOutIcon, UserPenIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

import { cn, formatVNDCurrency } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserAvatarButton() {
  const { user, isLoadingUser, logout, isLoggingOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Get the appropriate route based on user role (similar to NavLink component)
  const getRoleBasedRoute = (baseRoute: string): string => {
    if (!user) return baseRoute

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
        return baseRoute
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-border bg-background px-3 py-1 pr-4 text-sm font-medium transition-colors hover:bg-muted focus:outline-none"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={user?.imageUrl || "/placeholder.svg"}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {user?.firstName?.charAt(0) || ""}
              {user?.lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>

          {!isLoadingUser && user && (
            <div className="flex flex-col items-start">
              <span className="line-clamp-1 truncate font-medium">
                {user.firstName} {user.lastName}
              </span>
              {user && "balance" in user && (
                <span className="text-xs text-muted-foreground">
                  {formatVNDCurrency((user as any).balance || 0)}
                </span>
              )}
            </div>
          )}

          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-0 shadow-lg"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <div className="px-5 py-4">
          {isLoadingUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="mt-2 h-16 w-full rounded-md" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage
                    src={user?.imageUrl || "/placeholder.svg"}
                    alt="Profile image"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">
                    {user?.firstName?.charAt(0) || ""}
                    {user?.lastName?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {user && "balance" in user && (
                <div className="mt-4 rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Balance
                    </span>
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {formatVNDCurrency((user as any).balance || 0)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2.5 text-sm focus:bg-muted"
            onClick={() => router.push(getRoleBasedRoute("/"))}
          >
            <Layers2Icon
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2.5 text-sm focus:bg-muted"
            onClick={() => router.push(getRoleBasedRoute("/profile"))}
          >
            <UserPenIcon
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem
            onClick={() => logout()}
            disabled={isLoggingOut}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive focus:bg-destructive/10 focus:text-destructive",
              isLoggingOut && "cursor-not-allowed opacity-70"
            )}
          >
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
