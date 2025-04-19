"use client"

import { useState } from "react"

import * as z from "zod"
import { useAuth } from "@/providers/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { formatVNDCurrency } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const withdrawFormSchema = z.object({
  amount: z
    .number()
    .min(50000, "Minimum withdrawal amount is 50,000 VND")
    .max(10000000, "Maximum withdrawal amount is 10,000,000 VND"),
})

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>

export function WithdrawDialog() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: 50000,
    },
  })

  const onSubmit = async (data: WithdrawFormValues) => {
    try {
      setIsSubmitting(true)
      // TODO: Implement withdrawal API call
      console.log("Withdrawal request:", data)

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Withdrawal request submitted successfully")
      setIsOpen(false)
      form.reset()
    } catch (error) {
      toast.error("Failed to submit withdrawal request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Withdraw Request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Submit a request to withdraw funds from your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      min={50000}
                      max={10000000}
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value
                      ? `You will receive ${formatVNDCurrency(field.value)}`
                      : "Enter an amount to withdraw"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
