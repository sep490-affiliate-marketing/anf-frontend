"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { useParams } from "next/navigation"

import { format } from "date-fns"

import { formatVNDCurrency } from "@/lib/utils"

import { useGetTransactionDetail } from "@/hooks/transaction"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Spinner } from "@/components/spinner"

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
        label: "Unknown",
        color: "text-gray-600",
      }
  }
}

export default function SuccessPage() {
  const { transactionId } = useParams()
  const { data, isFetching, error } = useGetTransactionDetail(
    transactionId as string
  )

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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="mb-6 rounded-full bg-red-100 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Transaction Not Found
        </h1>
        <p className="mb-6 text-center text-gray-600">
          {error?.message ||
            "We couldn't find the transaction you're looking for."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Return to Home
        </Link>
      </div>
    )
  }

  const statusInfo = getStatusInfo(transaction.status)

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <div
        className={`mx-auto max-w-2xl transform px-4 transition-all duration-500 ease-out sm:px-6 sm:py-16 lg:px-8`}
      >
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
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
                <p className="text-sm font-medium text-gray-500">Wallet ID</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.walletId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={`mt-1 flex items-center text-sm font-medium ${statusInfo.color}`}
                >
                  <svg
                    className="mr-1.5 h-4 w-4 flex-shrink-0"
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
            href="/wallet"
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            View Transaction History
          </Link>

          <Link
            href="/"
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

