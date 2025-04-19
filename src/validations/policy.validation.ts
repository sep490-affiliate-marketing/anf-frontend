import { z } from "zod"

export function PolicyFormSchema() {
    return z
      .object({
        header: z
        .string({ message: "Subscription header is required" })
        .min(1, { message: "Subscription header is required" }),
        description: z
        .string({ message: "Description is required" })
        .min(1, { message: "Description is required" }),
    })
}

export type IPolicyForm = z.infer<ReturnType<typeof PolicyFormSchema>>