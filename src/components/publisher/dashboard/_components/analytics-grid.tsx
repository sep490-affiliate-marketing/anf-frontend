import { ArrowUpRight, Check, Info, Shield } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { formatVNDCurrency } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsGridProps {
  isLoading: boolean
  totalClicks: number
  totalRevenue: number
  totalVerifiedClicks: number
  totalFraudClicks: number
}

const validationData = [
  { name: "Valid", value: 85, color: "#10b981" },
  { name: "Fraud", value: 15, color: "#ef4444" },
]

export function AnalyticsGrid({
  isLoading,
  totalClicks,
  totalRevenue,
  totalVerifiedClicks,
  totalFraudClicks,
}: AnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Total Clicks
            </CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              totalClicks.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Click performance
          </div>
          <p className="text-sm text-gray-500">Based on selected period</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Revenue
            </CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              formatVNDCurrency(totalRevenue)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Revenue growth
          </div>
          <p className="text-sm text-gray-500">Total revenue for period</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Verified Clicks
            </CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              totalVerifiedClicks.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            High verification rate
          </div>
          <p className="text-sm text-gray-500">Above industry average</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Valid vs. Fraud
            </CardDescription>
            <div className="size-[32px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        value: totalVerifiedClicks,
                        color: "#10b981",
                      },
                      { value: totalFraudClicks, color: "#ef4444" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={12}
                    outerRadius={16}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {validationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : totalVerifiedClicks === 0 && totalFraudClicks === 0 ? (
              "No Data"
            ) : (
              <>
                {(
                  (totalVerifiedClicks /
                    (totalVerifiedClicks + totalFraudClicks)) *
                  100
                ).toFixed(1)}
                % Valid
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Fraud prevention
          </div>
          <p className="text-sm text-gray-500">
            {totalFraudClicks === 0 && totalVerifiedClicks === 0
              ? "No clicks detected"
              : `${totalFraudClicks} fraudulent clicks detected`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
