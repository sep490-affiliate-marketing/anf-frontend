import { errorMessage } from "@/constant/error-message"
import { statisticQueryKeys } from "@/constant/react-query"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

import {
  IAdvertiserOfferStatistics,
  IGenerateStatisticsErrorResponse,
  IGenerateStatisticsResponse,
  IGetAdvertiserOfferStatisticsErrorResponse,
  IGetAdvertiserOfferStatisticsResponse,
  IGetPublisherOfferStatisticsErrorResponse,
  IGetPublisherOfferStatisticsResponse,
} from "@/types/statistics.type"

import apiClient from "@/lib/api/client"

// Hook to get advertiser offer statistics by offer ID
export const useGetAdvertiserOfferStatistics = (offerId: string) => {
  return useQuery({
    queryKey: statisticQueryKeys.advertiser.offerById(offerId),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetAdvertiserOfferStatisticsResponse>(
            `/api/statistic/advertiser/offer/${offerId}`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response
                ?.data as IGetAdvertiserOfferStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message:
            errRes?.message ?? "Failed to fetch advertiser offer statistics",
          data: null,
        }
      }
    },
    enabled: !!offerId,
  })
}

// Hook to generate advertiser offer statistics by offer ID
export const useGenerateAdvertiserOfferStatistics = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (offerId: string) => {
      try {
        const { data } = await apiClient.post<IGenerateStatisticsResponse>(
          `/api/statistic/advertiser/offer/${offerId}`
        )
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IGenerateStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message: errRes?.message ?? errorMessage.unknown,
          statusCode: errRes?.statusCode ?? 500,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: (data, offerId) => {
      if (data.isSuccess) {
        toast.success("Advertiser offer statistics generated successfully")
        queryClient.invalidateQueries({
          queryKey: statisticQueryKeys.advertiser.offerById(offerId),
        })
      } else {
        toast.error(data.message || "Failed to generate statistics")
      }
    },
  })
}

// Hook to get advertiser offer statistics by advertiser code
export const useGetAdvertiserOfferStatisticsByCode = (
  advertiserCode: string
) => {
  return useQuery({
    queryKey: statisticQueryKeys.advertiser.offerByCode(advertiserCode),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetAdvertiserOfferStatisticsResponse>(
            `/api/statistic/advertiser/${advertiserCode}/offer`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response
                ?.data as IGetAdvertiserOfferStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message:
            errRes?.message ?? "Failed to fetch advertiser offer statistics",
          data: null,
        }
      }
    },
    enabled: !!advertiserCode,
  })
}

// Hook to generate advertiser offer statistics by advertiser code
export const useGenerateAdvertiserOfferStatisticsByCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (advertiserCode: string) => {
      try {
        const { data } = await apiClient.post<IGenerateStatisticsResponse>(
          `/api/statistic/advertiser/${advertiserCode}/offer`
        )
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IGenerateStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message: errRes?.message ?? errorMessage.unknown,
          statusCode: errRes?.statusCode ?? 500,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: (data, advertiserCode) => {
      if (data.isSuccess) {
        toast.success("Advertiser offer statistics generated successfully")
        queryClient.invalidateQueries({
          queryKey: statisticQueryKeys.advertiser.offerByCode(advertiserCode),
        })
      } else {
        toast.error(data.message || "Failed to generate statistics")
      }
    },
  })
}

// Hook to get publisher offer statistics by offer ID
export const useGetPublisherOfferStatistics = (
  publisherCode: string,
  offerId: string
) => {
  return useQuery({
    queryKey: statisticQueryKeys.publisher.offerById(publisherCode, offerId),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetPublisherOfferStatisticsResponse>(
            `/api/statistic/publisher/${publisherCode}/offer/${offerId}`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response
                ?.data as IGetPublisherOfferStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message:
            errRes?.message ?? "Failed to fetch publisher offer statistics",
          data: null,
        }
      }
    },
    enabled: !!(publisherCode && offerId),
  })
}

// Hook to generate publisher offer statistics by offer ID
export const useGeneratePublisherOfferStatistics = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      publisherCode,
      offerId,
    }: {
      publisherCode: string
      offerId: string
    }) => {
      try {
        const { data } = await apiClient.post<IGenerateStatisticsResponse>(
          `/api/statistic/publisher/${publisherCode}/offer/${offerId}`
        )
        return { data, publisherCode, offerId }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IGenerateStatisticsErrorResponse)
            : null

        return {
          data: {
            isSuccess: false,
            message: errRes?.message ?? errorMessage.unknown,
            statusCode: errRes?.statusCode ?? 500,
            details: errRes?.details ?? errorMessage.unknown,
          },
          publisherCode,
          offerId,
        }
      }
    },
    onSuccess: ({ data, publisherCode, offerId }) => {
      if (data.isSuccess) {
        toast.success("Publisher offer statistics generated successfully")
        queryClient.invalidateQueries({
          queryKey: statisticQueryKeys.publisher.offerById(
            publisherCode,
            offerId
          ),
        })
      } else {
        toast.error(data.message || "Failed to generate statistics")
      }
    },
  })
}

// Hook to get publisher offer statistics by publisher code
export const useGetPublisherOfferStatisticsByCode = (publisherCode: string) => {
  return useQuery({
    queryKey: statisticQueryKeys.publisher.offerByCode(publisherCode),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetPublisherOfferStatisticsResponse>(
            `/api/statistic/publisher/${publisherCode}/offer`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response
                ?.data as IGetPublisherOfferStatisticsErrorResponse)
            : null

        return {
          isSuccess: false,
          message:
            errRes?.message ?? "Failed to fetch publisher offer statistics",
          data: null,
        }
      }
    },
    enabled: !!publisherCode,
  })
}

// Hook to generate publisher offer statistics by publisher code
export const useGeneratePublisherOfferStatisticsByCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (publisherCode: string) => {
      try {
        const { data } = await apiClient.post<IGenerateStatisticsResponse>(
          `/api/statistic/publisher/${publisherCode}/offer`
        )
        return { data, publisherCode }
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IGenerateStatisticsErrorResponse)
            : null

        return {
          data: {
            isSuccess: false,
            message: errRes?.message ?? errorMessage.unknown,
            statusCode: errRes?.statusCode ?? 500,
            details: errRes?.details ?? errorMessage.unknown,
          },
          publisherCode,
        }
      }
    },
    onSuccess: ({ data, publisherCode }) => {
      if (data.isSuccess) {
        toast.success("Publisher offer statistics generated successfully")
        queryClient.invalidateQueries({
          queryKey: statisticQueryKeys.publisher.offerByCode(publisherCode),
        })
      } else {
        toast.error(data.message || "Failed to generate statistics")
      }
    },
  })
}
