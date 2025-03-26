import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-video items-center justify-center rounded-lg bg-gray-50",
        className
      )}
    >
      <ImageIcon className="size-8 text-gray-400" />
    </div>
  )
}
