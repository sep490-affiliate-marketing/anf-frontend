"use client"

import { Suspense, useMemo } from "react"

import { addDays, format } from "date-fns"
import { parseAsIsoDate, useQueryState } from "nuqs"

import {
  IAdminCampaignStatistics,
  IAdminUserStatistics,
} from "@/types/statistics.type"

import {
  useGetAdminCampaignStatistics,
  useGetAdminUserStatistics,
} from "@/hooks/statistics"
import { useAdminWithdrawRequestList } from "@/hooks/transaction"

import { DateRangePicker } from "@/components/ui/date-range-picker"

import { Spinner } from "@/components/spinner"

import { CampaignStatsChart } from "./_components/campaign-stats-chart"
import { StatsGrid } from "./_components/stats-grid"
import { UserStatsChart } from "./_components/user-stats-chart"

export default function AdminDashboard() {
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(
      new Date(new Date().setDate(new Date().getDate() - 30))
    )
  )
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(new Date())
  )

  // Fetch statistics data
  const { data: userData, isFetching: isUserDataFetching } =
    useGetAdminUserStatistics(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    )

  const { data: campaignData, isFetching: isCampaignDataFetching } =
    useGetAdminCampaignStatistics(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    )

  // Fetch recent withdrawal requests
  const { data: withdrawRequestList, isLoading: isWithdrawRequestLoading } =
    useAdminWithdrawRequestList(
      1,
      10,
      format(
        new Date(new Date().setDate(new Date().getDate() - 7)),
        "yyyy-MM-dd"
      ),
      format(addDays(new Date(), 1), "yyyy-MM-dd")
    )

  const isLoading =
    isUserDataFetching || isCampaignDataFetching || isWithdrawRequestLoading

  // Recent withdrawal requests
  const withdrawRequests = withdrawRequestList?.value?.data || []

  const transformedWithdrawRequests = useMemo(() => {
    return withdrawRequests.map((request) => ({
      ...request,
      id: request.id.toString(),
    }))
  }, [withdrawRequests])

  // Transform user statistics data for the chart
  const userChartData = useMemo(() => {
    if (!userData?.data) return []
    return userData.data.map((stat: IAdminUserStatistics) => ({
      date: stat.date,
      totalUser: stat.totalUser,
      totalActivedUser: stat.totalActivedUser ?? 0,
      totalDeactivedUser: stat.totalDeactivedUser ?? 0,
    }))
  }, [userData])

  // Transform campaign statistics data for the chart
  const campaignChartData = useMemo(() => {
    if (!campaignData?.data) return []
    return campaignData.data.map((stat: IAdminCampaignStatistics) => ({
      date: stat.date,
      totalCampaign: stat.totalCampaign,
      totalApprovedCampaign: stat.totalApprovedCampaign,
      totalRejectedCampaign: stat.totalRejectedCampaign ?? 0,
    }))
  }, [campaignData])

  return (
    <Suspense fallback={<Spinner />}>
      <div className="flex flex-col gap-8">
        {/* Overview Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                A comprehensive overview of your platform metrics and
                performance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DateRangePicker
                align="end"
                onUpdate={(values) => {
                  if (values.range.from && values.range.to) {
                    setStartDate(values.range.from)
                    setEndDate(values.range.to)
                  }
                }}
                initialDateFrom={startDate}
                initialDateTo={endDate}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid
          isLoading={isLoading}
          withdrawRequests={transformedWithdrawRequests}
        />

        {/* Charts */}
        <div className="grid grid-cols-12 gap-6">
          <UserStatsChart
            isLoading={isUserDataFetching}
            data={userChartData}
            startDate={startDate}
            endDate={endDate}
          />
          <CampaignStatsChart
            isLoading={isCampaignDataFetching}
            data={campaignChartData}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </Suspense>
  )
}
