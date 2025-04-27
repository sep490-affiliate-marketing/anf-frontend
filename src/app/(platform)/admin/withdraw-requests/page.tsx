import { Suspense } from "react"

import AdminWithdrawRequestsTable from "@/components/admin/withdraw-requests/withdraw-requests-table"
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
        </div>
      </div>

      {/* Withdraw Requests Table */}
      <section className="space-y-4">
        <Suspense fallback={<Spinner />}>
          <AdminWithdrawRequestsTable />
        </Suspense>
      </section>
    </div>
  )
}
