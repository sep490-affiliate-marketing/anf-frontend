import { bankQueryKeys } from "@/constant/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"

import apiClient from "@/lib/api/client"
import { createApiError } from "@/lib/api/error-handler"

export const useGetBankList = () => {
  return useQuery({
    queryKey: bankQueryKeys.list(),
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/bank/list")
        return data
      } catch {
        return null
      }
    },
  })
}

export const useAddBankAccount = () => {
  return useMutation({
    mutationKey: bankQueryKeys.add(),
    mutationFn: async (formData: any) => {
      try {
        const { data } = await apiClient.post(
          "/api/affiliate-network/users/bank-accounts",
          formData
        )
        return data
      } catch (error) {
        // Create a standardized error and throw it
        throw createApiError(error)
      }
    },
    onError: (error: unknown) => {
      // Show toast notification with error details
      // showApiErrorToast(error);
    },
  })
}
