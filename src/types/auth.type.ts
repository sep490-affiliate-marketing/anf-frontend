import { IUser } from "./user.type"

export interface ILoginRes {
  isSuccess: true
  message: string
  value: IUser
}
