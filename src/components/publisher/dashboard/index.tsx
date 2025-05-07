"use client"

import { useMemo, useState } from "react"

import { endOfMonth, format, startOfMonth } from "date-fns"
import { Check, ChevronsUpDown } from "lucide-react"
import { parseAsIsoDate, parseAsString, useQueryState } from "nuqs"
import { DateRange } from "react-day-picker"

import { ICampaign } from "@/types/campaign.type"
import { IGetPublisherRevenueStatistics } from "@/types/statistics.type"

import { cn } from "@/lib/utils"

import { useGetCampaignsByDate } from "@/hooks/campaign"
import { useGetPublisherRevenueStatistics } from "@/hooks/statistics"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
    parseAsIsoDate.withDefault(startOfMonth(new Date()))
  )
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(endOfMonth(new Date()))
  )
  const [selectedCampaign, setSelectedCampaign] = useQueryState(
    "selectedCampaign",
    parseAsString.withDefault("all")
  )
  const [open, setOpen] = useState(false)

  const {
    data: revenueData,
    isFetching: isRevenueFetching,
    // isError: isRevenueError,
    // error: revenueError,
  } = useGetPublisherRevenueStatistics(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd")
  )

  const { data: campaignsDataResponse, isFetching: isCampaignsFetching } =
    useGetCampaignsByDate(
      1,
      10,
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    )

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
  const campaignOptions = useMemo(() => {
    // Default option is always "All Campaigns"
    const defaultOption = [
      {
        value: "all",
        label: "All Campaigns",
        description: "",
        startDate: "",
        endDate: "",
        categoryName: "",
      },
    ]

    // Use campaignsDataResponse if available
    if (
      campaignsDataResponse?.isSuccess &&
      campaignsDataResponse.value?.data?.length > 0
    ) {
      return [
        ...defaultOption,
        ...campaignsDataResponse.value.data.map((campaign: ICampaign) => ({
          value: campaign.id.toString(),
          label: campaign.name || `Campaign #${campaign.id}`,
          description: campaign.description || "",
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          categoryName: campaign.categoryName || "Uncategorized",
        })),
      ]
    }

    // Fallback to revenueData if campaignsDataResponse is not available
    if (revenueData?.data) {
      const uniqueCampaigns = new Set<number>()
      Object.values(revenueData.data).forEach(
        (day: IGetPublisherRevenueStatistics) => {
          day.campaigns.forEach((campaign: Campaign) => {
            uniqueCampaigns.add(campaign.campaignId)
          })
        }
      )

      return [
        ...defaultOption,
        ...Array.from(uniqueCampaigns).map((id) => ({
          value: id.toString(),
          label: `Campaign #${id}`,
          description: "",
          startDate: "",
          endDate: "",
          categoryName: "",
        })),
      ]
    }

    // If no data is available, just return the default option
    return defaultOption
  }, [campaignsDataResponse, revenueData])

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

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[280px] justify-between"
                  disabled={isCampaignsFetching}
                >
                  {isCampaignsFetching ? (
                    <span className="flex items-center gap-2">
                      <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading campaigns...
                    </span>
                  ) : selectedCampaign ? (
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium">
                        {
                          campaignOptions.find(
                            (option) => option.value === selectedCampaign
                          )?.label
                        }
                      </span>
                      {/* {selectedCampaign !== "all" && (
                        <span className="max-w-[270px] truncate text-xs text-muted-foreground">
                          {
                            campaignOptions.find(
                              (option) => option.value === selectedCampaign
                            )?.categoryName
                          }
                        </span>
                      )} */}
                    </div>
                  ) : (
                    "Select Campaign"
                  )}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search campaign..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No campaign found.</CommandEmpty>
                    <CommandGroup>
                      {campaignOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setSelectedCampaign(currentValue)
                            setOpen(false)
                          }}
                          className="flex flex-col items-start py-3"
                        >
                          {option.value === "all" ? (
                            <div className="flex w-full items-center">
                              <span className="font-medium">
                                {option.label}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto size-4",
                                  selectedCampaign === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          ) : (
                            <div className="flex w-full flex-col text-sm">
                              <div className="flex w-full items-start justify-between">
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  <span className="text-xs text-primary">
                                    {option.categoryName}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto size-4",
                                    selectedCampaign === option.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                              <div className="mt-2 flex gap-2 text-xs text-gray-500">
                                <span>
                                  {option.startDate
                                    ? format(
                                        new Date(option.startDate),
                                        "MMM d, yyyy"
                                      )
                                    : "No start"}
                                </span>
                                <span>to</span>
                                <span>
                                  {option.endDate
                                    ? format(
                                        new Date(option.endDate),
                                        "MMM d, yyyy"
                                      )
                                    : "No end"}
                                </span>
                              </div>
                            </div>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
