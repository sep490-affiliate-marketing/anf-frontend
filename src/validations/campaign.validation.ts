import { z } from "zod"

import { OfferFormSchema } from "./offer.validation"

export function TrackingParamSchema() {
  return z.object({
    param_value: z.string().min(1, "validation.paramValue.required"),
    param_name: z
      .string()
      .min(1, "validation.paramName.required")
      .max(100, "validation.paramName.maxLength")
      .regex(/^[a-zA-Z0-9\-_]+$/, "validation.paramName.regex"),
  })
}

export function CreateCampaignFormSchema() {
  return z
    .object({
      name: z
        .string({ message: "validation.name.required" })
        .min(1, { message: "validation.name.required" }),
      description: z
        .string({ message: "validation.description.required" })
        .min(1, { message: "validation.description.required" }),
      start_date: z
        .string({ message: "validation.startDate.required" })
        .min(1, { message: "validation.startDate.required" })
        .refine(
          (startDate) => {
            const today = new Date()
            const start = new Date(startDate)
            today.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            return start >= today
          },
          { message: "validation.startDate.notInPast" }
        ),
      end_date: z
        .string({ message: "validation.endDate.required" })
        .min(1, { message: "validation.endDate.required" })
        .refine(
          (endDate) => {
            const today = new Date()
            const end = new Date(endDate)
            today.setHours(0, 0, 0, 0)
            end.setHours(0, 0, 0, 0)
            return end >= today
          },
          { message: "validation.endDate.notInPast" }
        ),
      // Simple mode fields
      url: z
        .string()
        .url("validation.url.invalid")
        .refine((url) => !url.endsWith("/"), {
          message: "validation.url.noTrailingSlash",
        })
        .optional(),
      // Advanced mode fields
      baseUrl: z
        .string()
        .url("validation.url.invalid")
        .refine((baseUrl) => !baseUrl.endsWith("/"), {
          message: "validation.url.noTrailingSlash",
        })
        // .refine((baseUrl) => !baseUrl.includes("?"), {
        //   message: t("validation.url.noQueryParams"),
        // })
        .optional(),
      tracking_params: z.array(TrackingParamSchema()).optional(),
      offers: z.array(OfferFormSchema()),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.start_date)
        const endDate = new Date(data.end_date)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= startDate
      },
      { message: "validation.endDate.afterStartDate", path: ["end_date"] }
    )
}

export type ICreateCampaignForm = z.infer<
  ReturnType<typeof CreateCampaignFormSchema>
>

export function UpdateCampaignFormSchema() {
  return z
    .object({
      name: z
        .string({ message: "validation.name.required" })
        .min(1, { message: "validation.name.required" })
        .optional(),
      description: z
        .string({ message: "validation.description.required" })
        .min(1, { message: "validation.description.required" })
        .optional(),
      start_date: z
        .string({ message: "validation.startDate.required" })
        .min(1, { message: "validation.startDate.required" })
        .refine(
          (startDate) => {
            const today = new Date()
            const start = new Date(startDate)
            today.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            return start >= today
          },
          { message: "validation.startDate.notInPast" }
        )
        .optional(),
      end_date: z
        .string({ message: "validation.endDate.required" })
        .min(1, { message: "validation.endDate.required" })
        .refine(
          (endDate) => {
            const today = new Date()
            const end = new Date(endDate)
            today.setHours(0, 0, 0, 0)
            end.setHours(0, 0, 0, 0)
            return end >= today
          },
          { message: "validation.endDate.notInPast" }
        )
        .optional(),
      // Simple mode fields
      url: z
        .string()
        .url("validation.url.invalid")
        .refine((url) => !url.endsWith("/"), {
          message: "validation.url.noTrailingSlash",
        })
        .optional(),
      // Advanced mode fields
      baseUrl: z
        .string()
        .url("validation.url.invalid")
        .refine((baseUrl) => !baseUrl.endsWith("/"), {
          message: "validation.url.noTrailingSlash",
        })
        .optional(),
      tracking_params: z.array(TrackingParamSchema()).optional(),
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
      { message: "validation.endDate.afterStartDate", path: ["end_date"] }
    )
}

export type IUpdateCampaignForm = z.infer<
  ReturnType<typeof UpdateCampaignFormSchema>
>
