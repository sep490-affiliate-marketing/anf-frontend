import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { UserRole } from "@/enums/user-role"
import { env } from "@/env"
import { jwtVerify } from "jose"

export interface JwtPayload {
  // User identifiers
  primarysid: string // Primary SID (e.g. "8771465403")
  nameid: string // Name ID (e.g. "59CF89CFF5")
  email: string // User email (e.g. "admin@gmail.com")

  // User role
  role: UserRole

  // Token timing fields
  nbf: number // Not Before timestamp
  exp: number // Expiration timestamp
  iat: number // Issued At timestamp

  // Token metadata
  iss: string // Issuer (e.g. "http://localhost:5272;https://localhost:7064")
  aud: string // Audience (e.g. "http://localhost:3000")

  // Any other custom claims
  [key: string]: any
}

/**
 * Verifies a JWT token using the application secret
 * @param token The token to verify
 * @returns The decoded token payload if valid, null if invalid
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    // Create a TextEncoder
    const encoder = new TextEncoder()
    // Convert the JWT_SECRET to a Uint8Array
    const secretKey = encoder.encode(env.JWT_SECRET)

    // Verify the token
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    })

    // Check if token is not expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp > currentTime) {
      return payload as JwtPayload
    } else {
      console.error("JWT token expired")
      return null
    }
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

/**
 * Gets and verifies the current user's token from cookies
 * @returns The decoded token payload if a valid token exists, null otherwise
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * Checks if the current user is authenticated
 * @returns True if the user has a valid token, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Gets the user's role from their token
 * @returns The user's role if they have a valid token, null otherwise
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.role || null
}

/**
 * Gets the user's email from their token
 * @returns The user's email if they have a valid token, null otherwise
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.email || null
}

/**
 * Gets the user's primary SID from their token
 * @returns The user's primary SID if they have a valid token, null otherwise
 */
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.primarysid || null
}

/**
 * Helper function to handle invalid tokens in middleware
 * @param request The Next.js request object
 * @param redirectUrl The URL to redirect to
 * @returns A NextResponse with the token cookie deleted
 */
export function handleInvalidToken(
  request: NextRequest,
  redirectUrl: string
): NextResponse {
  const response = NextResponse.redirect(redirectUrl)

  // Clear the invalid token
  response.cookies.delete("access_token")

  return response
}
