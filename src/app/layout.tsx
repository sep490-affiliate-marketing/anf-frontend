import { Plus_Jakarta_Sans as JakartaSans } from "next/font/google"

import { constructMetadata } from "@/configs/site.config"
import { ReactQueryClientProvider } from "@/providers/react-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"

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
            <NextTopLoader height={4} color="#ea580c" showSpinner={false} />
            <NuqsAdapter>
              <div className="relative flex min-h-svh flex-col bg-background">
                {children}
              </div>
            </NuqsAdapter>
            <TailwindIndicator />
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
