"use client"

import { Suspense } from "react"
import { useEffect, useMemo, useState } from "react"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { CAMPAIGN_CATEGORIES } from "@/constant/campaign"
import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowRight,
  Check,
  ChevronDown,
  GridIcon,
  Layers,
  ListFilter,
  Megaphone,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react"

import { ICampaign } from "@/types/campaign.type"

import { cn, formatVNDCurrency } from "@/lib/utils"

import {
  useGetActiveCampaigns,
  useGetPublisherCampaigns,
} from "@/hooks/campaign"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const pricingModels = ["All", "CPA", "CPC", "CPS"]
const sortOptions = [
  { label: "Recent first", value: "recent" },
  { label: "Highest payout", value: "payout" },
  { label: "Alphabetical", value: "alpha" },
]

function OfferBadge({ model }: { model: string }) {
  const colors: Record<string, string> = {
    CPA: "bg-blue-50 text-blue-700 border-blue-200",
    CPC: "bg-purple-50 text-purple-700 border-purple-200",
    CPS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium transition-colors",
        colors[model] || "border-gray-200 bg-gray-50 text-gray-700"
      )}
    >
      {model}
    </Badge>
  )
}

// Define extended campaign type with join status
interface ICampaignWithJoinStatus extends ICampaign {
  isJoined?: boolean
}

// Update component props
interface CampaignCardProps {
  campaign: ICampaignWithJoinStatus
}

interface CampaignListItemProps {
  campaign: ICampaignWithJoinStatus
}

