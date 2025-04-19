import { useRouter } from "next/navigation"

import { errorMessage } from "@/constant/error-message"
import { subscriptionQueryKeys } from "@/constant/react-query"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import qs from "qs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


import apiClient from "@/lib/api/client"
import { ICreateSubscriptionErrorResponse, 
         ICreateSubscriptionSuccessResponse, 
         IGetSubscriptionByIdResponse, 
         IGetSubscriptionsResponse } 
        from "@/types/subscription.type"
import { ISubscriptionForm, SubscriptionFormSchema } from "@/validations/subscription.validation"

export const useGetSubscriptionById = (subscriptionId: string) => {
  return useQuery({
    queryKey: subscriptionQueryKeys.global.details(subscriptionId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetSubscriptionByIdResponse>(
          `/api/affiliate-network/subscriptions/${subscriptionId}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching subscriptions",
          data: null,
        }
      }
    },
    enabled: !!subscriptionId,
  })
}

export const useCreateSubscriptionForm = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
  
    const form = useForm<ISubscriptionForm>({
      mode: "onChange",
      resolver: zodResolver(SubscriptionFormSchema()),
      defaultValues: {
        name: "",
        description: "",
        price: "",
        duration: "",
      },
    })
  
    const { mutateAsync: createSubscriptionMutation, isPending } = useMutation({
      mutationKey: subscriptionQueryKeys.admin.create(),
      mutationFn: async (
        formData: FormData
      ): Promise<
        ICreateSubscriptionSuccessResponse | ICreateSubscriptionErrorResponse
      > => {
        try {
          const { data } = await apiClient.post<ICreateSubscriptionSuccessResponse>(
            "/api/affiliate-network/subscriptions",
            formData
          )
          return data
        } catch (error) {
          const errRes =
            error instanceof AxiosError
              ? (error.response?.data as ICreateSubscriptionErrorResponse)
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
          toast.success("Subscription created successfully")
          queryClient.invalidateQueries({
            queryKey: subscriptionQueryKeys.advertiser.list,
          })
          form.reset()
          router.push("/admin/subscriptions")
        } else {
          toast.error(resData.message)
        }
      },
    })
  
    const onCreateSubscription = async (data: ISubscriptionForm) => {
      try {
        // Initialize FormData instance
        const formData = new FormData()

        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price)
        formData.append("duration", data.duration)
  
        // Execute mutation to create the subscription
        await createSubscriptionMutation(formData)
      } catch {}
    }
  
    return {
      form,
      isPending,
      onCreateSubscription,
      errorMessage,
    }
  }
  
  export const useGetSubscriptions = (
    page?: number,
    pageSize?: number
  ) => {
    return useQuery({
      queryKey: subscriptionQueryKeys.global.list(
        page ?? 1,
        pageSize ?? 10
      ),
      queryFn: async () => {
        const queryString = qs.stringify({
          pageNumber: page ?? 1,
          pageSize: pageSize ?? 10,
        })
        try {
          const { data } = await apiClient.get<IGetSubscriptionsResponse>(
            `/api/affiliate-network/subscriptions?${queryString}`
          )
          return data
        } catch {
          return {
            isSuccess: false,
            message: "Something went wrong while fetching subscriptions",
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
    })
  }
  
  export const useUpdateSubscription = (subscriptionId : string) => {
    const queryClient = useQueryClient()
    const router = useRouter()
  
    const form = useForm<ISubscriptionForm>({
      mode: "onChange",
      resolver: zodResolver(SubscriptionFormSchema()),
      defaultValues: {
        name: "",
        description: "",
        price: "",
        duration: "",
      },
    })
  
    const { mutateAsync: updateSubscriptionMutation, isPending } = useMutation({
      mutationKey: subscriptionQueryKeys.admin.update(subscriptionId),
      mutationFn: async (
        formData: FormData
    ): 
        Promise<
        ICreateSubscriptionSuccessResponse | ICreateSubscriptionErrorResponse
      > => {
        try {
          const { data } = await apiClient.put<ICreateSubscriptionSuccessResponse>(
            `/api/affiliate-network/subscriptions/${subscriptionId}`,
            formData
          )
          return data
        } catch (error) {
          const errRes =
            error instanceof AxiosError
              ? (error.response?.data as ICreateSubscriptionErrorResponse)
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
          toast.success("Subscription created successfully")
          queryClient.invalidateQueries({
            queryKey: subscriptionQueryKeys.advertiser.list,
          })
          form.reset()
          router.push("/admin/subscriptions")
        } else {
          toast.error(resData.message)
        }
      },
    })
  
    const onUpdateSubscription = async (data: ISubscriptionForm) => {
      try {
        // Initialize FormData instance
        const formData = new FormData()

        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price)
        formData.append("duration", data.duration)
  
        // Execute mutation to create the subscription
        await updateSubscriptionMutation(formData)
      } catch {}
    }
  
    return {
      form,
      isPending,
      onUpdateSubscription,
      errorMessage,
    }
  }
