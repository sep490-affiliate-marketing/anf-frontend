import { useState } from "react"

import { DollarSign, InfoIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useAddCredit } from "@/hooks/wallet"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddCreditDialog({ children }: { children: React.ReactNode }) {
  const [addCreditAmount, setAddCreditAmount] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutate: addCredit, isPending: isAddingCredit } = useAddCredit()

  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate amount
    const amount = parseFloat(addCreditAmount)
    if (isNaN(amount) || amount < 10) {
      setError("Minimum amount is 10 VND")
      return
    }

    // Call the mutation to add credit
    addCredit({ amount })
  }

  // Format number with commas for thousands
  const formatNumber = (value: string) => {
    if (!value) return "0.00"
    const num = parseFloat(value)
    if (isNaN(num)) return "0.00"
    return num.toLocaleString("vi-VN")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleAddCredit}>
          <DialogHeader>
            <DialogTitle>Add Credit to Your Account</DialogTitle>
            <DialogDescription>
              Add funds to your wallet balance for easy payments
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8 pt-4 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount to Add
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="size-4 text-gray-400" />
                  </div>
                  <Input
                    value={addCreditAmount}
                    onChange={(e) => {
                      setAddCreditAmount(e.target.value)
                      setError(null)
                    }}
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="h-11 pl-9"
                    min="10"
                    step="1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum amount: 10 VND
                </p>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <div className="space-y-3 pt-3">
                <Button
                  type="submit"
                  className="h-11 w-full bg-primary/90 text-sm font-medium shadow-sm transition-all hover:bg-primary"
                  disabled={
                    isAddingCredit ||
                    !addCreditAmount ||
                    parseFloat(addCreditAmount) < 10
                  }
                >
                  {isAddingCredit ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Funds"
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-5">
              <h4 className="flex items-center gap-1.5 font-medium">
                <InfoIcon className="size-4 text-primary" />
                Payment Information
              </h4>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <span className="text-sm text-muted-foreground">
                    Current Balance
                  </span>
                  <span className="font-medium">0.00 VND</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <span className="text-sm text-muted-foreground">
                    Amount to Add
                  </span>
                  <span className="font-medium">
                    {formatNumber(addCreditAmount)} VND
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium">New Balance</span>
                  <span className="font-medium text-primary">
                    {formatNumber(addCreditAmount)} VND
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-primary/5 p-3 text-xs text-muted-foreground">
                <p className="flex items-start gap-1.5">
                  <InfoIcon className="mt-0.5 size-3 text-primary" />
                  <span>
                    Funds will be available in your account immediately after
                    the transaction is processed.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
