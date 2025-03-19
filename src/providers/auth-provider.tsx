"use client"

import React, { useContext, useState } from "react"

import { AuthService } from "@/services/auth.service"
import { ILoginForm, LoginFormSchema } from "@/validations/auth.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CookiesProvider, useCookies } from "react-cookie"
import { useForm, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { IUser } from "@/types/user.type"

import LogoutDialog from "@/components/dialogs/logout-dialog"

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthContextType = {
  user: IUser | null
  isLoadingUser: boolean
  logout: () => void
  isLoggingOut: boolean
  login: (data: ILoginForm) => void
  isLoggingIn: boolean
  loginForm: UseFormReturn<ILoginForm>
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [cookies, setCookie] = useCookies(["access_token"])

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await AuthService.getUser()

      if ("data" in response) {
        return response.data.value
      }
      return null
    },

    enabled: !!cookies.access_token,
  })

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear()
    },
  })

  const loginForm = useForm<ILoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILoginForm) => AuthService.login(data),
    onSuccess: (res) => {
      if (res.isSuccess === true) {
        setCookie("access_token", res.value.accessToken, {
          path: "/",
          maxAge: 60 * 60 * 45, // 45min
          sameSite: "lax",
        })

        // Store user data in localStorage only in browser environment
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(res.value))
        }

        queryClient.setQueryData(["me"], {
          ...res.value,
          userCode: res.value.userCode,
        })

        toast.success("Login successful")
      } else {
        toast.error(res.message)
      }
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user: userData ?? null,
        isLoadingUser,
        logout,
        isLoggingOut,
        login,
        isLoggingIn,
        loginForm,
      }}
    >
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        {children}
        <LogoutDialog isOpen={isLoggingOut} />
      </CookiesProvider>
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
