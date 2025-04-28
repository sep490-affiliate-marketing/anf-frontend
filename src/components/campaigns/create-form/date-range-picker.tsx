"use client"

import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Button,
  DateRangePicker,
  Dialog,
  Group,
  Popover,
} from "react-aria-components"

import { cn } from "@/lib/utils"

import { RangeCalendar } from "@/components/ui/calendar-rac"
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac"

export interface DatePickerWithRangeProps {
  className?: string
  defaultDateRange?: { from?: Date; to?: Date }
  disabledBefore?: string
  disabledAfter?: string
  onChange?: (dates: { startDate: string; endDate: string | null }) => void
}

// Define RangeValue type to match React Aria's expectations
interface RangeValue<T extends DateValue> {
  start: T | null
  end: T | null
}

export function DatePickerWithRange({
  className,
  defaultDateRange,
  disabledBefore,
  disabledAfter,
  onChange,
}: DatePickerWithRangeProps) {
  // Get today's date for validation
  const currentDate = today(getLocalTimeZone())

  // Parse disabled dates
  const minDate = disabledBefore
    ? parseDate(format(new Date(disabledBefore), "yyyy-MM-dd"))
    : currentDate

  const maxDate = disabledAfter
    ? parseDate(format(new Date(disabledAfter), "yyyy-MM-dd"))
    : undefined

  // Convert default date range to CalendarDate
  const defaultValue = defaultDateRange
    ? {
        start: defaultDateRange.from
          ? parseDate(format(defaultDateRange.from, "yyyy-MM-dd"))
          : null,
        end: defaultDateRange.to
          ? parseDate(format(defaultDateRange.to, "yyyy-MM-dd"))
          : null,
      }
    : undefined

  // Handle value change
  const handleChange = (value: RangeValue<CalendarDate> | null) => {
    if (onChange && value?.start) {
      const startDate = new Date(
        value.start.year,
        value.start.month - 1,
        value.start.day
      )
      const endDate = value.end
        ? new Date(value.end.year, value.end.month - 1, value.end.day)
        : null

      onChange({
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString() || null,
      })
    }
  }

  // Format date for display
  const formatDisplayDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy")
  }

  // Get display value
  const displayValue =
    defaultDateRange?.from && defaultDateRange?.to
      ? `${formatDisplayDate(defaultDateRange.from)} - ${formatDisplayDate(defaultDateRange.to)}`
      : undefined

  return (
    <DateRangePicker
      className={cn("w-full", className)}
      minValue={minDate}
      maxValue={maxDate}
      defaultValue={defaultValue as any}
      onChange={handleChange as any}
    >
      <div className="relative flex">
        <Group className={cn(dateInputStyle, "pe-9")}>
          <DateInput slot="start" unstyled />
          <span aria-hidden="true" className="px-2 text-muted-foreground/70">
            -
          </span>
          <DateInput slot="end" unstyled />
        </Group>
      </div>
    </DateRangePicker>
  )
}
