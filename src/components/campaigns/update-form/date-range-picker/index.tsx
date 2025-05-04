"use client"

import * as React from "react"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
  onChange,
  disabledBefore,
  disabledAfter,
  defaultDateRange,
}: {
  className?: string
  onChange?: (dates: { startDate: string; endDate: string | null }) => void
  disabledBefore?: string
  disabledAfter?: string
  defaultDateRange?: DateRange
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    defaultDateRange
  )

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    if (selectedDate?.from) {
      onChange?.({
        startDate: format(selectedDate.from, "yyyy-MM-dd"),
        endDate: selectedDate.to ? format(selectedDate.to, "yyyy-MM-dd") : null,
      })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent",
              "px-3 py-1 text-base shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:text-white md:text-sm",
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yy")
              )
            ) : (
              <span>pick Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border border-input bg-background p-0 shadow-md"
          align="start"
          sideOffset={4}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{
              before: disabledBefore ? new Date(disabledBefore) : new Date(),
              after: disabledAfter ? new Date(disabledAfter) : undefined,
            }}
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}