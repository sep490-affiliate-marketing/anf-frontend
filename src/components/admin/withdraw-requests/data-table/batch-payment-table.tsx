"use client"

import { useState } from "react"

import { format } from "date-fns"
import { CalendarIcon, Download, Search } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { formatVNDCurrency } from "@/lib/utils"

import {
  useBatchPaymentData,
  useExportBatchPaymentData,
} from "@/hooks/transaction"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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

import { Spinner } from "@/components/spinner"

interface BatchPaymentTableProps {
  startDate: string
  endDate: string
  onDateChange: (type: "start" | "end", date: string) => void
}

export function BatchPaymentTable({
  startDate,
  endDate,
  onDateChange,
}: BatchPaymentTableProps) {
  const [searchTerm, setSearchTerm] = useQueryState(
    "searchTerm",
    parseAsString.withDefault("")
  )
  const [batchPage, setBatchPage] = useState(1)
  const [batchPageSize, setBatchPageSize] = useState(10)
  const [selectedRequests, setSelectedRequests] = useState<
    Record<string, boolean>
  >({})
  const [selectAll, setSelectAll] = useState(false)

  const { data: batchPaymentData, isLoading: isBatchDataLoading } =
    useBatchPaymentData(batchPage, batchPageSize, startDate, endDate)

  const { exportBatchPaymentData, isPending: isExporting } =
    useExportBatchPaymentData()

  const batchPaymentItems = batchPaymentData?.value.data || []
  const filteredItems = searchTerm
    ? batchPaymentItems.filter(
        (item) =>
          item.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.beneficiaryName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.beneficiaryAccount
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : batchPaymentItems

  // Total batch payment items for pagination
  const totalBatchItems = batchPaymentData?.value.totalRecords || 0
  const totalBatchPages = batchPaymentData?.value.totalPages || 0
  const hasBatchNextPage = batchPaymentData?.value.hasNextPage || false
  const hasBatchPrevPage = batchPaymentData?.value.hasPreviousPage || false
  const isBatchDataEmpty = filteredItems.length === 0

  // Handle pagination for batch payments
  const handleBatchPreviousPage = () => {
    if (batchPage > 1) {
      setBatchPage(batchPage - 1)
    }
  }

  const handleBatchNextPage = () => {
    if (hasBatchNextPage) {
      setBatchPage(batchPage + 1)
    }
  }

  // Handle export functionality
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked)

    if (checked) {
      const allSelected: Record<string, boolean> = {}
      filteredItems.forEach((item) => {
        allSelected[item.transactionId] = true
      })
      setSelectedRequests(allSelected)
    } else {
      setSelectedRequests({})
    }
  }

  const handleSelectRequest = (transactionId: string, checked: boolean) => {
    setSelectedRequests((prev) => ({
      ...prev,
      [transactionId]: checked,
    }))

    // Update selectAll state based on selection
    if (!checked) {
      setSelectAll(false)
    } else {
      const allSelected = filteredItems.every(
        (item) =>
          item.transactionId === transactionId ||
          selectedRequests[item.transactionId]
      )
      setSelectAll(allSelected)
    }
  }

  const handleExport = async () => {
    const selectedItems = batchPaymentItems.filter(
      (item) => selectedRequests[item.transactionId]
    )

    if (selectedItems.length === 0) return

    await exportBatchPaymentData(selectedItems)
    // Clear selections after export
    setSelectedRequests({})
    setSelectAll(false)
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
              placeholder="Search by ID, account, or name..."
              className="pl-9"
              onChange={(e) => {
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
                  <CalendarIcon className="mr-2 size-4" />
                  {startDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(startDate)}
                  onSelect={(date) =>
                    date && onDateChange("start", format(date, "yyyy-MM-dd"))
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
                  <CalendarIcon className="mr-2 size-4" />
                  {endDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(endDate)}
                  onSelect={(date) =>
                    date && onDateChange("end", format(date, "yyyy-MM-dd"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end space-x-2">
            <Button
              onClick={handleExport}
              disabled={
                isExporting || Object.keys(selectedRequests).length === 0
              }
            >
              {isExporting ? (
                <div className="mr-2">
                  <Spinner noPadding />
                </div>
              ) : (
                <Download className="mr-2 size-4" />
              )}
              {isExporting ? "Exporting..." : "Export Selected"}
            </Button>
          </div>
        </div>
      </div>

      {isBatchDataLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : isBatchDataEmpty ? (
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
              No batch payment data available
            </div>
            <p className="text-sm text-muted-foreground">
              No data is available for export during the selected time period.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="relative w-full overflow-auto">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow className="border-b border-gray-200 hover:bg-white">
                  <TableHead className="w-[50px] py-3">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[140px] py-3 font-medium text-gray-700">
                    Transaction ID
                  </TableHead>
                  <TableHead className="py-3 font-medium text-gray-700">
                    From Account
                  </TableHead>
                  <TableHead className="py-3 font-medium text-gray-700">
                    Beneficiary
                  </TableHead>
                  <TableHead className="py-3 font-medium text-gray-700">
                    Bank
                  </TableHead>
                  <TableHead className="w-[150px] py-3 text-right font-medium text-gray-700">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.transactionId}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={!!selectedRequests[item.transactionId]}
                        onCheckedChange={(checked) =>
                          handleSelectRequest(item.transactionId, !!checked)
                        }
                        aria-label={`Select payment ${item.transactionId}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.transactionId}
                    </TableCell>
                    <TableCell>{item.fromAccount}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{item.beneficiaryName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.beneficiaryAccount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.beneficiaryBankName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatVNDCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Batch Pagination */}
          <div className="sticky bottom-0 mt-auto border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page</span>
                <Select
                  value={batchPageSize.toString()}
                  onValueChange={(value) => {
                    setBatchPageSize(Number(value))
                    setBatchPage(1)
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
                  onClick={handleBatchPreviousPage}
                  disabled={!hasBatchPrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-gray-200 px-4 text-sm font-medium text-gray-700"
                  onClick={handleBatchNextPage}
                  disabled={!hasBatchNextPage}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
              <div>
                Showing {(batchPage - 1) * batchPageSize + 1}-
                {Math.min(batchPage * batchPageSize, totalBatchItems)} of{" "}
                {totalBatchItems} results
              </div>
              <div>
                Page {batchPage} of {totalBatchPages || 1}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
