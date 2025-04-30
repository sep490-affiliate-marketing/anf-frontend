import { TransactionStatusEnum } from "@/enums/transaction-status"

export interface IAddCreditResponse {
  isSuccess: boolean
  message: string
  value?: string
}

export interface IWalletTransaction {
  id: number
  amount: number
  campaignId: number | null
  subscriptionId: number | null
  isWithdrawal: boolean
  status: TransactionStatusEnum
  createdAt: string
}

export type IGetWalletHistoryResponse = IPaginationResponse<IWalletTransaction>

export interface IWithdrawRequestResponse {
  isSuccess: boolean
  message: string
  value?: any
}

export interface IWithdrawRequestErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface IGetWithdrawRequestListResponse
  extends IPaginationResponse<{
    id: number
    userCode: string
    walletId: number
    amount: number
    reason: string
    createdAt: string
    currentBankingNo: string
  }> {}
