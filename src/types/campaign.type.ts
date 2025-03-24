
export interface ICreateCampaignRequest {
  name: string
  description: string
  startDate: string
  endDate: string
  url?: string
  baseUrl?: string
  advertiserCode?: string
  trackingParams?: string
  images: File[]
  offers: Array<{
    pricingModel: string
    description: string
    bid: string
    startDate: string
    endDate: string
    budget: string
    stepInfo: string
    thumbnail?: File | string
  }>
}

export interface ICreateCampaignSuccessResponse {
  success: true
  message: string
  data: {
    campaignCode: string
  }
}

export interface ICreateCampaignErrorResponse {
  success: false
  message: string
  type: string | null
  errors: Record<string, string[]> | null
}

export interface ITrackingParams {
  param_name: string
  param_value: string
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
  status: string
  category: any | null
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
  }>
  images: Array<{
    imageUrl: string
  }>
}

export interface IGetCampaignsByAdvertiserResponse {
  isSuccess: true
  message: string
  value: IPaginatedResponse<ICampaign>
}

export interface IGetCampaignByCampCodeResponse {
  success: true
  data: ICampaign
  message: string
  type: string
}

export type IGetAllCampaignsResponse = IPaginationResponse<ICampaign>

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

export interface IGetCampaignsByAdvertiserParams {
  pageNumber?: number
  pageSize?: number
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

