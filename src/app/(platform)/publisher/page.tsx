import { Suspense } from "react"

import { PublisherDashboard } from "@/components/publisher/dashboard"
import { Spinner } from "@/components/spinner"

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <PublisherDashboard />
    </Suspense>
  )
}
