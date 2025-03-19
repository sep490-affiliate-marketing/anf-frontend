import { IOffer } from "./offer.type"

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
  name: string
  code: string
  start_date: string
  end_date: string
  status: number
  description: string
  created_at: string
  updated_at: string
  camp_owner: number
  url: string
  tracking_params: string
  offer: IOffer[]
}

export type IGetCampaignsByAdvertiserResponse = IPaginationResponse<ICampaign>

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
  search?: string
  filter_by?: string
  filter_value?: string
  status?: number
  page?: number
  pageSize?: number
  sort_by?: string
  sort_order?: string
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

