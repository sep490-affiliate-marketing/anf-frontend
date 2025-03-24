"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  HelpCircle,
  Image as ImageIcon,
  Tag,
  ZoomIn,
} from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { cn, formatVNDCurrency } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
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

function CampaignHeader({ campaign }: { campaign: Campaign }) {
  return (
    <div className="relative space-y-6 bg-gradient-to-b from-white to-gray-50/20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {campaign.name}
            </h1>
            <CampaignStatus status={campaign.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaign.description}
          </p>
        </div>
      </div>
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
