import { z } from "zod"

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type ILoginForm = z.infer<typeof LoginFormSchema>

export const SignUpFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters"),
    citizenId: z.string().min(13, "Citizen ID must be at least 13 characters"),
    dateOfBirth: z.string().date(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    passwordConfirmed: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmed, {
    message: "Passwords do not match",
    path: ["passwordConfirmed"],
  })

export type ISignUpForm = z.infer<typeof SignUpFormSchema>

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type IForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>
