import { OfferStatusEnum } from "@/enums/offfer-status"

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
  commissionRate: number
  orderReturnTime: number
  imageUrl: string
  status: OfferStatusEnum
  rejectedReason: string
  pubOfferStatus: number
  campaign: null
}

export interface IGetOfferResponse {
  id: number
  campaignId: number
  pricingModel: string
  description: string
  stepInfo: string
  startDate: string
  endDate: string
  bid: number
  budget: number
  commissionRate: number
  orderReturnTime: number
  imageUrl: string
  status: string
  rejectedReason: string
  pubOfferStatus: number
  //"campaign": Campa
}

export interface IUpdateOfferResponse {
  success: true
  message: string
  type: "update_offer_success"
}

export interface IUpdateOfferErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface IUpdateOfferSuccessResponse {
  isSuccess: true
  message: string
}
