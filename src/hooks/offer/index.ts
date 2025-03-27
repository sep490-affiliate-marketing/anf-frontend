import { offerQueryKeys } from "@/constant/react-query"
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
        return undefined
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
        return undefined
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
        return undefined
      }
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Offer joined successfully")
        queryClient.invalidateQueries({
          queryKey: ["campaignDetailForPublisher", campaignId],
        })
      } else {
        toast.error(data.message || "Failed to join offer")
      }
    },
  })
}
