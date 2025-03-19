"use client"

import { env } from "@/env"
import axios from "axios"

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
})

export default apiClient
