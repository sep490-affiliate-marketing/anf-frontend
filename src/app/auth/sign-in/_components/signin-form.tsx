"use client"

import { Suspense } from "react"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { useAuth } from "@/providers/auth-provider"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Inner component that uses useSearchParams
function SigninFormWithCallback({}) {
  const { loginForm, login, isLoggingIn } = useAuth()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const handleSubmit = loginForm.handleSubmit((data) => {
    login(data, callbackUrl)
  })

  return (
    <Form {...loginForm}>
      <form onSubmit={handleSubmit} className={cn("flex-1 space-y-6")}>
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </Label>
              <FormControl>
                <Input type="text" placeholder="abc@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mật khẩu
              </Label>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={isLoggingIn}
          isLoading={isLoggingIn}
          loadingText="Xác minh"
        >
          Đăng nhập
        </Button>

        <div className="flex items-center justify-center text-sm">
          <span className="text-dark-600">Mới với Denticare?</span>
          <Link
            href="/auth/sign-up"
            className="ml-2 text-primary hover:underline"
          >
            Tạo tài khoản
          </Link>
        </div>
      </form>
    </Form>
  )
}

// Wrapper component with Suspense
export function SigninForm() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SigninFormWithCallback />
    </Suspense>
  )
}
