"use client"

import React, { useContext } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { UserRoleEnum } from "@/enums/user-role"
import { AuthService } from "@/services/auth.service"
import { ILoginForm, LoginFormSchema } from "@/validations/auth.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await AuthService.getUser()

      if ("data" in response) {
        return response.data.value
      }
      return null
    },

    enabled: !!Cookies.get("access_token"),
  })

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear()
      Cookies.remove("access_token")
      router.push("/auth/login")
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
    onSuccess: async (res) => {
      if (res.isSuccess === true) {
        const { accessToken, role } = res.value
        await Cookies.set("access_token", accessToken)

        queryClient.setQueryData(["me"], res.value)

        if (callbackUrl) {
          router.push(callbackUrl)
        } else {
          if (role === UserRoleEnum.ADVERTISER) {
            router.push("/advertiser")
          } else if (role === UserRoleEnum.PUBLISHER) {
            router.push("/publisher")
          } else if (role === UserRoleEnum.ADMIN) {
            router.push("/admin")
          }
        }

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
