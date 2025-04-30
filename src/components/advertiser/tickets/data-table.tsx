"use client"

import { useEffect, useState } from "react"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { FilterX, RefreshCw, Search } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  TicketStatusBadge,
  TicketStatusEnum,
} from "@/components/badge/ticket-status-badge"
import { Spinner } from "@/components/spinner"

// Mock data for tickets
const mockTickets = [
  {
    id: "T-1001",
    publisherId: "P-5432",
    publisherName: "TopAffiliates",
    campaignId: "C-789",
    campaignName: "Summer Sale",
    issueType: "Click Fraud",
    description: "Detected unusual click patterns from this publisher",
    dateSubmitted: "2023-10-15T10:30:00Z",
    status: TicketStatusEnum.OPEN,
    lastUpdated: "2023-10-15T10:30:00Z",
  },
  {
    id: "T-1002",
    publisherId: "P-2187",
    publisherName: "MarketBoost",
    campaignId: "C-456",
    campaignName: "Holiday Promo",
    issueType: "Lead Quality",
    description: "Leads provided were all using fake contact information",
    dateSubmitted: "2023-09-28T14:20:00Z",
    status: TicketStatusEnum.APPROVED,
    lastUpdated: "2023-10-02T09:15:00Z",
  },
  {
    id: "T-1003",
    publisherId: "P-9075",
    publisherName: "AffiliatePro",
    campaignId: "C-123",
    campaignName: "Black Friday",
    issueType: "Conversion Manipulation",
    description: "Publisher seems to be manipulating conversion tracking",
    dateSubmitted: "2023-10-05T08:45:00Z",
    status: TicketStatusEnum.REJECTED,
    lastUpdated: "2023-10-12T16:30:00Z",
  },
  {
    id: "T-1004",
    publisherId: "P-3421",
    publisherName: "GrowthPartners",
    campaignId: "C-789",
    campaignName: "Summer Sale",
    issueType: "Policy Violation",
    description: "Publisher using prohibited advertising methods",
    dateSubmitted: "2023-10-10T11:20:00Z",
    status: TicketStatusEnum.REJECTED,
    lastUpdated: "2023-10-14T15:10:00Z",
  },
  {
    id: "T-1005",
    publisherId: "P-5432",
    publisherName: "TopAffiliates",
    campaignId: "C-456",
    campaignName: "Holiday Promo",
    issueType: "Click Fraud",
    description: "Abnormal click-to-conversion ratio detected",
    dateSubmitted: "2023-10-13T09:50:00Z",
    status: TicketStatusEnum.APPROVED,
    lastUpdated: "2023-10-13T09:50:00Z",
  },
]

export type Ticket = (typeof mockTickets)[0]

type TicketDataTableProps = {
  status?: "all" | "open" | "approved" | "rejected"
}

export default function TicketDataTable({
  status = "all",
}: TicketDataTableProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all")

  // In a real app, this would be a react-query hook like:
  // const { data: ticketsData, isLoading, error, refetch } = useGetTickets(page, limit, status)

  // Filter tickets when component mounts or when filters change
  useEffect(() => {
    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      let filtered = [...mockTickets]

      // Filter by status (if not "all")
      if (status !== "all") {
        filtered = filtered.filter((ticket) => ticket.status === status)
      }

      // Filter by issue type (if not "all")
      if (issueTypeFilter !== "all") {
        filtered = filtered.filter(
          (ticket) => ticket.issueType === issueTypeFilter
        )
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (ticket) =>
            ticket.id.toLowerCase().includes(term) ||
            ticket.publisherName.toLowerCase().includes(term) ||
            ticket.campaignName.toLowerCase().includes(term) ||
            ticket.issueType.toLowerCase().includes(term) ||
            ticket.description.toLowerCase().includes(term)
        )
      }

      setFilteredTickets(filtered)
      setIsLoading(false)
    }, 500)
  }, [searchTerm, status, issueTypeFilter])

  const totalTickets = filteredTickets.length
  const totalPages = Math.ceil(totalTickets / limit)
  const isDataEmpty = filteredTickets.length === 0

  // Pagination calculation
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + limit, totalTickets)
  const currentPageTickets = filteredTickets.slice(startIndex, endIndex)

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // In a real app, this would call refetch()
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setIssueTypeFilter("all")
  }

  // Get unique issue types for filter dropdown
  const issueTypes = [
    "all",
    ...new Set(mockTickets.map((ticket) => ticket.issueType)),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="md:w-1/2">
          <label
            className="mb-2 block text-sm font-medium text-gray-700"
            htmlFor="search"
          >
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              id="search"
              value={searchTerm}
              placeholder="Search tickets..."
              className="pl-9"
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Issue Type
            </label>
            <Select
              value={issueTypeFilter}
              onValueChange={(value) => {
                setIssueTypeFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder="All Issues" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Issues" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {(searchTerm || issueTypeFilter !== "all") && (
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="h-10"
              >
                <FilterX className="mr-2 size-4" />
                Clear Filters
              </Button>
            )}
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="h-10"
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grow">
        {isLoading || isRefreshing ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : isDataEmpty ? (
          <div className="flex items-center justify-center py-10 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="rounded-full bg-muted p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-muted-foreground"
                >
                  <path d="M20.42 12c0-4.1-3.33-7.42-7.42-7.42-3.94 0-7.16 3.08-7.42 6.96-2.62.67-4.58 3.06-4.58 5.91 0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.65-2.05-4.79-4.58-4.96z"></path>
                </svg>
              </div>
              <div className="text-base font-medium">No tickets found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="relative w-full overflow-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="border-b border-gray-200 hover:bg-white">
                    <TableHead className="w-[130px] py-3 font-medium text-gray-700">
                      Ticket ID
                    </TableHead>
                    <TableHead className="w-[150px] py-3 font-medium text-gray-700">
                      Date Submitted
                    </TableHead>
                    <TableHead className="py-3 font-medium text-gray-700">
                      Publisher
                    </TableHead>
                    <TableHead className="py-3 font-medium text-gray-700">
                      Campaign
                    </TableHead>
                    <TableHead className="w-[150px] py-3 font-medium text-gray-700">
                      Issue Type
                    </TableHead>
                    <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageTickets.map((ticket) => {
                    const formattedDate = format(
                      new Date(ticket.dateSubmitted),
                      "dd/MM/yyyy",
                      { locale: vi }
                    )
                    const formattedTime = format(
                      new Date(ticket.dateSubmitted),
                      "h:mm a"
                    )

                    return (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="py-3 font-medium">
                          {ticket.id}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="space-y-1">
                            <div className="font-medium">{formattedDate}</div>
                            <div className="text-xs text-muted-foreground">
                              {formattedTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {ticket.publisherName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {ticket.publisherId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {ticket.campaignName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {ticket.campaignId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          {ticket.issueType}
                        </TableCell>
                        <TableCell className="py-3">
                          <TicketStatusBadge status={ticket.status} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page</span>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-auto border-gray-200 text-sm">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                    onClick={handleNextPage}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                <div>
                  {totalTickets > 0 ? (
                    <>
                      Showing {startIndex + 1}-{endIndex} of {totalTickets}{" "}
                      results
                    </>
                  ) : (
                    "No results"
                  )}
                </div>
                <div>
                  Page {totalPages > 0 ? page : 0} of {totalPages || 1}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
