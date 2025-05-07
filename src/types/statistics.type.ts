export interface IStatisticsResponse {
  isSuccess: boolean
  message: string
  value?: any
  statusCode?: number
  details?: string
}

export interface IAdvertiserOfferStatistics {
  id: number
  offerId: number
  date: string
  clickCount: number
  conversionCount: number
  conversionRate: number
  pullbackCount: number
  publisherCount: number
  revenue: number
}

export interface IPublisherOfferStatistics {
  id: number
  publisherId: number
  offerId: number
  date: string
  clickCount: number
  conversionCount: number
  conversionRate: number
  pullbackCount: number
  revenue: number
}

export interface IGetAdvertiserOfferStatisticsResponse {
  isSuccess: true
  message: string
  value: IAdvertiserOfferStatistics
}

export interface IGetAdvertiserOfferStatisticsErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface IGetPublisherOfferStatisticsResponse {
  isSuccess: true
  message: string
  value: IPublisherOfferStatistics
}

export interface IGetPublisherOfferStatisticsErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

export interface IGenerateStatisticsResponse {
  isSuccess: true
  message: string
}

export interface IGenerateStatisticsErrorResponse {
  isSuccess: false
  statusCode: number
  message: string
  details: string
}

// Admin Statistics Types
export interface IAdminUserStatistics {
  date: string
  totalUser: number
  totalActivedUser: number
  totalDeactivedUser: number
}

export interface IAdminCampaignStatistics {
  date: string
  totalCampaign: number
  totalApprovedCampaign: number
  totalRejectedCampaign: number
}

export interface IAdminTicketStatistics {
  totalTicket: number
  totalResolvedTicket: number
  totalPendingTicket: number
}

export interface IAdminAllTotalStatistics {
  id: number
  totalUser: number
  totalCampaign: number
  totalRejectedCampaign: number
  totalApprovedCampaign: number
  totalTicket: number
  totalResolvedTicket: number
  totalPendingTicket: number
  date: string
}

export type IGetAdminUserStatisticsResponse = IBackendRes<
  IAdminUserStatistics[]
>
export type IGetAdminCampaignStatisticsResponse = IBackendRes<
  IAdminCampaignStatistics[]
>
export type IGetAdminTicketStatisticsResponse =
  IBackendRes<IAdminTicketStatistics>
export type IGetAdminAllTotalStatisticsResponse =
  IBackendRes<IAdminAllTotalStatistics>

export interface IGetPublisherRevenueStatistics {
  date: string
  campaigns: {
    campaignId: number
    totalRevenue: number
    totalClick: number
    totalVerifiedClick: number
    totalFraudClick: number
    totalTablet: number
    totalMobile: number
    totalComputer: number
  }[]
}

export type IGetPublisherRevenueStatisticsResponse =
  IBackendRes<IGetPublisherRevenueStatistics>
