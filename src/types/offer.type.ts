import { NETWORK } from "@/constant/campaign"

export interface IOffer {
  id: number
  camp_id: number
  code: string
  price_modal: string
  payout_money: number
  thumbnail: string
  start_date: string
  end_date: string
  status: number
  created_at: string
  updated_at: string
  type: number
  carrier: string
  network: (typeof NETWORK)[number]["name"]
  country: string
  os: string
  user_status: number
  affiliate_offer: number[]
  camp: ICampaign
}

export interface ICampaign {
  id: number
  name: string
  code: number
  url: string
  tracking_params: string[]
}

export type IGetOffersResponse = IPaginationResponse<IOffer>

export type IGetOffersByCampaignCodeResponse = {
  data: IOffer[]
  message: string
  success: true
  type: string
}

export interface ICreateOfferResponseSuccess {
  success: true
  message: string
  type: string
}

export interface ICreateOfferResponseError {
  success: false
  message: string
  errors: IValidationErrors
  type: string
}

export interface IActiveOfferResponse {
  success: true
  message: string
  type: "active_offer_success" | "deactive_offer_success"
}

export interface IActiveOfferErrorResponse {
  success: false
  message: string
  type: "unauthorized" | "deactive_offer_false" | "active_offer_error"
}

export interface IUpdateOfferResponse {
  success: true
  message: string
  type: "update_offer_success"
}

export interface IUpdateOfferErrorResponse {
  success: false
  message: string
  type:
    | "permission_denied"
    | "data_offer_not_exist"
    | "camp_not_found"
    | "error_date_offer"
    | "error_date_offer"
    | "update_offer_error"
}

export interface IPublisherOffersResponse {
  success: boolean
  message: string
  type: string
  data: {
    id: number
    name: string
    code: string
    url: string
    description: string
    status: number
    offers: {
      id: number
      code: string
      price_modal: string
      payout_money: string
      thumbnail: string
      start_date: string
      end_date: string
      status: number
      created_at: string
      updated_at: string
      type: number
      carrier: string
      network: string
      country: string
      os: string
      offer_owner: number
    }[]
  }[]
}
