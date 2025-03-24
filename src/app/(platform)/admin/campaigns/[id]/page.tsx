"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  AlertCircle,
  ArrowUpRight,
  BadgeX,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Loader2,
  ShieldCheck,
  Tag,
  ThumbsDown,
  ThumbsUp,
  XCircle,
  ZoomIn,
} from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { cn, formatVNDCurrency } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  status: string
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

type VerificationAction = "approve" | "reject"

// Temporary mock data - replace with actual API call
const mockCampaign: Campaign = {
  id: 1,
  advertiserCode: "2481c765-1f1b-4e9a-8b65-24b8b044d01a",
  name: "Baotangtruyentranh",
  description: "Banner at home page of baotangtruyentranh",
  startDate: "2025-05-01T00:00:00",
  endDate: "2025-12-31T00:00:00",
  balance: 15000000,
  productUrl: "https://baotangtruyentranh.com",
  trackingParams: null,
  rejectReason: null,
  categoryId: null,
  status: "Pending",
  category: null,
  thumbnail:
    "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  images: [
    "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ],
  offers: [
    {
      id: 1,
      campaignId: 1,
      pricingModel: "CPA",
      description: "Offer enter a form in the home page",
      stepInfo:
        "1. Click to the banner and redirect to the page has form. 2. Fill the information 3. Submit the form",
      startDate: "2025-05-01T00:00:00",
      endDate: "2025-08-01T00:00:00",
      bid: 100000,
      budget: 10000000,
      commissionRate: null,
      orderReturnTime: "30 days",
      imageUrl:
        "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      campaignId: 1,
      pricingModel: "CPC",
      description: "Offer click a banner in the home page",
      stepInfo: "User click the banner",
      startDate: "2025-08-15T00:00:00",
      endDate: "2025-12-31T00:00:00",
      bid: 100000,
      budget: 5000000,
      commissionRate: null,
      orderReturnTime: null,
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ],
}

function CampaignStatus({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          text: "Pending",
        }
      case "active":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: CheckCircle,
          text: "Active",
        }
      case "rejected":
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

function ImagePreview({
  src,
  alt,
  className,
  onClick,
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      <img src={src} alt={alt} className="size-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
        <ZoomIn className="size-6 text-white" />
      </div>
    </div>
  )
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-video items-center justify-center rounded-lg bg-gray-50",
        className
      )}
    >
      <ImageIcon className="size-8 text-gray-400" />
    </div>
  )
}

