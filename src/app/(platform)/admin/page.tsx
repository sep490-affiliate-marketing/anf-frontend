"use client"

import { ChevronDown, Info, TrendingUp } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Fake data for the dashboard
const revenueData = [
  { month: "1", value: 20 },
  { month: "2", value: 120 },
  { month: "3", value: 100 },
  { month: "4", value: 500 },
  { month: "5", value: 900 },
  { month: "6", value: 1200 },
  { month: "7", value: 300 },
]

const chartConfig = {
  value: {
    label: "Revenue",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export default function Page() {
  return (
    <div className="container mx-auto flex flex-1 flex-col gap-4 p-4">
      {/* Overview Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your overview</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Add
            </Button>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </div>

        {/* Time period selector */}
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded-md border bg-background px-2 py-1">
            Last 7 days
          </div>
          <span className="text-muted-foreground">compared to</span>
          <Select defaultValue="previous">
            <SelectTrigger className="h-7 w-[140px] border-none px-2 shadow-none [&>span]:font-normal">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous period</SelectItem>
              <SelectItem value="year">Previous year</SelectItem>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Button variant="outline" size="sm" className="h-7">
            Daily <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Payments Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Payments</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Information about payments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Gross Volume */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                Gross volume
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total transaction volume</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="rounded bg-muted px-1 text-xs">0.0%</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">$0.00</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>$0.00</span>
                  <span>previous period</span>
                </div>
              </div>
              <div className="relative mt-4 aspect-[4/2] w-full">
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
                          stopColor="hsl(var(--destructive))"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--destructive))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                      width={0}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="value"
                      type="monotone"
                      fill="url(#colorRevenue)"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Mar 10</span>
                <span>Today</span>
              </div>
              <div className="mt-4 flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Volume */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                Net volume from sales
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Net volume after fees and refunds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="rounded bg-muted px-1 text-xs">0.0%</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">$0.00</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>$0.00</span>
                  <span>previous period</span>
                </div>
              </div>
              <div className="relative mt-4 aspect-[4/2] w-full">
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--destructive))"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--destructive))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                      width={0}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="value"
                      type="monotone"
                      fill="url(#colorRevenue2)"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Mar 10</span>
                <span>Today</span>
              </div>
              <div className="mt-4 flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
