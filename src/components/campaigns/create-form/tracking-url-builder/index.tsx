import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { Link, Settings } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

import { useTrackingUrlBuilder } from "@/hooks/tracking-url"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import StatusBadge from "@/components/badge/status-badge"

import AdvancedUrlBuilderForm from "./advanced-url-builder"
import SimpleUrlBuilderForm from "./simple-url-builder"

type TrackingUrlBuilderProps = {
  form: UseFormReturn<ICreateCampaignForm>
}

export default function TrackingUrlBuilder({ form }: TrackingUrlBuilderProps) {
  const { mode, toggleMode, generateUrl } = useTrackingUrlBuilder({ form })
  const {
    formState: { errors },
  } = form

  const isValid = mode === "simple" ? !errors.url : !errors.baseUrl

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">
          Tracking URL Configuration
        </Label>
        <div className="flex items-center gap-4">
          <StatusBadge variant="orange" className="text-sm font-medium">
            {mode === "simple" ? "Simple Mode" : "Advanced Mode"}
          </StatusBadge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="gap-2"
          >
            {mode === "simple" ? (
              <>
                <Settings className="size-4" />
                Switch to Advanced
              </>
            ) : (
              <>
                <Link className="size-4" />
                Switch to Simple
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border px-5 py-4">
        {mode === "simple" ? (
          <SimpleUrlBuilderForm form={form} />
        ) : (
          <AdvancedUrlBuilderForm form={form} />
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Tracking URL</h3>
          </div>
          <pre
            className={cn(
              "whitespace-pre-wrap break-all rounded-lg bg-muted p-4 font-mono text-sm",
              !isValid &&
                "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {generateUrl() || "Invalid URL format. Please check your inputs."}
          </pre>
        </div>
      </div>
    </div>
  )
}
