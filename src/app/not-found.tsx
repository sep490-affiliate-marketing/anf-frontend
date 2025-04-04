import Link from "next/link"

import { Home } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          {/* Left column with visual element */}
          <div className="order-2 flex flex-col items-center md:order-1 md:items-end">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-purple-200 opacity-70 blur-xl"></div>
              <h1 className="relative text-[140px] font-bold leading-none tracking-tighter text-purple-600 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-[180px]">
                404
              </h1>
            </div>
            <div className="my-6 h-1 w-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 delay-150 duration-700 animate-in fade-in slide-in-from-bottom-4"></div>
          </div>

          {/* Right column with content */}
          <div className="order-1 space-y-8 text-left delay-300 duration-700 animate-in fade-in slide-in-from-bottom-4 md:order-2">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-neutral-900 md:text-3xl">
                Page not found
              </h2>
              <p className="text-md text-neutral-600 md:text-lg">
                We couldn&apos;t find the page you&apos;re looking for. It might
                have been moved or doesn&apos;t exist.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className={buttonVariants({
                  className:
                    "inline-flex h-11 items-center gap-2 rounded-full bg-purple-600 px-6 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-200",
                })}
              >
                <Home className="size-4" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
