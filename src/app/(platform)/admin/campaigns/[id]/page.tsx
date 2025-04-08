"use client"

import React from "react"

import { useRouter } from "next/navigation"

import { CampaignStatusEnum } from "@/enums/campaign-status"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  AlertCircle,
  ArrowUpRight,
  Clock,
  CreditCard,
  Loader2,
  Tag,
} from "lucide-react"
import "yet-another-react-lightbox/styles.css"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetCampaignById } from "@/hooks/campaign"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CampaignHeader } from "@/components/admin/campaigns/detail/campaign-header"
import { CampaignGallery } from "@/components/admin/campaigns/detail/campaign-image-gallery"

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

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function CampaignDetailsPage({ params: paramsPromise }: Props) {
  const router = useRouter()

  // Unwrap params using React.use() as recommended by Next.js
  const params = React.use(paramsPromise)
  const { id } = params

  // Use the campaign hook instead of mock data
  const { data: campaignResponse, isLoading } = useGetCampaignById(id)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading campaign details...</span>
        </div>
      </div>
    )
  }

  if (!campaignResponse?.isSuccess || !campaignResponse.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Failed to load campaign details</span>
        </div>
      </div>
    )
  }

  const campaign = {
    ...campaignResponse.data,
    images: campaignResponse.data.campImages || [],
    thumbnail: campaignResponse.data.campImages?.[0] || null,
    category: {
      id: campaignResponse.data.categoryId,
      name: campaignResponse.data.categoryName,
    },
  } as Campaign

  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const handleOfferClick = (offerId: number) => {
    router.push(`/admin/campaigns/${id}/offers/${offerId}`)
  }

  return (
    <div className="space-y-8">
      <CampaignHeader campaign={campaign} />

      {/* Campaign Info Section */}
      <div className="border-b border-border bg-white px-6 pb-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Campaign Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Detailed information and progress of the campaign
          </p>
        </div>

        {/* Campaign Images Gallery */}
        {(campaign.thumbnail || campaign.images.length > 0) && (
          <div className="mb-8">
            <CampaignGallery
              thumbnail={campaign.thumbnail}
              images={campaign.images}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Time & Progress */}
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-purple-50 p-1.5">
                  <Clock className="size-4 text-purple-600" />
                </div>
                <h3 className="font-medium">Time & Progress</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Left
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-semibold text-purple-600">
                          {daysLeft}
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-purple-600 transition-all" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-gray-900">
                          {format(new Date(campaign.startDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                        <span className="text-gray-500">Start</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-gray-900">
                          {format(new Date(campaign.endDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                        <span className="text-gray-500">End</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-purple-50 p-1.5">
                  <Tag className="size-4 text-purple-600" />
                </div>
                <h3 className="font-medium">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group space-y-1 rounded-lg p-2 transition-colors hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-500">
                          Advertiser Code
                        </p>
                        <p className="font-mono text-sm text-gray-900">
                          {campaign.advertiserCode}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unique identifier for the advertiser</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="space-y-1 rounded-lg p-2 transition-colors hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">
                    Product URL
                  </p>
                  <a
                    href={campaign.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                  >
                    {campaign.productUrl}
                    <ArrowUpRight className="size-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Offers Section */}
      <div className="border-b border-border bg-white px-6 pb-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Budget & Offers</h2>
          <p className="mt-1 text-sm text-gray-500">
            Information about the budget and offers in the campaign
          </p>
        </div>
        <div className="space-y-8">
          {/* Budget Overview */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-purple-50 p-1.5">
                    <CreditCard className="size-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Campaign Budget</h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Balance
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-3xl font-semibold text-purple-600">
                      {formatVNDCurrency(campaign.balance)}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700"
                    >
                      {Math.round(
                        (campaign.balance /
                          campaign.offers.reduce(
                            (sum, offer) => sum + offer.budget,
                            0
                          )) *
                          100
                      )}
                      % remaining
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-500">
                      Total Budget
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatVNDCurrency(
                        campaign.offers.reduce(
                          (sum, offer) => sum + offer.budget,
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-purple-600 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (campaign.balance /
                            campaign.offers.reduce(
                              (sum, offer) => sum + offer.budget,
                              0
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-center gap-2">
                <Tag className="size-5 text-purple-600" />
                <h3 className="font-medium">Budget Details</h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white p-3">
                  <span className="text-sm text-gray-600">Initial Balance</span>
                  <span className="font-medium">
                    {formatVNDCurrency(campaign.balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-3">
                  <span className="text-sm text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">
                    {formatVNDCurrency(
                      campaign.offers.reduce(
                        (sum, offer) => sum + offer.budget,
                        0
                      ) - campaign.balance
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white p-3">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium text-purple-600">
                    {formatVNDCurrency(campaign.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Offers Overview */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-purple-50 p-1.5">
                    <Tag className="size-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Offers Overview</h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Number of Offers
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-3xl font-semibold text-purple-600">
                      {campaign.offers.length}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700"
                    >
                      active
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Average Bid
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatVNDCurrency(
                        campaign.offers.reduce(
                          (sum, offer) => sum + offer.bid,
                          0
                        ) / campaign.offers.length
                      )}
                    </p>
                  </div>
                  <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Average Budget
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatVNDCurrency(
                        campaign.offers.reduce(
                          (sum, offer) => sum + offer.budget,
                          0
                        ) / campaign.offers.length
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-center gap-2">
                <Tag className="size-5 text-purple-600" />
                <h3 className="font-medium">Offers Distribution</h3>
              </div>
              <div className="mt-4 space-y-3">
                {campaign.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-200">
                        {offer.pricingModel}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Offer #{offer.id}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatVNDCurrency(offer.budget)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="border-b border-border bg-white px-6 pb-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Offers List</h2>
          <p className="mt-1 text-sm text-gray-500">
            Active offers in this campaign
          </p>
        </div>
        <div className="space-y-4">
          {campaign.offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative flex cursor-pointer gap-6 rounded-xl border p-4 transition-all hover:border-purple-100 hover:bg-purple-50/20 hover:shadow-sm"
              onClick={() => handleOfferClick(offer.id)}
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-purple-200 bg-purple-50 font-medium text-purple-700"
                    >
                      #{offer.id}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-white text-gray-700"
                    >
                      {offer.pricingModel}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(offer.startDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}{" "}
                    -{" "}
                    {format(new Date(offer.endDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {offer.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Bid:</span>
                    <span className="font-medium text-gray-900">
                      {formatVNDCurrency(offer.bid)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium text-gray-900">
                      {formatVNDCurrency(offer.budget)}
                    </span>
                  </div>
                  {offer.commissionRate && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Commission:</span>
                      <span className="font-medium text-gray-900">
                        {offer.commissionRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center text-purple-600 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="size-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
