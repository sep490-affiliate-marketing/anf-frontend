"use client"

import React, { useContext } from "react"

import { AuthService } from "@/services/auth.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { IUser } from "@/types/user.type"

import LogoutDialog from "@/components/dialogs/logout-dialog"

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  user: IUser | null
  isLoading: boolean
  isLoggingOut: boolean
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => AuthService.getUser(),
  })

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear()
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isLoggingOut,
        logout,
      }}
    >
      {children}
      <LogoutDialog isOpen={isLoggingOut} />
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
