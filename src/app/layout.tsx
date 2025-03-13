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
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(jakarta.variable, "font-jakarta antialiased")}>
        <ReactQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <NextTopLoader height={4} color="#2dac5c" showSpinner={false} />
            <ApiProvider>
              <AuthProvider>
                <NuqsAdapter>
                  <Toaster />
                  <div className="relative flex min-h-svh flex-col bg-background">
                    {children}
                  </div>
                </NuqsAdapter>
              </AuthProvider>
            </ApiProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
