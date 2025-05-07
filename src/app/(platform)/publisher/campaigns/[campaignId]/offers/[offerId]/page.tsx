"use client"

import { useParams, useRouter } from "next/navigation"

import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import PostbackDataTable from "@/components/publisher/offers/postback-data-table"

export default function OfferPostbacksPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = Number(params.offerId)
  const campaignId = Number(params.campaignId)

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-gray-500"
            onClick={() => router.push(`/publisher/campaigns/${campaignId}`)}
          >
            <ChevronLeft className="size-3.5" />
            Back to Campaign
          </Button>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Postback History
        </h1>
        <p className="text-sm text-muted-foreground">
          View the postback history for this offer
        </p>
      </div>
      <PostbackDataTable offerId={offerId} />
    </div>
  )
}
