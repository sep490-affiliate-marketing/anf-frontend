import { errorMessage } from "@/constant/error-message"
import { campaignQueryKeys } from "@/constant/react-query"
import {
  CreateCampaignFormSchema,
  ICreateCampaignForm,
} from "@/validations/campaign.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import qs from "qs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  ICreateCampaignErrorResponse,
  ICreateCampaignSuccessResponse,
  IGetAllCampaignsResponse,
  IGetCampaignByCampIdResponse,
  IGetCampaignDetailForPublisherResponse,
  IGetCampaignsByAdvertiserParams,
  IGetCampaignsByAdvertiserResponse,
  IGetPublisherCampaignsResponse,
  IUpdateCampaignErrorResponse,
} from "@/types/campaign.type"

import apiClient from "@/lib/api/client"

export const useGetCampaignById = (campaignId: string) => {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetCampaignByCampIdResponse>(
          `/api/affiliate-network/campaigns/${campaignId}`
        )
        return {
          success: true,
          message: data.message,
          data: data.value,
        }
      } catch (error) {
        return {
          success: false,
          message: "Something went wrong while fetching campaign",
          type: null,
          data: null,
        }
      }
    },
    enabled: !!campaignId,
  })
}

export const useCreateCampaignForm = () => {
  const queryClient = useQueryClient()

  const form = useForm<ICreateCampaignForm>({
    mode: "onChange",
    resolver: zodResolver(CreateCampaignFormSchema()),
    defaultValues: {
      url: "",
      images: [],
      offers: [
        {
          pricingModel: "",
          description: "",
          bid: "",
          stepInfo: "",
          startDate: "",
          endDate: "",
          budget: "",
        },
      ],
    },
  })

  const { mutateAsync: createCampaignMutation, isPending } = useMutation({
    mutationKey: campaignQueryKeys.advertiser.create(),
    mutationFn: async (
      formData: FormData
    ): Promise<
      ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse
    > => {
      try {
        const { data } = await apiClient.post<
          ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse
        >("/api/affiliate-network/campaigns", formData)
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as ICreateCampaignErrorResponse)
            : null

        return {
          isSuccess: false,
          statusCode: errRes?.statusCode ?? 500,
          message: errRes?.message ?? errorMessage.unknown,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: async (resData) => {
      if (resData.isSuccess === true) {
        toast.success("Campaign created successfully")
        queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.advertiser.list,
        })
      } else {
        toast.error(resData.message)
      }
    },
  })

  const onCreateCampaign = async (data: ICreateCampaignForm) => {
    try {
      // Initialize FormData instance
      const formData = new FormData()

      // Handle image files first - they should be appended with name "imgFiles"
      if (Array.isArray(data.images)) {
        data.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("imgFiles", image)
          }
        })
      }

      // Append all other fields except "images" and "offers"
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "offers" && key !== "images") {
          if (value instanceof Date) {
            formData.append(key, value.toISOString())
          } else if (value !== null && value !== undefined) {
            formData.append(key, String(value))
          }
        }
      })

      // Append offers if present
      if (Array.isArray(data.offers)) {
        data.offers.forEach((offer, index) => {
          Object.entries(offer).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(`offers[${index}][${key}]`, String(value))
            }
          })
        })
      }

      // Execute mutation to create the campaign
      await createCampaignMutation(formData)
    } catch {}
  }

  return {
    form,
    isPending,
    onCreateCampaign,
    errorMessage,
  }
}

export const useGetCampaignsByAdvertiser = (
  params: IGetCampaignsByAdvertiserParams,
  advertiserCode: string
) => {
  return useQuery({
    queryKey: ["campaignsByAdvertiser", params, advertiserCode],
    queryFn: async () => {
      const queryString = qs.stringify(params)
      try {
        const { data } = await apiClient.get<IGetCampaignsByAdvertiserResponse>(
          `/api/affiliate-network/campaigns/advertisers/${advertiserCode}/offers?${queryString}`
        )
        return data
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching campaigns",
          value: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
            totalPages: 0,
            totalRecords: 0,
            data: [],
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
      }
    },
    enabled: !!advertiserCode,
  })
}

export const useGetActiveCampaigns = (
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["activeCampaigns", page, pageSize],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetAllCampaignsResponse>(
          `/api/affiliate-network/campaigns?pageNumber=${page}&pageSize=${pageSize}`
        )
        return data
      } catch (error) {
        return undefined
      }
    },
  })
}

export const useGetPublisherCampaigns = (publisherId: number) => {
  return useQuery({
    queryKey: campaignQueryKeys.publisher.list(publisherId, 1, 10),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetPublisherCampaignsResponse>(
          "/api/affiliate-network/offers/publishers"
        )
        return data.value
      } catch (error) {
        return undefined
      }
    },
  })
}

export const useGetCampaignDetailForPublisher = (campaignId: number) => {
  return useQuery({
    queryKey: ["campaignDetailForPublisher", campaignId],
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetCampaignDetailForPublisherResponse>(
            `/api/affiliate-network/campaigns/${campaignId}/publishers`
          )
        return data
      } catch (error) {
        return undefined
      }
    },
  })
}

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      campaignStatus,
      rejectReason,
    }: {
      id: number
      campaignStatus: string
      rejectReason?: string
    }) => {
      try {
        const { data } = await apiClient.patch(
          `/api/affiliate-network/campaigns/admin/${id}/status`,
          {
            campaignStatus,
            rejectReason,
          }
        )
        return data
      } catch (error) {
        const errorRes =
          error instanceof AxiosError
            ? (error.response?.data as IUpdateCampaignErrorResponse)
            : null
        return {
          isSuccess: false,
          message:
            errorRes?.message ??
            "Something went wrong while updating campaign status",
        }
      }
    },
    onSuccess: (data, { id }) => {
      if (data.isSuccess) {
        toast.success("Campaign status updated successfully")
        // Invalidate relevant queries to refetch data
        queryClient.invalidateQueries({
          queryKey: ["campaignsByAdvertiser"],
        })
        queryClient.invalidateQueries({
          queryKey: ["campaign", `${id}`],
        })
      } else {
        toast.error(data.message || "Failed to update campaign status")
      }
    },
    onError: () => {
      toast.error("An error occurred while updating campaign status")
    },
  })
}

export const useGetAdminCampaigns = () => {
  return useQuery({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetAllCampaignsResponse>(
          "/api/affiliate-network/campaigns/offers"
        )
        return data
      } catch (error) {
        return undefined
      }
    },
  })
}
