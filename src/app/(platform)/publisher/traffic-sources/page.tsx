"use client"

import { Suspense } from "react"

import TrafficSourceDataTable from "@/components/traffic-sources/data-table"
import CreateTrafficSourceModal from "@/components/traffic-sources/modals/create-traffic-source-modal"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-border pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Traffic Sources
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your traffic sources and promotional channels
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <CreateTrafficSourceModal />
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <TrafficSourceDataTable />
      </div>
    </Suspense>
  )
}
