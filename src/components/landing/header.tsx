"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { motion } from "framer-motion"

import { buttonVariants } from "@/components/ui/button"

const NAV_ITEMS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
]

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavItems = () => (
    <>
      <div className="mr-2 flex items-center space-x-8">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group relative text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          </li>
        ))}
      </div>

      <li className="flex items-center space-x-4">
        <Link
          href="/auth/sign-in"
          className="relative text-sm font-medium text-gray-600 transition-all duration-300 hover:-translate-y-px hover:text-gray-900"
        >
          Sign In
        </Link>

        <Link
          className={buttonVariants({
            className:
              "bg-gradient-to-r from-purple-600 to-indigo-600 text-white transition-all duration-300 hover:-translate-y-px hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg",
            size: "sm",
          })}
          href="/auth/sign-up"
        >
          Get Started
        </Link>
      </li>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-8">
            <NavItems />
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        initial={false}
        animate={
          isMobileMenuOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        className={`lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          <ul className="flex flex-col space-y-4">
            <NavItems />
          </ul>
        </div>
      </motion.nav>
    </header>
  )
}
