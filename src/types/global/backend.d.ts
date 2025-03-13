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
}
