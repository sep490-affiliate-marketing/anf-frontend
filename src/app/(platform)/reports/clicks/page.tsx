"use client"

import { Suspense } from "react"
import { useState } from "react"

import { useSearchParams } from "next/navigation"

import { BarChart3, Download, ExternalLink, LineChart } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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
const clickData = [
  {
    id: "1",
    date: "2023-06-01",
    campaign: "Summer Sale",
    source: "Facebook",
    country: "US",
    clicks: 1250,
    uniqueClicks: 980,
    ctr: 3.2,
    cpc: 0.45,
  },
  {
    id: "2",
    date: "2023-06-02",
    campaign: "Summer Sale",
    source: "Google",
    country: "US",
    clicks: 980,
    uniqueClicks: 820,
    ctr: 2.8,
    cpc: 0.52,
  },
  {
    id: "3",
    date: "2023-06-03",
    campaign: "Back to School",
    source: "Facebook",
    country: "CA",
    clicks: 750,
    uniqueClicks: 620,
    ctr: 2.5,
    cpc: 0.48,
  },
  {
    id: "4",
    date: "2023-06-04",
    campaign: "Holiday Special",
    source: "Direct",
    country: "UK",
    clicks: 1100,
    uniqueClicks: 950,
    ctr: 3.5,
    cpc: 0.42,
  },
  {
    id: "5",
    date: "2023-06-05",
    campaign: "Spring Collection",
    source: "Instagram",
    country: "US",
    clicks: 890,
    uniqueClicks: 760,
    ctr: 2.9,
    cpc: 0.5,
  },
]

const dailyClicksData = [
  { date: "Jun 01", clicks: 1250, uniqueClicks: 980 },
  { date: "Jun 02", clicks: 980, uniqueClicks: 820 },
  { date: "Jun 03", clicks: 750, uniqueClicks: 620 },
  { date: "Jun 04", clicks: 1100, uniqueClicks: 950 },
  { date: "Jun 05", clicks: 890, uniqueClicks: 760 },
  { date: "Jun 06", clicks: 1300, uniqueClicks: 1050 },
  { date: "Jun 07", clicks: 1450, uniqueClicks: 1200 },
]

const clicksBySourceData = [
  { source: "Facebook", clicks: 3200 },
  { source: "Google", clicks: 2800 },
  { source: "Direct", clicks: 1900 },
  { source: "Instagram", clicks: 1600 },
  { source: "Twitter", clicks: 950 },
]

const clicksByCountryData = [
  { country: "United States", clicks: 5800 },
  { country: "Canada", clicks: 2100 },
  { country: "United Kingdom", clicks: 1900 },
  { country: "Australia", clicks: 1200 },
  { country: "Germany", clicks: 950 },
]

// Table columns
const columns = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "campaign",
    header: "Campaign",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "country",
    header: "Country",
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
    accessorKey: "uniqueClicks",
    header: "Unique Clicks",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        {row.getValue("uniqueClicks").toLocaleString()}
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
    accessorKey: "cpc",
    header: "CPC",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">${row.getValue("cpc").toFixed(2)}</div>
    ),
  },
]

function ClickReportContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate totals for overview cards
  const totalClicks = clickData.reduce((sum, item) => sum + item.clicks, 0)
  const totalUniqueClicks = clickData.reduce(
    (sum, item) => sum + item.uniqueClicks,
    0
  )
  const averageCTR =
    clickData.reduce((sum, item) => sum + item.ctr, 0) / clickData.length
  const averageCPC =
    clickData.reduce((sum, item) => sum + item.cpc, 0) / clickData.length

  const handleExport = () => {
    console.log("Exporting data...")
    // Implement export functionality
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Click Reports</h1>
          <p className="text-muted-foreground">
            Analyze click performance across campaigns, sources, and countries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <LineChart className="mr-2 size-4" />
            Custom Report
          </Button>
          <Button size="sm">
            <Download className="mr-2 size-4" />
            Export All Data
          </Button>
        </div>
      </div>

      <ReportFilters
        showCampaignFilter={true}
        showSourceFilter={true}
        showCountryFilter={true}
        filterOptions={{
          campaigns: [
            { id: "1", name: "Summer Sale" },
            { id: "2", name: "Back to School" },
            { id: "3", name: "Holiday Special" },
            { id: "4", name: "Spring Collection" },
          ],
          sources: [
            { id: "1", name: "Facebook" },
            { id: "2", name: "Google" },
            { id: "3", name: "Direct" },
            { id: "4", name: "Instagram" },
            { id: "5", name: "Twitter" },
          ],
          countries: [
            { id: "US", name: "United States" },
            { id: "CA", name: "Canada" },
            { id: "UK", name: "United Kingdom" },
            { id: "AU", name: "Australia" },
            { id: "DE", name: "Germany" },
          ],
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportCard
              title="Total Clicks"
              value={totalClicks.toLocaleString()}
              description="Last 30 days"
              change={4.8}
              icon={<ExternalLink className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Unique Clicks"
              value={totalUniqueClicks.toLocaleString()}
              description="Last 30 days"
              change={3.2}
              icon={<ExternalLink className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Average CTR"
              value={`${averageCTR.toFixed(2)}%`}
              description="Click-through rate"
              change={1.5}
              icon={<LineChart className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Average CPC"
              value={`$${averageCPC.toFixed(2)}`}
              description="Cost per click"
              change={-2.1}
              icon={<BarChart3 className="size-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Daily Click Trends</CardTitle>
                <CardDescription>
                  Total and unique clicks over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyClicksData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
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
                          id="colorUniqueClicks"
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
                        dataKey="clicks"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        name="Total Clicks"
                      />
                      <Area
                        type="monotone"
                        dataKey="uniqueClicks"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorUniqueClicks)"
                        name="Unique Clicks"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clicks by Source</CardTitle>
                <CardDescription>
                  Distribution of clicks by traffic source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clicksBySourceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks by Country</CardTitle>
                <CardDescription>
                  Distribution of clicks by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clicksByCountryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Click Performance Metrics</CardTitle>
              <CardDescription>CTR and CPC by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={clickData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="campaign" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ctr"
                      stroke="#8884d8"
                      name="CTR (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cpc"
                      stroke="#82ca9d"
                      name="CPC ($)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Click Data</CardTitle>
              <CardDescription>
                Detailed click metrics by date, campaign, source, and country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportDataTable
                columns={columns}
                data={clickData}
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
export default function ClickReportPage() {
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
      <ClickReportContent />
    </Suspense>
  )
}
