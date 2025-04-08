import { Database, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyTable({
  title = "No data available",
  description = "No data found that matches your current filters.",
  onRefresh,
}: {
  title?: string
  description?: string
  onRefresh?: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
        <Database className="size-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description ?? "No data found that matches your current filters."}
      </p>
      <div className="mt-6 flex gap-3">
        {onRefresh && (
          <Button
            onClick={onRefresh}
            className="inline-flex items-center"
            variant="outline"
            size="sm"
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  )
}
