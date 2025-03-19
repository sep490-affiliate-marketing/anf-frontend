import { IUpdateCampaignForm } from "@/validations/campaign.validation"
import { AxiosError } from "axios"
import qs from "qs"

import {
  IActivateCampaignErrorResponse,
  IActivateCampaignResponse,
  ICreateCampaignErrorResponse,
  ICreateCampaignSuccessResponse,
  IGetAllCampaignsResponse,
  IGetCampaignByCampCodeResponse,
  IGetCampaignsByAdvertiserParams,
  IGetCampaignsByAdvertiserResponse,
  IGetTrackingParamsErrorResponse,
  IGetTrackingParamsResponse,
  IUpdateCampaignErrorResponse,
  IUpdateCampaignResponse,
} from "@/types/campaign.type"

import apiClient from "@/lib/api/client"

export interface ITest {
  code: string
  name: string
  description: string
  id: string
}

const CampaignService = {
  createCampaign: async (formData: FormData) => {
    try {
      const { data } = await apiClient.post<
        ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse
      >("/api/store-camp", formData)
      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorRes = error.response?.data as ICreateCampaignErrorResponse
        return {
          success: false,
          message: errorRes.message,
          type: errorRes.type,
          errors: errorRes.errors,
        }
      } else {
        return {
          success: false,
          message: "Something went wrong while creating campaign",
          type: null,
          errors: null,
        }
      }
    }
  },
  getCampaignsByAdvertiser: async (params: IGetCampaignsByAdvertiserParams) => {
    const queryString = qs.stringify(params)
    try {
      const { data } = await apiClient.get<IGetCampaignsByAdvertiserResponse>(
        `/api/my-campaigns?${queryString}`
      )
      return data
    } catch (error) {
      return undefined
    }
  },
  getCampaignByCampCode: async (campaignCode: string) => {
    try {
      const { data } = await apiClient.get<IGetCampaignByCampCodeResponse>(
        `/api/campaigns/${campaignCode}`
      )
      return {
        success: true,
        message: data.message,
        data: data.data,
      }
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong while fetching campaign",
        type: null,
        data: null,
      }
    }
  },
  getAllCampaigns: async (page: number = 1) => {
    try {
      const { data } = await apiClient.get<IGetAllCampaignsResponse>(
        `/api/campaign?page=${page}`
      )
      return data
    } catch (error) {
      return undefined
    }
  },
  activateCampaign: async (campaignCode: string) => {
    try {
      const { data } = await apiClient.post<IActivateCampaignResponse>(
        `/api/active-camp/${campaignCode}`
      )
      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorRes = error.response?.data as IActivateCampaignErrorResponse
        return {
          success: false,
          message: errorRes.message,
          type: errorRes.type,
        }
      } else {
        return {
          success: false,
          message: "Something went wrong while activating campaign",
          type: null,
        }
      }
    }
  },
  getTrackingParams: async () => {
    try {
      const { data } = await apiClient.get<IGetTrackingParamsResponse>(
        "/api/tracking-params"
      )
      return {
        success: true,
        message: data.message,
        data: data.data,
      }
    } catch (error) {
      const errorRes =
        error instanceof AxiosError
          ? (error.response?.data as IGetTrackingParamsErrorResponse)
          : null
      return {
        success: false,
        message:
          errorRes?.message ??
          "Something went wrong while fetching tracking params",
        type: errorRes?.type ?? "unknown",
      }
    }
  },
  updateCampaignByCode: async (
    campaignCode: string,
    formData: IUpdateCampaignForm
  ) => {
    try {
      const { data } = await apiClient.post<IUpdateCampaignResponse>(
        `/api/update-campaign/${campaignCode}`,
        formData
      )
      return {
        success: true,
        message: data.message,
        type: data.type,
      }
    } catch (error) {
      const errorRes =
        error instanceof AxiosError
          ? (error.response?.data as IUpdateCampaignErrorResponse)
          : null
      return {
        success: false,
        message:
          errorRes?.message ?? "Something went wrong while updating campaign",
        type: errorRes?.type ?? "unknown",
      }
    }
  },
}

export default CampaignService
