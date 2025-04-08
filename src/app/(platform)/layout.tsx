import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import Footer from "@/components/layouts/footer"
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layouts/site-header"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SiteHeader />
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-4">
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  )
}
