import { useQuery } from "@tanstack/react-query"

import apiClient from "@/lib/api/client"

interface Postback {
  id: number
  clickId: string
  offerId: number
  transactionId: string
  date: string
  publisherCode: string
  amount: number
  status: number
  offer: any
}

interface PostbackResponse {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: Postback[]
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export const useGetPostbacks = (
  offerId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["postbacks", offerId, page, pageSize],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IBackendRes<PostbackResponse>>(
          `/api/affiliate-network/postbacks/offer/${offerId}?page=${page}&pageSize=${pageSize}`
        )
        return data
      } catch (error) {
        return null
      }
    },
  })
}