function CampaignGallery({
  thumbnail,
  images,
}: {
  thumbnail: string | null
  images: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const allImages = thumbnail ? [thumbnail, ...images] : images
  const slides = allImages.map((src) => ({ src }))

  // Determine which images to show
  const mainImage = thumbnail || (images.length > 0 ? images[0] : null)
  // If we have a thumbnail, we show up to 2 from images array, otherwise show 2nd and 3rd images
  const sideImages = thumbnail ? images.slice(0, 2) : images.slice(1, 3)
  // Calculate remaining images
  const totalVisibleImages = (mainImage ? 1 : 0) + sideImages.length
  const hasExtraImages = allImages.length > totalVisibleImages
  const remainingCount = allImages.length - totalVisibleImages

  return (
    <>
      <div className="flex gap-4" style={{ height: "420px" }}>
        {/* Main Image - Left Side */}
        <div className="w-[65%]">
          {mainImage ? (
            <div
              className="relative size-full overflow-hidden rounded-lg"
              onClick={() => {
                setPhotoIndex(0)
                setIsOpen(true)
              }}
            >
              <img
                src={mainImage}
                alt="Campaign main image"
                className="size-full object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder className="size-full rounded-lg" />
          )}
        </div>

        {/* Side Images - Right Side */}
        <div className="flex w-[35%] flex-col gap-4">
          {/* First side image */}
          {sideImages.length > 0 ? (
            <div
              className="relative h-1/2 w-full overflow-hidden rounded-lg"
              onClick={() => {
                const index = thumbnail ? 1 : 1
                setPhotoIndex(index)
                setIsOpen(true)
              }}
            >
              <img
                src={sideImages[0]}
                alt="Campaign additional image"
                className="size-full object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder className="h-1/2 rounded-lg" />
          )}

          {/* Second side image or placeholder with overlay */}
          {sideImages.length > 1 ? (
            <div
              className="relative h-1/2 w-full overflow-hidden rounded-lg"
              onClick={() => {
                const index = thumbnail ? 2 : 2
                setPhotoIndex(index)
                setIsOpen(true)
              }}
            >
              <img
                src={sideImages[1]}
                alt="Campaign additional image"
                className="size-full object-cover"
              />

              {/* "+X more" overlay if needed */}
              {hasExtraImages && (
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 font-semibold text-white">
                  <span className="text-lg">+{remainingCount} more</span>
                </div>
              )}
            </div>
          ) : (
            <ImagePlaceholder className="h-1/2 rounded-lg" />
          )}
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  )
}

function CampaignVerificationUI({ campaign }: { campaign: Campaign }) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationAction, setVerificationAction] =
    useState<VerificationAction | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectCategory, setRejectCategory] = useState<string>("content")
  const [isProcessing, setIsProcessing] = useState(false)
  const [reviewTabValue, setReviewTabValue] = useState<string>("overview")
  const [notifyAdvertiser, setNotifyAdvertiser] = useState(true)

  const rejectCategories = [
    {
      id: "content",
      label: "Invalid Content",
      description: "Campaign content violates guidelines or policies",
    },
    {
      id: "budget",
      label: "Budget Issues",
      description: "Insufficient budget or pricing problems",
    },
    {
      id: "targeting",
      label: "Targeting Problems",
      description: "Invalid audience targeting or reach",
    },
    {
      id: "technical",
      label: "Technical Issues",
      description: "Technical implementation problems with tracking or links",
    },
    {
      id: "other",
      label: "Other Reason",
      description: "Other rejection reason not listed above",
    },
  ]

  const handleVerificationClick = (action: VerificationAction) => {
    setVerificationAction(action)
    setIsVerifying(true)
    setReviewTabValue("overview")
  }

  const handleVerificationSubmit = async () => {
    try {
      setIsProcessing(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Replace with actual API call
      console.log("Submitting verification:", {
        action: verificationAction,
        rejectReason:
          verificationAction === "reject" ? rejectReason : undefined,
        rejectCategory:
          verificationAction === "reject" ? rejectCategory : undefined,
        notifyAdvertiser,
      })

      setIsVerifying(false)
      setRejectReason("")
    } catch (error) {
      console.error("Error submitting verification:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getButtonLabel = () => {
    if (isProcessing) return "Processing..."
    return verificationAction === "approve"
      ? "Approve Campaign"
      : "Reject Campaign"
  }

  return (
    <>
      {/* Campaign Action Bar - Persistent at top of page */}
      <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-gradient-to-r from-white to-white/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <div className="h-5 w-px bg-gray-200"></div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">
                {campaign.name}
              </h1>
              <CampaignStatus status={campaign.status} className="ml-2" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {campaign.description}
            </p>
          </div>
        </div>

        {/* Verification Action Buttons - Enhanced Design */}
        {campaign.status.toLowerCase() === "pending" && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-1.5 shadow-sm">
              <Button
                variant="ghost"
                className="gap-2 rounded-lg border-0 text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => handleVerificationClick("reject")}
              >
                <ThumbsDown className="size-4" />
                <span>Reject</span>
              </Button>
              <div className="h-5 w-px bg-gray-200" />
              <Button
                variant="ghost"
                className="gap-2 rounded-lg border-0 text-purple-700 hover:bg-purple-50 hover:text-purple-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => handleVerificationClick("approve")}
              >
                <ThumbsUp className="size-4" />
                <span>Approve</span>
              </Button>
            </div>

            <Button
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm hover:from-purple-700 hover:to-purple-600"
              onClick={() => handleVerificationClick("approve")}
            >
              <ShieldCheck className="size-4" />
              <span>Review Campaign</span>
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Verification Dialog */}
      <Dialog
        open={isVerifying}
        onOpenChange={(open) => {
          if (!isProcessing) setIsVerifying(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {verificationAction === "approve" ? (
                <>Campaign Approval</>
              ) : (
                <>
                  <BadgeX className="size-5 text-red-500" />
                  Campaign Rejection
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === "approve"
                ? "Review campaign details before approving"
                : "Please specify the reason for rejection"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Tabs
              defaultValue="overview"
              value={reviewTabValue}
              onValueChange={setReviewTabValue}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {verificationAction === "reject" ? (
                  <TabsTrigger value="reason">Rejection Details</TabsTrigger>
                ) : (
                  <TabsTrigger value="details">Campaign Details</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Campaign Summary
                    </CardTitle>
                    <CardDescription>
                      Key information about this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                      <span className="text-sm text-gray-500">Advertiser</span>
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                      <span className="text-sm text-gray-500">Timeline</span>
                      <span className="font-medium">
                        {format(new Date(campaign.startDate), "dd MMM yyyy", {
                          locale: vi,
                        })}{" "}
                        -
                        {format(new Date(campaign.endDate), "dd MMM yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                      <span className="text-sm text-gray-500">
                        Total Budget
                      </span>
                      <span className="font-medium">
                        {formatVNDCurrency(
                          campaign.offers.reduce(
                            (sum, offer) => sum + offer.budget,
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-500">Offers</span>
                      <Badge variant="outline" className="font-medium">
                        {campaign.offers.length} offers
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {verificationAction === "approve" ? (
                  <div className="flex items-center rounded-lg border border-purple-100 bg-purple-50 p-3 text-purple-800">
                    <Info className="mr-2 size-5 text-purple-500" />
                    <p className="text-sm">
                      Approving will make this campaign active and visible to
                      publishers
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center rounded-lg border border-red-100 bg-red-50 p-3 text-red-800">
                    <Info className="mr-2 size-5 text-red-500" />
                    <p className="text-sm">
                      Rejection requires providing a reason. The advertiser will
                      be notified.
                    </p>
                  </div>
                )}
              </TabsContent>

              {verificationAction === "reject" ? (
                <TabsContent value="reason" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        Rejection Reason
                      </CardTitle>
                      <CardDescription>
                        Select a category and provide details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup
                        value={rejectCategory}
                        onValueChange={setRejectCategory}
                        className="space-y-3"
                      >
                        {rejectCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={category.id}
                              id={category.id}
                            />
                            <Label
                              htmlFor={category.id}
                              className="flex flex-col"
                            >
                              <span className="font-medium">
                                {category.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {category.description}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="pt-2">
                        <Label
                          htmlFor="rejection-details"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Detailed Explanation
                        </Label>
                        <Textarea
                          id="rejection-details"
                          placeholder="Please provide specific details about the rejection reason..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          <Info className="size-4 text-gray-500" />
                          <Label
                            htmlFor="notify-advertiser"
                            className="text-sm text-gray-700"
                          >
                            Notify Advertiser
                          </Label>
                        </div>
                        <Switch
                          id="notify-advertiser"
                          checked={notifyAdvertiser}
                          onCheckedChange={setNotifyAdvertiser}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ) : (
                <TabsContent value="details" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        Campaign Details
                      </CardTitle>
                      <CardDescription>
                        Additional information about this campaign
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="overflow-hidden rounded-lg border">
                        <div className="border-b bg-gray-50 px-4 py-2">
                          <h4 className="text-sm font-medium">
                            Offers ({campaign.offers.length})
                          </h4>
                        </div>
                        <div className="divide-y">
                          {campaign.offers.map((offer) => (
                            <div
                              key={offer.id}
                              className="flex items-center justify-between px-4 py-2.5"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  {offer.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {offer.pricingModel} · Budget:{" "}
                                  {formatVNDCurrency(offer.budget)}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {offer.pricingModel}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          <Info className="size-4 text-gray-500" />
                          <Label
                            htmlFor="notify-approval"
                            className="text-sm text-gray-700"
                          >
                            Notify Advertiser on Approval
                          </Label>
                        </div>
                        <Switch
                          id="notify-approval"
                          className="ml-auto"
                          checked={notifyAdvertiser}
                          onCheckedChange={setNotifyAdvertiser}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <DialogFooter className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (!isProcessing) {
                  setIsVerifying(false)
                  setRejectReason("")
                }
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerificationSubmit}
              disabled={
                isProcessing ||
                (verificationAction === "reject" && rejectReason.trim() === "")
              }
              className={cn(
                "min-w-[140px]",
                verificationAction === "approve"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>{getButtonLabel()}</span>
                </div>
              ) : (
                <>
                  {verificationAction === "approve" ? (
                    <CheckCircle className="mr-2 size-4" />
                  ) : (
                    <XCircle className="mr-2 size-4" />
                  )}
                  {getButtonLabel()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CampaignHeader({ campaign }: { campaign: Campaign }) {
  // Replacement of old header content with new component
  return (
    <div className="relative space-y-6 bg-gradient-to-b from-white to-gray-50/20">
      <CampaignVerificationUI campaign={campaign} />
    </div>
  )
}

export default function CampaignDetailsPage({ params: paramsPromise }: Props) {
  const campaign = mockCampaign
  const router = useRouter()

  // Unwrap params using React.use() as recommended by Next.js
  const params = React.use(paramsPromise)
  const { id } = params

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
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-purple-50 p-1.5">
                <ImageIcon className="size-4 text-purple-600" />
              </div>
              <h3 className="font-medium">Campaign Images</h3>
            </div>
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
              className="group relative flex cursor-pointer gap-6 rounded-xl border p-4 transition-all hover:border-purple-100 hover:bg-gray-50/50 hover:shadow-sm"
              onClick={() => handleOfferClick(offer.id)}
            >
              <div className="w-48 shrink-0">
                {offer.imageUrl ? (
                  <ImagePreview
                    src={offer.imageUrl}
                    alt={offer.description}
                    className="aspect-video ring-1 ring-gray-200 transition-all group-hover:ring-purple-200"
                  />
                ) : (
                  <ImagePlaceholder className="aspect-video" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      #{offer.id}
                    </span>
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
                <p className="text-sm text-gray-600">{offer.description}</p>
                <div className="flex items-center gap-6 text-sm">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
