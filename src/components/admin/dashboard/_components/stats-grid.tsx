"use client"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetAdminAllTotalStatistics } from "@/hooks/statistics"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsGridProps {
  isLoading: boolean
  withdrawRequests: Array<{
    amount: number
  }>
}

export function StatsGrid({ isLoading, withdrawRequests }: StatsGridProps) {
  const { data: adminStats, isLoading: isStatsLoading } =
    useGetAdminAllTotalStatistics()

  // Calculate statistics
  const userStats = {
    totalUsers: adminStats?.data?.totalUser || 0,
    activeUsers: adminStats?.data?.totalUser || 0,
    inactiveUsers: 0,
    activePercentage: "100.0",
  }

  const campaignStats = {
    totalCampaigns: adminStats?.data?.totalCampaign || 0,
    approvedCampaigns: adminStats?.data?.totalApprovedCampaign || 0,
    rejectedCampaigns: adminStats?.data?.totalRejectedCampaign || 0,
    approvalRate: adminStats?.data?.totalCampaign
      ? (
          (adminStats.data.totalApprovedCampaign /
            adminStats.data.totalCampaign) *
          100
        ).toFixed(1)
      : "0.0",
  }

  const isLoadingAny = isLoading || isStatsLoading

  return (
    <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Users Card */}
      <Card className="@container/card min-w-[240px]" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isLoadingAny ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              userStats.totalUsers.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total users registered in network
          </div>
          <div className="text-muted-foreground">
            {userStats.activeUsers} active out of {userStats.totalUsers} total
            users
          </div>
        </CardFooter>
      </Card>

      {/* Total Campaigns Card */}
      <Card className="@container/card min-w-[240px]" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Total Campaigns</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isLoadingAny ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              campaignStats.totalCampaigns.toLocaleString()
            )}
          </CardTitle>
          <div className="absolute right-4 top-4"></div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total campaigns in network
          </div>
          <div className="text-muted-foreground">
            {campaignStats.approvedCampaigns} approved,{" "}
            {campaignStats.rejectedCampaigns} rejected
          </div>
        </CardFooter>
      </Card>

      {/* Pending Withdrawals Card */}
      <Card className="@container/card min-w-[240px]" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Pending Withdrawals</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isLoadingAny ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              withdrawRequests.length.toLocaleString()
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Requests awaiting approval{" "}
          </div>
          <div className="text-muted-foreground">
            Total requests in processing queue
          </div>
        </CardFooter>
      </Card>

      {/* Total Withdrawal Amount Card */}
      <Card className="@container/card min-w-[240px]" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Total Withdrawal Amount</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {isLoadingAny ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatVNDCurrency(
                withdrawRequests.reduce((sum, req) => sum + req.amount, 0)
              )
            )}
          </CardTitle>
          <div className="absolute right-4 top-4"></div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total pending withdrawal value
          </div>
          <div className="text-muted-foreground">
            Combined value of all pending requests
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
