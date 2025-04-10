"use client"

import { AxiosError } from "axios"
import { toast } from "sonner"

import { errorMessage } from "@/constant/error-message"

/**
 * Extracts error details from an API error
 * @param error The error object from the API call
 * @returns An object containing the error message, status code, and details
 */
export function extractApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const errRes = error.response?.data as IBackendErrorRes | undefined
    
    return {
      message: errRes?.message ?? errRes?.details ?? errorMessage.unknown,
      statusCode: errRes?.statusCode ?? error.response?.status ?? 500,
      details: errRes?.details ?? errRes?.message ?? errorMessage.unknown,
    }
  }
  
  return {
    message: errorMessage.unknown,
    statusCode: 500,
    details: errorMessage.unknown,
  }
}

/**
 * Shows a toast notification for an API error
 * @param error The error object from the API call
 */
export function showApiErrorToast(error: unknown) {
  const { message, statusCode, details } = extractApiError(error)
  
  // Use details if available, otherwise use message
  const displayMessage = details !== errorMessage.unknown ? details : message
  
  // Show toast with status code if available
  toast.error(`Error ${statusCode}: ${displayMessage}`)
  
  return { message, statusCode, details }
}

/**
 * Creates a standardized error object from an API error
 * @param error The error object from the API call
 * @returns A standardized Error object with cause containing error details
 */
export function createApiError(error: unknown) {
  const { message, statusCode, details } = extractApiError(error)
  
  return new Error(details || message, {
    cause: {
      statusCode,
      details,
      message,
    },
  })
}
