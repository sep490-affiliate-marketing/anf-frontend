import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  variant: "success" | "warning" | "destructive" | "orange"
  children: React.ReactNode
  className?: string
}

export default function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"

  const statusClasses = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    destructive: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  }

  const dotClasses = {
    success: "bg-green-500 dark:bg-green-400",
    warning: "bg-yellow-500 dark:bg-yellow-400",
    destructive: "bg-red-500 dark:bg-red-400",
    orange: "bg-orange-500 dark:bg-orange-400",
  }

  return (
    <div className={cn(baseClasses, statusClasses[variant], className)}>
      <div className={cn("size-1.5 rounded-full", dotClasses[variant])} />
      {children}
    </div>
  )
}
