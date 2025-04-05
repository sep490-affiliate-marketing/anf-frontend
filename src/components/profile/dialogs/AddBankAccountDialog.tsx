"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { Loader2, Plus } from "lucide-react"

import { Bank, BankingInfo } from "@/types/profile"

import { UseProfileReturn } from "@/hooks/profile"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddBankAccountDialogProps {
  profile: UseProfileReturn
  onAddAccount: (account: BankingInfo) => void
}

export function AddBankAccountDialog({
  profile,
  onAddAccount,
}: AddBankAccountDialogProps) {
  const {
    banks,
    isLoadingBanks,
    lookupAccount,
    isLookingUpAccount,
    lookupError,
    getCachedBankAccount,
  } = profile

  const [bankingInfo, setBankingInfo] = useState<Partial<BankingInfo>>({
    id: crypto.randomUUID(),
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
  })

  const [isLookupEnabled, setIsLookupEnabled] = useState(false)

  useEffect(() => {
    setIsLookupEnabled(
      Boolean(bankingInfo.bankName && bankingInfo.accountNumber)
    )
  }, [bankingInfo.bankName, bankingInfo.accountNumber])

  const handleUpdateBankingInfo = (field: keyof BankingInfo, value: string) => {
    const updatedInfo = {
      ...bankingInfo,
      [field]: value,
    }
    setBankingInfo(updatedInfo)
  }

  const handleLookup = async () => {
    if (!bankingInfo.bankName || !bankingInfo.accountNumber) return

    // Check cache first
    const cachedData = getCachedBankAccount(
      bankingInfo.bankName,
      bankingInfo.accountNumber
    )

    if (cachedData) {
      // Use cached data if available
      setBankingInfo((prev) => ({
        ...prev,
        accountHolderName: cachedData.ownerName,
      }))
      return
    }

    // If not in cache, make API call
    lookupAccount(
      {
        bankName: bankingInfo.bankName,
        accountNumber: bankingInfo.accountNumber,
      },
      {
        onSuccess: (data) => {
          setBankingInfo((prev) => ({
            ...prev,
            accountHolderName: data.ownerName,
          }))
        },
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      bankingInfo.accountHolderName &&
      bankingInfo.accountNumber &&
      bankingInfo.bankName
    ) {
      onAddAccount(bankingInfo as BankingInfo)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full rounded-lg border-dashed border-gray-300 py-5 text-sm font-normal"
        >
          <Plus className="mr-2 size-4" />
          Link a new bank account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Add a new bank account for receiving payments
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Select
                value={bankingInfo.bankName}
                onValueChange={(value) =>
                  handleUpdateBankingInfo("bankName", value)
                }
                disabled={isLoadingBanks}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue
                    placeholder={
                      isLoadingBanks ? "Loading banks..." : "Select your bank"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank: Bank) => (
                    <SelectItem
                      key={bank.id}
                      value={bank.code}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={bank.icon_url}
                          alt={bank.short_name}
                          width={16}
                          height={16}
                          className="size-4 object-contain"
                        />
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={bankingInfo.accountNumber}
                onChange={(e) =>
                  handleUpdateBankingInfo("accountNumber", e.target.value)
                }
                className="h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <div className="flex gap-2">
                <Input
                  id="accountHolderName"
                  placeholder="Account holder name will appear here"
                  value={bankingInfo.accountHolderName}
                  readOnly
                  className="h-11 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-24"
                  disabled={!isLookupEnabled || isLookingUpAccount}
                  onClick={handleLookup}
                >
                  {isLookingUpAccount ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    "Lookup"
                  )}
                </Button>
              </div>
              {lookupError && (
                <p className="text-sm text-destructive">
                  {lookupError instanceof Error
                    ? lookupError.message
                    : "Failed to lookup account"}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!bankingInfo.accountHolderName}>
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
