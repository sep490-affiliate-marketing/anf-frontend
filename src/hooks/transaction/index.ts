import { useRouter } from "next/navigation"

import { transactionQueryKeys } from "@/constant/react-query"
import {
  IWithdrawRequestForm,
  WithdrawRequestSchema,
} from "@/validations/withdraw.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import qs from "qs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  IAddCreditResponse,
  IGetWalletHistoryResponse,
  IGetWithdrawRequestListResponse,
  IWithdrawRequestResponse,
} from "@/types/transaction.type"

import apiClient from "@/lib/api/client"
import { extractApiError } from "@/lib/api/error-handler"

export const useAddCredit = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: transactionQueryKeys.deposit(),
    mutationFn: async (formData: { amount: number }) => {
      try {
        const { data } = await apiClient.post<IAddCreditResponse>(
          "/api/affiliate-network/users/deposit",
          formData
        )
        return data
      } catch (error) {
        return null
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
    queryKey: transactionQueryKeys.walletHistory(userCode, page, limit),
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

export const useWithdrawRequest = () => {
  const withDrawResquestForm = useForm<IWithdrawRequestForm>({
    resolver: zodResolver(WithdrawRequestSchema),
    defaultValues: {
      amount: 0,
      bankingNo: "",
      beneficiaryBankCode: "",
      beneficiaryBankName: "",
    },
  })

  const { mutateAsync: withdrawRequestMutation, isPending } = useMutation({
    mutationKey: transactionQueryKeys.withdraw(),
    mutationFn: async (formData: IWithdrawRequestForm) => {
      try {
        const { data } = await apiClient.post<IWithdrawRequestResponse>(
          "/api/affiliate-network/users/withdrawal-request",
          formData
        )
        return data
      } catch (error) {
        const errRes = extractApiError(error)

        return {
          isSuccess: false,
          message: errRes?.message ?? "Failed to submit withdrawal request",
          details: errRes?.details ?? "An unexpected error occurred",
        }
      }
    },
    onSuccess: (resData) => {
      if (resData?.isSuccess === true) {
        toast.success("Withdrawal request submitted successfully")
      }
    },
  })

  return {
    withDrawResquestForm,
    withdrawRequestMutation,
    isPending,
  }
}

export const useAdminWithdrawRequestList = (
  page: number,
  pageSize: number,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: transactionQueryKeys.admin.withdrawRequestList(
      page,
      pageSize,
      startDate,
      endDate
    ),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pageNumber: page ?? 1,
          pageSize: pageSize ?? 10,
          fromDate: startDate ?? "",
          toDate: endDate ?? "",
        })
        const { data } = await apiClient.get<IGetWithdrawRequestListResponse>(
          `/api/affiliate-network/users/withdrawal-requests?${queryString}`
        )
        return data
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(
          errRes?.details ?? "Failed to fetch withdraw request list"
        )
      }
    },
  })
}
