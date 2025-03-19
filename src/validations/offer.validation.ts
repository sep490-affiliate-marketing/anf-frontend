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
      price_modal: z
        .string()
        .min(1, { message: "validation.priceModal.required" }),
      payout_money: z
        .string()
        .min(1, { message: "validation.payoutMoney.required" }) // Ensures the field is not empty
        .regex(/^\d{1,6}(\.\d{1,3})?$/, {
          message: "validation.payoutMoney.invalid",
        }),
      start_date: z
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
      end_date: z
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
      offer_type: z
        .string({ message: "validation.type.required" })
        .min(1, { message: "validation.type.required" }),
      country: z
        .string({ message: "validation.country.required" })
        .min(1, { message: "validation.country.required" }),
      carrier: z
        .string({ message: "validation.carrier.required" })
        .min(1, { message: "validation.carrier.required" }),
      os: z
        .string({ message: "validation.os.required" })
        .min(1, { message: "validation.os.required" }),
      network: z
        .string({ message: "validation.network.required" })
        .min(1, { message: "validation.network.required" }),
      required_traffic_source: z.array(
        z
          .string({ message: "validation.requiredTrafficSource.required" })
          .min(1, { message: "validation.requiredTrafficSource.required" }),
        { message: "validation.requiredTrafficSource.required" }
      ),
      thumbnail: z
        .any()
        .refine((file) => file !== undefined && file !== null, {
          message: "validation.thumbnail.required",
        })
        .refine(
          (file) => file?.size <= MAX_FILE_SIZE,
          "validation.thumbnail.size"
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "validation.thumbnail.invalidImageType"
        ),
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

export type IOfferForm = z.infer<ReturnType<typeof OfferFormSchema>>
