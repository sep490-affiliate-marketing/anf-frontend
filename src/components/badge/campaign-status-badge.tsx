import { CampaignStatusEnum } from "@/enums/campaign-status"
import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

type StatusConfig = {
  variant: "pending" | "active" | "rejected" | "default" | "verified"
  icon: LucideIcon
  label: string
}

const STATUS_VARIANTS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-purple-50 text-purple-700 border-purple-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  default: "bg-gray-50 text-gray-700 border-gray-200",
  verified: "bg-green-50 text-green-700 border-green-200",
} as const

export function CampaignStatusBadge({
  status,
  className,
}: {
  status: CampaignStatusEnum
  className?: string
}) {
  const getStatusConfig = (status: CampaignStatusEnum): StatusConfig => {
    switch (status) {
      case CampaignStatusEnum.PENDING:
        return {
          variant: "pending",
          icon: Clock,
          label: "Pending",
        }
      case CampaignStatusEnum.ACTIVE:
        return {
          variant: "active",
          icon: CheckCircle,
          label: "Active",
        }
      case CampaignStatusEnum.REJECTED:
        return {
          variant: "rejected",
          icon: AlertCircle,
          label: "Rejected",
        }
      case CampaignStatusEnum.VERIFIED:
        return {
          variant: "verified",
          icon: CheckCircle,
          label: "Verified",
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
