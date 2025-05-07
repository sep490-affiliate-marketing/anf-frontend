"use client"

import { useMemo, useState } from "react"

import { format } from "date-fns"
import { ArrowUpRight, Check, Filter, Info, Shield } from "lucide-react"
import { parseAsIsoDate, parseAsString, useQueryState } from "nuqs"
import { DateRange } from "react-day-picker"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { IGetPublisherRevenueStatistics } from "@/types/statistics.type"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetPublisherRevenueStatistics } from "@/hooks/statistics"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip"

// Mock data for the dashboard

const validationData = [
  { name: "Valid", value: 85, color: "#10b981" },
  { name: "Fraud", value: 15, color: "#ef4444" },
]

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
  const [showTotalClicks, setShowTotalClicks] = useState(true)
  const [showVerifiedClicks, setShowVerifiedClicks] = useState(true)
  const [showFraudedClicks, setShowFraudedClicks] = useState(true)
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

  const chartConfig = {
    totalClicks: {
      label: "Total Clicks",
      color: "#3b82f6",
    },
    verifiedClicks: {
      label: "Verified Clicks",
      color: "#10b981",
    },
    fraudedClicks: {
      label: "Frauded Clicks",
      color: "#ef4444",
    },
  }

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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Dashboard Filters</SheetTitle>
                  <SheetDescription>
                    Customize your dashboard view
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Traffic Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Traffic Type
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="all-traffic" defaultChecked />
                        <label
                          htmlFor="all-traffic"
                          className="text-sm text-gray-600"
                        >
                          All Traffic
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified-only" />
                        <label
                          htmlFor="verified-only"
                          className="text-sm text-gray-600"
                        >
                          Verified Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="active-offers" defaultChecked />
                        <label
                          htmlFor="active-offers"
                          className="text-sm text-gray-600"
                        >
                          Active Offers Only
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Chart Display */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Chart Display
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-total"
                          checked={showTotalClicks}
                          onCheckedChange={(checked) =>
                            setShowTotalClicks(checked === true)
                          }
                        />
                        <label
                          htmlFor="show-total"
                          className="text-sm text-gray-600"
                        >
                          Total Clicks
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-verified"
                          checked={showVerifiedClicks}
                          onCheckedChange={(checked) =>
                            setShowVerifiedClicks(checked === true)
                          }
                        />
                        <label
                          htmlFor="show-verified"
                          className="text-sm text-gray-600"
                        >
                          Verified Clicks
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-frauded"
                          checked={showFraudedClicks}
                          onCheckedChange={(checked) =>
                            setShowFraudedClicks(checked === true)
                          }
                        />
                        <label
                          htmlFor="show-frauded"
                          className="text-sm text-gray-600"
                        >
                          Frauded Clicks
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Overview - Single Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardHeader className="relative space-y-0 p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Total Clicks
                </CardDescription>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
                {isRevenueFetching ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  totals.totalClicks.toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Click performance
                <ArrowUpRight className="size-4 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">Based on selected period</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="relative space-y-0 p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Revenue
                </CardDescription>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
                {isRevenueFetching ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  formatVNDCurrency(totals.totalRevenue)
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Revenue growth
                <ArrowUpRight className="size-4 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">Total revenue for period</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="relative space-y-0 p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Verified Clicks
                </CardDescription>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
                {isRevenueFetching ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  totals.totalVerifiedClicks.toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                High verification rate
                <Check className="size-4 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">Above industry average</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="relative space-y-0 p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Valid vs. Fraud
                </CardDescription>
                <div className="size-[32px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            value: totals.totalVerifiedClicks,
                            color: "#10b981",
                          },
                          { value: totals.totalFraudClicks, color: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={12}
                        outerRadius={16}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {validationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
                {isRevenueFetching ? (
                  <Skeleton className="h-6 w-24" />
                ) : totals.totalVerifiedClicks === 0 &&
                  totals.totalFraudClicks === 0 ? (
                  "No Data"
                ) : (
                  <>
                    {(
                      (totals.totalVerifiedClicks /
                        (totals.totalVerifiedClicks +
                          totals.totalFraudClicks)) *
                      100
                    ).toFixed(1)}
                    % Valid
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Fraud prevention
                <Shield className="size-4 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">
                {totals.totalFraudClicks === 0 &&
                totals.totalVerifiedClicks === 0
                  ? "No clicks detected"
                  : `${totals.totalFraudClicks} fraudulent clicks detected`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Clicks Chart */}
          <Card className="col-span-1 overflow-hidden shadow-sm lg:col-span-2">
            <CardHeader className="mb-5 border-b px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-medium">
                    Daily Clicks Overview
                  </CardTitle>
                  <Info className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isRevenueFetching ? (
                <Skeleton className="h-[300px] w-full" />
              ) : dailyClicksData.length === 0 ? (
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                  <h3 className="text-lg font-semibold">
                    No Click Data Available
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No clicks recorded for the selected period
                  </p>
                </div>
              ) : (
                <ChartContainer
                  className="h-[300px] w-full"
                  config={chartConfig}
                >
                  <LineChart
                    data={dailyClicksData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                            labelKey="date"
                            nameKey="name"
                          />
                        )
                      }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    {showTotalClicks && (
                      <Line
                        type="monotone"
                        dataKey="totalClicks"
                        stroke="var(--color-totalClicks)"
                        strokeWidth={2}
                        dot={false}
                        name="Total Clicks"
                      />
                    )}
                    {showVerifiedClicks && (
                      <Line
                        type="monotone"
                        dataKey="verifiedClicks"
                        stroke="var(--color-verifiedClicks)"
                        strokeWidth={2}
                        dot={false}
                        name="Verified Clicks"
                      />
                    )}
                    {showFraudedClicks && (
                      <Line
                        type="monotone"
                        dataKey="fraudedClicks"
                        stroke="var(--color-fraudedClicks)"
                        strokeWidth={2}
                        dot={false}
                        name="Frauded Clicks"
                      />
                    )}
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card className="flex flex-col">
            <CardHeader className="border-b px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-medium">
                    Device Distribution
                  </CardTitle>
                  <Info className="size-4 text-muted-foreground/60" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isRevenueFetching ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-[400px]">
                    <Skeleton className="h-[40px] w-full" />
                  </div>
                  <div className="relative w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height={300}>
                      <Skeleton className="size-full" />
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : deviceDistributionData.every((item) => item.value === 0) ? (
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                  <h3 className="text-lg font-semibold">
                    No Device Data Available
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No device information recorded for the selected period
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex w-full max-w-[400px] items-center justify-center gap-x-8">
                    {deviceDistributionData.map((entry, index) => (
                      <div
                        key={`stat-${index}`}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-[3px] rounded-sm"
                            style={{ backgroundColor: entry.fill }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {entry.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold">
                            {entry.value.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({entry.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg border bg-white p-2 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="size-2 rounded-full"
                                    style={{ backgroundColor: data.fill }}
                                  />
                                  <span className="font-medium">
                                    {data.name}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {data.value.toLocaleString()} clicks (
                                  {data.percentage}%)
                                </div>
                              </div>
                            )
                          }}
                        />
                        <Pie
                          data={deviceDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={85}
                        >
                          {deviceDistributionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.fill}
                              stroke="white"
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground"
                        >
                          <tspan
                            x="50%"
                            dy="-0.5em"
                            className="text-2xl font-bold"
                          >
                            {totalDeviceClicks.toLocaleString()}
                          </tspan>
                          <tspan
                            x="50%"
                            dy="1.6em"
                            className="text-xs text-muted-foreground"
                          >
                            Total device clicks
                          </tspan>
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="flex flex-col">
            <CardHeader className="mb-5 border-b px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-medium">
                    Revenue Overview
                  </CardTitle>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <Info className="size-4 text-muted-foreground/60" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Daily revenue from verified clicks
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isRevenueFetching ? (
                <Skeleton className="h-[300px] w-full" />
              ) : !revenueData?.data ||
                Object.keys(revenueData.data).length === 0 ? (
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                  <h3 className="text-lg font-semibold">
                    No Revenue Data Available
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No revenue recorded for the selected period
                  </p>
                </div>
              ) : (
                <ChartContainer
                  className="w-full"
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "#10b981",
                    },
                  }}
                >
                  <BarChart
                    data={Object.values(revenueData?.data || {})
                      .map((day) => ({
                        date: format(new Date(day.date), "MMM d"),
                        revenue: day.campaigns.reduce(
                          (total: number, campaign: Campaign) => {
                            if (
                              selectedCampaign === "all" ||
                              campaign.campaignId.toString() ===
                                selectedCampaign
                            ) {
                              return total + campaign.totalRevenue
                            }
                            return total
                          },
                          0
                        ),
                      }))
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                      )}
                    margin={{ top: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(value) => formatVNDCurrency(value)}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const value = payload[0]?.value
                        if (typeof value !== "number") return null
                        return (
                          <div className="rounded-lg border bg-white p-2 shadow-sm">
                            <div className="font-medium">
                              {payload[0].payload.date}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="size-2 rounded-full bg-emerald-500" />
                              <span className="text-sm text-muted-foreground">
                                {formatVNDCurrency(value)}
                              </span>
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
