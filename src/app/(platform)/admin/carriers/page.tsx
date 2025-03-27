import React from "react"
import { Suspense } from "react"

import CarrierDataTable from "@/components/carriers/data-table"
import CreateCarrierModal from "@/components/carriers/modals/create-carrier-modal"
import SelectCountryModal from "@/components/carriers/modals/select-country-modal"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-border pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Manage Carriers
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your carriers and their associated data
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <CreateCarrierModal />
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <CarrierDataTable />

        {/* Country Selection Modal */}
        <SelectCountryModal />
      </div>
    </Suspense>
  )
}
