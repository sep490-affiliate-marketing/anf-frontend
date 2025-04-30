import { Suspense } from "react"

import { Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import WithdrawRequestsTable from "@/components/admin/withdraw-requests/data-table"
import { Spinner } from "@/components/spinner"

export default function WithdrawRequestsPage() {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Withdrawal Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Review and process withdrawal requests from users
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl">147</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-2xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              6 requests require urgent attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved Requests</CardDescription>
            <CardTitle className="text-2xl">112</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Processed within 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected Requests</CardDescription>
            <CardTitle className="text-2xl">11</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">2.5% rejection rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Requests Table */}
      <section>
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <Suspense fallback={<Spinner />}>
              <WithdrawRequestsTable />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
