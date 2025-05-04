"use client"

import { format } from "date-fns"
import { Download, List } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BatchPaymentTable } from "./batch-payment-table"
import { WithdrawRequestsTable } from "./withdraw-requests-table"

export default function WithdrawalManagementTabs() {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const defaultStartDate = format(firstDayOfMonth, "yyyy-MM-dd")
  const defaultEndDate = format(lastDayOfMonth, "yyyy-MM-dd")

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("withdrawals")
  )
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsString.withDefault(defaultStartDate)
  )
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsString.withDefault(defaultEndDate)
  )
  const [_page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [_limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  )

  // Handle date changes from child components
  const handleDateChange = (type: "start" | "end", date: string) => {
    if (type === "start") {
      setStartDate(date)
    } else {
      setEndDate(date)
    }
  }

  // Reset all filters when changing tabs
  const handleTabChange = (value: string) => {
    setStartDate(defaultStartDate)
    setEndDate(defaultEndDate)
    setPage(1)
    setLimit(10)
    setTab(value)
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="withdrawals"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <List className="size-4" />
            <span>Withdrawal Requests</span>
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <Download className="size-4" />
            <span>Batch Payment Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals" className="mt-0">
          <WithdrawRequestsTable
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </TabsContent>

        <TabsContent value="export" className="mt-0">
          <BatchPaymentTable
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
