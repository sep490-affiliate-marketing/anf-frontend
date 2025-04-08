"use client"

import { useEffect, useState } from "react"

import { ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    // Use a more reliable method to scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

    // Fallback for browsers that don't support smooth scrolling
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-all duration-300",
        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "flex items-center justify-center",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="size-5" />
    </button>
  )
}
