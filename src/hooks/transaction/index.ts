import { useRouter } from "next/navigation"

import { transactionQueryKeys } from "@/constant/react-query"
import { useAuth } from "@/providers/auth-provider"
import {
  IUpdateWithdrawalStatusForm,
  IWithdrawRequestForm,
  UpdateWithdrawalStatusSchema,
  WithdrawRequestSchema,
} from "@/validations/withdraw.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import qs from "qs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  IAddCreditResponse,
  IBatchPaymentItem,
  IGetBatchPaymentDataResponse,
  IGetTransactionDetailResponse,
  IGetWalletHistoryResponse,
  IGetWithdrawRequestListResponse,
  IUpdateWithdrawalStatusResponse,
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
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: transactionQueryKeys.walletHistory(
      userCode,
      pageNumber,
      pageSize
    ),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetWalletHistoryResponse>(
          `/api/affiliate-network/users/${userCode}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`
        )
        return data
      } catch (error) {
        return null
      }
    },
  })
}

export const useWithdrawRequest = () => {
  const { user } = useAuth()
  const quertClient = useQueryClient()
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
        quertClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletHistory(
            user?.userCode || "",
            1,
            10
          ),
        })
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
  pageNumber: number,
  pageSize: number,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: transactionQueryKeys.admin.withdrawRequestList(
      pageNumber,
      pageSize,
      startDate,
      endDate
    ),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pageNumber: pageNumber ?? 1,
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

export const useBatchPaymentData = (
  pageNumber: number,
  pageSize: number,
  fromDate: string,
  toDate: string
) => {
  return useQuery({
    queryKey: transactionQueryKeys.batchPaymentData(
      pageNumber,
      pageSize,
      fromDate,
      toDate
    ),
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          fromDate: fromDate ?? "",
          toDate: toDate ?? "",
        })
        const { data } = await apiClient.get<IGetBatchPaymentDataResponse>(
          `/api/affiliate-network/batch-payment-data?${queryString}`
        )
        return data
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(errRes?.details ?? "Failed to fetch batch payment data")
      }
    },
  })
}

export const useExportBatchPaymentData = () => {
  const { mutateAsync: exportBatchPaymentData, isPending } = useMutation({
    mutationKey: transactionQueryKeys.exportBatchPaymentData(),
    mutationFn: async (paymentItems: IBatchPaymentItem[]) => {
      try {
        // For file downloads, use axios directly with responseType: 'blob'
        const response = await apiClient.post(
          "/api/affiliate-network/export-batch-payment-data",
          paymentItems,
          { responseType: "blob" }
        )

        // Return the blob data directly
        return {
          isSuccess: true,
          message: "Export successful",
          fileData: response.data,
        }
      } catch (error) {
        const errRes = extractApiError(error)
        return {
          isSuccess: false,
          message: errRes?.message ?? "Failed to export batch payment data",
          details: errRes?.details ?? "An unexpected error occurred",
        }
      }
    },
    onSuccess: (resData) => {
      if (resData.isSuccess === true && "fileData" in resData) {
        toast.success("Batch payment data exported successfully")

        // Create a blob URL from the file data
        const blob = new Blob([resData.fileData], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        const url = window.URL.createObjectURL(blob)

        // Create a temporary link and trigger the download
        const a = document.createElement("a")
        a.href = url
        a.download = `batch-payment-export-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()

        // Clean up
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        toast.error(resData.message || "Failed to export batch payment data")
      }
    },
  })

  return {
    exportBatchPaymentData,
    isPending,
  }
}

export const useUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: transactionQueryKeys.admin.updateWithdrawalStatus(),
    mutationFn: async (formData: IUpdateWithdrawalStatusForm) => {
      try {
        UpdateWithdrawalStatusSchema.parse(formData)
        const { data } = await apiClient.post<IUpdateWithdrawalStatusResponse>(
          "/api/affiliate-network/users/withdrawal-status",
          formData
        )
        return data
      } catch (error) {
        const errRes = extractApiError(error)
        return {
          isSuccess: false,
          message: errRes?.message ?? "Failed to update withdrawal status",
          details: errRes?.details ?? "An unexpected error occurred",
        }
      }
    },
    onSuccess: (resData) => {
      if (resData?.isSuccess === true) {
        toast.success("Withdrawal status updated successfully")
        // Invalidate query with current URL params to refresh the list
        queryClient.invalidateQueries()
      } else {
        toast.error(resData?.message || "Failed to update withdrawal status")
      }
    },
  })

  return {
    updateWithdrawalStatus: mutateAsync,
    isPending,
  }
}

export const useGetTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: transactionQueryKeys.detail(transactionId),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IGetTransactionDetailResponse>(
          `/api/affiliate-network/transactions/${transactionId}`
        )
        return data
      } catch (error) {
        const errRes = extractApiError(error)
        throw new Error(errRes?.details ?? "Failed to get transaction detail")
      }
    },
    enabled: !!transactionId,
  })
}
