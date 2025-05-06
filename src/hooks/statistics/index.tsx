import { errorMessage } from "@/constant/error-message"
import {
  adminStatisticsQueryKeys,
  statisticQueryKeys,
} from "@/constant/react-query"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import qs from "qs"
import { toast } from "sonner"

import {
  IGenerateStatisticsErrorResponse,
  IGenerateStatisticsResponse,
  IGetAdminCampaignStatisticsResponse,
  IGetAdminTicketStatisticsResponse,
  IGetAdminUserStatisticsResponse,
  IGetAdvertiserOfferStatisticsErrorResponse,
  IGetAdvertiserOfferStatisticsResponse,
  IGetPublisherOfferStatisticsErrorResponse,
  IGetPublisherOfferStatisticsResponse,
  IGetPublisherRevenueStatisticsResponse,
} from "@/types/statistics.type"

import apiClient from "@/lib/api/client"
import { extractApiError } from "@/lib/api/error-handler"

// Hook to get advertiser offer statistics by offer ID
export const useGetAdvertiserOfferStatistics = (offerId: string) => {
  return useQuery({
    queryKey: statisticQueryKeys.advertiser.offerById(offerId),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetAdvertiserOfferStatisticsResponse>(
            `/statistic/advertiser/offer/${offerId}`
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
          `/statistic/advertiser/offer/${offerId}`
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
            `/statistic/advertiser/${advertiserCode}/offer`
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
          `/statistic/advertiser/${advertiserCode}/offer`
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
            `/statistic/publisher/${publisherCode}/offer/${offerId}`
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
          `/statistic/publisher/${publisherCode}/offer/${offerId}`
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
            `/statistic/publisher/${publisherCode}/offer`
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
          `/statistic/publisher/${publisherCode}/offer`
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

// Hook to get publisher revenue statistics (all campaigns)
export const useGetPublisherRevenueStatistics = (from: string, to: string) => {
  return useQuery({
    queryKey: statisticQueryKeys.publisher.revenue(from, to),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          from: from ?? "",
          to: to ?? "",
        })
        const { data } =
          await apiClient.get<IGetPublisherRevenueStatisticsResponse>(
            `/api/affiliate-network/publisher/stats/revenue?${queryString}`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ?? "Failed to fetch publisher revenue statistics"
        )
      }
    },
    enabled: !!from && !!to,
  })
}

// Hook to get publisher campaign's revenue statistics by campaign id
export const useGetPublisherCampaignRevenueStatisticsById = (
  id: number,
  from: string,
  to: string
) => {
  return useQuery({
    queryKey: statisticQueryKeys.publisher.campaignRevenueById(id, from, to),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          from: from ?? "",
          to: to ?? "",
        })
        const { data } = await apiClient.get<IPaginationResponse<any>>(
          `/api/affiliate-network/publisher-stats/campaign/${id}/revenue?${queryString}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ??
            "Failed to fetch publisher campaign revenue statistics"
        )
      }
    },
    enabled: !!id && !!from && !!to,
  })
}

// Hook to get admin user statistics
export const useGetAdminUserStatistics = (from: string, to: string) => {
  return useQuery({
    queryKey: adminStatisticsQueryKeys.users(from, to),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          from: from ?? "",
          to: to ?? "",
        })
        const { data } = await apiClient.get<IGetAdminUserStatisticsResponse>(
          `/api/affiliate-network/stats/users?${queryString}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ?? "Failed to fetch admin user statistics"
        )
      }
    },
    enabled: !!from && !!to,
  })
}

// Hook to get admin campaign statistics
export const useGetAdminCampaignStatistics = (from: string, to: string) => {
  return useQuery({
    queryKey: adminStatisticsQueryKeys.campaigns(from, to),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          from: from ?? "",
          to: to ?? "",
        })
        const { data } =
          await apiClient.get<IGetAdminCampaignStatisticsResponse>(
            `/api/affiliate-network/stats/campaigns?${queryString}`
          )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ?? "Failed to fetch admin campaign statistics"
        )
      }
    },
    enabled: !!from && !!to,
  })
}

// Hook to get admin complaint ticket statistics
export const useGetAdminComplaintTicketStatistics = (
  from: string,
  to: string
) => {
  return useQuery({
    queryKey: adminStatisticsQueryKeys.complaintTickets(from, to),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          fromDate: from ?? "",
          toDate: to ?? "",
        })
        const { data } = await apiClient.get<IGetAdminTicketStatisticsResponse>(
          `/api/affiliate-network/stats/complaint-tickets?${queryString}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ?? "Failed to fetch admin complaint ticket statistics"
        )
      }
    },
    enabled: !!from && !!to,
  })
}
