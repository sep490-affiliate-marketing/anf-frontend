"use client"

import React, { useState } from "react"

import Link from "next/link"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  GridIcon,
  Info,
  Layers,
  ListFilter,
  Megaphone,
  Search,
  SlidersHorizontal,
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
const statusOptions = ["All", "Active", "Pending"]

function CampaignStatus({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          text: "Active",
        }
      case "pending":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          text: "Pending",
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
      <Icon className="size-3.5" />
      {config.text}
    </Badge>
  )
}

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
        colors[model] || "border-gray-200 bg-gray-50 text-gray-700"
      )}
    >
      {model}
    </Badge>
  )
}

// Define campaign type for TypeScript
type Offer = {
  id: number
  pricingModel: string
  bid: number
}

interface CampaignWithJoinStatus extends ICampaign {
  joined?: boolean
}

// Component type definitions
interface CampaignCardProps {
  campaign: CampaignWithJoinStatus
  onJoinToggle: (id: number) => void
}

interface CampaignListItemProps {
  campaign: CampaignWithJoinStatus
  onJoinToggle: (id: number) => void
}

// Component for campaign grid card
function CampaignCard({ campaign, onJoinToggle }: CampaignCardProps) {
  return (
    <Card key={campaign.id} className="overflow-hidden">
      <div className="aspect-video w-full">
        <img
          src={
            (campaign.campImages && campaign.campImages.length > 0
              ? campaign.campImages[0]
              : null) || "/placeholder-image.jpg"
          }
          alt={campaign.name}
          className="size-full object-cover"
        />
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
              className="flex-1"
              onClick={() => onJoinToggle(campaign.id)}
            >
              Leave Campaign
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
              className="flex-1 gap-1"
              onClick={() => onJoinToggle(campaign.id)}
            >
              Join Campaign <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

// Component for campaign list item
function CampaignListItem({ campaign, onJoinToggle }: CampaignListItemProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border sm:flex-row">
      <div className="h-48 w-full sm:h-auto sm:w-48">
        <img
          src={
            (campaign.campImages && campaign.campImages.length > 0
              ? campaign.campImages[0]
              : null) || "/placeholder-image.jpg"
          }
          alt={campaign.name}
          className="size-full object-cover"
        />
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
              >
                Leave
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
                className="gap-1"
                onClick={() => onJoinToggle(campaign.id)}
              >
                Join Campaign <ArrowRight className="size-4" />
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
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedPricingModel: string
  onPricingModelChange: (value: string) => void
}) {
  return (
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
                    <Badge variant="outline" className="cursor-pointer">
                      All
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Joined
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
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
                          selectedCategory === category ? "default" : "outline"
                        }
                        className="cursor-pointer"
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
  )
}

// Component for view mode toggle and sort options
function ViewControls({
  viewMode,
  setViewMode,
  resultsCount,
}: {
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  resultsCount: number
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{resultsCount}</span> campaign
        results
      </p>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
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
              >
                <Layers className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>List view</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2 gap-1">
              <ListFilter className="size-3.5" />
              Sort
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Recent first
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Highest payout</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Alphabetical</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      <Megaphone className="mb-4 size-8 text-muted-foreground" />
      <h3 className="text-lg font-medium">No campaigns found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your search or filter criteria
      </p>
    </div>
  )
}

// Main page component
export default function PublisherCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPricingModel, setSelectedPricingModel] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const { data: campaignsData, isLoading, error } = useGetActiveCampaigns()
  const campaigns: CampaignWithJoinStatus[] = campaignsData?.value?.data || []

  // Filter campaigns based on search query and filters
  const filteredCampaigns = campaigns.filter(
    (campaign: CampaignWithJoinStatus) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" ||
        campaign.category?.name === selectedCategory

      const matchesPricingModel =
        selectedPricingModel === "All" ||
        campaign.offers.some(
          (offer) => offer.pricingModel === selectedPricingModel
        )

      return matchesSearch && matchesCategory && matchesPricingModel
    }
  )

  const handleJoinCampaign = (campaignId: number) => {
    // TODO: Implement join campaign functionality with API
    console.log("Joining campaign:", campaignId)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Loading campaigns...</h3>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error loading campaigns
          </h3>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    )
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
      />

      {/* View Controls */}
      <ViewControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultsCount={filteredCampaigns.length}
      />

      {/* Campaigns Grid/List */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onJoinToggle={handleJoinCampaign}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignListItem
              key={campaign.id}
              campaign={campaign}
              onJoinToggle={handleJoinCampaign}
            />
          ))}
        </div>
      )}
    </div>
  )
}
