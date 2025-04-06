import { useState } from "react"

import {
  Building,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit2,
  ImageIcon,
  Landmark,
  LogOut,
  Mail,
  Plus,
  Terminal,
  Wallet,
} from "lucide-react"

import { BankingInfo } from "@/types/profile"

import { UseProfileReturn } from "@/hooks/profile"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { AddCreditDialog } from "@/components/profile/dialogs/AddCreditDialog"

import { AddBankAccountDialog } from "./dialogs/AddBankAccountDialog"

interface ProfileSidebarProps {
  profile: UseProfileReturn
  onTabChange: (tab: string) => void
}

export function ProfileSidebar({ profile, onTabChange }: ProfileSidebarProps) {
  const { user, formatCurrency, getInitials } = profile

  // Sample linked accounts data - this would normally come from your API
  const [linkedAccounts, setLinkedAccounts] = useState<BankingInfo[]>([
    {
      id: "1",
      accountHolderName: user.name,
      accountNumber: "************1234",
      bankName: "MB Bank",
    },
    {
      id: "2",
      accountHolderName: user.name,
      accountNumber: "************5678",
      bankName: "Techcombank",
    },
  ])

  const [selectedAccount, setSelectedAccount] = useState<BankingInfo | null>(
    null
  )
  const [showAccountDetails, setShowAccountDetails] = useState(false)

  const handleAccountClick = (account: BankingInfo) => {
    setSelectedAccount(account)
    setShowAccountDetails(true)
  }

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
      </div>

      {/* Wallet Balance Card with Linked Accounts */}
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
        <div className="mt-4">
          <AddCreditDialog
            profile={profile}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-lg border-primary/20 bg-primary/5 text-xs font-medium text-primary shadow-sm hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="mr-1 size-3" />
                Add Credit
              </Button>
            }
          />
        </div>

        {/* Linked Accounts Section */}
        <div className="mt-6 border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Linked Accounts
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-medium text-primary hover:bg-transparent hover:text-primary/80"
              onClick={() => onTabChange("bankingInfo")}
            >
              Manage
            </Button>
          </div>

          <div className="space-y-2">
            {linkedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                onClick={() => handleAccountClick(account)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-50">
                    <CreditCard className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.bankName}</p>
                    <p className="text-xs text-muted-foreground">
                      •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <AddBankAccountDialog profile={profile} onAddAccount={() => {}} />
        </div>
      </div>

      {/* Bank Account Details Dialog */}
      {selectedAccount && (
        <Dialog open={showAccountDetails} onOpenChange={setShowAccountDetails}>
          <DialogTitle hidden>Account Details</DialogTitle>
          <DialogContent className="overflow-hidden p-0 sm:max-w-[480px]">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Details
                </h2>
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-green-600">
                    Active
                  </span>
                </div>
              </div>

              {/* Bank Info */}
              <div className="mb-8 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Landmark className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {selectedAccount.bankName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Connected on April 12, 2023
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="mb-8 space-y-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                      ACCOUNT NUMBER
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        ••••••••••••{selectedAccount.accountNumber.slice(-4)}
                      </p>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedAccount.accountNumber
                          )
                        }
                        aria-label="Copy account number"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                      ACCOUNT HOLDER
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedAccount.accountHolderName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="mb-1 text-xs text-gray-500">Last Used</p>
                    <p className="text-sm font-medium">June 2, 2023</p>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-3">
                    <p className="mb-1 text-xs text-gray-500">
                      Default Account
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      <span className="text-sm font-medium">Primary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col border-t border-gray-100">
              <div className="h-px w-full bg-gray-100"></div>
              <button
                type="button"
                className="p-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                onClick={() => {
                  setShowAccountDetails(false)
                  onTabChange("bankingInfo")
                }}
              >
                Remove Account
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
