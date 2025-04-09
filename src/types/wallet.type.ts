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

export interface IGetWalletHistoryResponse {
  isSuccess: boolean
  message: string
  value: {
    pageNumber: number
    pageSize: number
    totalPages: number
    totalRecords: number
    data: IWalletTransaction[]
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
