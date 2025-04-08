import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { SigninForm } from "./_components/signin-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Affiliate Network",
}
export default function Page() {
  return (
    <div className="flex h-screen">
      <section className="flex w-1/2 items-center justify-center bg-white px-8">
        <div className="w-full max-w-[400px] space-y-8">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="relative size-8 items-center justify-center">
              <Image src="/logo.png" alt="Logo" fill />
            </div>
            Affiliate Network
          </Link>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          <SigninForm />

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Affiliate Network
          </div>
        </div>
      </section>

      <div className="relative hidden w-1/2 lg:block">
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
