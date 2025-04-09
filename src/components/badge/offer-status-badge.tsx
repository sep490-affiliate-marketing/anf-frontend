import { OfferStatusEnum } from "@/enums/offfer-status"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  PlayCircle,
  StopCircle,
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

type StatusConfig = {
  variant: "pending" | "approved" | "rejected" | "started" | "ended" | "default"
  icon: LucideIcon
  label: string
}

const STATUS_VARIANTS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  started: "bg-blue-50 text-blue-700 border-blue-200",
  ended: "bg-purple-50 text-purple-700 border-purple-200",
  default: "bg-gray-50 text-gray-700 border-gray-200",
} as const

export function OfferStatusBadge({
  status,
  className,
}: {
  status: OfferStatusEnum
  className?: string
}) {
  const getStatusConfig = (status: OfferStatusEnum): StatusConfig => {
    switch (status) {
      case OfferStatusEnum.PENDING:
        return {
          variant: "pending",
          icon: Clock,
          label: "Pending",
        }
      case OfferStatusEnum.APPROVED:
        return {
          variant: "approved",
          icon: CheckCircle,
          label: "Approved",
        }
      case OfferStatusEnum.REJECTED:
        return {
          variant: "rejected",
          icon: AlertCircle,
          label: "Rejected",
        }
      case OfferStatusEnum.STARTED:
        return {
          variant: "started",
          icon: PlayCircle,
          label: "Started",
        }
      case OfferStatusEnum.ENDED:
        return {
          variant: "ended",
          icon: StopCircle,
          label: "Ended",
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
