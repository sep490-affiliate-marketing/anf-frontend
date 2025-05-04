import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

export enum TicketStatusEnum {
  OPEN = "open",
  APPROVED = "approved",
  REJECTED = "rejected",
}

type StatusConfig = {
  variant: "open" | "approved" | "rejected" | "default"
  icon: LucideIcon
  label: string
}

const STATUS_VARIANTS = {
  open: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  approved: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  rejected: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  default: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
} as const

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatusEnum | string
  className?: string
}) {
  const getStatusConfig = (status: TicketStatusEnum | string): StatusConfig => {
    switch (status) {
      case TicketStatusEnum.OPEN:
        return {
          variant: "open",
          icon: Clock,
          label: "Open",
        }
      case TicketStatusEnum.APPROVED:
        return {
          variant: "approved",
          icon: CheckCircle,
          label: "Approved",
        }
      case TicketStatusEnum.REJECTED:
        return {
          variant: "rejected",
          icon: AlertCircle,
          label: "Rejected",
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
          STATUS_VARIANTS[variant as keyof typeof STATUS_VARIANTS],
          "flex h-7 items-center gap-1.5 rounded-full px-3 py-1 font-medium capitalize"
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        <span>{label}</span>
      </Badge>
    </div>
  )
}
