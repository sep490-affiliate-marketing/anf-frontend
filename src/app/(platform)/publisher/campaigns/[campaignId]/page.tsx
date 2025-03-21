"use client"

import React from "react"

import Link from "next/link"
import { notFound } from "next/navigation"

import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Clock,
  Copy,
  CreditCard,
  Gem,
  Globe,
  ImageIcon,
  Info,
  Link as LinkIcon,
  Search,
  Tag,
  Zap,
} from "lucide-react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Campaign Service will be used in a real implementation
// import CampaignService from "@/services/campaign.service"

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
  status: string
  category: any | null
  offers: Offer[]
  images: string[]
  thumbnail: string | null
  joined: boolean
  advertiserName: string
  advertiserLogo: string
  createdAt: string
  conversionRate?: number
  publisherCount?: number
  terms?: string
}

// Mock campaign data for demonstration
const mockCampaign: Campaign = {
  id: 1,
  advertiserCode: "2481c765-1f1b-4e9a-8b65-24b8b044d01a",
  name: "Tiki Flash Sale Promotion",
  description:
    "Promote Tiki Flash Sale products to increase sales and conversions. High commission rates for publishers.",
  startDate: "2025-02-01T00:00:00",
  endDate: "2025-06-31T00:00:00",
  balance: 75000000,
  productUrl: "https://tiki.vn/flash-sale",
  trackingParams:
    "utm_source={publisher_id}&utm_medium=affiliate&utm_campaign=tiki_flash",
  rejectReason: null,
  categoryId: 1,
  status: "Active",
  category: "E-commerce",
  joined: false,
  advertiserName: "Tiki Corporation",
  advertiserLogo:
    "https://salt.tikicdn.com/ts/upload/c2/69/d8/5quyeJOhgrWoJE4WR7jBYXWYmqb.png",
  createdAt: "2025-05-15T10:30:00",
  conversionRate: 3.8,
  publisherCount: 128,
  terms:
    "All publishers must adhere to Tiki brand guidelines. No misleading content or spam tactics allowed.",
  offers: [
    {
      id: 1,
      pricingModel: "CPS",
      description: "Earn 5% commission on each successful sale",
      bid: 0,
      budget: 40000000,
      startDate: "2025-06-01T00:00:00",
      endDate: "2025-12-31T00:00:00",
      conversionGoal: "Successfully completed purchase",
      requirements: [
        "Traffic must be from Vietnam only",
        "No incentivized traffic allowed",
        "Publisher website must be related to e-commerce or shopping",
      ],
      approvalRate: 85,
    },
    {
      id: 2,
      pricingModel: "CPA",
      description: "Earn commission for each customer registration",
      bid: 15000,
      budget: 20000000,
      startDate: "2025-06-01T00:00:00",
      endDate: "2025-12-31T00:00:00",
      conversionGoal: "Completed user registration",
      requirements: [
        "Traffic must be from Vietnam only",
        "User must complete verification process",
      ],
      approvalRate: 92,
    },
    {
      id: 3,
      pricingModel: "CPC",
      description: "Earn for each click on flash sale products",
      bid: 2000,
      budget: 15000000,
      startDate: "2025-06-01T00:00:00",
      endDate: "2025-12-31T00:00:00",
      conversionGoal: "Valid click on product page",
      requirements: [
        "No bot traffic allowed",
        "Click must last minimum 5 seconds on landing page",
      ],
      approvalRate: 78,
    },
  ],
  images: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ],
  thumbnail:
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
}

