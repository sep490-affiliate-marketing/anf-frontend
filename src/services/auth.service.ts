import { ILoginForm } from "@/validations/auth.validation"

import { ILoginRes } from "@/types/auth.type"
import { IUser } from "@/types/user.type"

import apiClient from "@/lib/api/client"

export const AuthService = {
  getUser: async () => {
    try {
      const data = await apiClient.get<IBackendRes<IUser>>(
        "/api/affiliate-network/users/me"
      )
      return data
    } catch (error) {
      const errRes = error as IBackendErrorRes
      return {
        isSuccess: false,
        message: errRes.message,
        value: null,
      }
    }
  },
  login: async (
    formData: ILoginForm
  ): Promise<ILoginRes | IBackendErrorRes> => {
    try {
      const { data } = await apiClient.post<ILoginRes>(
        "/api/affiliate-network/users/login",
        formData
      )
      return data
    } catch (error) {
      const errRes = error as IBackendErrorRes
      return {
        isSuccess: false,
        message: errRes.message,
        statusCode: errRes.statusCode,
        details: errRes.details,
      }
    }
  },

  logout: async () => {
    try {
      const data = await apiClient.post<IBackendRes<void>>("/auth/logout")
      return data
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to logout",
      }
    }
  },
}
