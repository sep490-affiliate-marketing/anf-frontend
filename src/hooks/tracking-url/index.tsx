import { useCallback } from "react"

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
  const generateUrl = useCallback(() => {
    try {
      const { baseUrl, tracking_param = [] } = form.watch()
      if (!baseUrl) return ""

      const url =
        encodeUrlSafely(baseUrl) +
        (baseUrl.includes("?") ? "&" : "?") +
        tracking_param
          ?.map((p) => `${p.param_name}={${p.param_value}}`)
          .join("&")
      return url
    } catch {
      return ""
    }
  }, [form])

  return { generateUrl }
}

type UseUpdateTrackingUrlBuilderProps = {
  form: UseFormReturn<IUpdateCampaignForm>
}

export const useUpdateTrackingUrlBuilder = ({
  form,
}: UseUpdateTrackingUrlBuilderProps) => {
  const generateUrl = useCallback(() => {
    try {
      const { productUrl, tracking_params = [] } = form.watch()
      if (!productUrl) return ""

      const url =
        encodeUrlSafely(productUrl) +
        (productUrl.includes("?") ? "&" : "?") +
        tracking_params
          ?.map((p) => `${p.param_name}={${p.param_value}}`)
          .join("&")
      return url
    } catch {
      return ""
    }
  }, [form])

  return { generateUrl }
}
