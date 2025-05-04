"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import {
  ArrowRight,
  EllipsisIcon,
  GridIcon,
  LayersIcon,
  PlusIcon,
} from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, useQueryState } from "nuqs"

import { ICampaign } from "@/types/campaign.type"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetCampaignsByAdvertiser } from "@/hooks/campaign"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CampaignStatusBadge } from "@/components/badge/campaign-status-badge"
import { EmptyTable } from "@/components/data-table/empty-table"
import { SearchInput } from "@/components/inputs/search-input"
import { Spinner } from "@/components/spinner"

interface CampaignCardProps {
  campaign: ICampaign
  onViewDetails: (id: number, isUpdate?: boolean) => void
}

function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-[180px] w-full overflow-hidden">
        {campaign.campImages &&
        campaign.campImages.length > 0 &&
        !imageError ? (
          <Image
            src={campaign.campImages[0]}
            alt={campaign.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-100">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute right-3 top-3 z-10">
          <CampaignStatusBadge status={campaign.status} />
        </div>
      </div>
      <CardHeader className="flex-none p-4 pb-2">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-semibold">{campaign.name}</h3>
          <p className="text-xs text-muted-foreground">
            Campaign #{campaign.id}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 px-4 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="font-medium">
              {format(new Date(campaign.startDate), "dd/MM/yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="font-medium">
              {format(new Date(campaign.endDate), "dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Product URL</p>
          <a
            href={campaign.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-full truncate text-blue-600 hover:underline"
          >
            {campaign.productUrl}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-medium">{formatVNDCurrency(campaign.balance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Offers</p>
            <p className="font-medium">{campaign.offers.length}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-none border-t p-4">
        <div className="flex w-full gap-2">
          <Button
            className="w-full gap-1"
            onClick={() => onViewDetails(campaign.id)}
          >
            View Details <ArrowRight className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="shadow-none"
                aria-label="More options"
              >
                <EllipsisIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onViewDetails(campaign.id)}>
                  <span>View details</span>
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {campaign.status === "Pending" ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => onViewDetails(campaign.id, true)}
                  >
                    <span>Update</span>
                    <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : null}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <span>Delete</span>
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function CampaignDataTable() {
  const { user } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  )

  const { data, isLoading, isError, refetch } = useGetCampaignsByAdvertiser(
    user?.userCode ?? "",
    currentPage,
    pageSize
  )

  // Extract data from the response
  const campaigns = data?.value?.data || []
  const paginationInfo = {
    from: (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, data?.value?.totalRecords || 0),
    total: data?.value?.totalRecords || 0,
    last_page: data?.value?.totalPages || 1,
  }
  const isDataEmpty = !campaigns || campaigns.length === 0

  // Handle next page navigation - increment by 1
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(paginationInfo.last_page, prev + 1))
  }

  // Handle previous page navigation - decrement by 1
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  // Handler for refresh button click
  const handleRefresh = () => {
    refetch()
  }

  // Navigate to campaign details page
  const handleViewDetails = (id: number, isUpdate = false) => {
    router.push(
      isUpdate
        ? `/advertiser/campaigns/${id}/update`
        : `/advertiser/campaigns/${id}`
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      {/* Filters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SearchInput
            className="w-[500px] transition-all focus-within:ring-2 focus-within:ring-ring"
            placeholder="Find campaign by name..."
          />
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <div className="flex items-center rounded-md border p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("table")}
                      className="size-8"
                    >
                      <LayersIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="size-8"
                    >
                      <GridIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid view</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Link
              href="/advertiser/campaigns/create"
              className={buttonVariants({
                variant: "default",
              })}
            >
              <PlusIcon size={16} />
              Create Campaign
            </Link>
          </div>
        </div>

        {/* Results Table or Empty State */}
        <div className="mt-4 grow">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Spinner />
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-sm text-destructive">Error loading data</p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : isDataEmpty ? (
            <EmptyTable onRefresh={handleRefresh} />
          ) : viewMode === "table" ? (
            <div className="flex flex-col">
              {/* Data Table Section */}
              <div className="relative w-full">
                <Table className="w-full">
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow className="border-b border-gray-200 hover:bg-white">
                      <TableHead className="w-[80px] py-3 font-medium text-gray-700">
                        ID
                      </TableHead>
                      <TableHead className="w-[180px] py-3 font-medium text-gray-700">
                        Name
                      </TableHead>
                      <TableHead className="w-[180px] py-3 font-medium text-gray-700">
                        Start Date
                      </TableHead>
                      <TableHead className="w-[130px] py-3 font-medium text-gray-700">
                        End Date
                      </TableHead>
                      <TableHead className="w-[140px] py-3 font-medium text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="w-[200px] py-3 font-medium text-gray-700">
                        Product URL
                      </TableHead>
                      <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                        Balance
                      </TableHead>
                      <TableHead className="w-[100px] py-3 font-medium text-gray-700">
                        Offers
                      </TableHead>
                      <TableHead className="py-3 text-right font-medium text-gray-700">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign: ICampaign) => (
                      <TableRow
                        key={campaign.id}
                        className="cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell
                          className="py-3 text-sm font-medium text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {campaign.id}
                        </TableCell>
                        <TableCell
                          className="py-3 text-sm text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {campaign.name}
                        </TableCell>
                        <TableCell
                          className="py-3 text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {format(new Date(campaign.startDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell
                          className="py-3 text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {format(new Date(campaign.endDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell
                          className="py-3"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          <CampaignStatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell
                          className="py-3 text-sm text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          <a
                            href={campaign.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block max-w-[180px] truncate text-blue-600 hover:underline"
                          >
                            {campaign.productUrl}
                          </a>
                        </TableCell>
                        <TableCell
                          className="py-3 text-sm text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {formatVNDCurrency(campaign.balance)}
                        </TableCell>
                        <TableCell
                          className="py-3 text-sm text-muted-foreground"
                          onClick={() => handleViewDetails(campaign.id)}
                        >
                          {campaign.offers.length}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="flex justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="shadow-none"
                                  aria-label="Edit item"
                                >
                                  <EllipsisIcon size={16} aria-hidden="true" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(campaign.id)}
                                >
                                  <span>View details</span>
                                  <DropdownMenuShortcut>
                                    ⌘E
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>

                              {campaign.status === "Pending" ? (
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewDetails(campaign.id, true)
                                    }
                                  >
                                    <span>Update</span>
                                    <DropdownMenuShortcut>
                                      ⌘U
                                    </DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              ) : null}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <span>Delete</span>
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign: ICampaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Shared pagination for both views */}
          {!isLoading && !isError && !isDataEmpty && (
            <div className="sticky bottom-0 mt-6 border-t border-gray-200 bg-white">
              {/* Main pagination controls */}
              <div className="flex items-center justify-between px-4 py-2">
                {/* Results per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {viewMode === "table" ? "Rows" : "Items"} per page
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-14 border-gray-200 text-sm">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                    onClick={handleNextPage}
                    disabled={currentPage === paginationInfo.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Bottom status line */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                <div>
                  Viewing {paginationInfo.from || 1}-
                  {paginationInfo.to ||
                    Math.min(pageSize, paginationInfo.total || 0)}{" "}
                  of {paginationInfo.total || 0} results
                </div>
                <div>
                  Page {currentPage} of {paginationInfo.last_page || 1}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
