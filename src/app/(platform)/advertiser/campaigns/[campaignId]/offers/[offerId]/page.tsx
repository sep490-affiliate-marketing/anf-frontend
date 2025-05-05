"use client"

import React, { useState } from "react"

import Link from "next/link"

import { env } from "@/env"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  Clock,
  Copy,
  DollarSign,
  FileCode,
  Info,
  Loader2,
  Megaphone,
  PieChart,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"

import { formatVNDCurrency } from "@/lib/utils"
import { formatDate } from "@/lib/utils/date"

import {
  useApprovePublisherInOffer,
  useGetOfferDetails,
  useGetPublisherInOffer,
} from "@/hooks/offer"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { OfferStatusBadge } from "@/components/badge/offer-status-badge"
import { EmptyTable } from "@/components/data-table/empty-table"
import { Preview } from "@/components/editor/preview"
import { Spinner } from "@/components/spinner"

interface OfferDetailParams {
  params: Promise<{
    campaignId: string
    offerId: string
  }>
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")

  // Unwrap params using React.use() as recommended by Next.js
  const params = React.use(paramsPromise)
  const { campaignId, offerId } = params

  const {
    data: offerResData,
    isLoading,
    isFetching,
  } = useGetOfferDetails(Number(offerId))
  const { data: publisherList, isLoading: isLoadingPublishers } =
    useGetPublisherInOffer(Number(offerId))

  const { mutate: approvePublisher, isPending: isApproving } =
    useApprovePublisherInOffer()

  // Map publishers from API format to the format needed by the UI
  const [publisherRequests, setPublisherRequests] = useState<any[]>([])

  React.useEffect(() => {
    if (publisherList) {
      const formattedPublishers = publisherList.map((publisher) => ({
        id: publisher.poNo.toString(), // Change this to use poNo
        name: `${publisher.firstName} ${publisher.lastName}`,
        requestDate: "123",
        email: publisher.email,
        website: "",
        status:
          publisher.pubOfferStatus === 1
            ? "pending"
            : publisher.pubOfferStatus === 2
              ? "approved"
              : "rejected",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${publisher.publisherCode}`,
        description: publisher.publisherCode,
        trafficSources: publisher.trafficSources || ["Unknown"],
        poNo: publisher.poNo, // Keep the original poNo for reference
      }))
      setPublisherRequests(formattedPublishers)
    }
  }, [publisherList])
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
  const handlePublisherStatusChange = (
    publisher: any,
    newStatus: "approved" | "rejected"
  ) => {
    if (newStatus === "rejected") {
      setSelectedPublisher(publisher)
      setRejectDialogOpen(true)
      return
    }

    approvePublisher(
      {
        poId: publisher.poNo, // Use poNo here
        status: 2, // 2 for approved
        rejectReason: "",
      },
      {
        onSuccess: () => {
          setPublisherRequests(
            publisherRequests.map((pub) =>
              pub.id === publisher.id ? { ...pub, status: "approved" } : pub
            )
          )
        },
      }
    )
  }

  const handleRejectConfirm = () => {
    if (!selectedPublisher || !rejectReason.trim()) return

    approvePublisher(
      {
        poId: selectedPublisher.poNo, // Use poNo here
        status: 3, // 3 for rejected
        rejectReason: rejectReason,
      },
      {
        onSuccess: () => {
          setPublisherRequests(
            publisherRequests.map((pub) =>
              pub.id === selectedPublisher.id
                ? { ...pub, status: "rejected" }
                : pub
            )
          )
          setRejectDialogOpen(false)
          setRejectReason("")
          setSelectedPublisher(null)
        },
      }
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
                value="publishers"
                className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                <Users className="size-4" />
                Publishers
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
                //icon={<CreditCard className="size-4 text-gray-400" />}
                icon={<></>}
                description="Total budget allocated"
              />
              <StatCard
                title="Bid Amount"
                value={formatVNDCurrency(offerResData.bid)}
                //icon={<DollarSign className="size-4 text-gray-400" />}
                icon={<></>}
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

                  {/* Additional Details */}
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Date Range
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>
                          {formatDate(
                            new Date(offerResData.startDate),
                            "dd/MM/yyyy"
                          )}{" "}
                          -{" "}
                          {formatDate(
                            new Date(offerResData.endDate),
                            "dd/MM/yyyy"
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

                  {/* Steps Information */}
                  {offerResData.stepInfo && (
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Conversion Steps
                      </h3>
                      <Preview value={offerResData.stepInfo} />
                    </div>
                  )}
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
                      {`${env.NEXT_PUBLIC_BACKEND_URL}/api/affiliate-network/tracking?offerId=${offerId}&publisherCode={publisherCode}`}
                    </code>
                    <Button variant="ghost" size="sm" className="size-8 p-0">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Replace {"{publisherCode}"} with the publisher&apos;s code
                    when sharing with approved publishers.
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

          {/* Publishers Tab */}
          <TabsContent value="publishers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-purple-600" />
                  Publisher Requests
                </CardTitle>
                <CardDescription>
                  Approve or reject publishers who want to join this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPublishers ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : publisherRequests.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center space-y-3 rounded-lg border border-dashed">
                    <div className="bg-primary-50 rounded-full p-3">
                      <User className="size-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        No requests
                      </p>
                      <p className="text-xs text-gray-500">
                        There are no pending publisher requests for this
                        campaign.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Publisher</TableHead>
                          <TableHead>Request Date</TableHead>
                          <TableHead>Traffic Sources</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {publisherRequests.map((publisher) => (
                          <TableRow key={publisher.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8">
                                  <AvatarImage
                                    src={publisher.avatar}
                                    alt={publisher.name}
                                  />
                                  <AvatarFallback>
                                    {publisher.name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {publisher.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {publisher.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {/* 
                              add request date later
                              */}
                              {publisher?.requestDate || "123"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {publisher.trafficSources.map(
                                  (source: string) => (
                                    <Badge
                                      key={source}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {source}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="line-clamp-1">
                                {publisher.description}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {publisher.status === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                          onClick={() =>
                                            handlePublisherStatusChange(
                                              publisher,
                                              "rejected"
                                            )
                                          }
                                          disabled={isApproving}
                                        >
                                          <X className="size-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Reject request</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="size-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                          onClick={() =>
                                            handlePublisherStatusChange(
                                              publisher,
                                              "approved"
                                            )
                                          }
                                          disabled={isApproving}
                                        >
                                          {isApproving ? (
                                            <Loader2 className="size-4 animate-spin" />
                                          ) : (
                                            <Check className="size-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Approve request</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className={
                                    publisher.status === "approved"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-red-200 bg-red-50 text-red-700"
                                  }
                                >
                                  {publisher.status}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Publisher</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this publisher. This will be
              visible to the publisher.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectReason("")
                setSelectedPublisher(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || isApproving}
            >
              {isApproving ? "Rejecting..." : "Reject Publisher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
