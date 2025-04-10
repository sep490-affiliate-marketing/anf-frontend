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
  createdAt: string
}

export type IGetWalletHistoryResponse = IPaginationResponse<IWalletTransaction>
