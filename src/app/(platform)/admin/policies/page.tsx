import PolicyDataTable from "@/components/admin/policy/data-table"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-border pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Manage Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage Policy and their associated data
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <PolicyDataTable />
        </section>
      </div>
    </Suspense>
  )
}
