export interface IOffer {
  id: number
  campaignId: number
  pricingModel: string
  description: string
  stepInfo: string
  startDate: string
  endDate: string
  bid: number
  budget: number
  commissionRate: null
  orderReturnTime: null
  imageUrl: null
  status: string
  rejectedReason: null
  pubOfferStatus: number
  campaign: null
}
