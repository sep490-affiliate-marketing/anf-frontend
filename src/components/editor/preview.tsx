"use client"

import { useMemo } from "react"

import dynamic from "next/dynamic"

import "react-quill-new/dist/quill.bubble.css"

import { cn } from "@/lib/utils"

interface PreviewProps {
  value: string
  className?: string
}

export const Preview = ({ value, className }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  )

  return (
    <div className={cn("overflow-auto bg-white", className)}>
      <ReactQuill theme="bubble" value={value} readOnly />
    </div>
  )
}
