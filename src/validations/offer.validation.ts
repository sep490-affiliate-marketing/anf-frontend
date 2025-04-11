import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export function OfferFormSchema() {
  return z
    .object({
      pricingModel: z
        .string({ required_error: "Pricing model is required" })
        .min(1, "Pricing model is required"),
      description: z
        .string({ required_error: "Description is required" })
        .min(1, "Description is required"),
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
            const today = new Date()
            const start = new Date(startDate)
            today.setHours(0, 0, 0, 0)
            start.setHours(0, 0, 0, 0)
            return start >= today
          },
          { message: "Start date cannot be in the past" }
        ),
      endDate: z
        .string()
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

      stepInfo: z
        .string({ required_error: "Step information is required" })
        .min(1, "Step information is required"),
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
