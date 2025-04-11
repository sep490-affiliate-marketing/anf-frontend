"use client"

import Link from "next/link"

import { env } from "@/env"
import { useAuth } from "@/providers/auth-provider"
import { differenceInDays, format } from "date-fns"
import {
  Calendar,
  ChevronLeft,
  Clock,
  CreditCard,
  Globe,
  ImageIcon,
  Info,
} from "lucide-react"
import { toast } from "sonner"

import { ICampaign } from "@/types/campaign.type"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetCampaignDetailForPublisher } from "@/hooks/campaign"
import { useJoinOffer } from "@/hooks/offer"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CopyToClipboardTextarea } from "@/components/ui/textarea/copy-to-clipboard-textarea"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ExtendedCampaign extends ICampaign {
  joined?: boolean
  publisherCount?: number
  conversionRate?: number
  terms?: string
}

function CampaignStatus({ status }: { status: string | undefined | null }) {
  const getStatusConfig = (status: string | undefined | null) => {
    if (!status) {
      return {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Info,
        text: "Unknown",
      }
    }

    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: Info,
          text: "Active",
        }
      case "pending":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          text: "Pending",
        }
      case "paused":
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Info,
          text: "Paused",
        }
      case "completed":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Info,
          text: "Completed",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Info,
          text: status,
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1.5 px-2.5 py-0.5 font-medium`}
    >
      <Icon className="size-3.5" />
      {config.text}
    </Badge>
  )
}

function OfferBadge({ model }: { model: string }) {
  const getModelConfig = (model: string) => {
    switch (model.toUpperCase()) {
      case "CPA":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          tooltip: "Cost Per Acquisition",
        }
      case "CPC":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          tooltip: "Cost Per Click",
        }
      case "CPL":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          tooltip: "Cost Per Lead",
        }
      case "CPS":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          tooltip: "Cost Per Sale",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          tooltip: model,
        }
    }
  }

  const config = getModelConfig(model)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${config.color} px-2 py-0.5 font-medium`}
          >
            {model.toUpperCase()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function CampaignDetails({ campaignId }: { campaignId: number }) {
  const {
    data: campaignData,
    isLoading,
    error,
  } = useGetCampaignDetailForPublisher(campaignId)

  const campaign = campaignData?.value as ExtendedCampaign | undefined
  const { user } = useAuth()
  const { mutate: joinOffer, isPending } = useJoinOffer(campaignId)

  const handleJoinOffer = (offerId: number) => {
    joinOffer(offerId, {
      onError: () => {
        toast.error("Failed to join the offer. Please try again.")
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Loading campaign details...</h3>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error loading campaign details
          </h3>
          <p className="text-sm text-muted-foreground">
            The campaign you&apos;re looking for might not exist or you
            don&apos;t have permission to view it.
          </p>
          <Link href="/publisher/campaigns" className="mt-4 inline-block">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="size-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate days left and campaign progress
  const startDate = new Date(campaign.startDate)
  const endDate = new Date(campaign.endDate)
  const now = new Date()
  const daysLeft = Math.max(0, differenceInDays(endDate, now))
  const totalDuration = differenceInDays(endDate, startDate)
  const progressPercent = Math.min(
    100,
    Math.max(0, (differenceInDays(now, startDate) / totalDuration) * 100)
  )

  // Generate timeline items
  const timelineItems = [
    {
      date: format(startDate, "MMM d, yyyy"),
      title: "Campaign Starts",
      content: "Campaign officially begins",
      isCompleted: now >= startDate,
    },
    ...campaign.offers.flatMap((offer) => [
      {
        date: format(new Date(offer.startDate), "MMM d, yyyy"),
        title: `${offer.pricingModel} Offer Starts`,
        content: `${offer.description} begins`,
        isCompleted: now >= new Date(offer.startDate),
      },
      {
        date: format(new Date(offer.endDate), "MMM d, yyyy"),
        title: `${offer.pricingModel} Offer Ends`,
        content: `${offer.description} concludes`,
        isCompleted: now >= new Date(offer.endDate),
      },
    ]),
    {
      date: format(endDate, "MMM d, yyyy"),
      title: "Campaign Ends",
      content: "Campaign concludes",
      isCompleted: now >= endDate,
    },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="mx-auto max-w-6xl bg-white">
      {/* Header Section */}
      <div className="border-b">
        <div className="mx-auto px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/publisher/campaigns">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-gray-500"
                >
                  <ChevronLeft className="size-3.5" />
                  Campaigns
                </Button>
              </Link>
              <CampaignStatus status={campaign.status} />
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="px-2 py-0.5 text-xs text-gray-500"
              >
                ID: {campaign.id}
              </Badge>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-7">
            <div className="md:col-span-5">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {campaign.name}
              </h1>
              <p className="mt-1 text-gray-500">{campaign.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {format(startDate, "MMM d, yyyy")} —{" "}
                      {format(endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span>{daysLeft} days left</span>
                    </div>
                    <Progress value={progressPercent} className="h-1" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Budget</p>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {formatVNDCurrency(campaign.balance)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-gray-400" />
                  <a
                    href={campaign.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {campaign.productUrl}
                  </a>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-video overflow-hidden rounded-lg">
                {campaign.campImages?.[0] ? (
                  <img
                    src={campaign.campImages[0]}
                    alt={campaign.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-50">
                    <ImageIcon className="size-8 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="border-b px-6 py-8">
        <h2 className="mb-6 text-base font-medium text-gray-900">
          Campaign Timeline
        </h2>
        <Timeline orientation="horizontal">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={index}
              isCompleted={item.isCompleted}
              orientation="horizontal"
              className="ml-0"
            >
              <TimelineIcon
                isCompleted={item.isCompleted}
                orientation="horizontal"
              />
              <TimelineDate className="text-sm text-gray-500">
                {item.date}
              </TimelineDate>
              <TimelineTitle className="text-sm font-medium">
                {item.title}
              </TimelineTitle>
              <TimelineContent className="text-sm text-gray-600">
                {item.content}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 px-6 py-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-6 text-base font-medium text-gray-900">
            Available Offers
          </h2>
          <div className="space-y-6">
            {campaign.offers.map((offer) => {
              // Generate tracking URL
              const trackingUrl =
                env.NEXT_PUBLIC_BACKEND_URL +
                "/api/affiliate-network/tracking?offerId=" +
                offer.id +
                "&publisherCode=" +
                user?.userCode

              // Define button configuration
              const buttonConfig = {
                text:
                  offer.pubOfferStatus === 2
                    ? "Joined"
                    : offer.pubOfferStatus === 1
                      ? "Pending Approval"
                      : offer.pubOfferStatus === 3
                        ? "Rejected"
                        : isPending
                          ? "Joining..."
                          : "Join Offer",
                disabled:
                  offer.pubOfferStatus === 1 ||
                  offer.pubOfferStatus === 2 ||
                  offer.pubOfferStatus === 3 ||
                  isPending,
                variant:
                  offer.pubOfferStatus === 2
                    ? ("outline" as const)
                    : offer.pubOfferStatus === 3
                      ? ("destructive" as const)
                      : ("default" as const),
              }

              return (
                <div key={offer.id} className="rounded-lg border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <OfferBadge model={offer.pricingModel} />
                    {offer.pubOfferStatus === 2 && (
                      <Badge
                        variant="secondary"
                        className="border-green-200 bg-green-100 text-xs text-green-700"
                      >
                        Joined
                      </Badge>
                    )}
                    {offer.pubOfferStatus === 1 && (
                      <Badge
                        variant="secondary"
                        className="border-yellow-200 bg-yellow-100 text-xs text-yellow-700"
                      >
                        Pending
                      </Badge>
                    )}
                    {offer.pubOfferStatus === 3 && (
                      <Badge
                        variant="secondary"
                        className="border-red-200 bg-red-100 text-xs text-red-700"
                      >
                        Rejected
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-4 text-base font-medium">
                    {offer.description}
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Payout</p>
                      <p className="text-lg font-medium">
                        {formatVNDCurrency(offer.bid)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Budget</span>
                        <span>{formatVNDCurrency(offer.budget)}</span>
                      </div>
                      <Progress value={70} className="mb-1 mt-1.5 h-1" />
                      <p className="text-right text-xs text-gray-500">
                        70% used
                      </p>
                    </div>
                  </div>

                  {offer.stepInfo && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">
                        Implementation Steps
                      </p>
                      <p className="text-sm">{offer.stepInfo}</p>
                    </div>
                  )}

                  {offer.pubOfferStatus === 1 && (
                    <div className="mt-6">
                      <Separator className="mb-4" />
                      <h4 className="mb-2 text-xs font-medium text-gray-900">
                        Tracking URL
                      </h4>
                      <CopyToClipboardTextarea
                        rows={2}
                        value={trackingUrl}
                        className="text-xs"
                      />
                    </div>
                  )}

                  {offer.pubOfferStatus === 2 && (
                    <div className="mt-6">
                      <Separator className="mb-4" />
                      <h4 className="mb-2 text-xs font-medium text-gray-900">
                        Your Tracking URL
                      </h4>
                      <CopyToClipboardTextarea
                        rows={2}
                        value={trackingUrl}
                        className="text-xs"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Use this URL in your marketing materials to track
                        conversions.
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <Button
                      className="w-full"
                      variant={buttonConfig.variant}
                      disabled={buttonConfig.disabled}
                      onClick={() => handleJoinOffer(offer.id)}
                    >
                      {buttonConfig.text}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-base font-medium text-gray-900">
            Budget Allocation
          </h2>
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-6">
              <p className="text-xs text-gray-500">Total Campaign Budget</p>
              <p className="text-2xl font-semibold">
                {formatVNDCurrency(campaign.balance)}
              </p>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              {campaign.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <OfferBadge model={offer.pricingModel} />
                    <span className="max-w-[150px] truncate text-sm">
                      {offer.description}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatVNDCurrency(offer.budget)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-900">
              Product Details
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 size-3.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <a
                    href={campaign.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {campaign.productUrl}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="mt-0.5 size-3.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Campaign Period</p>
                  <p className="text-sm">
                    {format(startDate, "MMM d, yyyy")} —{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 size-3.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Campaign ID</p>
                  <p className="text-sm">{campaign.id}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
