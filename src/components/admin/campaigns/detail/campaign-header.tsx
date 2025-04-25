"use client"

import { useState } from "react"

import { CampaignStatusEnum } from "@/enums/campaign-status"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  BadgeX,
  CheckCircle,
  ChevronLeft,
  Info,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import "yet-another-react-lightbox/styles.css"

import { formatVNDCurrency } from "@/lib/utils"

import { useUpdateCampaignStatus } from "@/hooks/campaign"

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
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationAction, setVerificationAction] =
    useState<VerificationAction | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectCategory, setRejectCategory] = useState<string>("content")
  const [reviewTabValue, setReviewTabValue] = useState<string>("overview")

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateCampaignStatus()

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
    if (!verificationAction) return

    const status = verificationAction === "approve" ? "verified" : "rejected"
    const reason = verificationAction === "reject" ? rejectReason : undefined

    updateStatus(
      {
        id: campaign.id,
        status,
        rejectReason: reason,
      },
      {
        onSuccess: () => {
          setIsVerifying(false)
          setRejectReason("")
        },
      }
    )
  }

  return (
    <>
      {/* Campaign Action Bar - Persistent at top of page */}
      <div className="sticky top-0 z-10 flex w-full flex-col border-b bg-gradient-to-r from-white to-white/90 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
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
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {truncateText(campaign.description, 120)}
            </p>
          </div>
        </div>

        {/* Verification Action Buttons - Enhanced Design */}
        {campaign.status.toLowerCase() === "pending" && (
          <div className="mt-3 flex shrink-0 items-center gap-3 sm:mt-0">
            <Button
              className="w-full gap-2 bg-purple-600 text-white shadow-sm hover:bg-purple-700 sm:w-auto"
              onClick={() => handleVerificationClick("approve")}
              disabled={isUpdating}
            >
              <ShieldCheck className="size-4" />
              <span className="sm:hidden">Approve</span>
              <span className="hidden sm:inline">Approve Campaign</span>
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Verification Dialog */}
      <Dialog
        open={isVerifying}
        onOpenChange={(open) => {
          if (!isUpdating) setIsVerifying(open)
        }}
      >
        <DialogContent className="flex max-h-[90vh] flex-col gap-4 overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {verificationAction === "approve" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex w-full items-center gap-2 overflow-hidden">
                        <ShieldCheck className="size-5 text-purple-500" />
                        <span className="truncate">Approve Campaign</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{campaign.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <BadgeX className="size-5 text-red-500" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate">Reject Campaign</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{campaign.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === "approve"
                ? "Review campaign details before approving"
                : "Please specify the reason for rejection"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
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
                  <CardContent>
                    <div className="space-y-3 pr-1">
                      <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                        <span className="text-sm text-gray-500">
                          Advertiser
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="max-w-[120px] truncate font-medium sm:max-w-[240px]">
                                campaign
                                {campaign.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{campaign.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                        <span className="text-sm text-gray-500">Timeline</span>
                        <span className="font-medium">
                          {format(new Date(campaign.startDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}{" "}
                          -
                          {format(new Date(campaign.endDate), "dd/MM/yyyy", {
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
                    </div>
                  </CardContent>
                </Card>
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
                    <CardContent>
                      <div className="pr-1">
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Left Column - Rejection Categories */}
                          <div className="space-y-4">
                            <div className="text-sm font-medium text-gray-700">
                              Rejection Category
                            </div>
                            <RadioGroup
                              value={rejectCategory}
                              onValueChange={setRejectCategory}
                              className="grid gap-2 sm:grid-cols-2 md:grid-cols-1"
                            >
                              {rejectCategories.map((category) => (
                                <div
                                  key={category.id}
                                  className={`flex items-start space-x-2 rounded-md border p-2.5 transition-colors ${
                                    rejectCategory === category.id
                                      ? "border-purple-100 bg-purple-50"
                                      : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={category.id}
                                    id={category.id}
                                    className="mt-0.5"
                                  />
                                  <Label
                                    htmlFor={category.id}
                                    className="flex w-full cursor-pointer flex-col"
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
                          </div>

                          {/* Right Column - Detailed Explanation */}
                          <div className="space-y-4">
                            <div className="text-sm font-medium text-gray-700">
                              Detailed Explanation
                            </div>
                            <div className="space-y-1.5">
                              <Textarea
                                id="rejection-details"
                                placeholder="Please provide specific details about the rejection reason..."
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                className="min-h-[150px] resize-none md:min-h-[220px]"
                              />
                              <div className="flex justify-between px-1 text-xs text-gray-500">
                                <span>
                                  {rejectReason.length === 0
                                    ? "Please provide a detailed explanation"
                                    : ""}
                                </span>
                                <span>
                                  {rejectReason.length} character
                                  {rejectReason.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
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
                    <CardContent>
                      <div className="space-y-4 pr-1">
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
                                <div className="min-w-0 flex-1 pr-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate text-sm font-medium">
                                          {offer.description}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{offer.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <p className="truncate text-xs text-gray-500">
                                    {offer.pricingModel} · Budget:{" "}
                                    {formatVNDCurrency(offer.budget)}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-xs"
                                >
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
                            defaultChecked
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {verificationAction === "approve" && (
            <div className="shrink-0 items-center rounded-lg border border-purple-100 bg-purple-50 px-4 py-3 text-purple-800">
              <div className="flex items-center">
                <Info className="mr-2 size-5 text-purple-500" />
                <p className="text-sm">
                  Approving will make this campaign active and visible to
                  publishers
                </p>
              </div>
            </div>
          )}

          {verificationAction === "reject" && (
            <div className="flex shrink-0 items-center rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-800">
              <Info className="mr-3 size-5 text-red-500" />
              <p className="text-sm">
                {rejectReason.trim() === ""
                  ? "Please provide a reason for rejection before continuing"
                  : "The advertiser will be notified about this rejection"}
              </p>
            </div>
          )}

          <div className="shrink-0 pt-3">
            <div className="mb-4 h-px w-full bg-gray-100"></div>
            <DialogFooter className="flex w-full flex-col-reverse gap-3 px-0 sm:flex-row sm:justify-end">
              {verificationAction === "approve" ? (
                <>
                  <Button
                    onClick={() => {
                      setVerificationAction("reject")
                      setReviewTabValue("reason")
                    }}
                    disabled={isUpdating}
                    variant="outline"
                    className="w-full gap-2 border-red-100 bg-white text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700 sm:w-auto"
                  >
                    <XCircle className="size-4" />
                    <span>Reject</span>
                  </Button>
                  <Button
                    onClick={handleVerificationSubmit}
                    disabled={isUpdating}
                    className="w-full gap-2 bg-purple-600 text-white shadow-sm hover:bg-purple-700 sm:w-auto"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 size-4" />
                        Approve Campaign
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      if (!isUpdating) {
                        setIsVerifying(false)
                        setRejectReason("")
                      }
                    }}
                    disabled={isUpdating}
                    variant="outline"
                    className="w-full border-gray-200 bg-white shadow-sm hover:bg-gray-50 sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerificationSubmit}
                    disabled={isUpdating || rejectReason.trim() === ""}
                    className="w-full gap-2 bg-red-600 text-white shadow-sm hover:bg-red-700 sm:w-auto"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <XCircle className="mr-2 size-4" />
                        Reject Campaign
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
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
