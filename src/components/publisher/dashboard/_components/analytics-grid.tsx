import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { formatVNDCurrency } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { FraudClicksDialog } from "./fraud-clicks-dialog"

interface AnalyticsGridProps {
  isLoading: boolean
  totalClicks: number
  totalRevenue: number
  totalVerifiedClicks: number
  totalFraudClicks: number
  startDate: Date
  endDate: Date
  children?: React.ReactNode
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
  startDate,
  endDate,
  children,
}: AnalyticsGridProps) {
  const validPercentage =
    totalVerifiedClicks + totalFraudClicks > 0
      ? (
          (totalVerifiedClicks / (totalVerifiedClicks + totalFraudClicks)) *
          100
        ).toFixed(1)
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Total Clicks
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">View click details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total number of clicks across all campaigns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">View revenue details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total revenue generated from all campaigns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">
                      View verified clicks details
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of clicks verified as legitimate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              <div className="flex items-center gap-2">
                <span>{validPercentage}%</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Valid
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                Fraud prevention
              </div>
              {totalFraudClicks > 0 ? (
                <FraudClicksDialog from={startDate} to={endDate}>
                  <div className="group cursor-pointer">
                    <p className="text-sm font-medium text-red-600 group-hover:text-red-700">
                      {totalFraudClicks.toLocaleString()} fraudulent clicks
                    </p>
                    <p className="text-xs text-muted-foreground group-hover:text-gray-600">
                      Click to view details
                    </p>
                  </div>
                </FraudClicksDialog>
              ) : (
                <p className="text-sm text-gray-500">
                  {totalVerifiedClicks === 0
                    ? "No clicks detected"
                    : "No fraud detected"}
                </p>
              )}
            </div>
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

