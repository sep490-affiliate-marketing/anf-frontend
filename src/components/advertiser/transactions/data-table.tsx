"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Search,
} from "lucide-react"

import { cn, formatVNDCurrency } from "@/lib/utils"

import { useGetWalletHistory } from "@/hooks/wallet"

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

import { TransactionStatusBadge } from "@/components/badge/transaction-status-badge"
import { Spinner } from "@/components/spinner"

export default function TransactionDataTable() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    data: walletHistory,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetWalletHistory(user?.userCode || "", page, limit)

  const transactions = walletHistory?.value.data || []
  const totalTransactions = walletHistory?.value.totalRecords || 0
  const totalPages = walletHistory?.value.totalPages || 0
  const isDataEmpty = transactions.length === 0
  const isError = !!error

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (walletHistory?.value.hasNextPage) {
      setPage(page + 1)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
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
              placeholder="Search transactions..."
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
            disabled={isFetching || isRefreshing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-4 flex-grow">
        {isFetching || isRefreshing ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-destructive">
                Failed to load transactions
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
              <div className="text-base font-medium">No transactions yet</div>
              <p className="text-sm text-muted-foreground">
                Your transaction history will appear here.
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
                      Description
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
                  {transactions.map((transaction) => {
                    const formattedDate = format(
                      new Date(transaction.createdAt),
                      "dd/MM/yyyy",
                      { locale: vi }
                    )
                    const formattedTime = format(
                      new Date(transaction.createdAt),
                      "h:mm a"
                    )
                    const isWithdrawal = transaction.isWithdrawal

                    return (
                      <TableRow
                        key={transaction.id}
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
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-full",
                                isWithdrawal ? "bg-blue-50" : "bg-green-50"
                              )}
                            >
                              {isWithdrawal ? (
                                <ArrowUpFromLine className="size-4 text-blue-600" />
                              ) : (
                                <ArrowDownToLine className="size-4 text-green-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {isWithdrawal ? "Withdrawal" : "Deposit"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Transaction #{transaction.id}
                                {transaction.campaignId &&
                                  ` • Campaign #${transaction.campaignId}`}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <TransactionStatusBadge status={transaction.status} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            "py-3 text-right font-medium",
                            isWithdrawal ? "text-blue-600" : "text-green-600"
                          )}
                        >
                          {isWithdrawal ? "-" : "+"}
                          {formatVNDCurrency(Math.abs(transaction.amount))}
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
                  Showing {(page - 1) * limit + 1}-
                  {Math.min(page * limit, totalTransactions)} of{" "}
                  {totalTransactions} results
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
