"use client"

import { Suspense } from "react"
import { useState } from "react"

import { useSearchParams } from "next/navigation"

import {
  BarChart3,
  CheckCircle,
  Download,
  LineChart,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
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
const conversionData = [
  {
    id: "1",
    date: "2023-06-01",
    campaign: "Summer Sale",
    source: "Facebook",
    country: "US",
    conversions: 45,
    revenue: 2250,
    cost: 900,
    conversionRate: 3.6,
    costPerConversion: 20,
  },
  {
    id: "2",
    date: "2023-06-02",
    campaign: "Summer Sale",
    source: "Google",
    country: "US",
    conversions: 38,
    revenue: 1900,
    cost: 760,
    conversionRate: 4.2,
    costPerConversion: 20,
  },
  {
    id: "3",
    date: "2023-06-03",
    campaign: "Back to School",
    source: "Facebook",
    country: "CA",
    conversions: 32,
    revenue: 1600,
    cost: 640,
    conversionRate: 5.1,
    costPerConversion: 20,
  },
  {
    id: "4",
    date: "2023-06-04",
    campaign: "Holiday Special",
    source: "Direct",
    country: "UK",
    conversions: 55,
    revenue: 2750,
    cost: 1100,
    conversionRate: 5.0,
    costPerConversion: 20,
  },
  {
    id: "5",
    date: "2023-06-05",
    campaign: "Spring Collection",
    source: "Instagram",
    country: "US",
    conversions: 28,
    revenue: 1400,
    cost: 560,
    conversionRate: 3.1,
    costPerConversion: 20,
  },
]

const dailyConversionsData = [
  { date: "Jun 01", conversions: 45, revenue: 2250 },
  { date: "Jun 02", conversions: 38, revenue: 1900 },
  { date: "Jun 03", conversions: 32, revenue: 1600 },
  { date: "Jun 04", conversions: 55, revenue: 2750 },
  { date: "Jun 05", conversions: 28, revenue: 1400 },
  { date: "Jun 06", conversions: 42, revenue: 2100 },
  { date: "Jun 07", conversions: 50, revenue: 2500 },
]

const conversionsBySourceData = [
  { source: "Facebook", conversions: 120 },
  { source: "Google", conversions: 95 },
  { source: "Direct", conversions: 75 },
  { source: "Instagram", conversions: 60 },
  { source: "Twitter", conversions: 30 },
]

const conversionsByDeviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 40 },
  { name: "Tablet", value: 15 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

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
    accessorKey: "conversions",
    header: "Conversions",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        {row.getValue("conversions").toLocaleString()}
      </div>
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
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        $
        {row.getValue("cost").toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    accessorKey: "conversionRate",
    header: "Conv. Rate",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">{row.getValue("conversionRate")}%</div>
    ),
  },
  {
    accessorKey: "costPerConversion",
    header: "Cost/Conv.",
    cell: ({ row }: { row: any }) => (
      <div className="text-right">
        ${row.getValue("costPerConversion").toFixed(2)}
      </div>
    ),
  },
]

function ConversionReportContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate totals for overview cards
  const totalConversions = conversionData.reduce(
    (sum, item) => sum + item.conversions,
    0
  )
  const totalRevenue = conversionData.reduce(
    (sum, item) => sum + item.revenue,
    0
  )
  const totalCost = conversionData.reduce((sum, item) => sum + item.cost, 0)
  const averageConversionRate =
    conversionData.reduce((sum, item) => sum + item.conversionRate, 0) /
    conversionData.length
  const roi = ((totalRevenue - totalCost) / totalCost) * 100

  const handleExport = () => {
    console.log("Exporting data...")
    // Implement export functionality
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Conversion Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze conversion performance and revenue metrics
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
              title="Total Conversions"
              value={totalConversions.toLocaleString()}
              description="Last 30 days"
              change={6.2}
              icon={<CheckCircle className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              description="Last 30 days"
              change={8.5}
              icon={<TrendingUp className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="Conversion Rate"
              value={`${averageConversionRate.toFixed(2)}%`}
              description="Average rate"
              change={3.1}
              icon={<LineChart className="size-4 text-muted-foreground" />}
            />
            <ReportCard
              title="ROI"
              value={`${roi.toFixed(2)}%`}
              description="Return on investment"
              change={5.4}
              icon={<BarChart3 className="size-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Conversion & Revenue Trends</CardTitle>
                <CardDescription>
                  Daily conversions and revenue over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={dailyConversionsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#8884d8"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="conversions"
                        stroke="#8884d8"
                        name="Conversions"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        name="Revenue ($)"
                      />
                    </RechartsLineChart>
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
                    <PieChart>
                      <Pie
                        data={conversionsByDeviceData}
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
                        {conversionsByDeviceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
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
                <CardTitle>Conversions by Source</CardTitle>
                <CardDescription>
                  Distribution of conversions by traffic source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionsBySourceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="conversions"
                        fill="#8884d8"
                        name="Conversions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Campaign</CardTitle>
                <CardDescription>
                  Conversion rates across different campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="campaign" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="conversionRate"
                        fill="#82ca9d"
                        name="Conversion Rate (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs. Cost</CardTitle>
              <CardDescription>
                Compare revenue and cost by campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="campaign" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                    <Bar dataKey="cost" fill="#82ca9d" name="Cost ($)" />
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
              <CardTitle>Conversion Data</CardTitle>
              <CardDescription>
                Detailed conversion metrics by date, campaign, source, and
                country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportDataTable
                columns={columns}
                data={conversionData}
                onExport={handleExport}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ConversionReportPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-[200px] rounded bg-muted" />
        </div>
      }
    >
      <ConversionReportContent />
    </Suspense>
  )
}
