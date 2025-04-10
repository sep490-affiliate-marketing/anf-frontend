"use client"

import { Suspense } from "react"
import { useState } from "react"

import { useSearchParams } from "next/navigation"

import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ReportCard } from "@/components/reports/report-card"
import { ReportDataTable } from "@/components/reports/report-data-table"
import { ReportFilters } from "@/components/reports/report-filters"

// Sample data - replace with actual API calls
const campaignData = [
  {
    id: "1",
    name: "Summer Sale",
    impressions: 125000,
    clicks: 7500,
    conversions: 450,
    spent: 3500,
    ctr: 6.0,
    cvr: 6.0,
    cpc: 0.47,
    revenue: 9000,
  },
  {
    id: "2",
    name: "Back to School",
    impressions: 95000,
    clicks: 5200,
    conversions: 320,
    spent: 2800,
    ctr: 5.5,
    cvr: 6.2,
    cpc: 0.54,
    revenue: 6400,
  },
  {
    id: "3",
    name: "Holiday Special",
    impressions: 150000,
    clicks: 9800,
    conversions: 620,
    spent: 4900,
    ctr: 6.5,
    cvr: 6.3,
    cpc: 0.5,
    revenue: 12400,
  },
  {
    id: "4",
    name: "Spring Collection",
    impressions: 85000,
    clicks: 4300,
    conversions: 280,
    spent: 2100,
    ctr: 5.1,
    cvr: 6.5,
    cpc: 0.49,
    revenue: 5600,
  },
  {
    id: "5",
    name: "Flash Sale",
    impressions: 65000,
    clicks: 3900,
    conversions: 210,
    spent: 1800,
    ctr: 6.0,
    cvr: 5.4,
    cpc: 0.46,
    revenue: 4200,
  },
]

const performanceData = [
  { date: "Jan", impressions: 45000, clicks: 2800, conversions: 168 },
  { date: "Feb", impressions: 52000, clicks: 3100, conversions: 186 },
  { date: "Mar", impressions: 49000, clicks: 2950, conversions: 177 },
  { date: "Apr", impressions: 63000, clicks: 3800, conversions: 228 },
  { date: "May", impressions: 59000, clicks: 3550, conversions: 213 },
  { date: "Jun", impressions: 75000, clicks: 4500, conversions: 270 },
  { date: "Jul", impressions: 85000, clicks: 5100, conversions: 306 },
]

const conversionByDeviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 40 },
  { name: "Tablet", value: 15 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

// Table columns
const columns = [
  {
    accessorKey: "name",
    header: "Campaign Name",
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        {row.getValue("impressions").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        {row.getValue("clicks").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        {row.getValue("conversions").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "spent",
    header: "Spent",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        $
        {row.getValue("spent").toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">{row.getValue("ctr")}%</div>
    ),
  },
  {
    accessorKey: "cvr",
    header: "CVR",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">{row.getValue("cvr")}%</div>
    ),
  },
  {
    accessorKey: "cpc",
    header: "CPC",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">${row.getValue("cpc").toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        $
        {row.getValue("revenue").toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
]

function CampaignReportContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate totals for overview cards
  const totalImpressions = campaignData.reduce(
    (sum, campaign) => sum + campaign.impressions,
    0
  )
  const totalClicks = campaignData.reduce(
    (sum, campaign) => sum + campaign.clicks,
    0
  )
  const totalConversions = campaignData.reduce(
    (sum, campaign) => sum + campaign.conversions,
    0
  )
  const totalSpent = campaignData.reduce(
    (sum, campaign) => sum + campaign.spent,
    0
  )
  const totalRevenue = campaignData.reduce(
    (sum, campaign) => sum + campaign.revenue,
    0
  )
  const averageCTR = (totalClicks / totalImpressions) * 100
  const averageCVR = (totalConversions / totalClicks) * 100
  const roi = ((totalRevenue - totalSpent) / totalSpent) * 100

  const handleExport = () => {
    console.log("Exporting data...")
    // Implement export functionality
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Campaign Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze and track the performance of your campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <LineChart className="mr-2 size-4" />
            Custom Report
          </Button>
          <Button size="sm">
            <BarChart3 className="mr-2 size-4" />
            Export All Data
          </Button>
        </div>
      </div>

      <ReportFilters
        showCampaignFilter={true}
        showSourceFilter={true}
        showCountryFilter={true}
        filterOptions={{
          campaigns: campaignData.map((c) => ({ id: c.id, name: c.name })),
          sources: [
            { id: "1", name: "Facebook" },
            { id: "2", name: "Google" },
            { id: "3", name: "Direct" },
          ],
          countries: [
            { id: "US", name: "United States" },
            { id: "CA", name: "Canada" },
            { id: "UK", name: "United Kingdom" },
          ],
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportCard
              title="Total Impressions"
              value={totalImpressions.toLocaleString()}
              description="Last 30 days"
              change={5.2}
              icon={<BarChart3 className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Total Clicks"
              value={totalClicks.toLocaleString()}
              description="Last 30 days"
              change={3.8}
              icon={<LineChart className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Conversions"
              value={totalConversions.toLocaleString()}
              description="Last 30 days"
              change={7.2}
              icon={<TrendingUp className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="ROI"
              value={`${roi.toFixed(2)}%`}
              description="Return on investment"
              change={4.5}
              icon={<PieChart className="size-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Impressions, clicks, and conversions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorImpressions"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorClicks"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorImpressions)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversions by Device</CardTitle>
                <CardDescription>
                  Distribution of conversions by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={conversionByDeviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {conversionByDeviceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Click-Through Rate (CTR)</CardTitle>
                <CardDescription>
                  Average CTR: {averageCTR.toFixed(2)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ctr" fill="#8884d8" name="CTR (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate (CVR)</CardTitle>
                <CardDescription>
                  Average CVR: {averageCVR.toFixed(2)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cvr" fill="#82ca9d" name="CVR (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost vs. Revenue</CardTitle>
              <CardDescription>
                Compare campaign costs and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="spent" fill="#8884d8" name="Cost ($)" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Data</CardTitle>
              <CardDescription>
                Detailed performance metrics for all campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportDataTable
                columns={columns}
                data={campaignData}
                onExport={handleExport}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Main page component with Suspense
export default function CampaignReportPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-[200px] rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <CampaignReportContent />
    </Suspense>
  )
}
