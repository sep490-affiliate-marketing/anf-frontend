"use client"

import { useState } from "react"

import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

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
  onApprove: (id: number) => Promise<void>
  onReject: (id: number, reason: string) => Promise<void>
}

export function WithdrawRequestActions({
  requestId,
  userCode,
  amount,
  onApprove,
  onReject,
}: WithdrawRequestActionsProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await onApprove(requestId)
    } finally {
      setIsProcessing(false)
      setIsApproveDialogOpen(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await onReject(requestId, rejectReason)
    } finally {
      setIsProcessing(false)
      setIsRejectDialogOpen(false)
      setRejectReason("")
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 hover:bg-green-50 hover:text-green-700"
        onClick={() => setIsApproveDialogOpen(true)}
      >
        <Check className="mr-1 size-3.5" />
        Approve
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => setIsRejectDialogOpen(true)}
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
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault()
                handleApprove()
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Approval"}
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
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
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
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? "Processing..." : "Confirm Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
