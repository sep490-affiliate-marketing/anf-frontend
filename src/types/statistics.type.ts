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
