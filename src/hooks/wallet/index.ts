import { useRouter } from "next/navigation"

import { walletQueryKeys } from "@/constant/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  IAddCreditResponse,
  IGetWalletHistoryResponse,
} from "@/types/wallet.type"

import apiClient from "@/lib/api/client"

export const useAddCredit = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: walletQueryKeys.deposit(),
    mutationFn: async (formData: { amount: number }) => {
      try {
        const { data } = await apiClient.post<IAddCreditResponse>(
          "/api/affiliate-network/users/deposit",
          formData
        )
        return data
      } catch (error) {
        return undefined
      }
    },
    onSuccess: (resData) => {
      if (resData?.isSuccess) {
        const { value } = resData
        toast.success("Credit added successfully")
        if (value) {
          router.push(value)
        }
      }
      if (!resData?.isSuccess) {
        toast.error("Failed to add credit. Please try again.")
      }
    },
  })
}

export const useGetWalletHistory = (
  userCode: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: walletQueryKeys.walletHistory(userCode, page, limit),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetWalletHistoryResponse>(
          `/api/affiliate-network/users/${userCode}/transactions?page=${page}&limit=${limit}`
        )
        return data
      } catch (error) {
        return null
      }
    },
  })
}
