"use client"

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  LineChart,
  Loader2,
  RefreshCcw,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartTooltip } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatVNDCurrency } from '../../../lib/utils';

// Enhanced fake data for the dashboard
const revenueData = [
  { month: "Jan", value: 20000, growth: 2.5 },
  { month: "Feb", value: 42000, growth: 3.1 },
  { month: "Mar", value: 65000, growth: 3.8 },
  { month: "Apr", value: 78000, growth: 4.2 },
  { month: "May", value: 91000, growth: 4.5 },
  { month: "Jun", value: 112000, growth: 5.1 },
  { month: "Jul", value: 135000, growth: 5.8 },
]

const conversionData = [
  { name: "Mon", value: 2.4 },
  { name: "Tue", value: 3.1 },
  { name: "Wed", value: 2.8 },
  { name: "Thu", value: 4.2 },
  { name: "Fri", value: 3.9 },
  { name: "Sat", value: 3.3 },
  { name: "Sun", value: 2.7 },
]

const userActivityData = [
  { hour: "00:00", active: 245 },
  { hour: "04:00", active: 388 },
  { hour: "08:00", active: 912 },
  { hour: "12:00", active: 1245 },
  { hour: "16:00", active: 1088 },
  { hour: "20:00", active: 645 },
]

const chartConfig = {
  value: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  conversion: {
    label: "Conversion Rate",
    color: "hsl(var(--green-600))",
  },
  users: {
    label: "Active Users",
    color: "hsl(var(--blue-600))",
  },
} satisfies ChartConfig

export default function Page() {
  return (
    <div className="container mx-auto flex flex-1 flex-col gap-6 p-6">
      {/* Overview Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              A comprehensive overview of your business metrics and performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2">
              <LineChart className="size-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Time period selector */}
        <div className="flex items-center justify-end gap-2 text-sm">
          <div className="rounded-md border bg-background px-3 py-1.5 font-medium">
            Last 7 days
          </div>
          <span className="text-muted-foreground">compared to</span>
          <Select defaultValue="previous">
            <SelectTrigger className="h-8 w-[140px] border-none px-3 shadow-none [&>span]:font-normal">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous period</SelectItem>
              <SelectItem value="year">Previous year</SelectItem>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Button variant="outline" size="sm" className="h-8">
            Daily <ChevronDown className="ml-1 size-3" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">formatVNDCurrency(5435000)</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="size-3" />
                12.5%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="size-3" />
                8.2%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24%</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center text-red-500">
                <ArrowDownRight className="size-3" />
                1.2%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <Loader2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="size-3" />2
              </span>
              <span className="text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Trend */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Revenue
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {formatVNDCurrency(data.value ?? 0)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Growth
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {data.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="url(#colorRevenue)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conversionData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {data.name}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.value}%
                            </span>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={userActivityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="hour"
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
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {data.hour}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.active} users
                            </span>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New campaign created",
                  description: "Summer Sale 2024",
                  time: "2 hours ago",
                },
                {
                  title: "Revenue milestone reached",
                  description: "$100k in monthly revenue",
                  time: "5 hours ago",
                },
                {
                  title: "New integration added",
                  description: "Connected with Stripe",
                  time: "1 day ago",
                },
                {
                  title: "System update completed",
                  description: "Version 2.1.0 deployed",
                  time: "2 days ago",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border p-3"
                >
                  <div className="mt-px size-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
