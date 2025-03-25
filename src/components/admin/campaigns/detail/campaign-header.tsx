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

import { cn, formatVNDCurrency } from "@/lib/utils"

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

import { CampaignStatus } from "@/components/admin/campaigns/detail/campaign-status"

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
  const [notifyAdvertiser, setNotifyAdvertiser] = useState(true)
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
        campaignStatus: status,
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

  const getButtonLabel = () => {
    if (isUpdating) return "Processing..."
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
            <Button
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm hover:from-purple-700 hover:to-purple-600"
              onClick={() => handleVerificationClick("approve")}
              disabled={isUpdating}
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
          if (!isUpdating) setIsVerifying(open)
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
                if (!isUpdating) {
                  setIsVerifying(false)
                  setRejectReason("")
                }
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerificationSubmit}
              disabled={
                isUpdating ||
                (verificationAction === "reject" && rejectReason.trim() === "")
              }
              className={cn(
                "min-w-[140px]",
                verificationAction === "approve"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {isUpdating ? (
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

export function CampaignHeader({ campaign }: { campaign: Campaign }) {
  // Replacement of old header content with new component
  return (
    <div className="relative space-y-6 bg-gradient-to-b from-white to-gray-50/20">
      <CampaignVerificationUI campaign={campaign} />
    </div>
  )
}
