"use client"

import { useState } from "react"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

import { formatVNDCurrency } from "@/lib/utils"

import { useAdminWithdrawRequestList } from "@/hooks/transaction"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

import { WithdrawRequestActions } from "@/components/admin/withdraw-requests/data-table/action-buttons"
import { Spinner } from "@/components/spinner"

export default function WithdrawRequestsTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Default date range: current month
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const [startDate, setStartDate] = useState(
    format(firstDayOfMonth, "yyyy-MM-dd")
  )
  const [endDate, setEndDate] = useState(format(lastDayOfMonth, "yyyy-MM-dd"))

  const {
    data: withdrawRequestList,
    isLoading: isFetching,
    error,
    refetch,
  } = useAdminWithdrawRequestList(page, pageSize, startDate, endDate)

  const withdrawRequests = withdrawRequestList?.value.data || []
  const totalRequests = withdrawRequestList?.value.totalRecords || 0
  const totalPages = withdrawRequestList?.value.totalPages || 0
  const isDataEmpty = withdrawRequests.length === 0
  const isError = !!error

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (withdrawRequestList?.value.hasNextPage) {
      setPage(page + 1)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Handle request actions
  const handleApproveRequest = async (requestId: number) => {
    // TODO: Implement API call
    toast.success(`Withdrawal request #${requestId} approved successfully`)
    await refetch()
  }

  const handleRejectRequest = async (requestId: number, reason: string) => {
    // TODO: Implement API call
    toast.success(`Withdrawal request #${requestId} rejected`)
    await refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-1/3">
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
              placeholder="Search by user code..."
              className="pl-9"
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="startDate"
            >
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(startDate)}
                  onSelect={(date) =>
                    date && setStartDate(format(date, "yyyy-MM-dd"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="endDate"
            >
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(endDate)}
                  onSelect={(date) =>
                    date && setEndDate(format(date, "yyyy-MM-dd"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="h-10"
              disabled={isFetching || isRefreshing}
            >
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grow">
        {isFetching || isRefreshing ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-destructive">
                Failed to load withdrawal requests
              </p>
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
                No withdrawal requests
              </div>
              <p className="text-sm text-muted-foreground">
                Withdrawal requests will appear here once submitted by users.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="relative w-full overflow-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow className="border-b border-gray-200 hover:bg-white">
                    <TableHead className="w-[160px] py-3 font-medium text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="w-[140px] py-3 font-medium text-gray-700">
                      User Code
                    </TableHead>
                    <TableHead className="py-3 font-medium text-gray-700">
                      Bank Account
                    </TableHead>
                    <TableHead className="py-3 font-medium text-gray-700">
                      Reason
                    </TableHead>
                    <TableHead className="w-[150px] py-3 text-right font-medium text-gray-700">
                      Amount
                    </TableHead>
                    <TableHead className="w-[180px] py-3 text-right font-medium text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawRequests.map((request) => {
                    const formattedDate = format(
                      new Date(request.createdAt),
                      "dd/MM/yyyy",
                      { locale: vi }
                    )
                    const formattedTime = format(
                      new Date(request.createdAt),
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
                        <TableCell className="py-3 font-medium">
                          {request.userCode}
                        </TableCell>
                        <TableCell className="py-3">
                          {request.currentBankingNo}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate py-3">
                          {request.reason || "N/A"}
                        </TableCell>
                        <TableCell className="py-3 text-right font-medium">
                          {formatVNDCurrency(request.amount)}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <WithdrawRequestActions
                            requestId={request.id}
                            userCode={request.userCode}
                            amount={request.amount}
                            onApprove={handleApproveRequest}
                            onReject={handleRejectRequest}
                          />
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
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
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
                      <SelectItem value="100">100</SelectItem>
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
                  Showing {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, totalRequests)} of {totalRequests}{" "}
                  results
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
