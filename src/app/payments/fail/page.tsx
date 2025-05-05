"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const errorMessage =
    searchParams.get("message") || "Your payment could not be processed"
  const errorCode = searchParams.get("code") || "unknown_error"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Payment Failed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-600 sm:mt-5">
            We were unable to process your payment. Please try again or contact
            support.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error Details
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errorMessage}</p>
                      <p className="mt-1 text-xs text-red-600">
                        Error code: {errorCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  What you can do:
                </h3>
                <div className="mt-2 text-sm text-gray-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Check your payment information and try again</li>
                    <li>Verify that your card has sufficient funds</li>
                    <li>Try a different payment method</li>
                    <li>Contact your bank if the issue persists</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 border-t p-6 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Link
              href="/payments"
              className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
            >
              Return to Home
            </Link>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Contact our support team
            </Link>
          </p>
          <p className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Affiliate Network
          </p>
        </div>
      </div>
    </div>
  )
}
