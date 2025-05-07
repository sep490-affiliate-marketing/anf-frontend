import { TransactionStatusEnum } from "@/enums/transaction-status"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

type StatusConfig = {
  variant:
    | "failed"
    | "canceled"
    | "pending"
    | "approved"
    | "rejected"
    | "success"
    | "default"
  icon: LucideIcon
  label: string
}

const STATUS_VARIANTS = {
  failed: "bg-red-50 text-red-700 border-red-200",
  canceled: "bg-gray-50 text-gray-700 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  default: "bg-gray-50 text-gray-700 border-gray-200",
} as const

export function TransactionStatusBadge({
  status,
  className,
}: {
  status: TransactionStatusEnum
  className?: string
}) {
  const getStatusConfig = (status: TransactionStatusEnum): StatusConfig => {
    switch (status) {
      case TransactionStatusEnum.FAILED:
        return {
          variant: "failed",
          icon: AlertCircle,
          label: "Failed",
        }
      case TransactionStatusEnum.CANCELED:
        return {
          variant: "canceled",
          icon: XCircle,
          label: "Canceled",
        }
      case TransactionStatusEnum.PENDING:
        return {
          variant: "pending",
          icon: Clock,
          label: "Pending",
        }
      case TransactionStatusEnum.APPROVED:
        return {
          variant: "approved",
          icon: CheckCircle,
          label: "Approved",
        }
      case TransactionStatusEnum.REJECTED:
        return {
          variant: "rejected",
          icon: AlertCircle,
          label: "Rejected",
        }
      case TransactionStatusEnum.SUCCESS:
        return {
          variant: "success",
          icon: CheckCircle,
          label: "Success",
        }

      default:
        return {
          variant: "default",
          icon: HelpCircle,
          label: String(status),
        }
    }
  }

  const config = getStatusConfig(status)
  const { icon: Icon, variant, label } = config

  return (
    <div className={cn("flex items-center", className)}>
      <Badge
        variant="outline"
        className={cn(
          STATUS_VARIANTS[variant],
          "flex items-center gap-1.5 px-2.5 py-0.5 font-medium"
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        <span>{label}</span>
      </Badge>
    </div>
  )
}
