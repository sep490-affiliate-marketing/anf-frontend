import { UserRole } from "@/enums/user-role"

export type IUser = {
  id: number
  userCode: string
  firstName: string
  lastName: string
  phoneNumber: string
  citizenId: string
  address: string
  dateOfBirth: string
  email: string
  role: UserRole
  imageUrl: string | null
  accessToken: string
}
