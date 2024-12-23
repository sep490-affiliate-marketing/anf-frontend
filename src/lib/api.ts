"use client"

import { env } from "@/env"
import axios from "axios"

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
