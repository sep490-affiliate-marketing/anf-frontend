"use client"

import { useState } from "react"

import { format } from "date-fns"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, useQueryState } from "nuqs"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetPostbacks } from "@/hooks/postback"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

import { EmptyTable } from "@/components/data-table/empty-table"
import { SearchInput } from "@/components/inputs/search-input"
import { Spinner } from "@/components/spinner"

interface Postback {
  id: number
  clickId: string
  offerId: number
  transactionId: string
  date: string
  publisherCode: string
  amount: number
  status: number
  offer: any
}

interface PostbackResponse {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: Postback[]
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export default function PostbackDataTable({ offerId }: { offerId: number }) {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  )

  const { data, isLoading, isError, refetch } = useGetPostbacks(
    offerId,
    currentPage,
    pageSize
  )

  // Extract data from the response
  const postbacks = data?.value?.data || []
  const paginationInfo = {
    from: (currentPage - 1) * pageSize + 1,
    to: Math.min(currentPage * pageSize, data?.value?.totalRecords || 0),
    total: data?.value?.totalRecords || 0,
    last_page: data?.value?.totalPages || 1,
  }
  const isDataEmpty = !postbacks || postbacks.length === 0

  // Handle next page navigation
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(paginationInfo.last_page, prev + 1))
  }

  // Handle previous page navigation
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  // Handler for refresh button click
  const handleRefresh = () => {
    refetch()
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      {/* Filters Section */}
      <div className="space-y-6">
        <SearchInput
          className="w-[500px] transition-all focus-within:ring-2 focus-within:ring-ring"
          placeholder="Find postback by transaction ID..."
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
                      <TableHead className="w-[100px] py-3 font-medium text-gray-700">
                        ID
                      </TableHead>
                      <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                        Click ID
                      </TableHead>
                      <TableHead className="w-[200px] py-3 font-medium text-gray-700">
                        Transaction ID
                      </TableHead>
                      <TableHead className="w-[180px] py-3 font-medium text-gray-700">
                        Date
                      </TableHead>
                      <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                        Publisher Code
                      </TableHead>
                      <TableHead className="w-[120px] py-3 font-medium text-gray-700">
                        Amount
                      </TableHead>
                      <TableHead className="w-[100px] py-3 font-medium text-gray-700">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postbacks.map((postback) => (
                      <TableRow
                        key={postback.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                          {postback.id}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {postback.clickId}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {postback.transactionId}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {format(new Date(postback.date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {postback.publisherCode}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-muted-foreground">
                          {formatVNDCurrency(postback.amount)}
                        </TableCell>
                        <TableCell className="py-3">
                          {getStatusBadge(postback.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Section */}
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
