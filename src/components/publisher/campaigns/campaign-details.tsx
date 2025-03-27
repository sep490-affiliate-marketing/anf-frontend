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

import {
  useGetCampaignDetailForPublisher,
  useJoinOffer,
} from "@/hooks/campaign"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyToClipboardTextarea } from "@/components/ui/textarea/copy-to-clipboard-textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Format currency helper
const formatVNDCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount)
}

interface Offer {
  id: number
  pricingModel: string
  description: string
  bid: number
  budget: number
  startDate: string
  endDate: string
  conversionGoal?: string
  requirements?: string[]
  approvalRate?: number
  pubOfferStatus: number | null
}

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

function CampaignGallery({
  thumbnail,
  images,
}: {
  thumbnail: string | null
  images: string[]
}) {
  const allImages = [
    ...(thumbnail ? [thumbnail] : []),
    ...(images || []).filter((img) => img !== thumbnail),
  ]

  if (allImages.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border">
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No images available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {allImages.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-lg border"
        >
          <img
            src={image}
            alt={`Campaign image ${index + 1}`}
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function CampaignTimeline({ campaign }: { campaign: ExtendedCampaign }) {
  const startDate = new Date(campaign.startDate)
  const endDate = new Date(campaign.endDate)
  const now = new Date()

  // Calculate days left and total duration
  const daysLeft = Math.max(0, differenceInDays(endDate, now))
  const totalDuration = differenceInDays(endDate, startDate)
  const daysElapsed = Math.min(totalDuration, differenceInDays(now, startDate))

  // Calculate progress percentage
  const progress = Math.min(
    100,
    Math.max(0, (daysElapsed / totalDuration) * 100)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-sm">
            Started {format(startDate, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-sm">Ends {format(endDate, "MMM d, yyyy")}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-end">
          <Badge variant="outline" className="text-xs">
            {daysLeft} days left
          </Badge>
        </div>
      </div>
    </div>
  )
}

function OfferCard({
  offer,
  campaignId,
}: {
  offer: Offer
  campaignId: number
}) {
  const { mutate: joinOffer, isPending } = useJoinOffer(campaignId)
  const { user } = useAuth()
  const trackingUrl =
    env.NEXT_PUBLIC_BACKEND_URL +
    "/api/tracking?offerId=" +
    offer.id +
    "&publisherCode=" +
    user?.userCode

  const handleJoinOffer = () => {
    joinOffer(offer.id, {
      onSuccess: () => {
        toast.success("Successfully joined the offer")
      },
      onError: () => {
        toast.error("Failed to join the offer. Please try again.")
      },
    })
  }

  const getButtonConfig = () => {
    // pubOfferStatus:
    // 0: Not joined
    // 1: Pending approval
    // 2: Joined
    // 3: Rejected
    switch (offer.pubOfferStatus) {
      case 2:
        return {
          text: "Joined",
          disabled: true,
          variant: "outline" as const,
        }
      case 1:
        return {
          text: "Pending Approval",
          disabled: true,
          variant: "outline" as const,
        }
      case 3:
        return {
          text: "Rejected",
          disabled: true,
          variant: "destructive" as const,
        }
      case 0:
      default:
        return {
          text: isPending ? "Joining..." : "Join Offer",
          disabled: isPending,
          variant: "default" as const,
          onClick: handleJoinOffer,
        }
    }
  }

  const buttonConfig = getButtonConfig()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <OfferBadge model={offer.pricingModel} />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {offer.approvalRate}% approval rate
            </Badge>
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
        </div>
        <CardTitle className="mt-2 text-lg">{offer.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Payout</p>
          <p className="font-medium">{formatVNDCurrency(offer.bid)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Budget</p>
          <Progress value={70} className="h-1.5" />
          <div className="flex items-center justify-between text-xs">
            <span>{formatVNDCurrency(offer.budget * 0.7)} used</span>
            <span className="font-medium">
              {formatVNDCurrency(offer.budget)}
            </span>
          </div>
        </div>

        {offer.conversionGoal && (
          <div>
            <p className="text-sm text-muted-foreground">Conversion Goal</p>
            <p className="text-sm">{offer.conversionGoal}</p>
          </div>
        )}
        {offer.pubOfferStatus === 1 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-base font-medium text-accent-foreground">
                Tracking URL
              </h3>
              <p className="text-xs text-muted-foreground">
                Copy the tracking URL to your app
              </p>

              <div className="mt-3 w-full">
                <CopyToClipboardTextarea
                  rows={3}
                  value={trackingUrl}
                  className="mt-2"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {offer.requirements && offer.requirements.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-sm font-medium">Requirements</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {offer.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className="w-full"
          variant={buttonConfig.variant}
          disabled={buttonConfig.disabled}
          onClick={buttonConfig.onClick}
        >
          {buttonConfig.text}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CampaignDetails({ campaignId }: { campaignId: number }) {
  const {
    data: campaignData,
    isLoading,
    error,
  } = useGetCampaignDetailForPublisher(campaignId)

  const campaign = campaignData?.value as ExtendedCampaign | undefined

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
              <ChevronLeft className="h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/publisher/campaigns">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>
        <CampaignStatus status={campaign.status} />
      </div>

      {/* Campaign Header */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="mt-2 text-muted-foreground">{campaign.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {campaign.productUrl}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(campaign.startDate), "dd MMM yyyy")} -{" "}
                {format(new Date(campaign.endDate), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="offers" className="w-full">
            <TabsList>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="creatives">Creatives</TabsTrigger>
            </TabsList>
            <TabsContent value="offers" className="space-y-4">
              {campaign.offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  campaignId={campaignId}
                />
              ))}
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Information</CardTitle>
                  <CardDescription>
                    Detailed information about the campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.description}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-3 text-sm font-medium">Product URL</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-muted-foreground" />
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
                </CardContent>
              </Card>

              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Budget
                      </p>
                      <p className="text-2xl font-bold">
                        {formatVNDCurrency(campaign.balance)}
                      </p>
                    </div>
                    <CreditCard className="size-10 text-muted-foreground" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Budget Allocation</h3>
                    {campaign.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <OfferBadge model={offer.pricingModel} />
                          <span className="text-sm">
                            {offer.description.substring(0, 30)}...
                          </span>
                        </div>
                        <span className="font-medium">
                          {formatVNDCurrency(offer.budget)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="creatives">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Creatives</CardTitle>
                  <CardDescription>
                    Images and creative materials for the campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CampaignGallery
                    thumbnail={campaign.campImages?.[0] || null}
                    images={(campaign.campImages || [])
                      .map((img) => img || "")
                      .filter(Boolean)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <CampaignTimeline campaign={campaign} />
        </div>
      </div>
    </div>
  )
}
