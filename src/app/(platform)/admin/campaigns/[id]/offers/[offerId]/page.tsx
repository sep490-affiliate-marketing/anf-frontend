"use client"

import React, { useState } from "react"

import Link from "next/link"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileCode,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Megaphone,
  PieChart,
  Settings,
} from "lucide-react"

import { formatVNDCurrency } from "@/lib/utils"

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

interface OfferDetailParams {
  params: Promise<{
    id: string
    offerId: string
  }>
}

// Mock data for the offer
const mockOffer = {
  id: 1,
  campaignId: 1,
  campaignName: "Baotangtruyentranh",
  pricingModel: "CPA",
  status: "Active",
  description: "Offer enter a form in the home page",
  stepInfo:
    "1. Click to the banner and redirect to the page has form. 2. Fill the information 3. Submit the form",
  startDate: "2025-05-01T00:00:00",
  endDate: "2025-08-01T00:00:00",
  bid: 100000,
  budget: 10000000,
  spent: 2500000,
  commissionRate: null,
  orderReturnTime: "30 days",
  clicks: 3250,
  conversions: 25,
  impressions: 45000,
  ctr: 7.22,
  conversionRate: 0.77,
  imageUrl:
    "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  trackingUrl:
    "https://baotangtruyentranh.com?aff_id={affiliate_id}&source={source}",
  targetAudience: "All",
  allowedTrafficSources: ["Search", "Social", "Display", "Email"],
}

function OfferStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          text: "Active",
        }
      case "paused":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          text: "Paused",
        }
      case "pending":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Clock,
          text: "Pending",
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
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1.5 px-2.5 py-0.5 font-medium`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.text}
    </Badge>
  )
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
  const { id, offerId } = params

  // In a real implementation, you would fetch the offer data
  const offer = mockOffer

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Link href={`/admin/campaigns/${id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Button>
        </Link>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              Offer #{offer.id}
            </h1>
            <OfferStatusBadge status={offer.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {offer.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="gap-2">
            <Megaphone className="h-4 w-4" />
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
            <TabsList className="justify-start">
              <TabsTrigger value="overview" className="gap-2">
                <PieChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Info className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="tracking" className="gap-2">
                <FileCode className="h-4 w-4" />
                Tracking
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Spent"
                value={formatVNDCurrency(offer.spent)}
                icon={<CreditCard className="h-4 w-4 text-gray-400" />}
                description={`${Math.round((offer.spent / offer.budget) * 100)}% of budget`}
              />
              <StatCard
                title="Clicks"
                value={offer.clicks.toLocaleString()}
                icon={<ExternalLink className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Conversions"
                value={offer.conversions.toLocaleString()}
                icon={<CheckCircle className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Conversion Rate"
                value={`${offer.conversionRate.toFixed(2)}%`}
                icon={<PieChart className="h-4 w-4 text-gray-400" />}
              />
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Offer Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-purple-600" />
                    Offer Information
                  </CardTitle>
                  <CardDescription>Details about this offer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Offer Description */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>

                  {/* Steps Information */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                      Conversion Steps
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                      {offer.stepInfo}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Date Range
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {format(new Date(offer.startDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}{" "}
                          -{" "}
                          {format(new Date(offer.endDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Pricing Model
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="text-gray-700">
                          {offer.pricingModel}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Payout
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <span>{formatVNDCurrency(offer.bid)}</span>
                        <span className="text-gray-400">per conversion</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Return Time
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{offer.orderReturnTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offer Image Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    Offer Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={offer.imageUrl}
                      alt={offer.description}
                      className="h-auto w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Download Assets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tracking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-purple-600" />
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
                    <code className="break-all">{offer.trackingUrl}</code>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
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
                  Statistics charts would be displayed here
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
                        Target Audience
                      </h4>
                      <p className="font-medium">{offer.targetAudience}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">
                        Allowed Traffic Sources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {offer.allowedTrafficSources.map((source) => (
                          <Badge key={source} variant="secondary">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
