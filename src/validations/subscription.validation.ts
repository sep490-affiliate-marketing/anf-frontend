import { z } from "zod"

export function SubscriptionFormSchema() {
    return z
      .object({
        name: z
        .string({ message: "Subscription name is required" })
        .min(1, { message: "Subscription name is required" }),
        description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" }),
        price: z
        .string({ required_error: "Price is required" })
        .min(1, "Price is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue >= 1000
          },
          { message: "Price must be at least 1000" }
        ),
        duration: z
        .string({ required_error: "Duration is required" })
        .min(1, "Duration is required")
        .refine(
          (value) => {
            const numValue = parseFloat(value)
            return !isNaN(numValue) && numValue > 0
          },
          { message: "Duration must be greater than 0" }
        )
    })
}

export type ISubscriptionForm = z.infer<ReturnType<typeof SubscriptionFormSchema>>