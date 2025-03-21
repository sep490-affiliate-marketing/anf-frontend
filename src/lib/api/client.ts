"use client"

import { env } from "@/env"
import axios from "axios"
import Cookies from "js-cookie"

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
})

// Add request interceptor to include token in headers
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
