import { IUpdateCampaignForm } from "@/validations/campaign.validation"
import { AxiosError } from "axios"
import qs from "qs"

import {
  IActivateCampaignErrorResponse,
  IActivateCampaignResponse,
  ICampaign,
  ICreateCampaignErrorResponse,
  ICreateCampaignSuccessResponse,
  IGetAllCampaignsResponse,
  IGetCampaignByCampIdResponse,
  IGetCampaignDetailForPublisherResponse,
  IGetCampaignsByAdvertiserParams,
  IGetCampaignsByAdvertiserResponse,
  IGetTrackingParamsErrorResponse,
  IGetTrackingParamsResponse,
  IUpdateCampaignErrorResponse,
  IUpdateCampaignResponse,
} from "@/types/campaign.type"

import apiClient from "@/lib/api/client"

/**
 * CampaignService
 *
 * Provides methods to interact with campaign-related API endpoints, including
 * creating, retrieving, updating, and activating campaigns.
 *
 * This service handles communication with the backend for all campaign operations
 * and provides appropriate error handling and response formatting.
 */
const CampaignService = {
  /**
   * Creates a new campaign
   *
   * @access Admin, Advertiser
   * @param {FormData} formData - Form data containing campaign details
   * @returns {Promise<ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse>} Response with success status and message
   */
  createCampaign: async (formData: FormData) => {
    try {
      const { data } = await apiClient.post<
        ICreateCampaignSuccessResponse | ICreateCampaignErrorResponse
      >("/api/affiliate-network/campaigns", formData)
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

  /**
   * Retrieves campaigns by advertiser code
   *
   * @access Admin, Advertiser, Publisher
   * @param {IGetCampaignsByAdvertiserParams} params - Query parameters for filtering campaigns
   * @param {string} code - Advertiser code
   * @returns {Promise<IGetCampaignsByAdvertiserResponse | IErrorPaginationResponse<ICampaign>>}
   */
  getCampaignsByAdvertiser: async (
    params: IGetCampaignsByAdvertiserParams,
    code: string
  ) => {
    const queryString = qs.stringify(params)
    try {
      const { data } = await apiClient.get<IGetCampaignsByAdvertiserResponse>(
        `/api/affiliate-network/campaigns/advertisers/${code}/offers?${queryString}`
      )
      return data
    } catch {
      return {
        isSuccess: false,
        message: "Something went wrong while fetching campaigns",
        value: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          totalPages: 0,
          totalRecords: 0,
          data: [],
          hasNextPage: false,
          hasPreviousPage: false,
        },
      } as IErrorPaginationResponse<ICampaign>
    }
  },

  /**
   * Retrieves a campaign by its campaign code
   *
   * @access Admin, Advertiser, Publisher
   * @param {string} campaignId - Unique campaign identifier
   * @returns {Promise<{success: boolean, message: string, data: any | null, type?: string | null}>} Response with campaign data
   */
  getCampaignByCampId: async (campaignId: string) => {
    try {
      const { data } = await apiClient.get<IGetCampaignByCampIdResponse>(
        `/api/affiliate-network/campaigns/${campaignId}`
      )
      return {
        success: true,
        message: data.message,
        data: data.value,
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

  /**
   * Retrieves all campaigns with pagination
   *
   * @access Admin
   * @param {number} page - Page number for pagination, defaults to 1
   * @returns {Promise<IGetAllCampaignsResponse | undefined>} Paginated list of campaigns or undefined
   */
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
  getActiveCampaigns: async (page: number = 1, pageSize: number = 10) => {
    try {
      const { data } = await apiClient.get<IGetAllCampaignsResponse>(
        `/api/affiliate-network/campaigns?pageNumber=${page}&pageSize=${pageSize}`
      )
      return data
    } catch (error) {
      return undefined
    }
  },

  /**
   * Activates a campaign by its campaign code
   *
   * @access Admin, Advertiser
   * @param {string} campaignCode - Unique campaign identifier
   * @returns {Promise<IActivateCampaignResponse | {success: boolean, message: string, type: string | null}>} Response with activation status
   */
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

  /**
   * Retrieves tracking parameters used in campaigns
   *
   * @access Admin, Advertiser, Publisher
   * @returns {Promise<{success: boolean, message: string, data?: any, type?: string}>} Response with tracking parameters
   */
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

  /**
   * Updates a campaign status
   *
   * @access Admin
   * @param {number} id - Campaign ID
   * @param {string} campaignStatus - New status for the campaign ("Started", "Paused", "Rejected", etc.)
   * @param {string} [rejectReason] - Reason for rejection (required if status is "Rejected")
   * @returns {Promise<{isSuccess: boolean, message: string}>} Response with update status result
   */
  updateCampaignStatus: async (
    id: number,
    campaignStatus: string,
    rejectReason?: string
  ) => {
    try {
      const { data } = await apiClient.patch(
        `/api/affiliate-network/campaigns/admin/${id}/status`,
        {
          campaignStatus,
          rejectReason,
        }
      )
      return data
    } catch (error) {
      const errorRes =
        error instanceof AxiosError
          ? (error.response?.data as IUpdateCampaignErrorResponse)
          : null
      return {
        isSuccess: false,
        message:
          errorRes?.message ??
          "Something went wrong while updating campaign status",
      }
    }
  },

  /**
   * Updates a campaign by its campaign code
   *
   * @access Admin, Advertiser
   * @param {string} campaignCode - Unique campaign identifier
   * @param {IUpdateCampaignForm} formData - Form data containing updated campaign details
   * @returns {Promise<{success: boolean, message: string, type: string}>} Response with update status
   */
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

export const getCampaignDetailForPublisher = async (campaignId: number) => {
  try {
    const { data } =
      await apiClient.get<IGetCampaignDetailForPublisherResponse>(
        `/api/affiliate-network/campaigns/${campaignId}/publishers`
      )
    return data
  } catch (error) {
    return undefined
  }
}

export const joinOffer = async (offerId: number) => {
  try {
    const { data } = await apiClient.post(
      `/api/affiliate-network/offers/publisher?offerId=${offerId}`
    )
    return data
  } catch (error) {
    return undefined
  }
}

export default CampaignService
/**
 * Get all campaigns for admin
 *
 * @access Admin
 * @returns {Promise<IGetAllCampaignsResponse | undefined>} Paginated list of campaigns or undefined
 */
export const getAdminCampaigns = async () => {
  const { data } = await apiClient.get<IGetAllCampaignsResponse>(
    "/api/affiliate-network/campaigns/offers"
  )
  return data
}
