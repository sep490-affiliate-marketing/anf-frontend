"use client"

import { useAuth } from "@/providers/auth-provider"
import { BoltIcon, Layers2Icon, LogOutIcon, UserPenIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserAvatarButton() {
  const { user, isLoadingUser, logout, isLoggingOut } = useAuth()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bord2 rounded-full border p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user?.imageUrl || "/"} alt="Profile image" />
            <AvatarFallback>
              {user?.firstName?.charAt(0) || ""}
              {user?.lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" side="bottom" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          {isLoadingUser ? (
            <>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </>
          ) : (
            <>
              <span className="truncate text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              router.push(`${user?.role.toLocaleLowerCase()}/profile`)
            }
          >
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isLoggingOut}
          className={isLoggingOut ? "cursor-not-allowed opacity-70" : ""}
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
