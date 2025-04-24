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
}

export interface UserProfileNotification {
  userCode: string
}
