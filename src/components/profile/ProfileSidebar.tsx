"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import { ChevronRight, CreditCard, Landmark, Plus, Wallet } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import { AddCreditDialog } from "@/components/profile/dialogs/AddCreditDialog"

import { AddBankAccountDialog } from "./dialogs/AddBankAccountDialog"
import { formatVNDCurrency } from "@/lib/utils"

export function ProfileSidebar() {
  const { user, isLoadingUser } = useAuth()

  // Transform bankResponses to expected BankingInfo format
  const [linkedAccounts, setLinkedAccounts] = useState<
    {
      id: string
      accountHolderName: string
      accountNumber: string
      bankName: string
    }[]
  >([])

  // Update linkedAccounts when user data changes
  useEffect(() => {
    if (user?.bankResponses?.length) {
      const mappedAccounts = user.bankResponses.map((bank) => ({
        id: bank.id.toString(),
        accountHolderName: `${user?.firstName} ${user?.lastName}` || "",
        accountNumber: bank.bankingNo,
        bankName: bank.bankingProvider,
      }))
      setLinkedAccounts(mappedAccounts)
    }
  }, [user])

  const [selectedAccount, setSelectedAccount] = useState<{
    id: string
    accountHolderName: string
    accountNumber: string
    bankName: string
  } | null>(null)
  const [showAccountDetails, setShowAccountDetails] = useState(false)

  const handleAccountClick = (account: {
    id: string
    accountHolderName: string
    accountNumber: string
    bankName: string
  }) => {
    setSelectedAccount(account)
    setShowAccountDetails(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border">
        <div className="group overflow-hidden rounded-xl border-none transition-all duration-300">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary/70 to-primary/90"></div>
            <div className="absolute inset-0 h-32 bg-[url('/profile-pattern.svg')] bg-center opacity-20"></div>

            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                {isLoadingUser ? (
                  <Skeleton className="size-24 rounded-full" />
                ) : (
                  <Avatar className="size-24 border-4 border-background shadow-md transition-all duration-300 group-hover:scale-105">
                    {user?.imageUrl ? (
                      // If user has an image URL, display it
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.firstName || "User"}
                      />
                    ) : (
                      // Otherwise, use the fallback
                      <AvatarFallback className="bg-primary text-3xl font-medium text-primary-foreground">
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white px-5 pb-5 pt-16">
            <div className="flex flex-col items-start">
              <div className="flex w-full items-center justify-between">
                {isLoadingUser ? (
                  <>
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-6 w-24" />
                  </>
                ) : user ? (
                  <>
                    <h2 className="text-xl font-bold first-letter:uppercase">
                      {user.firstName} {user.lastName}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/10 font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/15"
                    >
                      {user.role}
                    </Badge>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">User</h2>
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/10 font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/15"
                    >
                      Guest
                    </Badge>
                  </>
                )}
              </div>

              {/* User Information Section */}
              <div className="mt-6 w-full">
                <h3 className="mb-4 text-sm font-medium text-gray-600">
                  User Information
                </h3>

                <div className="space-y-4">
                  {isLoadingUser ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-baseline justify-between"
                        >
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </>
                  ) : user ? (
                    <>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] text-gray-500">
                          Phone Number
                        </p>
                        <p className="text-[13px] font-medium text-gray-900">
                          {user.phoneNumber || "-"}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] text-gray-500">Email</p>
                        <p className="text-[13px] font-medium text-gray-900">
                          {user.email || "-"}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] text-gray-500">Citizen ID</p>
                        <p className="text-[13px] font-medium text-gray-900">
                          {user.citizenId || "-"}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] text-gray-500">
                          Date of Birth
                        </p>
                        <p className="text-[13px] font-medium text-gray-900">
                          {user.dateOfBirth
                            ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                            : "-"}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <p className="text-[13px] text-gray-500">Address</p>
                        <p className="truncate text-[13px] font-medium text-gray-900">
                          {user.address || "-"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {[
                        "Phone Number",
                        "Email",
                        "Citizen ID",
                        "Date of Birth",
                        "Address",
                      ].map((label) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between"
                        >
                          <p className="text-[13px] text-gray-500">{label}</p>
                          <p className="text-[13px] font-medium text-gray-900">
                            -
                          </p>
                        </div>
                      ))}
                    </>
                  )}
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
          {isLoadingUser ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <>
              <span className="text-3xl font-bold tracking-tight text-gray-900">
                {/* {user?.balance?.toLocaleString() || "0"} */}
                {formatVNDCurrency(user?.balance || 0)}
              </span>
              {/* <span className="ml-1 text-xs text-muted-foreground">VND</span> */}
            </>
          )}
        </div>
        <div className="mt-4">
          <AddCreditDialog>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg border-primary/20 bg-primary/5 text-xs font-medium text-primary shadow-sm hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="mr-1 size-3" />
              Add Credit
            </Button>
          </AddCreditDialog>
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
              onClick={() => {}}
            >
              Manage
            </Button>
          </div>

          <div className="space-y-2">
            {isLoadingUser ? (
              // Skeleton loaders for bank accounts while loading
              <>
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="size-4" />
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="size-4" />
                </div>
              </>
            ) : linkedAccounts.length > 0 ? (
              // Actual bank accounts
              linkedAccounts.map((account) => (
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
              ))
            ) : (
              // No bank accounts
              <div className="py-2 text-center text-sm text-muted-foreground">
                No bank accounts linked
              </div>
            )}
          </div>

          <AddBankAccountDialog />
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
