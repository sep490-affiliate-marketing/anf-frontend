import { z } from "zod"

import { OfferFormSchema } from "./offer.validation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

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
  return z
    .object({
      advertiser_code: z.string().optional(),
      name: z
        .string({ message: "Campaign name is required" })
        .min(1, { message: "Campaign name is required" }),
      description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" }),
      startDate: z
        .string({ message: "Start date is required" })
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const today = new Date()
            const start = new Date(startDate)
            const tomorrow = new Date(today)
            tomorrow.setDate(today.getDate() + 1)

            today.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            tomorrow.setHours(0, 0, 0, 0)

            return start >= tomorrow
          },
          { message: "Campaign start date must be at least 1 day after today" }
        ),
      endDate: z
        .string({ message: "End date is required" })
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const today = new Date()
            const end = new Date(endDate)
            today.setHours(0, 0, 0, 0)
            end.setHours(0, 0, 0, 0)
            return end >= today
          },
          { message: "End date cannot be in the past" }
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
      images: z.array(z.any()).optional().default([]),
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
  return z
    .object({
      name: z
        .string({ message: "Campaign name is required" })
        .min(1, { message: "Campaign name is required" })
        .optional(),
      description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" })
        .optional(),
      start_date: z
        .string({ message: "Start date is required" })
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const today = new Date()
            const start = new Date(startDate)
            today.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            return start >= today
          },
          { message: "Start date cannot be in the past" }
        )
        .optional(),
      end_date: z
        .string({ message: "End date is required" })
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const today = new Date()
            const end = new Date(endDate)
            today.setHours(0, 0, 0, 0)
            end.setHours(0, 0, 0, 0)
            return end >= today
          },
          { message: "End date cannot be in the past" }
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
