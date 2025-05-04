import { IUpdateCampaignForm } from "@/validations/campaign.validation"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

import { useUpdateTrackingUrlBuilder } from "@/hooks/tracking-url"

import AdvancedUrlBuilderForm from "./advanced-url-builder"

type TrackingUrlBuilderProps = {
  form: UseFormReturn<IUpdateCampaignForm>
}

export default function TrackingUrlBuilder({ form }: TrackingUrlBuilderProps) {
  const { generateUrl } = useUpdateTrackingUrlBuilder({ form })
  const {
    formState: { errors },
  } = form

  const isValid = !errors.productUrl

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <AdvancedUrlBuilderForm form={form} />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Generated Tracking URL</h3>
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