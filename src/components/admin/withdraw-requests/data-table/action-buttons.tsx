"use client"

import { useState } from "react"

import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { useUpdateWithdrawalStatus } from "@/hooks/transaction"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface WithdrawRequestActionsProps {
  requestId: number
  userCode: string
  amount: number
}

export function WithdrawRequestActions({
  requestId,
  userCode,
  amount,
}: WithdrawRequestActionsProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const { updateWithdrawalStatus, isPending } = useUpdateWithdrawalStatus()

  const handleApprove = async () => {
    await updateWithdrawalStatus({
      transactionIds: [requestId],
      status: "APPROVED",
    })
    setIsApproveDialogOpen(false)
  }

  const handleReject = async () => {
    await updateWithdrawalStatus({
      transactionIds: [requestId],
      status: "REJECTED",
      reason: rejectReason,
    })
    setIsRejectDialogOpen(false)
    setRejectReason("")
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 hover:bg-green-50 hover:text-green-700"
        onClick={() => setIsApproveDialogOpen(true)}
        disabled={isPending}
      >
        <Check className="mr-1 size-3.5" />
        Approve
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => setIsRejectDialogOpen(true)}
        disabled={isPending}
      >
        <X className="mr-1 size-3.5" />
        Reject
      </Button>

      {/* Approve Dialog */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Withdrawal Request</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve the withdrawal request #{requestId} for
              user {userCode}. The amount of {amount.toLocaleString()} VND will
              be transferred to the user&apos;s bank account. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault()
                handleApprove()
              }}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Confirm Approval"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Withdrawal Request</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject the withdrawal request #{requestId} for
              user {userCode}. Please provide a reason for rejection. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-4">
            <Textarea
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "bg-red-600 hover:bg-red-700",
                !rejectReason.trim() && "cursor-not-allowed opacity-50"
              )}
              onClick={(e) => {
                e.preventDefault()
                if (rejectReason.trim()) {
                  handleReject()
                }
              }}
              disabled={isPending || !rejectReason.trim()}
            >
              {isPending ? "Processing..." : "Confirm Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
