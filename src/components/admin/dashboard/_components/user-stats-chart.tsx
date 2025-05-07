import { eachDayOfInterval, format } from "date-fns"
import { Info } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyUserData {
  date: string
  totalUser: number
  totalActivedUser: number | null
  totalDeactivedUser: number | null
}

interface UserStatsChartProps {
  isLoading: boolean
  data: DailyUserData[]
  startDate: Date
  endDate: Date
}

const chartConfig = {
  totalUser: {
    label: "Total Users",
    color: "#3b82f6",
  },
  totalActivedUser: {
    label: "Active Users",
    color: "#10b981",
  },
  totalDeactivedUser: {
    label: "Deactive Users",
    color: "#f43f5e",
  },
}

export function UserStatsChart({
  isLoading,
  data,
  startDate,
  endDate,
}: UserStatsChartProps) {
  // Generate array of all dates in the range
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Create a map of existing data
  const dataMap = new Map(
    data.map((item) => [format(new Date(item.date), "MMM d"), item])
  )

  // Generate complete dataset with 0s for missing dates
  const completeData = dateRange.map((date) => {
    const formattedDate = format(date, "MMM d")
    const existingData = dataMap.get(formattedDate)

    return {
      date: formattedDate,
      totalUser: existingData?.totalUser ?? 0,
      totalActivedUser: existingData?.totalActivedUser ?? 0,
      totalDeactivedUser: existingData?.totalDeactivedUser ?? 0,
    }
  })

  return (
    <Card className="col-span-6">
      <CardHeader className="mb-5 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium">
              Daily User Statistics
            </CardTitle>
            <Info className="size-4 text-muted-foreground/60" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : completeData.length === 0 ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
            <h3 className="text-lg font-semibold">No User Data Available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No user statistics recorded for the selected period
            </p>
          </div>
        ) : (
          <ChartContainer className="h-[300px] w-full" config={chartConfig}>
            <LineChart
              data={completeData}
              margin={{ top: 20, right: 30, bottom: 20 }}
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
                dataKey="totalUser"
                stroke="var(--color-totalUser)"
                strokeWidth={2}
                dot={false}
                name="Total Users"
              />

              <Line
                type="linear"
                dataKey="totalActivedUser"
                stroke="var(--color-totalActivedUser)"
                strokeWidth={2}
                dot={false}
                name="Active Users"
              />

              <Line
                type="linear"
                dataKey="totalDeactivedUser"
                stroke="var(--color-totalDeactivedUser)"
                strokeWidth={2}
                dot={false}
                name="Deactive Users"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
