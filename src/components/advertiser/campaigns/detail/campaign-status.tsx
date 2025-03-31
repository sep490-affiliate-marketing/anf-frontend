import { CampaignStatusEnum } from "@/enums/campaign-status"
import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

export function CampaignStatus({
  status,
  className,
}: {
  status: CampaignStatusEnum
  className?: string
}) {
  const getStatusConfig = (status: CampaignStatusEnum) => {
    switch (status) {
      case CampaignStatusEnum.PENDING:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          text: "Pending",
        }
      case CampaignStatusEnum.ACTIVE:
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: CheckCircle,
          text: "Active",
        }
      case CampaignStatusEnum.REJECTED:
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: AlertCircle,
          text: "Rejected",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: HelpCircle,
          text: status,
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1.5 px-2.5 py-0.5 font-medium`}
      >
        <Icon className="size-3.5" />
        {config.text}
      </Badge>
    </div>
  )
}
