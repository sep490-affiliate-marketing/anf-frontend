export interface ILoginRes {
  isSuccess: true
  message: string
  value: {
    id: number
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    dateOfBirth: string
    accessToken: string
    userCode: string
  }
}
