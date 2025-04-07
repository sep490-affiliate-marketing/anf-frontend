import { useState } from "react"

import { DollarSign, InfoIcon } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddCreditDialog({ children }: { children: React.ReactNode }) {
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [addCreditAmount, setAddCreditAmount] = useState<string>("")

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Credit to Your Account</DialogTitle>
          <DialogDescription>
            Add funds to your wallet balance for easy payments
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 pt-4 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="payment-method" className="text-sm font-medium">
                Select Payment Method
              </Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chase">Chase Bank</SelectItem>
                  <SelectItem value="bofa">Bank of America</SelectItem>
                  <SelectItem value="wells">Wells Fargo</SelectItem>
                  <SelectItem value="citi">Citibank</SelectItem>
                  <SelectItem value="discover">Discover</SelectItem>
                  <SelectItem value="other">Other Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  onChange={(e) => setAddCreditAmount(e.target.value)}
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="h-11 pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum amount: $10.00
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <Button className="h-11 w-full bg-primary/90 text-sm font-medium shadow-sm transition-all hover:bg-primary">
                Add Funds
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
                  {addCreditAmount ? addCreditAmount.toLocaleString() : "0.00"}
                  VND
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium">New Balance</span>
                <span className="font-medium text-primary">
                  {addCreditAmount ? addCreditAmount.toLocaleString() : "0.00"}
                  VND
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-primary/5 p-3 text-xs text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <InfoIcon className="mt-0.5 size-3 text-primary" />
                <span>
                  Funds will be available in your account immediately after the
                  transaction is processed.
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
