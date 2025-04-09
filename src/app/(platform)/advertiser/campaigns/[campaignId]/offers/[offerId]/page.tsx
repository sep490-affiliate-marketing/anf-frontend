"use client"

import React, { useState } from "react"

import Link from "next/link"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  FileCode,
  Info,
  Megaphone,
  PieChart,
  Settings,
} from "lucide-react"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetOfferDetails } from "@/hooks/offer"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { OfferStatusBadge } from "@/components/badge/offer-status-badge"
import { EmptyTable } from "@/components/data-table/empty-table"
import { Spinner } from "@/components/spinner"

interface OfferDetailParams {
  params: Promise<{
    campaignId: string
    offerId: string
  }>
}

// Placeholder stats data that might not be in the API response
const placeholderStats = {
  spent: 0,
  clicks: 0,
  conversions: 0,
  conversionRate: 0,
  trackingUrl:
    "https://backend.affiliate-network.com/tracking?aff_id={affiliate_id}&source={source}",
}

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function OfferDetailPage({
  params: paramsPromise,
}: OfferDetailParams) {
  const [activeTab, setActiveTab] = useState("overview")

  // Unwrap params using React.use() as recommended by Next.js
  const params = React.use(paramsPromise)
  const { campaignId, offerId } = params

  const {
    data: offerResData,
    isLoading,
    isFetching,
  } = useGetOfferDetails(Number(offerId))

  // If data isn't loaded yet, use a loading state or fallback
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    )
  }

  if (!offerResData) {
    return (
      <EmptyTable
        title="Offer not found"
        description={`The requested offer does not exist: ${offerId}`}
        onRefresh={() => {}}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Link href={`/advertiser/campaigns/${campaignId}`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              Offer #{offerResData?.id}
            </h1>
            <OfferStatusBadge status={offerResData?.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {offerResData?.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="size-4" />
            Settings
          </Button>
          <Button className="gap-2">
            <Megaphone className="size-4" />
            Promote
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="border-b">
            <TabsList className="h-auto justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <PieChart className="size-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <BarChart3 className="size-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <Info className="size-4" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="tracking"
                className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <FileCode className="size-4" />
                Tracking
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Budget"
                value={formatVNDCurrency(offerResData.budget)}
                icon={<CreditCard className="size-4 text-gray-400" />}
                description="Total budget allocated"
              />
              <StatCard
                title="Bid Amount"
                value={formatVNDCurrency(offerResData.bid)}
                icon={<DollarSign className="size-4 text-gray-400" />}
                description={`Per ${offerResData.pricingModel} payout`}
              />
              <StatCard
                title="Campaign ID"
                value={offerResData.campaignId}
                icon={<Megaphone className="size-4 text-gray-400" />}
              />
              <StatCard
                title="Pricing Model"
                value={offerResData.pricingModel || "N/A"}
                icon={<PieChart className="size-4 text-gray-400" />}
              />
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-1">
              {/* Offer Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="size-5 text-purple-600" />
                    Offer Information
                  </CardTitle>
                  <CardDescription>Details about this offer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Offer Description */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-sm text-gray-600">
                      {offerResData.description}
                    </p>
                  </div>

                  {/* Steps Information */}
                  {offerResData.stepInfo && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">
                        Conversion Steps
                      </h3>
                      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        {offerResData.stepInfo}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Date Range
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>
                          {format(
                            new Date(offerResData.startDate),
                            "dd/MM/yyyy",
                            {
                              locale: vi,
                            }
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(offerResData.endDate),
                            "dd/MM/yyyy",
                            {
                              locale: vi,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Pricing Model
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <DollarSign className="size-4 text-gray-400" />
                        <Badge variant="outline" className="text-gray-700">
                          {offerResData.pricingModel || "N/A"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Payout
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <span>{formatVNDCurrency(offerResData.bid)}</span>
                        <span className="text-gray-400">
                          per {offerResData.pricingModel}
                        </span>
                      </div>
                    </div>
                    {offerResData.orderReturnTime && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Return Time
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Clock className="size-4 text-gray-400" />
                          <span>{offerResData.orderReturnTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tracking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="size-5 text-purple-600" />
                  Tracking Information
                </CardTitle>
                <CardDescription>
                  Use these details to track your promotions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Tracking URL</h3>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-600">
                    <code className="break-all">
                      {placeholderStats.trackingUrl}
                    </code>
                    <Button variant="ghost" size="sm" className="size-8 p-0">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Replace {"{affiliate_id}"} with your affiliate ID and{" "}
                    {"{source}"} with your traffic source.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>
                  View detailed statistics for this offer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="py-10 text-center text-gray-500">
                  Statistics data not available yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Offer Details</CardTitle>
                <CardDescription>
                  Complete details and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">
                        Campaign ID
                      </h4>
                      <p className="font-medium">{offerResData.campaignId}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">
                        Pricing Model
                      </h4>
                      <p className="font-medium">
                        {offerResData.pricingModel || "N/A"}
                      </p>
                    </div>
                    {offerResData.pubOfferStatus !== undefined && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">
                          Publisher Offer Status
                        </h4>
                        <p className="font-medium">
                          {offerResData.pubOfferStatus}
                        </p>
                      </div>
                    )}
                    {offerResData.rejectedReason && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">
                          Rejection Reason
                        </h4>
                        <p className="font-medium">
                          {offerResData.rejectedReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracking Setup</CardTitle>
                <CardDescription>
                  Advanced tracking configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 font-medium">
                      Implementation Instructions
                    </h3>
                    <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600">
                      <li>Copy the tracking URL with your affiliate ID</li>
                      <li>Place it in your promotional materials</li>
                      <li>Test the link to ensure proper tracking</li>
                      <li>Monitor your statistics to measure performance</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
