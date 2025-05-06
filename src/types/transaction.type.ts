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

export type IGetWithdrawRequestListResponse = IPaginationResponse<{
  id: number
  userCode: string
  walletId: number
  amount: number
  reason: string
  createdAt: string
  currentBankingNo: string
}>

export interface IBatchPaymentItem {
  transactionId: string
  fromAccount: string
  amount: number
  beneficiaryName: string
  beneficiaryAccount: string
  reason: string
  beneficiaryBankCode: string
  beneficiaryBankName: string
}

export type IGetBatchPaymentDataResponse =
  IPaginationResponse<IBatchPaymentItem>

export type IExportBatchPaymentDataResponse = IBackendRes<string>

export interface IUpdateWithdrawalStatusRequest {
  transactionIds: number[]
  status: string // should match backend enum, e.g. 'APPROVED' | 'REJECTED'
  reason?: string // optional, for rejection reason
}

export interface IUpdateWithdrawalStatusResponse {
  isSuccess: boolean
  message: string
  value?: any
}

export interface IGetTransactionDetailResponse {
  isSuccess: true
  message: string
  value: {
    id: number
    userCode: string
    walletId: number
    amount: number
    campaignId: number | null
    subscriptionId: number | null
    reason: string
    createdAt: string
    approvedAt: string | null
    currentBankingNo: string | null
    isWithdrawal: boolean
    billingType: string | null
    validFrom: string | null
    validTo: string | null
    remainedSlot: number | null
    status: number
  }
}
