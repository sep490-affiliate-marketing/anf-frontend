"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { format } from "date-fns"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetTransactionDetail } from "@/hooks/transaction"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Spinner } from "@/components/spinner"

// Define error type
interface ApiError extends Error {
  code?: string
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "dd/MM/yyyy")
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "HH:mm")
}

// Status mapping
const getStatusInfo = (status: number) => {
  switch (status) {
    case 4:
      return {
        label: "Completed",
        color: "text-green-600",
      }
    case 2:
      return {
        label: "Pending",
        color: "text-yellow-600",
      }
    case 3:
      return {
        label: "Failed",
        color: "text-red-600",
      }
    default:
      return {
        label: "-",
        color: "text-gray-600",
      }
  }
}

export default function SuccessPage() {
  const { transactionId } = useParams()
  const { user } = useAuth()
  const { data, isFetching, error } = useGetTransactionDetail(
    transactionId as string
  )

  // Get role-based transactions route
  const getTransactionsRoute = () => {
    if (!user) return "/transactions"

    switch (user.role) {
      case UserRoleEnum.ADVERTISER:
        return "/advertiser/transactions"
      case UserRoleEnum.PUBLISHER:
        return "/publisher/transactions"
      case UserRoleEnum.ADMIN:
        return "/admin/transactions"
      default:
        return "/transactions"
    }
  }

  // Extract transaction data from the response
  const transaction = data?.value

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <Spinner />
        <p className="mt-4 text-purple-900">Loading transaction details...</p>
      </div>
    )
  }

  if (error || !transaction) {
    const apiError = error as ApiError
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8 text-red-600"
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
              Transaction Not Found
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-600 sm:mt-5">
              We couldn&apos;t find the transaction you&apos;re looking for.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <svg
                        className="size-5 text-red-400"
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
                        <p>
                          {apiError?.message ||
                            "Transaction could not be found"}
                        </p>
                        <p className="mt-1 text-xs text-red-600">
                          Error code:{" "}
                          {apiError?.code || "TRANSACTION_NOT_FOUND"}
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
                      <li>Check if the transaction ID is correct</li>
                      <li>Try refreshing the page</li>
                      <li>View your transaction history</li>
                      <li>Contact support if the issue persists</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 border-t p-6 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Link
                href={getTransactionsRoute()}
                className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
              >
                View Transaction History
              </Link>
              <Link
                href={user ? `/${user.role.toLowerCase()}` : "/"}
                className="inline-flex w-full items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
              >
                Return to Home
              </Link>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="mt-8 text-xs text-gray-400">
              © {new Date().getFullYear()} Affiliate Network
            </p>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(transaction.status)

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <div
        className={`mx-auto max-w-2xl px-4 transition-all duration-500 ease-out sm:px-6 sm:py-16 lg:px-8`}
      >
        <div className="text-center">
          <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-900 sm:text-4xl">
            Payment Successful
          </h1>
          <p className="mt-3 text-base text-purple-700 sm:mt-5">
            Your wallet balance has been updated.
          </p>
          <p className="text-4xl font-bold text-purple-900 sm:mt-3">
            {formatVNDCurrency(transaction.amount)}
          </p>
        </div>

        <Card className="mt-12">
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-base font-semibold text-purple-900">
              Transaction Details
            </h2>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Transaction ID
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {transaction.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(transaction.createdAt)}{" "}
                  {formatTime(transaction.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={`mt-1 flex items-center text-sm font-medium ${statusInfo.color}`}
                >
                  <svg
                    className="mr-1.5 size-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {statusInfo.label}
                </p>
              </div>
            </div>
          </CardContent>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">User Code</p>
              <p className="text-sm text-gray-900">{transaction.userCode}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm text-gray-900">{transaction.reason}</p>
            </div>
          </div>

          <CardFooter className="flex justify-between border-t border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-900">
              Transaction Amount
            </p>
            <p className="text-base font-bold text-purple-900">
              {formatVNDCurrency(transaction.amount)}
            </p>
          </CardFooter>
        </Card>

        <div className="mt-12 flex flex-col items-center justify-center space-y-4">
          <Link
            href={getTransactionsRoute()}
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            View Transaction History
          </Link>

          <Link
            href={user ? `/${user.role.toLowerCase()}` : "/"}
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            Return to Home
          </Link>

          <p className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Affiliate Network
          </p>
        </div>
      </div>
    </div>
  )
}
