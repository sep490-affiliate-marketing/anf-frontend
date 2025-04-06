"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { Loader2, Plus } from "lucide-react"

import { BankingInfo } from "@/types/profile"

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

// Sample bank data - in a real app, this would come from an API
const sampleBanks = [
  {
    id: "1",
    code: "MBBANK",
    name: "MB Bank",
    short_name: "MB",
    icon_url: "/images/banks/mb-bank.png"
  },
  {
    id: "2",
    code: "TCB",
    name: "Techcombank",
    short_name: "TCB",
    icon_url: "/images/banks/techcombank.png"
  },
  {
    id: "3",
    code: "VCB",
    name: "Vietcombank",
    short_name: "VCB",
    icon_url: "/images/banks/vietcombank.png"
  },
  {
    id: "4",
    code: "BIDV",
    name: "BIDV",
    short_name: "BIDV",
    icon_url: "/images/banks/bidv.png"
  }
]

interface AddBankAccountDialogProps {
  onAddAccount: (account: BankingInfo) => void
}

export function AddBankAccountDialog({
  onAddAccount,
}: AddBankAccountDialogProps) {
  const [bankingInfo, setBankingInfo] = useState<Partial<BankingInfo>>({
    id: crypto.randomUUID(),
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
  })

  const [isLookupEnabled, setIsLookupEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLookingUpAccount, setIsLookingUpAccount] = useState(false)
  const [lookupError, setLookupError] = useState<Error | null>(null)
  const [isAddingBankAccount, setIsAddingBankAccount] = useState(false)
  const [addBankAccountError, setAddBankAccountError] = useState<Error | null>(null)

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
    
    setIsLookingUpAccount(true)
    setLookupError(null)
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful lookup - in a real app, this would use the response from the API
      const bankName = sampleBanks.find(b => b.code === bankingInfo.bankName)?.name || ""
      setBankingInfo(prev => ({
        ...prev,
        accountHolderName: "Advertiser Real", // Using the user's name from our data
      }))
    } catch (error) {
      setLookupError(error instanceof Error ? error : new Error("Failed to lookup account"))
    } finally {
      setIsLookingUpAccount(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      bankingInfo.accountHolderName &&
      bankingInfo.accountNumber &&
      bankingInfo.bankName
    ) {
      setIsAddingBankAccount(true)
      setAddBankAccountError(null)
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, simulate an API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Find the full bank name from the code
        const bankInfo = sampleBanks.find(b => b.code === bankingInfo.bankName)
        const fullBankName = bankInfo?.name || bankingInfo.bankName
        
        const newAccount: BankingInfo = {
          id: bankingInfo.id || crypto.randomUUID(),
          accountHolderName: bankingInfo.accountHolderName,
          accountNumber: bankingInfo.accountNumber,
          bankName: fullBankName,
        }
        
        onAddAccount(newAccount)
        setIsOpen(false)
        setBankingInfo({
          id: crypto.randomUUID(),
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
        })
      } catch (error) {
        setAddBankAccountError(error instanceof Error ? error : new Error("Failed to add bank account"))
      } finally {
        setIsAddingBankAccount(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {sampleBanks.map((bank) => (
                    <SelectItem
                      key={bank.id}
                      value={bank.code}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full bg-gray-100 flex items-center justify-center">
                          {/* In a real app, these would be real images */}
                          <span className="text-xs">{bank.short_name.substring(0, 1)}</span>
                        </div>
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
                  {lookupError.message || "Failed to lookup account"}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            {addBankAccountError && (
              <p className="text-sm text-destructive">
                {addBankAccountError.message || "Failed to add bank account"}
              </p>
            )}
            <Button
              type="submit"
              disabled={!bankingInfo.accountHolderName || isAddingBankAccount}
            >
              {isAddingBankAccount ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
