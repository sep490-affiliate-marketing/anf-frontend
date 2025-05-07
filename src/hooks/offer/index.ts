import { useRouter } from "next/navigation"

import { errorMessage } from "@/constant/error-message"
import { campaignQueryKeys, offerQueryKeys } from "@/constant/react-query"
import { IOfferForm, OfferFormSchema } from "@/validations/offer.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { IGetPublisherInOfferResponse } from "@/types/campaign.type"
import {
  IGetOfferResponse,
  IOffer,
  IUpdateOfferErrorResponse,
  IUpdateOfferSuccessResponse,
} from "@/types/offer.type"

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

export const useGetOfferById = (offerId: string) => {
  return useQuery({
    queryKey: offerQueryKeys.advertiser.update(offerId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IBackendRes<IGetOfferResponse>>(
          `/api/affiliate-network/offers/${offerId}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching offer details",
          data: null,
        }
      }
    },
    enabled: !!offerId,
  })
}

export const useUpdateOfferForm = (id: number, campaignId: number) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<IOfferForm>({
    mode: "onChange",
    resolver: zodResolver(OfferFormSchema()),
    defaultValues: {
      pricingModel: "",
      description: "",
      bid: "",
      startDate: "",
      endDate: "",
      budget: "",
      orderReturnTime: "",
      commissionRate: "",
      stepInfo: "",
    },
  })

  const { mutateAsync: updateOfferMutation, isPending } = useMutation({
    mutationKey: offerQueryKeys.advertiser.update(id.toString()),
    mutationFn: async (
      formData: FormData
    ): Promise<IUpdateOfferSuccessResponse | IUpdateOfferErrorResponse> => {
      try {
        const { data } = await apiClient.put<IUpdateOfferSuccessResponse>(
          `api/affiliate-network/offers/${id}?` +
            `pricingModel=${formData.get("pricingModel")}` +
            `&description=${formData.get("description")}` +
            `&stepInfo=${formData.get("stepInfo")}` +
            `&startDate=${formData.get("startDate")}` +
            `&endDate=${formData.get("endDate")}` +
            `&bid=${formData.get("bid")}` +
            `&budget=${formData.get("budget")}` +
            `&commissionRate=${formData.get("commissionRate")}` +
            `&orderReturnTime=${formData.get("orderReturnTime")}`
        )
        return data
      } catch (error) {
        console.error(error)
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IUpdateOfferErrorResponse)
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
        toast.success("Offer update successfully")
        queryClient.invalidateQueries({
          queryKey: offerQueryKeys.advertiser.update(id.toString()),
        })
        queryClient.invalidateQueries({
          queryKey: offerQueryKeys.advertiser.details(id.toString()),
        })
        form.reset()

        router.push(`/advertiser/campaigns/${campaignId}/offers/${id}`)
      } else {
        toast.error(resData.message, {
          description: resData.details,
        })
      }
    },
  })

  const onUpdateOffer = async (data: IOfferForm) => {
    try {
      // Initialize FormData instance
      const formData = new FormData()

      // Format dates to YYYY-MM-DD for proper MySQL compatibility
      const formatDateToYYYYMMDD = (dateStr: string): string => {
        const date = new Date(dateStr)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      }
      //formData.append("campaignId", data.campaignId?.toString() || "")
      formData.append("pricingModel", data.pricingModel || "")
      formData.append("description", data.description || "")
      formData.append("stepInfo", data.stepInfo || "")
      formData.append("bid", data.bid || "")
      formData.append("budget", data.budget || "")
      formData.append("commissionRate", data.commissionRate || "")
      formData.append("orderReturnTime", data.orderReturnTime || "")
      formData.append(
        "startDate",
        formatDateToYYYYMMDD(data.startDate) || formatDateToYYYYMMDD(Date())
      )
      formData.append(
        "endDate",
        formatDateToYYYYMMDD(data.endDate) || formatDateToYYYYMMDD(Date())
      )

      await updateOfferMutation(formData)
    } catch {}
  }

  return {
    form,
    isPending,
    onUpdateOffer,
    errorMessage,
  }
}
