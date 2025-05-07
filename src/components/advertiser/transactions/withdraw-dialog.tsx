"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { AlertCircle } from "lucide-react"

import { formatVNDCurrency } from "@/lib/utils"

import { useWithdrawRequest } from "@/hooks/transaction"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define bank account interface
interface BankAccount {
  id: string
  bankingNo: string
  bankingProvider: string
}

export function WithdrawDialog() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { withDrawResquestForm, withdrawRequestMutation, isPending } =
    useWithdrawRequest()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Bank accounts from the user object
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has banking information
    if (user?.bankResponses && Array.isArray(user.bankResponses)) {
      // Convert any numeric ids to strings
      const formattedBankAccounts = user.bankResponses.map((bank) => ({
        id: String(bank.id),
        bankingNo: bank.bankingNo,
        bankingProvider: bank.bankingProvider,
      }))
      setBankAccounts(formattedBankAccounts)
    }
  }, [user])

  const handleSubmit = async (values: any) => {
    try {
      setErrorMessage(null)
      const result = await withdrawRequestMutation(values)
      if (result?.isSuccess) {
        setIsOpen(false)
        withDrawResquestForm.reset()
      } else if ("details" in result && result.details) {
        // If there's a detailed error message from API
        setErrorMessage(`${result.message}: ${result.details}`)
      } else if (result?.message) {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.")
    }
  }

  // Handle bank selection
  const handleBankSelection = (bankId: string) => {
    setSelectedBankId(bankId)
    const selectedBank = bankAccounts.find((bank) => bank.id === bankId)
    if (selectedBank) {
      withDrawResquestForm.setValue("bankingNo", selectedBank.bankingNo)
      withDrawResquestForm.setValue(
        "beneficiaryBankName",
        selectedBank.bankingProvider
      )
      withDrawResquestForm.setValue(
        "beneficiaryBankCode",
        selectedBank.bankingProvider
      )
    }
  }

  // Clear any error when dialog opens/closes
  useEffect(() => {
    setErrorMessage(null)
    if (!isOpen) {
      withDrawResquestForm.reset()
      setSelectedBankId(null)
    }
  }, [isOpen, withDrawResquestForm])

  // Use balance property from user object
  const availableBalance = user?.currentBalance ?? 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Withdraw Request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Submit a request to withdraw funds from your account.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...withDrawResquestForm}>
          <form
            onSubmit={withDrawResquestForm.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="mb-2 text-sm text-muted-foreground">
              Available balance: {formatVNDCurrency(availableBalance)}
            </div>

            <FormField
              control={withDrawResquestForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₫)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      min={50000}
                      max={Math.min(10000000, availableBalance)}
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value
                      ? `You will receive ${formatVNDCurrency(field.value)}`
                      : "Enter an amount to withdraw (Min: 50,000 ₫, Max: 10,000,000 ₫)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {bankAccounts.length > 0 ? (
              <FormField
                control={withDrawResquestForm.control}
                name="bankingNo"
                render={() => (
                  <FormItem>
                    <FormLabel>Bank Account</FormLabel>
                    <Select
                      onValueChange={handleBankSelection}
                      value={selectedBankId || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bankAccounts.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.bankingProvider} - {bank.bankingNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a bank account for receiving your funds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p>
                  No bank accounts found. Please add a bank account in your
                  profile.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  bankAccounts.length === 0 ||
                  !selectedBankId ||
                  !withDrawResquestForm.getValues("amount")
                }
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
