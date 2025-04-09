"use server"

import { cookies } from "next/headers"

import { env } from "@/env"

import { IUserExtended } from "@/types/auth.type"

/**
 * Fetches current user data from the server
 * @returns The user data or null if not authenticated
 */
export async function getCurrentUser(): Promise<IUserExtended | null> {
  try {
    // Check if access token exists
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return null
    }

    // Make API request directly
    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/api/affiliate-network/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.isSuccess ? data.value : null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}
