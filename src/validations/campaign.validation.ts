import { z } from "zod"

import { OfferFormSchema } from "./offer.validation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]

// Helper function to validate HTML content (rich text editor)
const hasValidHtmlContent = (htmlContent: string): boolean => {
  if (!htmlContent) return false
  // Strip HTML tags and check if there's actual content
  const textContent = htmlContent.replace(/<[^>]*>/g, "").trim()
  return textContent.length > 0
}

export function TrackingParamSchema() {
  return z.object({
    param_value: z.string().min(1, "Parameter value is required"),
    param_name: z
      .string()
      .min(1, "Parameter name is required")
      .max(100, "Parameter name must be less than 100 characters")
      .regex(
        /^[a-zA-Z0-9\-_]+$/,
        "Parameter name can only contain letters, numbers, hyphens, and underscores"
      ),
  })
}

export function CreateCampaignFormSchema() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return z
    .object({
      advertiser_code: z.string().optional(),
      name: z
        .string({ message: "Campaign name is required" })
        .min(1, { message: "Campaign name is required" }),
      description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" })
        .refine(hasValidHtmlContent, {
          message: "Description must contain actual text content",
        }),
      category: z
        .string({ message: "Category is required" })
        .min(1, { message: "Category is required" }),
      startDate: z
        .string({ message: "Start date is required" })
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            return start >= tomorrow
          },
          { message: "Campaign start date must be at least tomorrow or later" }
        ),
      endDate: z
        .string({ message: "End date is required" })
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const end = new Date(endDate)
            end.setHours(0, 0, 0, 0)
            return end > today
          },
          { message: "End date must be in the future" }
        ),
      baseUrl: z
        .string()
        .url("Invalid URL format")
        .refine((baseUrl) => !baseUrl.endsWith("/"), {
          message: "URL should not end with a trailing slash",
        })
        // .refine((baseUrl) => !baseUrl.includes("?"), {
        //   message: t("validation.url.noQueryParams"),
        // })
        .optional(),
      tracking_param: z.array(TrackingParamSchema()).optional(),
      trackingParams: z.string().optional(),
      offers: z.array(OfferFormSchema()),
      images: z
        .array(z.any())
        .min(1, { message: "At least one campaign image is required" })
        .refine(
          (files) => {
            if (files.length === 0) return false
            return true
          },
          { message: "Campaign image is required" }
        ),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= startDate
      },
      { message: "End date must be after start date", path: ["endDate"] }
    )
}

export type ICreateCampaignForm = z.infer<
  ReturnType<typeof CreateCampaignFormSchema>
>

export function UpdateCampaignFormSchema() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return z
    .object({
      name: z
        .string({ message: "Campaign name is required" })
        .min(1, { message: "Campaign name is required" })
        .optional(),
      description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" })
        .refine(hasValidHtmlContent, {
          message: "Description must contain actual text content",
        })
        .optional(),
      start_date: z
        .string({ message: "Start date is required" })
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            return start >= tomorrow
          },
          { message: "Start date must be at least tomorrow or later" }
        )
        .optional(),
      end_date: z
        .string({ message: "End date is required" })
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const end = new Date(endDate)
            end.setHours(0, 0, 0, 0)
            return end > today
          },
          { message: "End date must be in the future" }
        )
        .optional(),
      baseUrl: z
        .string()
        .url("Invalid URL format")
        .refine((baseUrl) => !baseUrl.endsWith("/"), {
          message: "URL should not end with a trailing slash",
        })
        .optional(),
      tracking_params: z.array(TrackingParamSchema()).optional(),
      trackingParams: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.start_date && data.end_date) {
          const startDate = new Date(data.start_date)
          const endDate = new Date(data.end_date)
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(0, 0, 0, 0)
          return endDate >= startDate
        }
        return true
      },
      { message: "End date must be after start date", path: ["end_date"] }
    )
}

export type IUpdateCampaignForm = z.infer<
  ReturnType<typeof UpdateCampaignFormSchema>
>

