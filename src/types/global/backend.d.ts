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

  interface IPaginatedResponse<T> {
    pageNumber: number
    pageSize: number
    totalPages: number
    totalRecords: number
    data: T[]
    hasNextPage: boolean
    hasPreviousPage: boolean
  }

  interface IPaginationResponse<T> {
    isSuccess: true
    message: string
    value: IPaginatedResponse<T>
  }
}
