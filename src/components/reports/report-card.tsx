"use client"

import { ReactNode } from "react"

import { ArrowDown, ArrowUp, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ReportCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  change?: number
  tooltip?: string
  className?: string
}

export function ReportCard({
  title,
  value,
  description,
  icon,
  change,
  tooltip,
  className,
}: ReportCardProps) {
  const isPositiveChange = change && change > 0
  const isNegativeChange = change && change < 0

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change !== undefined) && (
          <div className="flex items-center">
            {change !== undefined && (
              <span
                className={cn(
                  "mr-2 flex items-center text-xs",
                  isPositiveChange && "text-green-500",
                  isNegativeChange && "text-red-500"
                )}
              >
                {isPositiveChange && <ArrowUp className="mr-1 size-3" />}
                {isNegativeChange && <ArrowDown className="mr-1 size-3" />}
                {Math.abs(change)}%
              </span>
            )}
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
