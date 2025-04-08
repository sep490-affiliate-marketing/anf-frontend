"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { InfoIcon } from "lucide-react"

import { BankingInfo } from "@/types/profile"

import { TabsContent } from "@/components/ui/tabs"

import { BankAccountCard } from "@/components/profile/BankAccountCard"

export function BankingInfoTab() {
  const { user } = useAuth()
  const [bankAccounts, setBankAccounts] = useState<BankingInfo[]>([])
  const [primaryAccountId, setPrimaryAccountId] = useState<string>()

  const handleAddAccount = (account: BankingInfo) => {
    setBankAccounts((prev) => [...prev, account])
    if (!primaryAccountId) {
      setPrimaryAccountId(account.id)
    }
  }

  const handleSetPrimary = (accountId: string) => {
    setPrimaryAccountId(accountId)
  }

  const handleDeleteAccount = (accountId: string) => {
    setBankAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
    if (primaryAccountId === accountId) {
      setPrimaryAccountId(bankAccounts[0]?.id)
    }
  }

  return (
    <TabsContent value="bankingInfo" className="mt-0 space-y-6 pb-4">
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Banking Information</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your bank accounts for receiving payments
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {bankAccounts.map((account) => (
              <BankAccountCard
                key={account.id}
                account={account}
                isPrimary={account.id === primaryAccountId}
                onSetPrimary={handleSetPrimary}
                onDelete={handleDeleteAccount}
              />
            ))}

            {bankAccounts.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h4 className="mb-2 text-sm font-medium">No Bank Accounts</h4>
                <p className="text-sm text-muted-foreground">
                  Add a bank account to receive payments
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <h4 className="flex items-center gap-1.5 font-medium">
            <InfoIcon className="size-4 text-primary" />
            Important Information
          </h4>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-primary/5 p-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <InfoIcon className="mt-0.5 size-3.5 text-primary" />
                <span>
                  Your banking information is encrypted and stored securely. We
                  use industry-standard security measures to protect your data.
                </span>
              </p>
            </div>
            <div className="rounded-md bg-primary/5 p-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <InfoIcon className="mt-0.5 size-3.5 text-primary" />
                <span>
                  Please ensure all banking details are accurate. Incorrect
                  information may result in failed transactions.
                </span>
              </p>
            </div>
            <div className="rounded-md bg-primary/5 p-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <InfoIcon className="mt-0.5 size-3.5 text-primary" />
                <span>
                  For security reasons, you will need to verify your identity
                  when updating banking information.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
