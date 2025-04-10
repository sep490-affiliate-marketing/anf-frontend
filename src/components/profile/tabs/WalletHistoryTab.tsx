"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
} from "lucide-react"

import { IWalletTransaction } from "@/types/wallet.type"

import { cn } from "@/lib/utils"
import { formatVNDCurrency } from "@/lib/utils"

import { useGetWalletHistory } from "@/hooks/wallet"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

import { TransactionStatusBadge } from "@/components/badge/transaction-status-badge"

export function WalletHistoryTab() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const limit = 10
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: walletHistory,
    isLoading,
    error,
  } = useGetWalletHistory(user?.userCode || "", page, limit)

  // Get transaction type based on amount
  const getTransactionType = (transaction: IWalletTransaction) => {
    return transaction.isWithdrawal ? "withdrawal" : "deposit"
  }

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

  const transactions = walletHistory?.value.data || []
  const totalTransactions = walletHistory?.value.totalRecords || 0
  const totalPages = walletHistory?.value.totalPages || 0

  // Calculate total balance from transactions (simplified example)
  const calculateTotalBalance = () => {
    if (!transactions.length) return 0
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    )
  }

  const balance = calculateTotalBalance()

  return (
    <TabsContent value="walletHistory" className="mt-0 space-y-8 pb-6">
      {/* Summary Cards */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Balance
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              formatVNDCurrency(balance)
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Available for withdrawal
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            This Month
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Monthly summary
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Pending
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Processing transactions
          </div>
        </div>
      </div> */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h3 className="text-lg font-medium leading-6">Transaction History</h3>
        </div>

        {/* Filters */}
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full border-dashed pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="size-3.5" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All transactions</DropdownMenuItem>
                  <DropdownMenuItem>Credits only</DropdownMenuItem>
                  <DropdownMenuItem>Debits only</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Calendar className="size-3.5" />
                    <span>Date range</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Time period</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>This month</DropdownMenuItem>
                  <DropdownMenuItem>Last month</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="max-h-[500px] overflow-auto px-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] pl-6">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={`skeleton-${index}`}
                    className="hover:bg-transparent"
                  >
                    <TableCell className="pl-6">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
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
                          <path d="M12 9v4"></path>
                          <path d="M12 17h.01"></path>
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      </div>
                      <div className="text-base font-medium">
                        Failed to load transactions
                      </div>
                      <p className="text-sm text-muted-foreground">
                        There was an error retrieving your transaction history.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Try again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
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
                        No transactions yet
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your transaction history will appear here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const formattedDate = format(
                    new Date(transaction.createdAt),
                    "MMM d, yyyy"
                  )
                  const formattedTime = format(
                    new Date(transaction.createdAt),
                    "h:mm a"
                  )
                  const type = getTransactionType(transaction)
                  const isWithdrawal = transaction.isWithdrawal

                  return (
                    <TableRow
                      key={transaction.id}
                      className="group cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="pl-6">
                        <div className="space-y-1">
                          <div className="font-medium">{formattedDate}</div>
                          <div className="text-xs text-muted-foreground">
                            {formattedTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      <TableCell>
                        <TransactionStatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "pr-6 text-right font-medium",
                          isWithdrawal ? "text-blue-600" : "text-green-600"
                        )}
                      >
                        {isWithdrawal ? "-" : "+"}
                        {formatVNDCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalTransactions > 0 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  `Showing ${transactions.length} of ${totalTransactions} transactions`
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={handlePreviousPage}
                  disabled={isLoading || page <= 1}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={handleNextPage}
                  disabled={isLoading || !walletHistory?.value.hasNextPage}
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  )
}