// Component for campaign grid card
function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card
      key={campaign.id}
      className="group flex h-[500px] flex-col overflow-hidden transition-all hover:shadow-md"
    >
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={
            (campaign.campImages && campaign.campImages.length > 0
              ? campaign.campImages[0]
              : null) || "/placeholder-image.jpg"
          }
          alt={campaign.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {campaign.isJoined && (
          <Badge className="absolute right-2 top-2 bg-green-500">Joined</Badge>
        )}
      </div>
      <CardHeader className="flex-none space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 font-semibold">{campaign.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {campaign.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {campaign.offers.map((offer) => (
            <OfferBadge key={offer.id} model={offer.pricingModel} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {campaign.offers[0].pricingModel != "CPS" ? (
            <div>
              <p className="text-xs text-muted-foreground">Highest Payout</p>
              <p className="font-medium">
                {formatVNDCurrency(
                  Math.max(...campaign.offers.map((o) => o.bid))
                )}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground">Commission</p>
              <p className="font-medium">
                {campaign.offers[0].commissionRate}%
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Campaign Ends</p>
            <p className="font-medium">
              {format(new Date(campaign.endDate), "dd MMM yyyy", {
                locale: vi,
              })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-none border-t p-4">
        <Link href={`/publisher/campaigns/${campaign.id}`} className="w-full">
          <Button className="w-full gap-1">
            View Details <ArrowRight className="size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Component for campaign list item
function CampaignListItem({ campaign }: CampaignListItemProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md sm:flex-row">
      <div className="relative h-48 w-full sm:h-auto sm:w-48">
        <img
          src={
            (campaign.campImages && campaign.campImages.length > 0
              ? campaign.campImages[0]
              : null) || "/placeholder-image.jpg"
          }
          alt={campaign.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {campaign.isJoined && (
          <Badge className="absolute right-2 top-2 bg-green-500">Joined</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{campaign.name}</h3>
          </div>
          <div className="flex gap-2">
            {campaign.offers.slice(0, 2).map((offer) => (
              <OfferBadge key={offer.id} model={offer.pricingModel} />
            ))}
            {campaign.offers.length > 2 && (
              <Badge variant="secondary">+{campaign.offers.length - 2}</Badge>
            )}
          </div>
        </div>
        <p className="mt-2 flex-1 text-muted-foreground">
          {campaign.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-6">
            {campaign.offers[0].pricingModel != "CPS" ? (
              <div>
                <p className="text-xs text-muted-foreground">Highest Payout</p>
                <p className="font-medium">
                  {formatVNDCurrency(
                    Math.max(...campaign.offers.map((o) => o.bid))
                  )}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Commission</p>
                <p className="font-medium">
                  {campaign.offers[0].commissionRate}%
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/publisher/campaigns/${campaign.id}`}>
              <Button className="gap-1">
                View Details <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for search and filters
function CampaignFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPricingModel,
  onPricingModelChange,
  showJoinedOnly,
  onShowJoinedOnlyChange,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedPricingModel: string
  onPricingModelChange: (value: string) => void
  showJoinedOnly: boolean
  onShowJoinedOnlyChange: (value: boolean) => void
}) {
  return (
    <div className="">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CAMPAIGN_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPricingModel}
            onValueChange={onPricingModelChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pricing Model" />
            </SelectTrigger>
            <SelectContent>
              {pricingModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showJoinedOnly ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => onShowJoinedOnlyChange(!showJoinedOnly)}
          >
            <Check className="size-4" />
            Joined Only
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SlidersHorizontal className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine campaigns based on your preferences
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {CAMPAIGN_CATEGORIES.map((category) => (
                        <Badge
                          key={category.id}
                          variant={
                            selectedCategory === category.id.toString()
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer transition-colors"
                          onClick={() =>
                            onCategoryChange(category.id.toString())
                          }
                        >
                          {category.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {(searchQuery ||
        selectedCategory !== "All" ||
        selectedPricingModel !== "All" ||
        showJoinedOnly) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 pl-2">
              &ldquo;{searchQuery}&rdquo;
              <button
                title="Clear search"
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onSearchChange("")}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "All" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {selectedCategory}
              <button
                title="Clear category"
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onCategoryChange("All")}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {selectedPricingModel !== "All" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {selectedPricingModel}
              <button
                title="Clear pricing model"
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onPricingModelChange("All")}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {showJoinedOnly && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Joined Only
              <button
                title="Clear joined filter"
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onShowJoinedOnlyChange(false)}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {(searchQuery ||
            selectedCategory !== "All" ||
            selectedPricingModel !== "All" ||
            showJoinedOnly) && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs"
              onClick={() => {
                onSearchChange("")
                onCategoryChange("All")
                onPricingModelChange("All")
                onShowJoinedOnlyChange(false)
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Component for view mode toggle and sort options
function ViewControls({
  viewMode,
  setViewMode,
  resultsCount,
  sortBy,
  setSortBy,
}: {
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  resultsCount: number
  sortBy: string
  setSortBy: (sort: string) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{resultsCount}</span>{" "}
        campaign
        {resultsCount !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="size-9"
              >
                <GridIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="size-9"
              >
                <Layers className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>List view</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2 h-9 gap-1">
              <ListFilter className="size-3.5" />
              Sort
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={sortBy === option.value}
                onCheckedChange={() => setSortBy(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <Megaphone className="mb-4 size-12 text-muted-foreground opacity-80" />
      <h3 className="text-lg font-medium">No campaigns found</h3>
      <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
        Try adjusting your search or filter criteria to find campaigns that
        match your interests
      </p>
      <Button variant="outline" className="mt-4 gap-2">
        <Search className="size-4" /> Browse all campaigns
      </Button>
    </div>
  )
}

// Skeleton loader for campaigns
function CampaignSkeletons({ viewMode }: { viewMode: "grid" | "list" }) {
  return viewMode === "grid" ? (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="p-4 pb-0">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-16 w-full" />
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-5 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-5 w-24" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-lg border sm:flex-row"
        >
          <Skeleton className="h-48 w-full sm:h-auto sm:w-48" />
          <div className="flex flex-1 flex-col p-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="mt-2 h-16 w-full" />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-1 h-5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-1 h-5 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Create a separate component that uses searchParams
function CampaignsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  // State from URL or defaults
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPricingModel, setSelectedPricingModel] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [page, setPage] = useState(1)
  const [allCampaigns, setAllCampaigns] = useState<ICampaignWithJoinStatus[]>(
    []
  )
  const [showJoinedOnly, setShowJoinedOnly] = useState(false)

  // Get publisher's joined campaigns
  const { data: publisherCampaignsData } = useGetPublisherCampaigns(
    user?.id || 0
  )

  // Memoize joined campaign IDs to prevent unnecessary recalculations
  const joinedCampaignIds = useMemo(() => {
    const publisherCampaigns = publisherCampaignsData?.isSuccess
      ? publisherCampaignsData.value
      : []
    const ids = publisherCampaigns
      .map((publisherCampaign: any) => publisherCampaign.campaignId)
      .filter(Boolean)
    return new Set(ids)
  }, [publisherCampaignsData])

  // Get active campaigns
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useGetActiveCampaigns({
    pageNumber: page,
    pageSize: 9,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    pricingModel:
      selectedPricingModel !== "All" ? selectedPricingModel : undefined,
    sortBy,
  })

  // Reset campaigns when filters change
  useEffect(() => {
    setAllCampaigns([])
    setPage(1)
  }, [searchQuery, selectedCategory, selectedPricingModel, sortBy])

  // Update allCampaigns when new data arrives
  useEffect(() => {
    if (campaignsData?.value?.data) {
      const campaignsWithJoinStatus = campaignsData.value.data.map(
        (campaign) => {
          const isJoined = joinedCampaignIds.has(campaign.id)
          return {
            ...campaign,
            isJoined,
          }
        }
      )

      if (page === 1) {
        setAllCampaigns(campaignsWithJoinStatus)
      } else {
        setAllCampaigns((prev) => [...prev, ...campaignsWithJoinStatus])
      }
    }
  }, [campaignsData?.value?.data, page, joinedCampaignIds])

  const hasNextPage = campaignsData?.value?.hasNextPage || false
  const hasPreviousPage = campaignsData?.value?.hasPreviousPage || false

  // Filter campaigns based on search query and filters
  const filteredCampaigns = allCampaigns.filter(
    (campaign: ICampaignWithJoinStatus) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" ||
        campaign.categoryId?.toString() === selectedCategory

      const matchesPricingModel =
        selectedPricingModel === "All" ||
        campaign.offers.some(
          (offer) => offer.pricingModel === selectedPricingModel
        )

      const matchesJoined = !showJoinedOnly || campaign.isJoined

      return (
        matchesSearch && matchesCategory && matchesPricingModel && matchesJoined
      )
    }
  )

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
    if (sortBy === "payout") {
      const maxPayoutA = Math.max(...a.offers.map((o) => o.bid))
      const maxPayoutB = Math.max(...b.offers.map((o) => o.bid))
      return maxPayoutB - maxPayoutA
    }
    if (sortBy === "alpha") {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  const loadMore = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Browse advertising campaigns to monetize your traffic
        </p>
      </div>

      {/* Filters */}
      <CampaignFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPricingModel={selectedPricingModel}
        onPricingModelChange={setSelectedPricingModel}
        showJoinedOnly={showJoinedOnly}
        onShowJoinedOnlyChange={setShowJoinedOnly}
      />

      {/* View Controls */}
      <ViewControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultsCount={filteredCampaigns.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Campaigns Grid/List */}
      {isLoading && page === 1 ? (
        <CampaignSkeletons viewMode={viewMode} />
      ) : error ? (
        <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <XCircle className="mb-4 size-12 text-destructive opacity-80" />
          <h3 className="text-lg font-medium text-destructive">
            Error loading campaigns
          </h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We couldn&apos;t load campaigns at this time. Please try again
            later.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {sortedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCampaigns.map((campaign) => (
                <CampaignListItem key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex items-center justify-center pt-6">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span>Loading...</span>
                    <ChevronDown className="size-3.5 animate-bounce" />
                  </>
                ) : (
                  <>
                    <span>Load more campaigns</span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Main page component with Suspense
export default function PublisherCampaignsPage() {
  return (
    <Suspense fallback={<CampaignSkeletons viewMode="grid" />}>
      <CampaignsContent />
    </Suspense>
  )
}
