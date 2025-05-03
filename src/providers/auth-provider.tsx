"use client"

import React, { useContext, useEffect } from "react"

import { useRouter } from "next/navigation"

import { errorMessage } from "@/constant/error-message"
import { authQueryKeys } from "@/constant/react-query"
import { UserRoleEnum } from "@/enums/user-role"
import {
  ILoginForm,
  ISignUpForm,
  LoginFormSchema,
  SignUpFormSchema,
} from "@/validations/auth.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Cookies from "js-cookie"
import { useForm, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { ILoginRes, IMeRes, IUserExtended } from "@/types/auth.type"

import apiClient from "@/lib/api/client"
import { initNotificationHub } from "@/lib/signalr/notification-hub"

import LogoutDialog from "@/components/dialogs/logout-dialog"

type AuthProviderProps = {
  children: React.ReactNode
  initUserData?: IUserExtended | null
}

type AuthContextType = {
  user: IUserExtended | null
  isLoadingUser: boolean
  logout: () => void
  isLoggingOut: boolean
  login: (data: ILoginForm, callbackUrl?: string | null) => void
  isLoggingIn: boolean
  loginForm: UseFormReturn<ILoginForm>
  signup: (data: ISignUpForm) => void
  isSigningUp: boolean
  signupForm: UseFormReturn<ISignUpForm>
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export default function AuthProvider({
  children,
  initUserData,
}: AuthProviderProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: userData, isFetching: isLoadingUser } = useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<IMeRes>(
          "/api/affiliate-network/users/me"
        )
        return data.value
      } catch {
        return null
      }
    },
    initialData: initUserData,
    enabled: !!Cookies.get("access_token"),
  })

  // Initialize SignalR connection when user is authenticated
  useEffect(() => {
    if (userData) {
      initNotificationHub(queryClient).startConnection()
      return () => {
        initNotificationHub(queryClient).stopConnection()
      }
    }
  }, [userData, queryClient])

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutation({
    mutationKey: authQueryKeys.logout(),
    mutationFn: async () => {
      try {
        const data = await apiClient.post<IBackendRes<void>>("/auth/logout")
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IBackendErrorRes)
            : null
        return {
          success: false,
          message: errRes?.message ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: () => {
      queryClient.clear()
      Cookies.remove("access_token")
      router.push("/auth/sign-in")
    },
  })

  const loginForm = useForm<ILoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm<ISignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      citizenId: "",
      dateOfBirth: new Date(2000, 0, 1),
      email: "",
      password: "",
      passwordConfirmed: "",
      address: "",
      role: "" as any,
    },
  })

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useMutation({
    mutationKey: authQueryKeys.login(),
    mutationFn: async (
      formData: ILoginForm
    ): Promise<ILoginRes | IBackendErrorRes> => {
      try {
        const { data } = await apiClient.post<ILoginRes>(
          "/api/affiliate-network/users/login",
          formData
        )
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IBackendErrorRes)
            : null

        return {
          isSuccess: false,
          message: errRes?.message ?? errorMessage.unknown,
          statusCode: errRes?.statusCode ?? 500,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: async (res) => {
      if (res.isSuccess === true) {
        const { accessToken } = res.value
        await Cookies.set("access_token", accessToken, {
          expires: 1, //1 hours
        })

        queryClient.setQueryData(authQueryKeys.me(), res.value)

        loginForm.reset()

        toast.success("Login successful")
      } else {
        toast.error(res.details)
      }
    },
  })

  const { mutateAsync: signupMutation, isPending: isSigningUp } = useMutation({
    mutationKey: authQueryKeys.register(),
    mutationFn: async (
      formData: ISignUpForm
    ): Promise<IBackendRes<void> | IBackendErrorRes> => {
      try {
        const { data } = await apiClient.post<IBackendRes<void>>(
          "/api/affiliate-network/users/account",
          formData
        )
        return data
      } catch (error) {
        const errRes =
          error instanceof AxiosError
            ? (error.response?.data as IBackendErrorRes)
            : null

        return {
          isSuccess: false,
          message: errRes?.message ?? errorMessage.unknown,
          statusCode: errRes?.statusCode ?? 500,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: (res) => {
      if (res.isSuccess === true) {
        signupForm.reset()
        toast.success("Successful", {
          description: "Successfully registered, please login to continue",
        })
        router.push("/auth/sign-in")
      } else {
        toast.error(res.details || res.message || "Registration failed")
      }
    },
  })

  // Custom login function that handles redirection with callbackUrl
  const login = async (formData: ILoginForm, callbackUrl?: string | null) => {
    const res = await loginMutation(formData)

    if (res.isSuccess === true) {
      if (callbackUrl) {
        router.push(callbackUrl)
      } else {
        const { role } = res.value
        if (role === UserRoleEnum.ADVERTISER) {
          router.push("/advertiser")
        } else if (role === UserRoleEnum.PUBLISHER) {
          router.push("/publisher")
        } else if (role === UserRoleEnum.ADMIN) {
          router.push("/admin")
        }
      }
      window.location.reload()
    }
  }

  // Custom signup function
  const signup = async (formData: ISignUpForm) => {
    await signupMutation(formData)
  }

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
        signup,
        isSigningUp,
        signupForm,
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
