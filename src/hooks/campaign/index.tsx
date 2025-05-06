import { useRouter } from "next/navigation"

import { errorMessage } from "@/constant/error-message"
import { campaignQueryKeys } from "@/constant/react-query"
import { useAuth } from "@/providers/auth-provider"
import {
  CreateCampaignFormSchema,
  ICreateCampaignForm,
  IUpdateCampaignForm,
  UpdateCampaignFormSchema,
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
  IGetCampaignsByAdvertiserResponse,
  IGetPublisherCampaignsErrorResponse,
  IGetPublisherCampaignsResponse,
  IUpdateCampaignErrorResponse,
} from "@/types/campaign.type"

import apiClient from "@/lib/api/client"

export const useGetCampaignById = (campaignId: string) => {
  return useQuery({
    queryKey: campaignQueryKeys.global.details(campaignId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetCampaignByCampIdResponse>(
          `/api/affiliate-network/campaigns/${campaignId}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching campaign",
          data: null,
        }
      }
    },
    enabled: !!campaignId,
  })
}

export const useCreateCampaignForm = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()

  const form = useForm<ICreateCampaignForm>({
    mode: "onChange",
    resolver: zodResolver(CreateCampaignFormSchema()),
    defaultValues: {
      name: "",
      description: "",
      baseUrl: "",
      tracking_param: [],
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
          commissionRate: "",
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
        const { data } = await apiClient.post<ICreateCampaignSuccessResponse>(
          "/api/affiliate-network/campaigns",
          formData
        )
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
          queryKey: campaignQueryKeys.advertiser.list(
            user?.userCode ?? "",
            1,
            10
          ),
        })
        form.reset()
        router.push("/advertiser/campaigns")
      } else {
        toast.error(resData.message, {
          description: resData.details,
        })
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

      // Format dates to YYYY-MM-DD for proper MySQL compatibility
      const formatDateToYYYYMMDD = (dateStr: string): string => {
        const date = new Date(dateStr)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      }

      // Create a deep copy of the data with properly formatted dates
      const processedData = {
        ...data,
        startDate: formatDateToYYYYMMDD(data.startDate),
        endDate: formatDateToYYYYMMDD(data.endDate),
        offers: data.offers.map((offer) => ({
          ...offer,
          startDate: offer.startDate
            ? formatDateToYYYYMMDD(offer.startDate)
            : formatDateToYYYYMMDD(data.startDate),
          endDate: offer.endDate
            ? formatDateToYYYYMMDD(offer.endDate)
            : formatDateToYYYYMMDD(data.endDate),
        })),
      }

      // Append all other fields except "images" and "offers"
      Object.entries(processedData).forEach(([key, value]) => {
        if (key !== "offers" && key !== "images") {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value))
          }
        }
      })

      // Append offers if present
      if (Array.isArray(processedData.offers)) {
        processedData.offers.forEach((offer, index) => {
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
  advertiserCode: string,
  page?: number,
  pageSize?: number
) => {
  return useQuery({
    queryKey: campaignQueryKeys.advertiser.list(
      advertiserCode,
      page ?? 1,
      pageSize ?? 10
    ),
    queryFn: async () => {
      const queryString = qs.stringify({
        pageNumber: page ?? 1,
        pageSize: pageSize ?? 10,
      })
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
            pageNumber: page ?? 1,
            pageSize: pageSize ?? 10,
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
    queryKey: campaignQueryKeys.global.listActive(page, pageSize),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetAllCampaignsResponse>(
          `/api/affiliate-network/campaigns?pageNumber=${page}&pageSize=${pageSize}`
        )
        return data
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching campaigns",
          value: {
            pageNumber: page,
            pageSize: pageSize,
            totalPages: 0,
            totalRecords: 0,
            data: [],
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
      }
    },
  })
}

export const useGetPublisherCampaigns = (publisherId: number) => {
  return useQuery({
    queryKey: campaignQueryKeys.publisher.listOwnedByPublisher(
      publisherId,
      1,
      10
    ),
    queryFn: async (): Promise<
      IGetPublisherCampaignsResponse | IGetPublisherCampaignsErrorResponse
    > => {
      try {
        const { data } = await apiClient.get<IGetPublisherCampaignsResponse>(
          "/api/affiliate-network/offers/publishers"
        )
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IGetPublisherCampaignsErrorResponse)
            : null
        return {
          isSuccess: false,
          statusCode: errRes?.statusCode ?? 500,
          message: errRes?.message ?? errorMessage.unknown,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    enabled: !!publisherId,
  })
}

export const useGetCampaignDetailForPublisher = (campaignId: number) => {
  return useQuery({
    queryKey: campaignQueryKeys.publisher.details(campaignId),
    queryFn: async () => {
      try {
        const { data } =
          await apiClient.get<IGetCampaignDetailForPublisherResponse>(
            `/api/affiliate-network/campaigns/${campaignId}/publishers`
          )
        return data
      } catch (error) {
        return null
      }
    },
    enabled: !!campaignId,
  })
}

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectReason,
    }: {
      id: number
      status: string
      rejectReason?: string
    }) => {
      try {
        const { data } = await apiClient.patch(
          `/api/affiliate-network/campaigns/admin/${id}/status`,
          {
            status,
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
          queryKey: campaignQueryKeys.global.details(id.toString()),
        })
        queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.admin.list(1, 10),
        })
        queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.admin.details(id.toString()),
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

export const useGetAdminCampaigns = (
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: campaignQueryKeys.admin.list(pageNumber, pageSize),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetAllCampaignsResponse>(
          `/api/affiliate-network/campaigns/offers?pageNumber=${pageNumber}&pageSize=${pageSize}`
        )
        return data
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching campaigns",
          value: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: 0,
            totalRecords: 0,
            data: [],
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
      }
    },
  })
}

export const useUpdateCampaignForm = (id: number) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()

  const form = useForm<IUpdateCampaignForm>({
    mode: "onChange",
    resolver: zodResolver(UpdateCampaignFormSchema()),
    defaultValues: {
      name: "",
      description: "",
      productUrl: "",
      trackingParams: "",
      images: [],
    },
  })

  const { mutateAsync: updateCampaignMutation, isPending } = useMutation({
    mutationKey: campaignQueryKeys.advertiser.update(id.toString()),
    mutationFn: async (
      formData: FormData
    ): Promise<
      ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse
    > => {
      try {
        const { data } = await apiClient.put<ICreateCampaignSuccessResponse>(
          `/api/affiliate-network/campaigns/${id}`,
          formData
        )
        return data
      } catch (error) {
        console.error(error)
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
        toast.success("Campaign update successfully")
        queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.advertiser.list(
            user?.userCode ?? "",
            1,
            10
          ),
        })
        form.reset()

        router.push(`/advertiser/campaigns/${id}`)
      } else {
        toast.error(resData.message, {
          description: resData.details,
        })
      }
    },
  })

  const onUpdateCampaign = async (data: IUpdateCampaignForm) => {
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

      // Format dates to YYYY-MM-DD for proper MySQL compatibility
      const formatDateToYYYYMMDD = (dateStr: string): string => {
        const date = new Date(dateStr)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      }

      formData.append("name", data.name || "")
      formData.append("description", data.description || "")
      formData.append("productUrl", data.productUrl || "")
      formData.append("trackingParams", data.trackingParams || "")
      formData.append("categoryId", String(data.categoryId || "1"))
      formData.append(
        "startDate",
        formatDateToYYYYMMDD(data.startDate) || formatDateToYYYYMMDD(Date())
      )
      formData.append(
        "endDate",
        formatDateToYYYYMMDD(data.endDate) || formatDateToYYYYMMDD(Date())
      )
      // Execute mutation to create the campaign
      await updateCampaignMutation(formData)
    } catch {}
  }

  return {
    form,
    isPending,
    onUpdateCampaign,
    errorMessage,
  }
}
