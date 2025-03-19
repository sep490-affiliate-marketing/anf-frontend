"use client"

import { useEffect, useState } from "react"

export const useGetLS = (key: string) => {
  const [value, setValue] = useState<any>(null)

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key)
        setValue(item ? JSON.parse(item) : null)
      } catch (error) {
        console.error("Error reading from localStorage:", error)
        setValue(null)
      }
    }
  }, [key])

  return value
}

export default useGetLS
