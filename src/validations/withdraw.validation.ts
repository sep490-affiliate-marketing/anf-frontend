import { z } from "zod"

export const WithdrawRequestSchema = z.object({
  amount: z
    .number()
    .min(50000, "Minimum withdrawal amount is 50,000 VND")
    .max(10000000, "Maximum withdrawal amount is 10,000,000 VND"),
  bankingNo: z
    .string()
    .min(1, "Banking number is required")
    .regex(/^\d+$/, "Banking number must contain only digits"),
  beneficiaryBankCode: z.string().min(1, "Bank code is required"),
  beneficiaryBankName: z.string().min(1, "Bank name is required"),
})

export type IWithdrawRequestForm = z.infer<typeof WithdrawRequestSchema>

export const UpdateWithdrawalStatusSchema = z.object({
  transactionIds: z
    .array(z.number())
    .min(1, "At least one transaction ID is required"),
  status: z.string().min(1, "Status is required"),
  reason: z.string().optional(),
})

export type IUpdateWithdrawalStatusForm = z.infer<
  typeof UpdateWithdrawalStatusSchema
>
