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

    console.log("accessToken", accessToken)

    if (!accessToken) {
      return null
    }

    // Make API request directly with improved caching and error handling
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

    // Handle different error scenarios
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Authentication or authorization error
        console.error(`Auth error: ${response.status}`)
        return null
      }

      // Other API errors
      console.error(`API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!data.isSuccess) {
      console.error(
        "API returned unsuccessful response:",
        data.message || "Unknown error"
      )
      return null
    }

    return data.value
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}
