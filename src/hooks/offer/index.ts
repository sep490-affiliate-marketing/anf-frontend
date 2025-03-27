import { offerQueryKeys } from "@/constant/react-query"
import { useQuery } from "@tanstack/react-query"

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
