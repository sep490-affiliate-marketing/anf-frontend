"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import axios, { AxiosError } from "axios"
import { Loader2, Plus } from "lucide-react"

import { IBank } from "@/types/bank.type"
import { BankingInfo } from "@/types/profile"

import { useAddBankAccount, useGetBankList } from "@/hooks/bank"

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

export function AddBankAccountDialog() {
  const [bankingInfo, setBankingInfo] = useState<Partial<BankingInfo>>({
    accountNumber: "",
    bankName: "",
  })
  const [isLookupEnabled, setIsLookupEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLookingUpAccount, setIsLookingUpAccount] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  const [accountHolderName, setAccountHolderName] = useState("")
  const [addBankAccountError, setAddBankAccountError] = useState<Error | null>(
    null
  )

  const { mutate: addBankAccount, isPending: isAddingBankAccount } =
    useAddBankAccount()

  const { data: bankList, isLoading: isLoadingBankList } = useGetBankList()

  // Reset form when dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setBankingInfo({
        accountNumber: "",
        bankName: "",
      })
      setAccountHolderName("")
      setLookupError(null)
      setAddBankAccountError(null)
    }
  }, [isOpen])

  // Enable lookup when bank and account number are provided
  useEffect(() => {
    setIsLookupEnabled(
      !!bankingInfo.bankName &&
        !!bankingInfo.accountNumber &&
        bankingInfo.accountNumber.length >= 8
    )
  }, [bankingInfo.bankName, bankingInfo.accountNumber])

  const handleBankChange = (value: string) => {
    setBankingInfo((prev) => ({ ...prev, bankName: value }))
  }

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBankingInfo((prev) => ({ ...prev, accountNumber: e.target.value }))
  }

  const handleLookupAccount = async () => {
    if (!bankingInfo.bankName || !bankingInfo.accountNumber) return

    setIsLookingUpAccount(true)
    setLookupError(null)

    try {
      const { data } = await axios.post("/api/bank/look-up", {
        bankCode: bankingInfo.bankName,
        accountNumber: bankingInfo.accountNumber,
      })

      setAccountHolderName(data.data.ownerName)
    } catch (error) {
      setLookupError(
        error instanceof AxiosError
          ? error.response?.data?.error
          : "Failed to lookup account123"
      )
    } finally {
      setIsLookingUpAccount(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !accountHolderName ||
      !bankingInfo.accountNumber ||
      !bankingInfo.bankName
    ) {
      return
    }

    // Find the selected bank to get its name
    const selectedBank = bankList?.data?.find(
      (bank: IBank) => bank.code === bankingInfo.bankName
    )

    if (!selectedBank) {
      setAddBankAccountError(new Error("Selected bank not found"))
      return
    }

    // Prepare the data in the required format
    const bankAccountData = [
      {
        accountName: accountHolderName,
        bankingNo: bankingInfo.accountNumber,
        bankingCode: bankingInfo.bankName,
        bankingName: selectedBank.name,
      },
    ]

    // Call the mutation to add the bank account
    addBankAccount(bankAccountData, {
      onSuccess: () => {
        // Close the dialog on success
        setIsOpen(false)
      },
      onError: (error) => {
        setAddBankAccountError(
          error instanceof Error
            ? error
            : new Error("Failed to add bank account")
        )
      },
    })
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
              <Label htmlFor="bankName">Select Bank</Label>
              <Select
                value={bankingInfo.bankName}
                onValueChange={handleBankChange}
                disabled={isLoadingBankList}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankList?.data?.map((bank: IBank) => (
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
                className="h-11"
                value={bankingInfo.accountNumber}
                onChange={handleAccountNumberChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <div className="flex gap-2">
                <Input
                  id="accountHolderName"
                  placeholder="Account holder name will appear here"
                  readOnly
                  value={accountHolderName}
                  className="h-11 flex-1 border-transparent bg-muted shadow-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-24"
                  disabled={!isLookupEnabled || isLookingUpAccount}
                  onClick={handleLookupAccount}
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
                  {lookupError || "Failed to lookup account"}
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
              disabled={!accountHolderName || isAddingBankAccount}
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
