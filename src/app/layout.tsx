import { ReactNode } from "react"

import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google"

import { constructMetadata } from "@/configs/site.config"
import ApiProvider from "@/providers/api-provider"
import AuthProvider from "@/providers/auth-provider"
import { ReactQueryClientProvider } from "@/providers/react-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"

import TailwindIndicator from "@/components/layouts/tailwind-indicator"

import "@/styles/globals.css"

const jakarta = JakartaSans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

export const metadata = constructMetadata()

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(jakarta.variable, "font-jakarta antialiased")}>
        <ReactQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <ApiProvider>
                <NuqsAdapter>
                  <Toaster />
                  <div className="relative flex min-h-svh flex-col bg-background">
                    {children}
                  </div>
                </NuqsAdapter>
              </ApiProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryClientProvider>
        <TailwindIndicator />
      </body>
    </html>
  )
}
