import { useCallback, useState } from "react"

import {
  ICreateCampaignForm,
  IUpdateCampaignForm,
} from "@/validations/campaign.validation"
import { UseFormReturn } from "react-hook-form"

import { encodeUrlSafely } from "@/lib/utils"

type UseTrackingUrlBuilderProps = {
  form: UseFormReturn<ICreateCampaignForm>
}

export const useTrackingUrlBuilder = ({ form }: UseTrackingUrlBuilderProps) => {
  const [mode, setMode] = useState<"simple" | "advanced">("simple")

  const generateUrl = useCallback(() => {
    if (mode === "simple") {
      return encodeUrlSafely(form.getValues("url") || "")
    }

    try {
      const { baseUrl, tracking_params } = form.watch()
      if (!baseUrl) return ""

      const url =
        encodeUrlSafely(baseUrl) +
        (baseUrl.includes("?") ? "&" : "?") +
        tracking_params
          ?.map((p) => `${p.param_name}={${p.param_value}}`)
          .join("&")
      return url
    } catch {
      return ""
    }
  }, [mode, form])

  const toggleMode = useCallback(() => {
    const newMode = mode === "simple" ? "advanced" : "simple"

    if (newMode === "simple") {
      form.setValue("baseUrl", undefined)
      form.setValue("tracking_params", undefined)
    } else {
      form.setValue("url", undefined)
    }

    if (mode === "simple") {
      try {
        const url = new URL(form.getValues("url") || "")
        form.setValue("baseUrl", `${url.origin}${url.pathname}`)

        // Convert URL parameters to advanced mode format
        const tracking_params = Array.from(url.searchParams.entries()).map(
          ([param_value]) => ({
            param_value,
            param_name: "",
          })
        )
        form.setValue("tracking_params", tracking_params)
      } catch (error) {
        form.setValue("baseUrl", "")
        form.setValue("tracking_params", [])
      }
    } else {
      try {
        const generatedUrl = generateUrl()
        form.setValue("url", generatedUrl)
      } catch (error) {
        form.setValue("url", "")
      }
    }

    setMode(newMode)
  }, [mode, form, generateUrl])

  return { mode, toggleMode, generateUrl }
}

type UseUpdateTrackingUrlBuilderProps = {
  form: UseFormReturn<IUpdateCampaignForm>
  mode: "simple" | "advanced"
}

export const useUpdateTrackingUrlBuilder = ({
  form,
  mode,
}: UseUpdateTrackingUrlBuilderProps) => {
  const generateUrl = useCallback(() => {
    if (mode === "simple") {
      return encodeUrlSafely(form.getValues("url") || "")
    }

    try {
      const { baseUrl, tracking_params } = form.watch()
      if (!baseUrl) return ""

      const url =
        encodeUrlSafely(baseUrl) +
        (baseUrl.includes("?") ? "&" : "?") +
        tracking_params
          ?.map((p) => `${p.param_name}={${p.param_value}}`)
          .join("&")
      return url
    } catch {
      return ""
    }
  }, [mode, form])

  return { mode, generateUrl }
}
