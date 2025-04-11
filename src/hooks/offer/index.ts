import { campaignQueryKeys, offerQueryKeys } from "@/constant/react-query"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { IGetPublisherInOfferResponse } from "@/types/campaign.type"
import { IOffer } from "@/types/offer.type"

import apiClient from "@/lib/api/client"

export const useGetPublisherInOffer = (offerId: number) => {
  return useQuery({
    queryKey: offerQueryKeys.global.publisherInOffer(offerId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<
          IBackendRes<IGetPublisherInOfferResponse[]>
        >(`/api/affiliate-network/offers/${offerId}/publishers`)
        return data.value
      } catch (error) {
        return null
      }
    },
  })
}

export const useGetOfferDetails = (offerId: number) => {
  return useQuery({
    queryKey: offerQueryKeys.global.details(offerId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IBackendRes<IOffer>>(
          `/api/affiliate-network/offers/${offerId}`
        )
        return data.value
      } catch (error) {
        return null
      }
    },
  })
}

export const useJoinOffer = (campaignId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (offerId: number) => {
      try {
        const { data } = await apiClient.post(
          `/api/affiliate-network/offers/publisher?offerId=${offerId}`
        )
        return data
      } catch (error) {
        return null
      }
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Offer joined successfully")
        queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.publisher.details(campaignId),
        })
      } else {
        toast.error(data.message || "Failed to join offer")
      }
    },
  })
}

export const useApprovePublisherInOffer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      poId,
      status,
      rejectReason,
    }: {
      poId: number
      status: number
      rejectReason: string
    }) => {
      try {
        const { data } = await apiClient.patch(
          `/api/affiliate-network/offers/pubOffers/${poId}/status?status=${status}&rejectReason=${rejectReason}`
        )
        return data
      } catch (error) {
        return null
      }
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Publisher approved successfully")
        queryClient.invalidateQueries({
          queryKey: ["publisherInOffer"],
        })
      } else {
        toast.error(data.message || "Failed to approve publisher")
      }
    },
  })
}
