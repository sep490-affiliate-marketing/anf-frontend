export {}

declare global {
  interface IRequest {
    url: string
    method: string
    body?: { [key: string]: any }
    queryParams?: any
    useCredentials?: boolean
    headers?: any
    nextOption?: any
  }

  interface IBackendRes<T> {
    isSuccess: true
    message: string
    value: T
  }

  interface IBackendErrorRes {
    isSuccess: false
    statusCode: number
    message: string
    details: string
  }
  interface IValidationErrors {
    [key: string]: string[]
  }
  interface IPaginationLink {
    url: string | null
    label: string
    active: boolean
  }

  interface IPaginationResponse<T> {
    success: true
    message: string
    type: string
    data: {
      current_page: number
      data: T[]
      first_page_url: string
      from: number
      last_page: number
      last_page_url: string
      links: IPaginationLink[]
      next_page_url: string | null
      path: string
      per_page: number
      prev_page_url: string | null
      to: number
      total: number
    }
  }
}
