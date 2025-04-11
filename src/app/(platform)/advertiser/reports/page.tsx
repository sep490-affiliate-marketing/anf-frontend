"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"
import {
  Activity,
  BarChart as BarChartIcon,
  Calendar,
  DollarSign,
  MousePointer,
  RefreshCw,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { useGetCampaignsByAdvertiser } from "@/hooks/campaign"
import {
  useGenerateAdvertiserOfferStatistics,
  useGenerateAdvertiserOfferStatisticsByCode,
  useGetAdvertiserOfferStatistics,
  useGetAdvertiserOfferStatisticsByCode,
} from "@/hooks/statistics"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types for statistics data
interface PerformanceData {
  name: string
  clicks: number
  conversions: number
  revenue: number
}

interface StatisticsItem {
  id: number
  offerId: number
  date: string
  clickCount: number
  conversionCount: number
  conversionRate: number
  publisherCount: number
  revenue: number
}

interface StatisticsTotals {
  clickCount: number
  conversionCount: number
  publisherCount: number
  revenue: number
  conversionRate: number
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [advertiserCode, setAdvertiserCode] = useState(user?.userCode ?? "")

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("")
  const [selectedOfferId, setSelectedOfferId] = useState<string>("")

  // Overview tab hooks (by advertiser code)
  const {
    data: advertiserCodeStats,
    isLoading: isLoadingCodeStats,
    isError: isErrorCodeStats,
    error: errorCodeStats,
  } = useGetAdvertiserOfferStatisticsByCode(advertiserCode)

  const { mutate: generateByCode, isPending: isGeneratingByCode } =
    useGenerateAdvertiserOfferStatisticsByCode()

  // Detailed tab hooks (by offer ID)
  const {
    data: offerStats,
    isLoading: isLoadingOfferStats,
    isError: isErrorOfferStats,
    error: errorOfferStats,
  } = useGetAdvertiserOfferStatistics(selectedOfferId)

  const { mutate: generateByOffer, isPending: isGeneratingByOffer } =
    useGenerateAdvertiserOfferStatistics()

  // Campaign data for detailed tab
  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
  } = useGetCampaignsByAdvertiser(advertiserCode)

  const handleGenerateStatistics = () => {
    if (activeTab === "overview") {
      generateByCode(advertiserCode)
    } else if (activeTab === "detailed" && selectedOfferId) {
      generateByOffer(selectedOfferId)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
    setSelectedOfferId("")
  }

  const handleOfferChange = (offerId: string) => {
    setSelectedOfferId(offerId)
  }

  // Get campaigns from data
  const campaigns = campaignsData?.value?.data || []

  // Get offers for the selected campaign
  const selectedCampaign = campaigns.find(
    (campaign) => campaign.id.toString() === selectedCampaignId
  )
  const campaignOffers = selectedCampaign?.offers || []

  // Format data for the chart
  const getChartData = (data: any): PerformanceData[] => {
    if (!data?.data || !Array.isArray(data.data)) return []

    // Return data with each offer as a separate item
    return data.data.map((item: StatisticsItem) => ({
      name: `Offer #${item.offerId}`,
      clicks: item.clickCount || 0,
      conversions: item.conversionCount || 0,
      revenue: item.revenue || 0,
    }))
  }

  // Calculate totals for metric cards
  const calculateTotals = (data: any): StatisticsTotals => {
    if (!data?.data || !Array.isArray(data.data)) {
      return {
        clickCount: 0,
        conversionCount: 0,
        publisherCount: 0,
        revenue: 0,
        conversionRate: 0,
      }
    }

    // Sum up the values across all offers
    return data.data.reduce(
      (acc: StatisticsTotals, item: StatisticsItem) => {
        return {
          clickCount: acc.clickCount + (item.clickCount || 0),
          conversionCount: acc.conversionCount + (item.conversionCount || 0),
          publisherCount: Math.max(
            acc.publisherCount,
            item.publisherCount || 0
          ),
          revenue: acc.revenue + (item.revenue || 0),
          // Recalculate overall conversion rate
          conversionRate:
            acc.clickCount + item.clickCount > 0
              ? (acc.conversionCount + item.conversionCount) /
                (acc.clickCount + item.clickCount)
              : 0,
        }
      },
      {
        clickCount: 0,
        conversionCount: 0,
        publisherCount: 0,
        revenue: 0,
        conversionRate: 0,
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your campaign performance
          </p>
        </div>
        <Button
          onClick={handleGenerateStatistics}
          disabled={
            activeTab === "overview"
              ? isGeneratingByCode
              : isGeneratingByOffer || !selectedOfferId
          }
          className="gap-2"
        >
          {(
            activeTab === "overview" ? isGeneratingByCode : isGeneratingByOffer
          ) ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              Generate Statistics
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoadingCodeStats ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="mb-2 h-8 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : isErrorCodeStats ? (
            <Card className="bg-destructive/10">
              <CardHeader>
                <CardTitle>Error Loading Statistics</CardTitle>
                <CardDescription>
                  {errorCodeStats?.message ||
                    "Failed to load statistics. Please try again."}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Clicks
                    </CardTitle>
                    <MousePointer className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculateTotals(
                        advertiserCodeStats
                      ).clickCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      User interactions with your ads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Conversions
                    </CardTitle>
                    <BarChartIcon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculateTotals(
                        advertiserCodeStats
                      ).conversionCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Completed actions from your ads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Publishers
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculateTotals(
                        advertiserCodeStats
                      ).publisherCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Publishers showing your ads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue
                    </CardTitle>
                    <DollarSign className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      $
                      {calculateTotals(
                        advertiserCodeStats
                      ).revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total earnings from conversions
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Campaign performance metrics for{" "}
                    {advertiserCodeStats?.data &&
                    Array.isArray(advertiserCodeStats.data) &&
                    advertiserCodeStats.data.length > 0
                      ? new Date(
                          advertiserCodeStats.data[0].date
                        ).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getChartData(advertiserCodeStats)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) =>
                            value.toString().length > 3
                              ? `${value / 1000}k`
                              : value
                          }
                        />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--muted))" }}
                          content={({
                            active,
                            payload,
                          }: TooltipProps<ValueType, NameType>) => {
                            if (!active || !payload?.length) return null
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-1 gap-2">
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        {entry.name}
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {entry.name === "Revenue ($)"
                                          ? `$${entry.value?.toLocaleString()}`
                                          : entry.value?.toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{ paddingTop: "10px" }}
                        />
                        <defs>
                          <linearGradient
                            id="colorClicks"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#4f46e5"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4f46e5"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorConversions"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <Bar
                          name="Clicks"
                          dataKey="clicks"
                          fill="url(#colorClicks)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          name="Conversions"
                          dataKey="conversions"
                          fill="url(#colorConversions)"
                          radius={[4, 4, 0, 0]}
                        />

                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{ paddingTop: "10px" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Offer Statistics</CardTitle>
              <CardDescription>
                Select a campaign and offer to view detailed statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Campaign and Offer Selection */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Campaign
                    </label>
                    <Select
                      value={selectedCampaignId}
                      onValueChange={handleCampaignChange}
                      disabled={isLoadingCampaigns}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCampaigns ? (
                          <SelectItem value="loading" disabled>
                            Loading campaigns...
                          </SelectItem>
                        ) : isErrorCampaigns ? (
                          <SelectItem value="error" disabled>
                            Error loading campaigns
                          </SelectItem>
                        ) : campaigns.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No campaigns available
                          </SelectItem>
                        ) : (
                          campaigns.map((campaign) => (
                            <SelectItem
                              key={campaign.id}
                              value={campaign.id.toString()}
                            >
                              {campaign.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Offer</label>
                    <Select
                      value={selectedOfferId}
                      onValueChange={handleOfferChange}
                      disabled={
                        !selectedCampaignId || campaignOffers.length === 0
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            selectedCampaignId
                              ? "Select an offer"
                              : "First select a campaign"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {!selectedCampaignId ? (
                          <SelectItem value="nocampaign" disabled>
                            First select a campaign
                          </SelectItem>
                        ) : campaignOffers.length === 0 ? (
                          <SelectItem value="nooffers" disabled>
                            No offers available for this campaign
                          </SelectItem>
                        ) : (
                          campaignOffers.map((offer) => (
                            <SelectItem
                              key={offer.id}
                              value={offer.id.toString()}
                              className="py-3"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">
                                    {offer.pricingModel}
                                  </span>
                                  <span className="rounded bg-muted px-2 py-0.5">
                                    Bid: ${offer.bid?.toLocaleString()}
                                  </span>
                                  <span className="rounded bg-muted px-2 py-0.5">
                                    Budget: ${offer.budget?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    disabled={!selectedOfferId || isGeneratingByOffer}
                    onClick={() =>
                      selectedOfferId && generateByOffer(selectedOfferId)
                    }
                    className="gap-2"
                  >
                    {isGeneratingByOffer ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="size-4" />
                        Load Offer Stats
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedOfferId &&
            (isLoadingOfferStats ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-64" />
                  </div>
                </CardContent>
              </Card>
            ) : isErrorOfferStats ? (
              <Card className="bg-destructive/10">
                <CardHeader>
                  <CardTitle>Error Loading Offer Statistics</CardTitle>
                  <CardDescription>
                    {errorOfferStats?.message ||
                      "Failed to load offer statistics. Please try again."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : offerStats?.data ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm font-medium">
                          Performance
                        </CardTitle>
                        <Activity className="size-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold">
                            {offerStats.data.conversionRate
                              ? `${(offerStats.data.conversionRate * 100).toFixed(2)}%`
                              : "0.00%"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Conversion Rate
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">
                              {offerStats.data.clickCount?.toLocaleString() ||
                                0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Clicks
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {offerStats.data.conversionCount?.toLocaleString() ||
                                0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Conversions
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm font-medium">
                          Publishers
                        </CardTitle>
                        <Users className="size-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold">
                            {offerStats.data.publisherCount?.toLocaleString() ||
                              0}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Active Publishers
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {selectedCampaign?.name || ""}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Campaign
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm font-medium">
                          Details
                        </CardTitle>
                        <Calendar className="size-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="font-semibold">
                            Offer #{offerStats.data.offerId}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Offer ID
                          </p>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {new Date(offerStats.data.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Report Date
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Offer Performance Chart</CardTitle>
                    <CardDescription>
                      Visual representation of offer metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: `Offer #${offerStats?.data?.offerId || ""}`,
                              clicks: offerStats?.data?.clickCount || 0,
                              conversions:
                                offerStats?.data?.conversionCount || 0,
                            },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) =>
                              value.toString().length > 3
                                ? `${value / 1000}k`
                                : value
                            }
                          />
                          <Tooltip
                            cursor={{ fill: "hsl(var(--muted))" }}
                            content={({
                              active,
                              payload,
                            }: TooltipProps<ValueType, NameType>) => {
                              if (!active || !payload?.length) return null
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-1 gap-2">
                                    {payload.map((entry, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col"
                                      >
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          {entry.name}
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                          {entry.value?.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={10}
                            wrapperStyle={{ paddingTop: "10px" }}
                          />
                          <defs>
                            <linearGradient
                              id="colorClicks3"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#4f46e5"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4f46e5"
                                stopOpacity={0.2}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorConversions3"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0.2}
                              />
                            </linearGradient>
                          </defs>
                          <Bar
                            name="Clicks"
                            dataKey="clicks"
                            fill="url(#colorClicks3)"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          />
                          <Bar
                            name="Conversions"
                            dataKey="conversions"
                            fill="url(#colorConversions3)"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
