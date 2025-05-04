import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/configs/route.config"
import { UserRoleEnum } from "@/enums/user-role"

import { getCurrentUser } from "./server/actions/me"

/**
 * Middleware for handling route protection and authentication
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { nextUrl } = request
  const normalizedPath = pathname.toLowerCase()

  // Skip middleware for API authentication routes
  const isApiAuthRoute = apiAuthPrefix.some((path) =>
    normalizedPath.startsWith(path)
  )
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Check if current route is public or auth route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  )

  const isAuthRoute = authRoutes.some(
    (path) =>
      normalizedPath.startsWith(`/${path}`) || normalizedPath === `/${path}`
  )

  // Is this a login page? Used to prevent redirect loops
  const isLoginPage = normalizedPath.includes("login")

  // Check for authentication by calling the /me API endpoint
  const accessToken = request.cookies.get("access_token")?.value
  const userData = accessToken ? await getCurrentUser() : null
  const isLoggedIn = userData !== null

  // Handle auth routes: redirect to appropriate dashboard based on role if already logged in
  if (isAuthRoute) {
    if (isLoggedIn && userData) {
      const role = userData.role as UserRoleEnum
      const roleRedirect = getRoleRedirect(role)
      return NextResponse.redirect(new URL(roleRedirect, nextUrl))
    }
    return NextResponse.next()
  }

  // Handle public routes: redirect to role-specific dashboard if already logged in
  if (isPublicRoute) {
    if (isLoggedIn && userData) {
      const role = userData.role as UserRoleEnum
      const roleRedirect = getRoleRedirect(role)
      return NextResponse.redirect(new URL(roleRedirect, nextUrl))
    }
    return NextResponse.next()
  }

  // Handle protected routes: redirect to login if not logged in
  if (!isLoggedIn && !isPublicRoute) {
    // If not logged in and we're not already on the login page, redirect to login
    if (!isLoginPage) {
      let callbackUrl = nextUrl.pathname
      if (nextUrl.search) {
        callbackUrl += nextUrl.search
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      const loginUrl = new URL(
        `/auth/sign-in?callbackUrl=${encodedCallbackUrl}`,
        nextUrl
      ).toString()

      // Use helper function to handle invalid token (clears cookie and redirects)
      if (accessToken) {
        return createRedirectResponse(request, loginUrl)
      }

      // No token at all, just redirect
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check for role-specific routes and verify access
  if (isLoggedIn && userData) {
    const roleEnum = userData.role as UserRoleEnum
    const roleValue = userData.role.toString()

    // Check if user can access the requested path
    const hasAccess = canAccessPath(pathname, roleValue)

    if (!hasAccess) {
      // Redirect to appropriate dashboard for their role
      const roleRedirect = getRoleRedirect(roleEnum)
      return NextResponse.redirect(new URL(roleRedirect, nextUrl))
    }
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclude files, _next, telescope, and horizon
    "/((?!.+\\.[\\w]+$|_next|telescope/requests|horizon/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}

// Define role-based routes with proper typing using the enum
const ROLE_REDIRECTS: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADVERTISER]: "/advertiser",
  [UserRoleEnum.PUBLISHER]: "/publisher",
  [UserRoleEnum.ADMIN]: "/admin",
}

/**
 * Get the redirect URL for a user based on their role
 * @param role The user's role
 * @returns The appropriate redirect URL for the role
 */
export function getRoleRedirect(role: UserRoleEnum): string {
  return ROLE_REDIRECTS[role] || DEFAULT_LOGIN_REDIRECT
}

/**
 * Check if a user can access a specific path based on their role
 * @param path The path to check
 * @param roleValue The user's role value as a string
 * @returns Whether the user has access to the path
 */
export function canAccessPath(path: string, roleValue: string): boolean {
  // Admin can access everything
  if (roleValue === UserRoleEnum.ADMIN) {
    return true
  }

  // Check route-specific permissions
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.startsWith("/advertiser")) {
    return roleValue === UserRoleEnum.ADVERTISER
  }

  if (normalizedPath.startsWith("/publisher")) {
    return roleValue === UserRoleEnum.PUBLISHER
  }

  if (normalizedPath.startsWith("/admin")) {
    return roleValue === UserRoleEnum.ADMIN
  }

  // For other paths, allow access
  return true
}

/**
 * Creates a redirect response while clearing invalid tokens
 * @param request The Next.js request object
 * @param redirectUrl The URL to redirect to
 * @returns A NextResponse with the token cookie deleted
 */
export async function createRedirectResponse(
  request: NextRequest,
  redirectUrl: string
): Promise<NextResponse> {
  const response = NextResponse.redirect(redirectUrl)

  // Clear the invalid token
  response.cookies.delete("access_token")

  return response
}
