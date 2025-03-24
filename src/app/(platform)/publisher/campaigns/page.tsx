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

import { cn, formatVNDCurrency } from "@/lib/utils"

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

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    advertiserCode: "2481c765-1f1b-4e9a-8b65-24b8b044d01a",
    name: "Baotangtruyentranh",
    description: "Banner at home page of baotangtruyentranh",
    startDate: "2025-05-01T00:00:00",
    endDate: "2025-12-31T00:00:00",
    balance: 15000000,
    thumbnail:
      "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Active",
    category: "Entertainment",
    offers: [
      {
        id: 1,
        pricingModel: "CPA",
        bid: 100000,
      },
      {
        id: 2,
        pricingModel: "CPC",
        bid: 5000,
      },
    ],
    joined: false,
  },
  {
    id: 2,
    advertiserCode: "a4b1c3d2-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    name: "Tiki",
    description: "Promote Tiki products with high commission rates",
    startDate: "2025-04-15T00:00:00",
    endDate: "2026-01-15T00:00:00",
    balance: 50000000,
    thumbnail:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Active",
    category: "E-commerce",
    offers: [
      {
        id: 3,
        pricingModel: "CPS",
        bid: 200000,
      },
      {
        id: 4,
        pricingModel: "CPL",
        bid: 15000,
      },
    ],
    joined: true,
  },
  {
    id: 3,
    advertiserCode: "q7r8s9t0-u1v2-w3x4-y5z6-a7b8c9d0e1f2",
    name: "Shopee",
    description: "Promote flash sale products with high conversion rates",
    startDate: "2025-03-10T00:00:00",
    endDate: "2025-09-30T00:00:00",
    balance: 75000000,
    thumbnail:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Active",
    category: "E-commerce",
    offers: [
      {
        id: 5,
        pricingModel: "CPS",
        bid: 180000,
      },
    ],
    joined: false,
  },
  {
    id: 4,
    advertiserCode: "g3h4i5j6-k7l8-m9n0-o1p2-q3r4s5t6u7v8",
    name: "Netflix",
    description: "Promote Netflix subscription plans to new users",
    startDate: "2025-06-01T00:00:00",
    endDate: "2026-06-01T00:00:00",
    balance: 100000000,
    thumbnail:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Pending",
    category: "Entertainment",
    offers: [
      {
        id: 6,
        pricingModel: "CPL",
        bid: 250000,
      },
    ],
    joined: false,
  },
  {
    id: 5,
    advertiserCode: "w9x0y1z2-a3b4-c5d6-e7f8-g9h0i1j2k3l4",
    name: "Lazada",
    description: "Promote electronics products on Lazada platform",
    startDate: "2025-05-15T00:00:00",
    endDate: "2025-11-15T00:00:00",
    balance: 45000000,
    thumbnail:
      "https://images.unsplash.com/photo-1563770660941-13978b895966?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Active",
    category: "E-commerce",
    offers: [
      {
        id: 7,
        pricingModel: "CPA",
        bid: 120000,
      },
      {
        id: 8,
        pricingModel: "CPC",
        bid: 8000,
      },
    ],
    joined: true,
  },
  {
    id: 6,
    advertiserCode: "m5n6o7p8-q9r0-s1t2-u3v4-w5x6y7z8a9b0",
    name: "Booking.com",
    description: "Promote hotel bookings and travel packages",
    startDate: "2025-07-01T00:00:00",
    endDate: "2026-07-01T00:00:00",
    balance: 80000000,
    thumbnail:
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "Active",
    category: "Travel",
    offers: [
      {
        id: 9,
        pricingModel: "CPA",
        bid: 300000,
      },
    ],
    joined: false,
  },
]

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

type Campaign = {
  id: number
  advertiserCode: string
  name: string
  description: string
  startDate: string
  endDate: string
  balance: number
  thumbnail: string
  status: string
  category: string
  offers: Offer[]
  joined: boolean
}

// Component for campaign grid card
function CampaignCard({
  campaign,
  onJoinToggle,
}: {
  campaign: Campaign
  onJoinToggle: (id: number) => void
}) {
  return (
    <Card key={campaign.id} className="overflow-hidden">
      <div className="aspect-video w-full">
        <img
          src={campaign.thumbnail}
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
function CampaignListItem({
  campaign,
  onJoinToggle,
}: {
  campaign: Campaign
  onJoinToggle: (id: number) => void
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border sm:flex-row">
      <div className="h-48 w-full sm:h-auto sm:w-48">
        <img
          src={campaign.thumbnail}
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
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter campaigns based on search query and filters
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" || campaign.category === selectedCategory

    const matchesPricingModel =
      selectedPricingModel === "All" ||
      campaign.offers.some(
        (offer) => offer.pricingModel === selectedPricingModel
      )

    return matchesSearch && matchesCategory && matchesPricingModel
  })

  const handleJoinCampaign = (campaignId: number) => {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, joined: !campaign.joined }
          : campaign
      )
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
