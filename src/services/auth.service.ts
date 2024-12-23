import { AxiosError } from "axios"

import api from "@/lib/api"

export const AuthService = {
  getUser: async () => {
    try {
      const { data } = await api.get("/auth/me")
      return data
    } catch (error) {
      const errorRes = error instanceof AxiosError && error.response?.data
      return {
        success: false,
        message: errorRes?.message || "Failed to get user data",
      }
    }
  },
  logout: async () => {
    try {
      const { data } = await api.post("/auth/logout")
      return data
    } catch (error) {
      const errorRes = error instanceof AxiosError && error.response?.data
      return {
        success: false,
        message: errorRes?.message || "Failed to logout",
      }
    }
  },
}
