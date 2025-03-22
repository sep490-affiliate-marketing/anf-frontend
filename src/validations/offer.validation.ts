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
      // code: z.coerce.number(),
      pricingModel: z
        .string({ required_error: "validation.pricingModel.required" })
        .min(1, "validation.pricingModel.required"),
      description: z
        .string({ required_error: "validation.description.required" })
        .min(1, "validation.description.required"),
      bid: z
        .string({ required_error: "validation.bid.required" })
        .min(1, "validation.bid.required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue >= 1000
          },
          { message: "Bid must be at least 1000" }
        ),
      startDate: z
        .string()
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
      endDate: z
        .string()
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
      budget: z
        .string({ required_error: "validation.budget.required" })
        .min(1, "validation.budget.required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue >= 1000
          },
          { message: "Budget must be at least 1000" }
        ),
      stepInfo: z
        .string({ required_error: "validation.stepInfo.required" })
        .min(1, "validation.stepInfo.required"),
      // thumbnail: z
      //   .union([
      //     z
      //       .custom<File>((value) => value instanceof File, {
      //         message: "Must be a valid file",
      //       })
      //       .refine((file) => file.size <= MAX_FILE_SIZE, {
      //         message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      //       })
      //       .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      //         message: "Only .jpg, .jpeg, .png and .webp files are accepted",
      //       }),
      //     z.string(),
      //   ])
      //   .optional(),
      // offer_type: z
      //   .string({ message: "validation.type.required" })
      //   .min(1, { message: "validation.type.required" }),
      // country: z
      //   .string({ message: "validation.country.required" })
      //   .min(1, { message: "validation.country.required" }),
      // carrier: z
      //   .string({ message: "validation.carrier.required" })
      //   .min(1, { message: "validation.carrier.required" }),
      // os: z
      //   .string({ message: "validation.os.required" })
      //   .min(1, { message: "validation.os.required" }),
      // network: z
      //   .string({ message: "validation.network.required" })
      //   .min(1, { message: "validation.network.required" }),
      // required_traffic_source: z.array(
      //   z
      //     .string({ message: "validation.requiredTrafficSource.required" })
      //     .min(1, { message: "validation.requiredTrafficSource.required" }),
      //   { message: "validation.requiredTrafficSource.required" }
      // ),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= startDate
      },
      { message: "validation.endDate.afterStartDate", path: ["endDate"] }
    )
}

export type IOfferForm = z.infer<ReturnType<typeof OfferFormSchema>>
