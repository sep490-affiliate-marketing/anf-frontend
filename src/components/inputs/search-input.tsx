import * as React from "react"

import { ArrowRightIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"

const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          className={cn("peer pe-9 ps-9", className)}
          placeholder="Search..."
          type="search"
          ref={ref}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
