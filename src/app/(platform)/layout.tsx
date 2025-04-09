"use client"

import { usePathname } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"

import Footer from "@/components/layouts/footer"
import { AdminSidebar } from "@/components/layouts/sidebar/admin-sidebar"
import { AdvertiserSidebar } from "@/components/layouts/sidebar/advertiser-sidebar"
import { PublisherSidebar } from "@/components/layouts/sidebar/publisher-sidebar"
import { SiteHeader } from "@/components/layouts/site-header"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine which sidebar to show based on the path
  const isAdmin = pathname.startsWith("/admin")
  const isAdvertiser = pathname.startsWith("/advertiser")
  const isPublisher = pathname.startsWith("/publisher")

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SiteHeader />
      <div className="flex flex-1">
        <SidebarProvider>
          {isAdmin && <AdminSidebar />}
          {isAdvertiser && <AdvertiserSidebar />}
          {isPublisher && <PublisherSidebar />}

          <div className="flex flex-1 flex-col gap-4 bg-[#fafafa]">
            <main className="mx-auto w-full max-w-7xl bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
              {children}
              <Footer />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
