"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { RefreshCw, Search } from "lucide-react"

import { formatVNDCurrency } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
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

import { Spinner } from "@/components/spinner"

// Define the type for withdrawal requests
interface WithdrawRequest {
  id: string
  amount: number
  bankName: string
  bankAccount: string
  status: "pending" | "approved" | "rejected"
  requestDate: string
}

export default function WithdrawRequestsTable() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in a real app, this would come from an API call
  const withdrawRequests: WithdrawRequest[] = [
    {
      id: "1",
      amount: 500000,
      bankName: "Ngân hàng TMCP Quân đội",
      bankAccount: "36641267",
      status: "pending",
      requestDate: "2023-11-01T10:30:00Z",
    },
    {
      id: "2",
      amount: 1000000,
      bankName: "Ngân hàng TMCP Quân đội",
      bankAccount: "36641267",
      status: "approved",
      requestDate: "2023-10-15T08:45:00Z",
    },
    {
      id: "3",
      amount: 200000,
      bankName: "Ngân hàng TMCP Quân đội",
      bankAccount: "36641267",
      status: "rejected",
      requestDate: "2023-09-22T14:20:00Z",
    },
  ]

  // Filter requests by search term (if any)
  const filteredRequests = searchTerm
    ? withdrawRequests.filter(
        (request) =>
          request.id.includes(searchTerm) ||
          request.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.bankAccount.includes(searchTerm)
      )
    : withdrawRequests

  // Calculate pagination
  const totalRequests = filteredRequests.length
  const totalPages = Math.ceil(totalRequests / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex)
  const isDataEmpty = paginatedRequests.length === 0

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
    // In a real app, this would refetch data
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="w-1/2">
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
              placeholder="Search withdraw requests..."
              className="pl-9"
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
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
              <div className="text-base font-medium">
                No withdraw requests yet
              </div>
              <p className="text-sm text-muted-foreground">
                Your withdraw request history will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="relative w-full overflow-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="border-b border-gray-200 hover:bg-white">
                    <TableHead className="w-[200px] py-3 font-medium text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="py-3 font-medium text-gray-700">
                      Bank Details
                    </TableHead>
                    <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="w-[150px] py-3 text-right font-medium text-gray-700">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => {
                    const formattedDate = format(
                      new Date(request.requestDate),
                      "dd/MM/yyyy",
                      { locale: vi }
                    )
                    const formattedTime = format(
                      new Date(request.requestDate),
                      "h:mm a"
                    )

                    return (
                      <TableRow
                        key={request.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="py-3">
                          <div className="space-y-1">
                            <div className="font-medium">{formattedDate}</div>
                            <div className="text-xs text-muted-foreground">
                              {formattedTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div>
                            <div className="font-medium">
                              {request.bankName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Account #{request.bankAccount}
                              {request.id && ` • Request #${request.id}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right font-medium text-blue-600">
                          {formatVNDCurrency(request.amount)}
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
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
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
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                <div>
                  Showing {Math.min(startIndex + 1, totalRequests)}-
                  {Math.min(endIndex, totalRequests)} of {totalRequests} results
                </div>
                <div>
                  Page {page} of {totalPages || 1}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
