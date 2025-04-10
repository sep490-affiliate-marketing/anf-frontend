import * as React from "react"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type TimelineOrientation = "vertical" | "horizontal"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: TimelineOrientation
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        orientation === "vertical"
          ? "relative space-y-8 before:absolute before:inset-0 before:left-3.5 before:h-full before:w-px before:bg-border"
          : "relative flex space-x-8 before:absolute before:inset-0 before:left-0 before:top-3.5 before:h-px before:w-full before:bg-border",
        className
      )}
      {...props}
    />
  )
)
Timeline.displayName = "Timeline"

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isCompleted?: boolean
  orientation?: TimelineOrientation
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    { className, isCompleted = false, orientation = "vertical", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        orientation === "vertical"
          ? "relative pl-10"
          : "relative ml-3.5 flex-1 pt-10",
        className
      )}
      {...props}
    />
  )
)
TimelineItem.displayName = "TimelineItem"

interface TimelineIconProps extends React.HTMLAttributes<HTMLDivElement> {
  isCompleted?: boolean
  orientation?: TimelineOrientation
}

const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  (
    { className, isCompleted = false, orientation = "vertical", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full border",
        isCompleted
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background",
        orientation === "vertical"
          ? "absolute left-0"
          : "absolute left-0 top-0",
        className
      )}
      {...props}
    >
      {isCompleted && <Check className="h-4 w-4" />}
    </div>
  )
)
TimelineIcon.displayName = "TimelineIcon"

const TimelineDate = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mb-1 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TimelineDate.displayName = "TimelineDate"

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("mb-1 text-base font-medium leading-none", className)}
    {...props}
  />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineContent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
TimelineContent.displayName = "TimelineContent"

export {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
}
