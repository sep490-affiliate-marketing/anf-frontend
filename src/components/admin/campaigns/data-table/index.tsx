"use client"

import { useState } from "react"

import { format } from "date-fns"
import {
  MoreHorizontal as MoreHorizontalIcon,
  PauseCircle as PauseCircleIcon,
  PlayCircle as PlayCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, useQueryState } from "nuqs"

import { ICampaign } from "@/types/campaign.type"

import { useGetAdminCampaigns, useUpdateCampaignStatus } from "@/hooks/campaign"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"

import { EmptyTable } from "@/components/data-table/empty-table"
import { SearchInput } from "@/components/inputs/search-input"
import { Spinner } from "@/components/spinner"

export default function CampaignDataTable() {
  const router = useRouter()

  const { mutate: updateStatus, isPending } = useUpdateCampaignStatus()
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(
    null
  )

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  )

  const { data, isLoading, isError, refetch } = useGetAdminCampaigns(
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

  const handleUpdateStatus = (campaign: ICampaign, status: string) => {
    updateStatus({
      id: campaign.id,
      campaignStatus: status,
    })
  }

  const handleRejectSubmit = () => {
    if (!rejectReason.trim() || !selectedCampaign) return

    updateStatus({
      id: selectedCampaign.id,
      campaignStatus: "Rejected",
      rejectReason,
    })

    setIsRejectDialogOpen(false)
    setRejectReason("")
    setSelectedCampaign(null)
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      {/* Filters Section */}
      <div className="space-y-6">
        <SearchInput
          className="w-[500px] transition-all focus-within:ring-2 focus-within:ring-ring"
          placeholder="Find campaign by name..."
        />

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
          ) : (
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
                        onClick={() =>
                          router.push(`/admin/campaigns/${campaign.id}`)
                        }
                        key={campaign.id}
                        className="cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                          {campaign.id}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground">
                          {format(new Date(campaign.startDate), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground">
                          {format(new Date(campaign.endDate), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={getStatusBadgeColor(campaign.status)}
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          <a
                            href={campaign.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block max-w-[180px] truncate text-blue-600 hover:underline"
                          >
                            {campaign.productUrl}
                          </a>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          ${campaign.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {campaign.offers.length}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                                disabled={isPending}
                              >
                                <MoreHorizontalIcon className="size-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleUpdateStatus(campaign, "Started")
                                }
                              >
                                <PlayCircleIcon className="mr-2 size-4 text-green-600" />
                                Start
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleUpdateStatus(campaign, "Paused")
                                }
                              >
                                <PauseCircleIcon className="mr-2 size-4 text-amber-600" />
                                Pause
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <Dialog
                                open={isRejectDialogOpen}
                                onOpenChange={setIsRejectDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      setSelectedCampaign(campaign)
                                    }}
                                  >
                                    <XCircleIcon className="mr-2 size-4 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Campaign</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this
                                      campaign.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="reject-reason">
                                        Rejection reason
                                      </Label>
                                      <Textarea
                                        id="reject-reason"
                                        value={rejectReason}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => setRejectReason(e.target.value)}
                                        placeholder="Enter the reason for rejection"
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsRejectDialogOpen(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleRejectSubmit}
                                      disabled={
                                        !rejectReason.trim() || isPending
                                      }
                                    >
                                      Reject Campaign
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Section - Fixed at bottom when scrolling */}
              <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white">
                {/* Main pagination controls */}
                <div className="flex items-center justify-between px-4 py-2">
                  {/* Results per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
