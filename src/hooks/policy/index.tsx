import { useRouter } from "next/navigation"

import { errorMessage } from "@/constant/error-message"
import { policyQueryKeys } from "@/constant/react-query"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import qs from "qs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


import apiClient from "@/lib/api/client"
import { ICreatePolicyErrorResponse, ICreatePolicySuccessResponse, IDeletePolicyErrorResponse, IDeletePolicySuccessResponse, IGetPolicyByIdResponse, IUpdatePolicyErrorResponse, IUpdatePolicySuccessResponse } from "@/types/policy.type"
import { IPolicyForm, PolicyFormSchema } from "@/validations/policy.validation"
import { IGetPoliciesResponse } from '../../types/policy.type';


export const useGetPolicyById = (policyId: string) => {
  return useQuery({
    queryKey: policyQueryKeys.global.details(policyId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetPolicyByIdResponse>(
          `/api/affiliate-network/policy/${policyId}`
        )
        return {
          isSuccess: true,
          message: data.message,
          data: data.value,
        }
      } catch {
        return {
          isSuccess: false,
          message: "Something went wrong while fetching policy",
          data: null,
        }
      }
    },
    enabled: !!policyId,
  })
}

export const useCreatePolicy = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
  
    const form = useForm<IPolicyForm>({
      mode: "onChange",
      resolver: zodResolver(PolicyFormSchema()),
      defaultValues: {
        header: "",
        description: ""
      },
    })
  
    const { mutateAsync: createPolicyMutation, isPending } = useMutation({
      mutationKey: policyQueryKeys.admin.create(),
      mutationFn: async (
        formData: FormData
      ): Promise<
        ICreatePolicySuccessResponse | ICreatePolicyErrorResponse
      > => {
        try {
          const { data } = await apiClient.post<ICreatePolicySuccessResponse>(
            "/api/affiliate-network/policy",
            // formData
            {
              header: formData.get("header"),
              description: formData.get("description"),
            }
          )
          return data
        } catch (error) {
          const errRes =
            error instanceof AxiosError
              ? (error.response?.data as ICreatePolicyErrorResponse)
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
          toast.success("Policy created successfully")
          queryClient.invalidateQueries({
            queryKey: policyQueryKeys.advertiser.list,
          })
          form.reset()
          router.push("/admin/policies")
        } else {
          toast.error(resData.message)
        }
      },
    })
  
    const onCreatePolicy = async (data: IPolicyForm) => {
      try {
        // Initialize FormData instance
        const formData = new FormData()

        formData.append("header", data.header)
        formData.append("description", data.description)
  
        // Execute mutation to create the policy
        await createPolicyMutation(formData)
      } catch {}
    }
  
    return {
      form,
      isPending,
      onCreatePolicy,
      errorMessage,
    }
  }
  
  export const useGetPolicies = (
    page?: number,
    pageSize?: number
  ) => {
    return useQuery({
      queryKey: policyQueryKeys.global.list(
        page ?? 1,
        pageSize ?? 10
      ),
      queryFn: async () => {
        const queryString = qs.stringify({
          pageNumber: page ?? 1,
          pageSize: pageSize ?? 10,
        })
        try {
          const { data } = await apiClient.get<IGetPoliciesResponse>(
            `/api/affiliate-network/policies?${queryString}`
          )
          return data
        } catch {
          return {
            isSuccess: false,
            message: "Something went wrong while fetching policies",
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
  
  export const useUpdatePolicy = (policyId : string) => {
    const queryClient = useQueryClient()
    const router = useRouter()
  
    const form = useForm<IPolicyForm>({
      mode: "onChange",
      resolver: zodResolver(PolicyFormSchema()),
      defaultValues: {
        header: "",
        description: "",
      },
    })
  
    const { mutateAsync: updatePolicyMutation, isPending } = useMutation({
      mutationKey: policyQueryKeys.admin.update(policyId),
      mutationFn: async (
        formData: FormData
    ): 
        Promise<
        IUpdatePolicySuccessResponse | IUpdatePolicyErrorResponse
      > => {
        try {
          const { data } = await apiClient.put<IUpdatePolicySuccessResponse>(
            `/api/affiliate-network/policy/${policyId}`,
            {
              header: formData.get("header"),
              description: formData.get("description"),
            }
          )
          return data
        } catch (error) {
          const errRes =
            error instanceof AxiosError
              ? (error.response?.data as IUpdatePolicyErrorResponse)
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
          toast.success("Policy created successfully")
          queryClient.invalidateQueries({
            queryKey: policyQueryKeys.advertiser.list,
          })
          form.reset()
          router.push("/admin/policies")
        } else {
          toast.error(resData.message)
        }
      },
    })
  
    const onUpdatePolicy = async (data: IPolicyForm) => {
      try {
        // Initialize FormData instance
        const formData = new FormData()

        formData.append("header", data.header)
        formData.append("description", data.description)
  
        // Execute mutation to create the policy
        await updatePolicyMutation(formData)
      } catch {}
    }
  
    return {
      form,
      isPending,
      onUpdatePolicy,
      errorMessage,
    }
  }

  export const useDeletePolicyById = () => {

  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: number
    }) => {
      try {
        const { data } = await apiClient.delete<IDeletePolicySuccessResponse>(
          `/api/affiliate-network/policy/${id}`
        )
        return data
      } catch (error) {
        const errorRes =
          error instanceof AxiosError
            ? (error.response?.data as IDeletePolicyErrorResponse)
            : null
        return {
          isSuccess: false,
          message:
            errorRes?.message ??
            "Something went wrong while deleting the policy",
        }
      }
    },
    onSuccess: (data,) => {
      if (data.isSuccess) {
        toast.success("deleted successfully")
      } else {
        toast.error(data.message || "Failed to delete policy")
      }
    },
    onError: () => {
      toast.error("An error occurred while deleting the policy")
    },
  })
}