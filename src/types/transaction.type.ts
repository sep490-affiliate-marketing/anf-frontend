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
