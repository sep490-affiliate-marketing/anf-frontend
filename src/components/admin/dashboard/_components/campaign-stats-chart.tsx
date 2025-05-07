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

interface DailyCampaignData {
  date: string
  totalCampaign: number
  totalApprovedCampaign: number
  totalRejectedCampaign: number
}

interface CampaignStatsChartProps {
  isLoading: boolean
  data: DailyCampaignData[]
  startDate: Date
  endDate: Date
}

const chartConfig = {
  totalCampaign: {
    label: "Total Campaigns",
    color: "#3b82f6",
  },
  totalApprovedCampaign: {
    label: "Approved Campaigns",
    color: "#10b981",
  },
  totalRejectedCampaign: {
    label: "Rejected Campaigns",
    color: "#f43f5e",
  },
}

export function CampaignStatsChart({
  isLoading,
  data,
  startDate,
  endDate,
}: CampaignStatsChartProps) {
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
      totalCampaign: existingData?.totalCampaign ?? 0,
      totalApprovedCampaign: existingData?.totalApprovedCampaign ?? 0,
      totalRejectedCampaign: existingData?.totalRejectedCampaign ?? 0,
    }
  })

  return (
    <Card className="col-span-6">
      <CardHeader className="mb-5 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium">
              Daily Campaign Statistics
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
            <h3 className="text-lg font-semibold">
              No Campaign Data Available
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No campaign statistics recorded for the selected period
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
                dataKey="totalCampaign"
                stroke="var(--color-totalCampaign)"
                strokeWidth={2}
                dot={false}
                name="Total Campaigns"
              />

              <Line
                type="linear"
                dataKey="totalApprovedCampaign"
                stroke="var(--color-totalApprovedCampaign)"
                strokeWidth={2}
                dot={false}
                name="Approved Campaigns"
              />

              <Line
                type="linear"
                dataKey="totalRejectedCampaign"
                stroke="var(--color-totalRejectedCampaign)"
                strokeWidth={2}
                dot={false}
                name="Rejected Campaigns"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
