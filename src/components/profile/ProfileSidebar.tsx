import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  Edit2,
  ImageIcon,
  LogOut,
  Mail,
  Plus,
  Terminal,
  Wallet,
} from "lucide-react"

import { UseProfileReturn } from "@/hooks/profile"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { AddCreditDialog } from "@/components/profile/dialogs/AddCreditDialog"

interface ProfileSidebarProps {
  profile: UseProfileReturn
  onTabChange: (tab: string) => void
}

export function ProfileSidebar({ profile, onTabChange }: ProfileSidebarProps) {
  const { user, formatCurrency, getInitials } = profile

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="group overflow-hidden border-none transition-all duration-300">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary/70 to-primary/90"></div>
            <div className="absolute inset-0 h-32 bg-[url('/profile-pattern.svg')] bg-center opacity-20"></div>
            <div className="absolute bottom-0 right-0 p-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Cover Photo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <Avatar className="size-24 border-4 border-background shadow-md transition-all duration-300 group-hover:scale-105">
                  <AvatarFallback className="bg-primary text-3xl font-medium text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-7 rounded-full border-primary/20 bg-background shadow-sm hover:bg-primary/5"
                        >
                          <ImageIcon className="size-3.5 text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update Avatar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-5 pt-16">
            <div className="flex flex-col items-start">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10 font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/15"
                >
                  {user.title}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Mail className="size-3.5" />
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                  <Terminal className="size-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Position
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{user.position}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                  <Building className="size-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Team
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{user.team}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="size-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Join Date
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{user.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="size-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Salary
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {formatCurrency(user.salary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline">
          <LogOut className="size-4" />
          <span>Log Out</span>
        </Button>
      </div>

      {/* Wallet Balance Card */}
      <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">Wallet Balance</h3>
          <Wallet className="size-4 text-primary" />
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {formatCurrency(user.walletBalance)}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">USD</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <AddCreditDialog 
            profile={profile}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-primary/20 bg-primary/5 text-xs font-medium text-primary shadow-sm hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="mr-1 size-3" />
                Add Credit
              </Button>
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-primary/20 text-xs font-medium shadow-sm"
            onClick={() => onTabChange("walletHistory")}
          >
            <Briefcase className="mr-1 size-3" />
            View History
          </Button>
        </div>
      </div>
    </div>
  )
}
