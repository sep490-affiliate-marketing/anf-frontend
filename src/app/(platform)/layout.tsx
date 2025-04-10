"use client"

import Footer from "@/components/layouts/footer"
import { SiteHeader } from "@/components/layouts/site-header"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SiteHeader />
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-4">
          <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  )
}
