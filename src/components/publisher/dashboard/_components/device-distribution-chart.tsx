import { Info } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface DeviceData {
  name: string
  value: number
  percentage: string
  fill: string
}

interface DeviceDistributionChartProps {
  isLoading: boolean
  data: DeviceData[]
  totalClicks: number
}

export function DeviceDistributionChart({
  isLoading,
  data,
  totalClicks,
}: DeviceDistributionChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium">
              Device Distribution
            </CardTitle>
            <Info className="size-4 text-muted-foreground/60" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-[400px]">
              <Skeleton className="h-[40px] w-full" />
            </div>
            <div className="relative w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height={300}>
                <Skeleton className="size-full" />
              </ResponsiveContainer>
            </div>
          </div>
        ) : data.every((item) => item.value === 0) ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
            <h3 className="text-lg font-semibold">No Device Data Available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No device information recorded for the selected period
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex w-full max-w-[400px] items-center justify-center gap-x-8">
              {data.map((entry, index) => (
                <div
                  key={`stat-${index}`}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-[3px] rounded-sm"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold">
                      {entry.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({entry.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-white p-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-2 rounded-full"
                              style={{ backgroundColor: data.fill }}
                            />
                            <span className="font-medium">{data.name}</span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {data.value.toLocaleString()} clicks (
                            {data.percentage}
                            %)
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={85}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke="white"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground"
                  >
                    <tspan x="50%" dy="-0.5em" className="text-2xl font-bold">
                      {totalClicks.toLocaleString()}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="1.6em"
                      className="text-xs text-muted-foreground"
                    >
                      Total client device
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
