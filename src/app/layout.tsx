import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google"

import { constructMetadata } from "@/configs/site.config"
import ApiProvider from "@/providers/api-provider"
import AuthProvider from "@/providers/auth-provider"
import { ReactQueryClientProvider } from "@/providers/react-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { getCurrentUser } from "@/server/actions/me"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"

import ScrollToTop from "@/components/layouts/scroll-to-top"
import TailwindIndicator from "@/components/layouts/tailwind-indicator"

import "@/styles/globals.css"

const jakarta = JakartaSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
})

export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch user data server-side
  const userData = await getCurrentUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(jakarta.variable, "font-jakarta antialiased")}>
        <ReactQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <NextTopLoader height={4} color="#7c3aed" showSpinner={false} />
            <ApiProvider>
              <AuthProvider initUserData={userData}>
                <NuqsAdapter>
                  <Toaster />
                  <div className="relative flex min-h-svh flex-col bg-background">
                    {children}
                  </div>
                  <ScrollToTop />
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
