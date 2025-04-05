"use client"

import { Landmark, Star, StarOff, Trash2 } from "lucide-react"

import { Bank, BankingInfo } from "@/types/profile"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BankAccountCardProps {
  account: BankingInfo
  isPrimary: boolean
  onSetPrimary: (accountId: string) => void
  onDelete: (accountId: string) => void
}

export function BankAccountCard({
  account,
  isPrimary,
  onSetPrimary,
  onDelete,
}: BankAccountCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="size-4 text-primary" />
            <CardTitle className="text-base">{account.bankName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!isPrimary && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSetPrimary(account.id)}
                className="size-8"
              >
                <StarOff className="size-4 text-muted-foreground" />
                <span className="sr-only">Set as primary</span>
              </Button>
            )}
            {isPrimary && <Star className="size-4 text-primary" />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(account.id)}
              className="size-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete account</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          {isPrimary && "Primary Account • "}Account ending in{" "}
          {account.accountNumber.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Holder</span>
            <span>{account.accountHolderName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
