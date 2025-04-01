import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { GalleryVerticalEnd } from "lucide-react"

import SignupForm from "./_components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up to Affiliate Network",
}
export default function Page() {
  return (
    <div className="flex h-screen">
      <section className="flex flex-1 items-center justify-center bg-white px-8">
        <div className="w-full max-w-[800px] space-y-8">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Affiliate Network
          </Link>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              New to Affiliate Network?
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up to get started!
            </p>
          </div>

          <SignupForm />

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Affiliate Network
          </div>
        </div>
      </section>

      <div className="relative w-[390px]">
        <Image
          src="/images/bg-101.png"
          alt="101"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
