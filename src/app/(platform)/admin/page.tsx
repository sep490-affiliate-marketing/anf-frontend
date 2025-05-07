import React, { Suspense } from "react"

import AdminDashboard from "@/components/admin/dashboard"
import { Spinner } from "@/components/spinner"

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminDashboard />
    </Suspense>
  )
}
