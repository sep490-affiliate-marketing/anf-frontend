interface BaseNotification {
  userCode: string
  status: string
  rejectReason?: string
}

export interface CampaignStatusNotification extends BaseNotification {
  campaignId: number
}

export interface OfferStatusNotification extends BaseNotification {
  offerId: number
}

export interface PublisherOfferStatusNotification extends BaseNotification {
  offerId: number // This represents pubOfferId from backend
  campaignId: number
}

export interface UserProfileNotification {
  userCode: string
}

export interface NotifyRequestToJoinOfferNotification {
  offerId: number
  campaignId: number
}
