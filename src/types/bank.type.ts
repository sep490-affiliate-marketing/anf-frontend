export interface IBank {
  id: string
  name: string
  code: string
  bin: number
  short_name: string
  logo_url: string
  icon_url: string
  swift_code?: string
  lookup_supported: number
}

export interface IBankListResponse {
  code: number
  success: boolean
  data: IBank[]
  msg: string
}
