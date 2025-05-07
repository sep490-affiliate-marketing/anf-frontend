import { eachDayOfInterval, format } from "date-fns"
import { Info } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { formatVNDCurrency } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip"

interface BudgetSpentData {
  date: string
  budgetSpent: number
}

interface BudgetSpentChartProps {
  isLoading: boolean
  data: BudgetSpentData[]
  startDate: Date
  endDate: Date
}

export function BudgetSpentChart({
  isLoading,
  data,
  startDate,
  endDate,
}: BudgetSpentChartProps) {
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
      budgetSpent: existingData?.budgetSpent ?? 0,
    }
  })

  return (
    <Card className="col-span-4">
      <CardHeader className="mb-5 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium">
              Budget Spent Overview
            </CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="size-4 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent>Daily budget spent on campaigns</TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="justify-end">
        {isLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : !completeData || completeData.length === 0 ? (
          <div className="flex h-[320px] w-full flex-col items-center justify-center rounded-lg text-center">
            <h3 className="text-lg font-semibold">No Budget Data Available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No budget expenditure recorded for the selected period
            </p>
          </div>
        ) : (
          <ChartContainer
            className="h-[320px] w-full"
            config={{
              budgetSpent: {
                label: "Budget Spent",
                color: "#f59e0b",
              },
            }}
          >
            <LineChart
              accessibilityLayer
              data={completeData}
              margin={{ top: 20, right: 20, left: 40 }}
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
                tickFormatter={(value) => formatVNDCurrency(value)}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const value = payload[0]?.value
                  if (typeof value !== "number") return null
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <div className="font-medium">
                        {payload[0].payload.date}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-500" />
                        <span className="text-sm text-muted-foreground">
                          {formatVNDCurrency(value)}
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />

              <Line
                type="linear"
                dataKey="budgetSpent"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
