import { IUser } from "./user.type"

export interface ILoginRes {
  isSuccess: true
  message: string
  value: IUser
}

export interface IMeRes {
  isSuccess: true
  message: string
  value: IUserExtended
}

export interface IUserExtended extends IUser {
  bankResponses: IBankResponse[]
  advertiserProfile: IAdvertiserProfile | null
  publisherProfile: IPublisherProfile | null
}

export interface IBankResponse {
  id: number
  bankingNo: string
  bankingProvider: string
}

export interface IAdvertiserProfile {
  companyName: string
  industry: string
  bio: string
}

export interface IPublisherProfile {
  specialization: string
  bio: string
}
