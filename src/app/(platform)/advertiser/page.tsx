import { Suspense } from "react"

import { AdvertiserDashboard } from "@/components/advertiser/dashboard"
import { Spinner } from "@/components/spinner"

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdvertiserDashboard />
    </Suspense>
  )
}
