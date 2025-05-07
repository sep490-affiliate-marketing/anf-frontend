"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Search } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"

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
import { EmptyTable } from "@/components/data-table/empty-table"
import { Spinner } from "@/components/spinner"

interface WithdrawRequestsTableProps {
  startDate: string
  endDate: string
}

export function WithdrawalTable({
  startDate,
  endDate,
}: WithdrawRequestsTableProps) {
  // Using nuqs for URL state management
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  )

  const [searchTerm, setSearchTerm] = useQueryState("search")

  const {
    data: withdrawRequestList,
    isLoading: isFetching,
    isError,
  } = useAdminWithdrawRequestList(page || 1, pageSize || 10, startDate, endDate)

  const withdrawRequests = withdrawRequestList?.value.data || []
  const totalRequests = withdrawRequestList?.value.totalRecords || 0
  const totalPages = withdrawRequestList?.value.totalPages || 0
  const isDataEmpty = withdrawRequests.length === 0

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (withdrawRequestList?.value.hasNextPage) {
      setPage((page || 1) + 1)
    }
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
              value={searchTerm || ""}
              placeholder="Search by user code..."
              className="pl-9"
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grow">
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : isError ? (
          <EmptyTable
            description="No data is available in this period"
            title="No withdrawal requests available"
          />
        ) : isDataEmpty ? (
          <EmptyTable
            description="No data is available in this period"
            title="No withdrawal requests available"
          />
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
                    value={pageSize?.toString()}
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
                  Showing {((page || 1) - 1) * (pageSize || 10) + 1}-
                  {Math.min((page || 1) * (pageSize || 10), totalRequests)} of{" "}
                  {totalRequests} results
                </div>
                <div>
                  Page {page || 1} of {totalPages || 1}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
