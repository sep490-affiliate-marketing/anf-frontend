import { eachDayOfInterval, format } from "date-fns"
import { Info } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyClicksData {
  date: string
  totalClicks: number
  verifiedClicks: number
  fraudedClicks: number
}

interface DailyClicksChartProps {
  isLoading: boolean
  data: DailyClicksData[]
  startDate: Date
  endDate: Date
}

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

export function DailyClicksChart({
  isLoading,
  data,
  startDate,
  endDate,
}: DailyClicksChartProps) {
  // Generate array of all dates in the range
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Create a map of existing data
  const dataMap = new Map(data.map((item) => [item.date, item]))

  // Generate complete dataset with 0s for missing dates
  const completeData = dateRange.map((date) => {
    const formattedDate = format(date, "MMM d")
    const existingData = dataMap.get(formattedDate)

    return {
      date: formattedDate,
      totalClicks: existingData?.totalClicks ?? 0,
      verifiedClicks: existingData?.verifiedClicks ?? 0,
      fraudedClicks: existingData?.fraudedClicks ?? 0,
    }
  })

  return (
    <Card className="col-span-6">
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
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : completeData.length === 0 ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg text-center">
            <h3 className="text-lg font-semibold">No Click Data Available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No clicks recorded for the selected period
            </p>
          </div>
        ) : (
          <ChartContainer className="h-[300px] w-full" config={chartConfig}>
            <LineChart
              data={completeData}
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

              <Line
                type="linear"
                dataKey="totalClicks"
                stroke="var(--color-totalClicks)"
                strokeWidth={2}
                dot={false}
                name="Total Clicks"
              />

              <Line
                type="linear"
                dataKey="verifiedClicks"
                stroke="var(--color-verifiedClicks)"
                strokeWidth={2}
                dot={false}
                name="Verified Clicks"
              />

              <Line
                type="linear"
                dataKey="fraudedClicks"
                stroke="var(--color-fraudedClicks)"
                strokeWidth={2}
                dot={false}
                name="Frauded Clicks"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
