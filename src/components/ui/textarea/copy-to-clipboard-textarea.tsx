"use client"

import { useRef, useState } from "react"

import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CopyToClipboardTextareaProps {
  value: any
  id?: string
  className?: string
  rows?: number
}

export function CopyToClipboardTextarea({
  value,
  id = "copyable-textarea",
  className,
  rows = 4,
}: CopyToClipboardTextareaProps) {
  const [copied, setCopied] = useState<boolean>(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const stringValue = typeof value === 'string' 
    ? value 
    : (value === null || value === undefined)
      ? ''
      : typeof value === 'object' 
        ? JSON.stringify(value, null, 2)
        : String(value)

  const handleCopy = () => {
    if (textareaRef.current) {
      navigator.clipboard.writeText(textareaRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        id={id}
        className={cn("pr-10", className)}
        rows={rows}
        value={stringValue}
        readOnly
        style={{ resize: "none" }}
      />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className={cn(
                "absolute right-2 top-2 flex items-center justify-center rounded-md",
                "text-muted-foreground/80 transition-colors hover:text-foreground",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "p-1.5 hover:bg-accent"
              )}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="px-2 py-1 text-xs">
            {copied ? "Copied!" : "Copy to clipboard"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
