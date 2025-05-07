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

interface AnalyticsGridProps {
  isLoading: boolean
  totalClicks: number
  totalValidClicks: number
  totalFraudClicks: number
  totalOffers: number
  totalJoinedPublishers: number
  totalRejectedPublishers: number
  budgetSpent: number
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
  totalValidClicks,
  totalFraudClicks,
  totalOffers,
  totalJoinedPublishers,
  totalRejectedPublishers,
  budgetSpent,
  startDate,
  endDate,
  children,
}: AnalyticsGridProps) {
  const validPercentage =
    totalValidClicks + totalFraudClicks > 0
      ? (
          (totalValidClicks / (totalValidClicks + totalFraudClicks)) *
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
                  <Button variant="ghost" size="icon" className="size-8">
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
              Budget Spent
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="sr-only">View budget details</span>
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
                  <p>Total budget spent across all campaigns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              formatVNDCurrency(budgetSpent)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Budget utilization
          </div>
          <p className="text-sm text-gray-500">Total spent for period</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Valid Clicks
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="sr-only">View valid clicks details</span>
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
              totalValidClicks.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            High validation rate
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
                        value: totalValidClicks,
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
            ) : totalValidClicks === 0 && totalFraudClicks === 0 ? (
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
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500">
                  {totalValidClicks.toLocaleString()} valid
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-red-500" />
                <span className="text-xs text-gray-500">
                  {totalFraudClicks.toLocaleString()} fraud
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Second row */}
      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Total Publishers
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="sr-only">View publishers details</span>
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
                  <p>Total number of publishers joined</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              totalJoinedPublishers.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Publisher participation
          </div>
          <p className="text-sm text-gray-500">Active publishers</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Rejected Publishers
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="sr-only">
                      View rejected publishers details
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
                  <p>Number of publishers rejected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              totalRejectedPublishers.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Quality control
          </div>
          <p className="text-sm text-gray-500">Rejected publishers</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="relative space-y-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-medium text-gray-500">
              Total Offers
            </CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <span className="sr-only">View offers details</span>
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
                  <p>Total number of offers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              totalOffers.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Campaign offers
          </div>
          <p className="text-sm text-gray-500">Active offers</p>
        </CardContent>
      </Card>
    </div>
  )
}
