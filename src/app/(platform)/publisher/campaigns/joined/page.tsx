"use client"

import Image from "next/image"

import { env } from "@/env"
import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"

import { useGetPublisherCampaigns } from "@/hooks/campaign"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CopyToClipboardTextarea } from "@/components/ui/textarea/copy-to-clipboard-textarea"
import { formatVNDCurrency } from '../../../../../lib/utils';
import { vi } from "date-fns/locale"

export default function JoinedCampaignsPage() {
  const { user } = useAuth()
  const publisherId = user?.id ?? 0
  const { data, isLoading } = useGetPublisherCampaigns(publisherId)

  // Extract campaigns from the response
  const campaigns = data?.isSuccess ? data.value : []

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-2xl font-bold">Joined Campaigns</h1>
        <p>No joined campaigns found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Joined Campaigns</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((offer) => {
          const trackingUrl =
            env.NEXT_PUBLIC_BACKEND_URL +
            "/api/tracking?offerId=" +
            offer.id +
            "&publisherCode=" +
            user?.userCode
          return (
            <Card key={offer.id} className="overflow-hidden">
              <CardHeader className="p-0">
                {offer.campaign.campImages[0] && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={offer.campaign.campImages[0]}
                      alt={offer.campaign.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2 text-lg">
                  {offer.campaign.name}
                </CardTitle>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {offer.campaign.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{offer.pricingModel}</Badge>
                    <Badge variant="outline">Bid: {formatVNDCurrency(offer.bid ?? 0)}</Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Start: {format(new Date(offer.startDate), "dd/mm/yyyy", { locale: vi, })}</p>
                    <p>End: {format(new Date(offer.endDate), "dd/mm/yyyy", { locale: vi, })}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      variant={
                        offer.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {offer.status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Show URL
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Campaign URL</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <CopyToClipboardTextarea
                            value={trackingUrl}
                            className="min-h-[100px]"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
