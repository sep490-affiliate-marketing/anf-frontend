"use client"

import { useMemo } from "react"

import { format } from "date-fns"
import { parseAsIsoDate, parseAsString, useQueryState } from "nuqs"
import { DateRange } from "react-day-picker"

import { IGetPublisherRevenueStatistics } from "@/types/statistics.type"

import { useGetPublisherRevenueStatistics } from "@/hooks/statistics"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AnalyticsGrid,
  DailyClicksChart,
  DeviceDistributionChart,
  RevenueChart,
} from "./_components"

interface Totals {
  totalClicks: number
  totalVerifiedClicks: number
  totalFraudClicks: number
  totalRevenue: number
}

interface DailyTotals {
  totalClicks: number
  verifiedClicks: number
  fraudedClicks: number
}

interface DeviceTotals {
  mobile: number
  tablet: number
  computer: number
}

interface Campaign {
  campaignId: number
  totalRevenue: number
  totalClick: number
  totalVerifiedClick: number
  totalFraudClick: number
  totalTablet: number
  totalMobile: number
  totalComputer: number
}

export function PublisherDashboard() {
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(new Date())
  )
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(new Date())
  )
  const [selectedCampaign, setSelectedCampaign] = useQueryState(
    "selectedCampaign",
    parseAsString.withDefault("all")
  )

  const {
    data: revenueData,
    isFetching: isRevenueFetching,
    // isError: isRevenueError,
    // error: revenueError,
  } = useGetPublisherRevenueStatistics(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd")
  )

  // const { data: campaignRevenueData } =
  //   useGetPublisherCampaignRevenueStatisticsById(
  //     2,
  //     format(startDate, "yyyy-MM-dd"),
  //     format(endDate, "yyyy-MM-dd")
  //   )

  const handleDateRangeChange = (values: { range: DateRange }) => {
    if (values.range.from && values.range.to) {
      setStartDate(values.range.from)
      setEndDate(values.range.to)
    }
  }

  // Calculate totals from real data
  const totals = useMemo<Totals>(() => {
    if (!revenueData?.data)
      return {
        totalClicks: 0,
        totalVerifiedClicks: 0,
        totalFraudClicks: 0,
        totalRevenue: 0,
      }

    return Object.values(revenueData.data).reduce(
      (acc: Totals, day: IGetPublisherRevenueStatistics) => {
        day.campaigns.forEach((campaign: Campaign) => {
          if (
            selectedCampaign === "all" ||
            campaign.campaignId.toString() === selectedCampaign
          ) {
            acc.totalClicks += campaign.totalClick
            acc.totalVerifiedClicks += campaign.totalVerifiedClick
            acc.totalFraudClicks += campaign.totalFraudClick
            acc.totalRevenue += campaign.totalRevenue
          }
        })
        return acc
      },
      {
        totalClicks: 0,
        totalVerifiedClicks: 0,
        totalFraudClicks: 0,
        totalRevenue: 0,
      }
    )
  }, [revenueData, selectedCampaign])

  // Get unique campaign IDs for the filter
  const campaigns = useMemo(() => {
    if (!revenueData?.data) return []
    const uniqueCampaigns = new Set<number>()
    Object.values(revenueData.data).forEach(
      (day: IGetPublisherRevenueStatistics) => {
        day.campaigns.forEach((campaign: Campaign) => {
          uniqueCampaigns.add(campaign.campaignId)
        })
      }
    )
    return Array.from(uniqueCampaigns)
  }, [revenueData])

  // Process data for daily clicks chart
  const dailyClicksData = useMemo(() => {
    if (!revenueData?.data) return []

    return Object.values(revenueData.data)
      .map((day) => {
        const dayTotals = day.campaigns.reduce(
          (acc: DailyTotals, campaign: Campaign) => {
            if (
              selectedCampaign === "all" ||
              campaign.campaignId.toString() === selectedCampaign
            ) {
              acc.totalClicks += campaign.totalClick
              acc.verifiedClicks += campaign.totalVerifiedClick
              acc.fraudedClicks += campaign.totalFraudClick
            }
            return acc
          },
          {
            totalClicks: 0,
            verifiedClicks: 0,
            fraudedClicks: 0,
          }
        )

        return {
          date: format(new Date(day.date), "MMM d"),
          ...dayTotals,
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [revenueData, selectedCampaign])

  // Process data for revenue chart
  const revenueChartData = useMemo(() => {
    if (!revenueData?.data) return []

    return Object.values(revenueData.data)
      .map((day) => ({
        date: format(new Date(day.date), "MMM d"),
        revenue: day.campaigns.reduce((total: number, campaign: Campaign) => {
          if (
            selectedCampaign === "all" ||
            campaign.campaignId.toString() === selectedCampaign
          ) {
            return total + campaign.totalRevenue
          }
          return total
        }, 0),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [revenueData, selectedCampaign])

  // Calculate device distribution from real data
  const deviceDistributionData = useMemo(() => {
    if (!revenueData?.data) return []

    const deviceTotals = Object.values(revenueData.data).reduce(
      (acc: DeviceTotals, day: IGetPublisherRevenueStatistics) => {
        day.campaigns.forEach((campaign: Campaign) => {
          if (
            selectedCampaign === "all" ||
            campaign.campaignId.toString() === selectedCampaign
          ) {
            acc.mobile += campaign.totalMobile
            acc.tablet += campaign.totalTablet
            acc.computer += campaign.totalComputer
          }
        })
        return acc
      },
      { mobile: 0, tablet: 0, computer: 0 }
    )

    const total =
      deviceTotals.mobile + deviceTotals.tablet + deviceTotals.computer

    return [
      {
        name: "Mobile",
        value: deviceTotals.mobile,
        percentage:
          total > 0 ? ((deviceTotals.mobile / total) * 100).toFixed(1) : "0.0",
        fill: "#3b82f6", // Blue-500
      },
      {
        name: "Desktop",
        value: deviceTotals.computer,
        percentage:
          total > 0
            ? ((deviceTotals.computer / total) * 100).toFixed(1)
            : "0.0",
        fill: "#10b981", // Emerald-500
      },
      {
        name: "Tablet",
        value: deviceTotals.tablet,
        percentage:
          total > 0 ? ((deviceTotals.tablet / total) * 100).toFixed(1) : "0.0",
        fill: "#6366f1", // Indigo-500
      },
    ]
  }, [revenueData, selectedCampaign])

  const totalDeviceClicks = useMemo(() => {
    return deviceDistributionData.reduce((sum, device) => sum + device.value, 0)
  }, [deviceDistributionData])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white pt-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your advertising campaigns
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker
              align="end"
              onUpdate={handleDateRangeChange}
              initialDateTo={endDate}
              initialDateFrom={startDate}
            />

            <Select
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map((campaignId) => (
                  <SelectItem key={campaignId} value={campaignId.toString()}>
                    Campaign #{campaignId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <AnalyticsGrid
          isLoading={isRevenueFetching}
          totalClicks={totals.totalClicks}
          totalRevenue={totals.totalRevenue}
          totalVerifiedClicks={totals.totalVerifiedClicks}
          totalFraudClicks={totals.totalFraudClicks}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          {/* Daily Clicks Chart */}
          <DailyClicksChart
            isLoading={isRevenueFetching}
            data={dailyClicksData}
            startDate={startDate}
            endDate={endDate}
          />

          {/* Revenue Chart */}
          <RevenueChart
            isLoading={isRevenueFetching}
            data={revenueChartData}
            startDate={startDate}
            endDate={endDate}
          />

          {/* Device Distribution */}
          <DeviceDistributionChart
            isLoading={isRevenueFetching}
            data={deviceDistributionData}
            totalClicks={totalDeviceClicks}
          />
        </div>
      </div>
    </div>
  )
}
