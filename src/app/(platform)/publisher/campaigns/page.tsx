"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowRight,
  BookmarkIcon,
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

import { useGetActiveCampaigns } from "@/hooks/campaign"

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

// Filter categories for campaigns
const categories = [
  "All",
  "E-commerce",
  "Entertainment",
  "Travel",
  "Technology",
  "Finance",
]
const pricingModels = ["All", "CPA", "CPC", "CPL", "CPS"]
const sortOptions = [
  { label: "Recent first", value: "recent" },
  { label: "Highest payout", value: "payout" },
  { label: "Alphabetical", value: "alpha" },
]

function OfferBadge({ model }: { model: string }) {
  const colors: Record<string, string> = {
    CPA: "bg-blue-50 text-blue-700 border-blue-200",
    CPC: "bg-purple-50 text-purple-700 border-purple-200",
    CPL: "bg-pink-50 text-pink-700 border-pink-200",
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

interface CampaignWithJoinStatus extends ICampaign {
  joined?: boolean
}

// Component type definitions
interface CampaignCardProps {
  campaign: CampaignWithJoinStatus
  onJoinToggle: (id: number) => void
  isJoining?: boolean
}

interface CampaignListItemProps {
  campaign: CampaignWithJoinStatus
  onJoinToggle: (id: number) => void
  isJoining?: boolean
}

// Component for campaign grid card
function CampaignCard({
  campaign,
  onJoinToggle,
  isJoining,
}: CampaignCardProps) {
  return (
    <Card
      key={campaign.id}
      className="group overflow-hidden transition-all hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={
            (campaign.campImages && campaign.campImages.length > 0
              ? campaign.campImages[0]
              : null) || "/placeholder-image.jpg"
          }
          alt={campaign.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {campaign.joined && (
          <div className="absolute right-3 top-3 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
            <BookmarkIcon className="size-4" />
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{campaign.name}</h3>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {campaign.description}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="mt-2 flex flex-wrap gap-2">
          {campaign.offers.map((offer) => (
            <OfferBadge key={offer.id} model={offer.pricingModel} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Highest Payout</p>
            <p className="font-medium">
              {formatVNDCurrency(
                Math.max(...campaign.offers.map((o) => o.bid))
              )}
            </p>
          </div>
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
      <CardFooter className="border-t p-4">
        {campaign.joined ? (
          <div className="flex w-full items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 transition-colors"
              onClick={() => onJoinToggle(campaign.id)}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <span className="mr-1">Processing</span>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                <>
                  <XCircle className="mr-1.5 size-4" /> Leave Campaign
                </>
              )}
            </Button>
            <Link
              href={`/publisher/campaigns/${campaign.id}`}
              className="flex-1"
            >
              <Button className="w-full gap-1">
                View Details <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Link
              href={`/publisher/campaigns/${campaign.id}`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Button
              className="flex-1 gap-1 transition-colors"
              onClick={() => onJoinToggle(campaign.id)}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <span className="mr-1">Processing</span>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                <>
                  Join Campaign <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

// Component for campaign list item
function CampaignListItem({
  campaign,
  onJoinToggle,
  isJoining,
}: CampaignListItemProps) {
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
        {campaign.joined && (
          <div className="absolute right-3 top-3 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
            <BookmarkIcon className="size-4" />
          </div>
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
            <div>
              <p className="text-xs text-muted-foreground">Highest Payout</p>
              <p className="font-medium">
                {formatVNDCurrency(
                  Math.max(...campaign.offers.map((o) => o.bid))
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">
                {format(new Date(campaign.startDate), "dd MMM", {
                  locale: vi,
                })}{" "}
                -{" "}
                {format(new Date(campaign.endDate), "dd MMM yyyy", {
                  locale: vi,
                })}
              </p>
            </div>
          </div>
          {campaign.joined ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onJoinToggle(campaign.id)}
                disabled={isJoining}
                className="transition-colors"
              >
                {isJoining ? (
                  <>
                    <span className="mr-1">Processing</span>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1.5 size-4" /> Leave
                  </>
                )}
              </Button>
              <Link href={`/publisher/campaigns/${campaign.id}`}>
                <Button className="gap-1">
                  View Offers <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/publisher/campaigns/${campaign.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Button
                className="gap-1 transition-colors"
                onClick={() => onJoinToggle(campaign.id)}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <span className="mr-1">Processing</span>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  <>
                    Join Campaign <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          )}
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
  joinedFilter,
  onJoinedFilterChange,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedPricingModel: string
  onPricingModelChange: (value: string) => void
  joinedFilter: "all" | "joined" | "not-joined"
  onJoinedFilterChange: (value: "all" | "joined" | "not-joined") => void
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
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Joined Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={joinedFilter === "all" ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => onJoinedFilterChange("all")}
                      >
                        All
                      </Badge>
                      <Badge
                        variant={
                          joinedFilter === "joined" ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => onJoinedFilterChange("joined")}
                      >
                        Joined
                      </Badge>
                      <Badge
                        variant={
                          joinedFilter === "not-joined" ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => onJoinedFilterChange("not-joined")}
                      >
                        Not Joined
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer transition-colors"
                          onClick={() => onCategoryChange(category)}
                        >
                          {category}
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
        joinedFilter !== "all") && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 pl-2">
              &ldquo;{searchQuery}&rdquo;
              <button
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
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onPricingModelChange("All")}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {joinedFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              {joinedFilter === "joined" ? "Joined Only" : "Not Joined Only"}
              <button
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground"
                onClick={() => onJoinedFilterChange("all")}
              >
                <XCircle className="size-3" />
              </button>
            </Badge>
          )}
          {(searchQuery ||
            selectedCategory !== "All" ||
            selectedPricingModel !== "All" ||
            joinedFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs"
              onClick={() => {
                onSearchChange("")
                onCategoryChange("All")
                onPricingModelChange("All")
                onJoinedFilterChange("all")
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
                className="h-9 w-9"
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
                className="h-9 w-9"
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

// Main page component
export default function PublisherCampaignsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State from URL or defaults
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPricingModel, setSelectedPricingModel] = useState("All")
  const [joinedFilter, setJoinedFilter] = useState<
    "all" | "joined" | "not-joined"
  >("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [joiningId, setJoiningId] = useState<number | null>(null)

  // Sync URL params with state
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    setSearchQuery(params.get("search") || "")
    setSelectedCategory(params.get("category") || "All")
    setSelectedPricingModel(params.get("model") || "All")
    setJoinedFilter(
      (params.get("joined") as "all" | "joined" | "not-joined") || "all"
    )
    setViewMode((params.get("view") as "grid" | "list") || "grid")
    setSortBy(params.get("sort") || "recent")
  }, [searchParams])

  // Update URL with state
  const updateUrlParams = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategory !== "All") params.set("category", selectedCategory)
    if (selectedPricingModel !== "All")
      params.set("model", selectedPricingModel)
    if (joinedFilter !== "all") params.set("joined", joinedFilter)
    if (viewMode !== "grid") params.set("view", viewMode)
    if (sortBy !== "recent") params.set("sort", sortBy)

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams()
  }, [
    searchQuery,
    selectedCategory,
    selectedPricingModel,
    joinedFilter,
    viewMode,
    sortBy,
  ])

  const { data: campaignsData, isLoading, error } = useGetActiveCampaigns()
  const campaigns: CampaignWithJoinStatus[] = campaignsData?.value?.data || []

  // Filter campaigns based on search query and filters
  const filteredCampaigns = campaigns.filter(
    (campaign: CampaignWithJoinStatus) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || campaign.categoryName === selectedCategory

      const matchesPricingModel =
        selectedPricingModel === "All" ||
        campaign.offers.some(
          (offer) => offer.pricingModel === selectedPricingModel
        )

      const matchesJoinedFilter =
        joinedFilter === "all" ||
        (joinedFilter === "joined" && campaign.joined) ||
        (joinedFilter === "not-joined" && !campaign.joined)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPricingModel &&
        matchesJoinedFilter
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

  const handleJoinCampaign = (campaignId: number) => {
    // Simulate API call with loading state
    setJoiningId(campaignId)

    // TODO: Implement join campaign functionality with API
    setTimeout(() => {
      // Update local state until API is implemented
      const updatedCampaigns = campaigns.map((camp) =>
        camp.id === campaignId ? { ...camp, joined: !camp.joined } : camp
      )

      // Reset loading state
      setJoiningId(null)

      console.log("Toggled campaign join status:", campaignId)
    }, 800)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Browse and join advertising campaigns to monetize your traffic
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
        joinedFilter={joinedFilter}
        onJoinedFilterChange={setJoinedFilter}
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
      {isLoading ? (
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
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sortedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onJoinToggle={handleJoinCampaign}
              isJoining={joiningId === campaign.id}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCampaigns.map((campaign) => (
            <CampaignListItem
              key={campaign.id}
              campaign={campaign}
              onJoinToggle={handleJoinCampaign}
              isJoining={joiningId === campaign.id}
            />
          ))}
        </div>
      )}

      {/* Pagination placeholder for future implementation */}
      {filteredCampaigns.length > 0 && (
        <div className="flex items-center justify-center pt-6">
          <Button variant="outline" size="sm" className="gap-1">
            <span>Load more campaigns</span>
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
