import { useAuth } from "@/providers/auth-provider"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import apiClient from "@/lib/api/client"

export interface TrafficSource {
  id: number
  provider: string
  sourceUrl: string
  createdAt: string
  type: string
  publisherId: number
  status: string
}

interface AddTrafficSourceRequest {
  provider: string
  sourceUrl: string
  type: string
}

interface UpdateTrafficSourceRequest {
  provider: string
  sourceUrl: string
  type: string
}

interface TrafficSourceResponse {
  isSuccess: boolean
  message: string
  value: TrafficSource[]
}

export const useAddTrafficSource = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const publisherId = user?.id

  return useMutation({
    mutationFn: async (sources: AddTrafficSourceRequest[]) => {
      const { data } = await apiClient.post<TrafficSourceResponse>(
        `/api/affiliate-network/publisher/${publisherId}/affiliate-sources`,
        sources
      )
      return data
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Traffic source added successfully")
        // Invalidate and refetch traffic sources
        queryClient.invalidateQueries({
          queryKey: ["trafficSources", publisherId],
        })
      } else {
        toast.error(data.message || "Failed to add traffic source")
      }
    },
    onError: (error) => {
      toast.error("Failed to add traffic source")
      console.error(error)
    },
  })
}

export const useGetPublisherTrafficSources = () => {
  const { user } = useAuth()
  const publisherId = user?.id

  return useQuery({
    queryKey: ["trafficSources", publisherId],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<TrafficSourceResponse>(
          `/api/affiliate-network/publishers/${publisherId}/traffic-sources`
        )
        return data.value
      } catch (error) {
        return []
      }
    },
    enabled: !!publisherId,
  })
}

export const useUpdateTrafficSource = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const publisherId = user?.id

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateTrafficSourceRequest
    }) => {
      const response = await apiClient.put<TrafficSourceResponse>(
        `/api/affiliate-network/affiliate-source/${id}`,
        data
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Traffic source updated successfully")
        queryClient.invalidateQueries({
          queryKey: ["trafficSources", publisherId],
        })
      } else {
        toast.error(data.message || "Failed to update traffic source")
      }
    },
    onError: (error) => {
      toast.error("Failed to update traffic source")
      console.error(error)
    },
  })
}

export const useDeleteTrafficSources = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const publisherId = user?.id

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await apiClient.delete<TrafficSourceResponse>(
        `/api/affiliate-network/affiliate-sources`,
        { data: ids }
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Traffic source(s) deleted successfully")
        queryClient.invalidateQueries({
          queryKey: ["trafficSources", publisherId],
        })
      } else {
        toast.error(data.message || "Failed to delete traffic source(s)")
      }
    },
    onError: (error) => {
      toast.error("Failed to delete traffic source(s)")
      console.error(error)
    },
  })
}
