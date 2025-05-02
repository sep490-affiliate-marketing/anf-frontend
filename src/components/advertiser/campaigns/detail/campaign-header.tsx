"use client"

import Link from "next/link"

import { CampaignStatusEnum } from "@/enums/campaign-status"
import { ChevronLeft } from "lucide-react"
import "yet-another-react-lightbox/styles.css"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CampaignStatusBadge } from "@/components/badge/campaign-status-badge"

// Utility function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

type VerificationAction = "approve" | "reject"
interface Offer {
  id: number
  campaignId: number
  pricingModel: string
  description: string
  stepInfo: string
  startDate: string
  endDate: string
  bid: number
  budget: number
  commissionRate: number | null
  orderReturnTime: string | null
  imageUrl: string | null
}

interface Campaign {
  id: number
  advertiserCode: string
  name: string
  description: string
  startDate: string
  endDate: string
  balance: number
  productUrl: string
  trackingParams: string | null
  rejectReason: string | null
  categoryId: number | null
  status: CampaignStatusEnum
  category: any | null
  offers: Offer[]
  images: string[]
  thumbnail: string | null
}
function CampaignVerificationUI({ campaign }: { campaign: Campaign }) {
  return (
    <>
      {/* Campaign Action Bar - Persistent at top of page */}
      <div className="sticky top-0 z-10 flex w-full flex-col border-b bg-gradient-to-r from-white to-white/90 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4 overflow-hidden">
          <Link href="/advertiser/campaigns">
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
          </Link>
          <div className="h-5 w-px shrink-0 bg-gray-200"></div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h1 className="truncate text-xl font-semibold tracking-tight">
                      {campaign.name}
                    </h1>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{campaign.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CampaignStatusBadge
                status={campaign.status}
                className="ml-2 shrink-0"
              />
            </div>
            <div
              className="mt-1 line-clamp-3 text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: campaign.description }}
            />

          </div>
        </div>
      </div>
    </>
  )
}

export function CampaignHeader({ campaign }: { campaign: Campaign }) {
  return (
    <div className="relative space-y-6 bg-gradient-to-b from-white to-gray-50/20">
      <CampaignVerificationUI campaign={campaign} />
    </div>
  )
}
