import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

// Helper function to validate HTML content (rich text editor)
const hasValidHtmlContent = (htmlContent: string): boolean => {
  if (!htmlContent) return false
  // Strip HTML tags and check if there's actual content
  const textContent = htmlContent.replace(/<[^>]*>/g, "").trim()
  return textContent.length > 0
}

export function OfferFormSchema() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return z
    .object({
      pricingModel: z
        .string({ required_error: "Pricing model is required" })
        .min(1, "Pricing model is required"),
      description: z
        .string({ required_error: "Description is required" })
        .min(1, "Description is required")
        .max(1000, {
          message: "Description must be less than 1000 characters",
        }),
      bid: z
        .string({ required_error: "Bid amount is required" })
        .min(1, "Bid amount is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue > 0
          },
          { message: "Value must be greater than 0" }
        ),
      startDate: z
        .string()
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            return start >= tomorrow
          },
          { message: "Start date must be at least tomorrow or later" }
        ),
      endDate: z
        .string()
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const end = new Date(endDate)
            end.setHours(0, 0, 0, 0)
            return end > today
          },
          { message: "End date must be in the future" }
        ),
      budget: z
        .string({ required_error: "Budget is required" })
        .min(1, "Budget is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue >= 1000
          },
          { message: "Budget must be at least 1000" }
        ),
      commissionRate: z.string().optional(),
      orderReturnTime: z.string().optional(),

      stepInfo: z
        .string({ required_error: "Step information is required" })
        .min(1, "Step information is required")
        .refine(hasValidHtmlContent, {
          message: "Step information must contain actual text content",
        }),
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

export type IOfferForm = z.infer<ReturnType<typeof OfferFormSchema>>

export function UpdateOfferFormSchema() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return z
    .object({
      pricingModel: z
        .string({ required_error: "Pricing model is required" })
        .min(1, "Pricing model is required"),
      description: z
        .string({ required_error: "Description is required" })
        .min(1, "Description is required")
        .refine(hasValidHtmlContent, {
          message: "Description must contain actual text content",
        }),
      bid: z
        .string({ required_error: "Bid amount is required" })
        .min(1, "Bid amount is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue > 0
          },
          { message: "Value must be greater than 0" }
        ),
      startDate: z
        .string()
        .min(1, { message: "Start date is required" })
        .refine(
          (startDate) => {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            return start >= tomorrow
          },
          { message: "Start date must be at least tomorrow or later" }
        ),
      endDate: z
        .string()
        .min(1, { message: "End date is required" })
        .refine(
          (endDate) => {
            const end = new Date(endDate)
            end.setHours(0, 0, 0, 0)
            return end > today
          },
          { message: "End date must be in the future" }
        ),
      budget: z
        .string({ required_error: "Budget is required" })
        .min(1, "Budget is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue >= 1000
          },
          { message: "Budget must be at least 1000" }
        ),
      commissionRate: z.string().optional(),
      orderReturnTime: z.string().optional(),

      stepInfo: z
        .string({ required_error: "Step information is required" })
        .min(1, "Step information is required")
        .refine(hasValidHtmlContent, {
          message: "Step information must contain actual text content",
        }),
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

export type IUpdateOfferForm = z.infer<ReturnType<typeof UpdateOfferFormSchema>>
