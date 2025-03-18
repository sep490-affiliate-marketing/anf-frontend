"use client"

import { env } from "@/env"
import axios from "axios"

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default apiClient
