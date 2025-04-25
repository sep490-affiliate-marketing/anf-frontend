"use client"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronRight, Home } from "lucide-react"

import { Separator } from "@/components/ui/separator"

export function ProfileHeader() {
  const { user } = useAuth()
  return (
    <div>
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Home className="size-4" />
        <ChevronRight className="mx-2 size-4" />
        <span>Profile</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user?.firstName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Account Status</p>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active
            </span>
          </div>
          <Separator orientation="vertical" className="h-12" />
          <div className="text-right">
            <p className="text-sm font-medium">Last Login</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
