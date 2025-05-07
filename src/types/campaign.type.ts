import { CampaignStatusEnum } from "@/enums/campaign-status"

export interface ICreateCampaignSuccessResponse {
  isSuccess: true
  message: string
  data: {
    campaignCode: string
  }
}

export interface ICreateCampaignErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface ICampaign {
  id: number
  advertiserCode: string
  name: string
  description: string
  startDate: string
  endDate: string
  balance: number
  productUrl: string
  trackingParams: string
  rejectReason: string | null
  categoryId: number | null
  categoryName: string | null
  status: CampaignStatusEnum
  offers: Array<{
    id: number
    campaignId: number
    pricingModel: string
    description: string
    stepInfo: string
    startDate: string
    endDate: string
    bid: number
    budget: number
    commissionRate: number | null
    orderReturnTime: number | null
    imageUrl: string | null
    pubOfferStatus: number | null
  }>
  campImages: Array<string>
}

export interface IGetCampaignsByAdvertiserResponse {
  isSuccess: true
  message: string
  value: IPaginatedResponse<ICampaign>
}

export interface IGetCampaignByCampIdResponse {
  isSuccess: boolean
  message: string
  value: ICampaign
}

export type IGetAllCampaignsResponse = IPaginationResponse<ICampaign>
export type IGetCampaignsByDateResponse = IBackendRes<ICampaign[]>

export interface IActivateCampaignResponse {
  success: true
  message: string
  type: "active_camp_success" | "deactivate_camp_success"
}

export interface IActivateCampaignErrorResponse {
  success: false
  message: string
  type:
    | "camp_not_exist"
    | "unauthorized"
    | "campaign_started"
    | "invalid_offers"
    | "active_camp_error"
}

export interface IGetTrackingParamsResponse {
  success: true
  data: string[]
  message: string
  type: "data_tracking_params"
}

export interface IGetTrackingParamsErrorResponse {
  success: false
  message: string
  type: "tracking_params_error"
}

export interface IUpdateCampaignResponse {
  success: true
  message: string
  type: "update_camp_success"
}

export interface IUpdateCampaignErrorResponse {
  success: false
  message: string
  type: "camp_already_active" | "permission_denied" | "update_camp_error"
}
export interface IGetCampaignDetailForPublisherResponse {
  isSuccess: true
  message: string
  value: ICampaign
}

export interface IGetPublisherCampaignsResponse {
  isSuccess: true
  message: string
  value: {
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
    campaign: {
      id: number
      name: string
      description: string
      startDate: string
      endDate: string
      balance: null
      productUrl: string
      trackingParams: string
      categoryId: null
      categoryName: string
      status: string
      campImages: string[]
      offers: []
    }
  }[]
}

export interface IGetPublisherCampaignsErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface IGetPublisherInOfferResponse {
  poNo: number
  publisherId: number
  publisherCode: string
  offerId: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  pubOfferStatus: number
  trafficSources: string[]
}
