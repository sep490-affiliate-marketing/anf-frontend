"use server"

import { cookies } from "next/headers"

import { env } from "@/env"
import axios from "axios"

export async function createApiServer() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")

  return axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken.value}` }),
    },
  })
}
