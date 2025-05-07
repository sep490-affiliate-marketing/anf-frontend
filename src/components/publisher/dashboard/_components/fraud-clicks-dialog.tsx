"use client"

import { useState } from "react"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AlertTriangle, RefreshCw, Search } from "lucide-react"

import { IFraudClick, useGetFraudClicks } from "@/hooks/transaction"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface FraudClicksDialogProps {
  children: React.ReactNode
  from: Date
  to: Date
}

export function FraudClicksDialog({
  children,
  from,
  to,
}: FraudClicksDialogProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    data: fraudData,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetFraudClicks(
    page,
    limit,
    format(from, "yyyy-MM-dd"),
    format(to, "yyyy-MM-dd")
  )

  const frauds = fraudData?.value.data || []
  const totalFrauds = fraudData?.value.totalRecords || 0
  const totalPages = fraudData?.value.totalPages || 0
  const isDataEmpty = frauds.length === 0
  const isError = !!error

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (fraudData?.value.hasNextPage) {
      setPage(page + 1)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Fraudulent Clicks</DialogTitle>
          <DialogDescription>
            View and manage fraudulent click detections
          </DialogDescription>
        </DialogHeader>

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
                  placeholder="Search frauds..."
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
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
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
                    Failed to load fraud data
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
                    <AlertTriangle className="size-6 text-muted-foreground" />
                  </div>
                  <div className="text-base font-medium">
                    No frauds detected
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No fraudulent clicks were detected in the selected period.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="relative w-full overflow-auto">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 z-10 bg-white">
                      <TableRow className="border-b border-gray-200 hover:bg-white">
                        <TableHead className="py-3 font-medium text-gray-700">
                          Date
                        </TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">
                          Click ID
                        </TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">
                          Reason
                        </TableHead>
                        <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                          Offer ID
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {frauds.map((fraud: IFraudClick) => {
                        const formattedDate = format(
                          new Date(fraud.detectedTime),
                          "dd/MM/yyyy",
                          { locale: vi }
                        )
                        const formattedTime = format(
                          new Date(fraud.detectedTime),
                          "h:mm a"
                        )

                        return (
                          <TableRow
                            key={fraud.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <TableCell className="py-3">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formattedDate}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formattedTime}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 font-medium">
                              {fraud.clickId}
                            </TableCell>
                            <TableCell className="whitespace-nowrap py-3">
                              <div className="text-sm text-red-600">
                                {fraud.reason}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-center">
                              {fraud.offerId}
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
                      <span className="text-sm text-gray-600">
                        Rows per page
                      </span>
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
                      {Math.min(page * limit, totalFrauds)} of {totalFrauds}{" "}
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
      </DialogContent>
    </Dialog>
  )
}