function CampaignStatus({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
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
      <Icon className="h-3.5 w-3.5" />
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
    ...images.filter((img) => img !== thumbnail),
  ]

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
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function CampaignTimeline({ campaign }: { campaign: Campaign }) {
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
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Started {format(startDate, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
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

function JoinCampaignCard({ campaign }: { campaign: Campaign }) {
  const [isJoined, setIsJoined] = React.useState(campaign.joined)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join This Campaign</CardTitle>
        <CardDescription>
          Promote this campaign to your audience and earn commissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Quick Stats</p>
            <p className="text-xs text-muted-foreground">
              {campaign.publisherCount} publishers joined
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Gem className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Avg. Conversion Rate</p>
            <p className="text-xs text-muted-foreground">
              {campaign.conversionRate}% across all publishers
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={isJoined ? "w-full bg-red-600 hover:bg-red-700" : "w-full"}
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? "Leave Campaign" : "Join Campaign"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function TrackingInfoCard({ campaign }: { campaign: Campaign }) {
  const trackingUrl = `https://backend.affiliate-network.com/tracking${campaign.trackingParams ? (campaign.productUrl.includes("?") ? "&" : "?") + campaign.trackingParams : ""}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Error copying text: ", err)
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Information</CardTitle>
        <CardDescription>
          Use these tracking details to earn commissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Tracking URL</p>
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
            <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              {trackingUrl}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => copyToClipboard(trackingUrl)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {campaign.trackingParams && (
          <div>
            <p className="mb-2 text-sm font-medium">Tracking Parameters</p>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
              <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                {campaign.trackingParams}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                // onClick={() => copyToClipboard(campaign.trackingParams)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Replace {"{publisher_id}"} with your unique publisher ID
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <OfferBadge model={offer.pricingModel} />
          <Badge variant="outline" className="text-xs">
            {offer.approvalRate}% approval rate
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{offer.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Payout</p>
          <p className="font-medium">
            {offer.pricingModel === "CPS"
              ? "5% commission"
              : formatVNDCurrency(offer.bid)}
          </p>
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
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {offer.requirements && offer.requirements.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-sm font-medium">Requirements</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {offer.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default function CampaignDetailsPage({
  params,
}: {
  params: { campaignId: string }
}) {
  // In a real implementation, we would fetch the campaign data based on the campaignId
  // const campaign = await getCampaignData(params.campaignId);
  // if (!campaign) return notFound();

  const campaign = mockCampaign

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button and Header */}
      <div className="flex flex-col space-y-4">
        <Link
          href="/publisher/campaigns"
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to campaigns
        </Link>

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {campaign.name}
              </h1>
              <CampaignStatus status={campaign.status} />
            </div>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>

          {!campaign.joined && (
            <Button size="lg" className="gap-2">
              Join Campaign
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: Campaign details */}
        <div className="space-y-8 lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="flex h-10 w-full items-center justify-start space-x-6 border-b bg-transparent p-0">
              <TabsTrigger
                value="details"
                className="h-10 rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="h-10 rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger
                value="creatives"
                className="h-10 rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Creatives
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="h-10 rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Terms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-8">
              {/* Campaign Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Advertiser Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img
                        src={campaign.advertiserLogo}
                        alt={campaign.advertiserName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {campaign.advertiserName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined{" "}
                        {formatDistanceToNow(new Date(campaign.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Campaign Timeline */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium">
                      Campaign Timeline
                    </h3>
                    <CampaignTimeline campaign={campaign} />
                  </div>

                  <Separator />

                  {/* Campaign URL */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium">Product URL</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
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

                  <Separator />

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="text-sm font-medium">Category</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.category}
                      </p>
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
                    <CreditCard className="h-10 w-10 text-muted-foreground" />
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

            <TabsContent value="offers" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {campaign.offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="creatives" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Creatives</CardTitle>
                  <CardDescription>
                    Use these images for your promotional materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CampaignGallery
                    thumbnail={campaign.thumbnail}
                    images={campaign.images}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p>{campaign.terms}</p>
                    <h3>General Guidelines</h3>
                    <ul>
                      <li>
                        All promotional content must comply with local
                        advertising laws and regulations.
                      </li>
                      <li>
                        Publishers must not use any deceptive or misleading
                        tactics in promotion.
                      </li>
                      <li>
                        The advertiser reserves the right to reject any
                        publisher or traffic source.
                      </li>
                      <li>
                        Payment terms: Net 30 days after the end of each month.
                      </li>
                    </ul>
                    <h3>Prohibited Activities</h3>
                    <ul>
                      <li>Incentivized traffic without prior approval</li>
                      <li>Spam or unsolicited communications</li>
                      <li>Fraudulent clicks or conversions</li>
                      <li>Misleading creatives or landing pages</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column: Join campaign and tracking info */}
        <div className="space-y-6">
          <JoinCampaignCard campaign={campaign} />
          <TrackingInfoCard campaign={campaign} />
        </div>
      </div>
    </div>
  )
}
