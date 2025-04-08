"use client"

import React, { useState } from "react"

import Link from "next/link"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { ISignUpForm } from "@/validations/auth.validation"
import { parseDate } from "@internationalized/date"
import { CalendarIcon } from "lucide-react"
import {
  Button as ButtonAria,
  DatePicker,
  Dialog,
  Group,
  Popover as PopoverAria,
} from "react-aria-components"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-rac"
import { DateInput } from "@/components/ui/datefield-rac"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

import { PasswordInput } from "@/components/inputs/password-input"

import UserTypeCard from "./user-type-card"

export default function SignupForm() {
  const [step, setStep] = useState<number>(1)
  const { signup, signupForm, isSigningUp } = useAuth()

  const onSubmit = (data: ISignUpForm) => {
    signup(data)
  }

  return (
    <Form {...signupForm}>
      <form
        onSubmit={signupForm.handleSubmit(onSubmit, (err) => {
          console.log(err)
        })}
        className="space-y-8"
      >
        {step === 1 && (
          <UserTypeSelection signupForm={signupForm} setStep={setStep} />
        )}
        {step === 2 && (
          <UserDetailsForm
            signupForm={signupForm}
            setStep={setStep}
            isSigningUp={isSigningUp}
          />
        )}
        <div className="flex items-center justify-center text-sm">
          <span className="text-dark-600">Already have an account?</span>
          <Link
            href="/auth/sign-in"
            className="ml-2 text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  )
}

interface StepProps {
  signupForm: UseFormReturn<ISignUpForm>
  setStep: (step: number) => void
}

interface UserDetailsFormProps extends StepProps {
  isSigningUp: boolean
}

function UserTypeSelection({ signupForm, setStep }: StepProps) {
  const { control, watch } = signupForm
  const selectedRole = watch("role")

  return (
    <React.Fragment>
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <div className="space-y-4">
                <UserTypeCard
                  setUserType={field.onChange}
                  userType={field.value as UserRoleEnum}
                  value={UserRoleEnum.PUBLISHER}
                  title="I am a Publisher"
                  text="I want to promote offers and earn commissions"
                />
                <UserTypeCard
                  setUserType={field.onChange}
                  userType={field.value as UserRoleEnum}
                  value={UserRoleEnum.ADVERTISER}
                  title="I am an Advertiser"
                  text="I want to create campaigns and offers for publishers"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          disabled={!selectedRole}
          onClick={() => setStep(2)}
        >
          Continue
        </Button>
      </div>
    </React.Fragment>
  )
}

function UserDetailsForm({
  signupForm,
  setStep,
  isSigningUp,
}: UserDetailsFormProps) {
  return (
    <React.Fragment>
      <ScrollArea className="h-[550px]">
        <div className="pb-2 pl-1 pr-4">
          {/* User Information Section */}
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-6 text-lg font-medium">User Information</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* First column - Personal Information */}
              <div className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Second column - Additional Information */}
              <div className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <DatePicker
                        className="*:not-first:mt-2"
                        value={
                          field.value
                            ? parseDate(field.value.toISOString().split("T")[0])
                            : undefined
                        }
                        onChange={(date) =>
                          field.onChange(
                            date ? new Date(date.toString()) : null
                          )
                        }
                      >
                        <div className="flex">
                          <Group className="w-full">
                            <DateInput className="pe-9" />
                          </Group>
                          <ButtonAria className="data-focus-visible:border-ring data-focus-visible:ring-ring/50 data-focus-visible:ring z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground">
                            <CalendarIcon size={16} />
                          </ButtonAria>
                        </div>
                        <PopoverAria
                          className="data-entering:animate-in data-exiting:animate-out outline-hidden z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
                          offset={4}
                        >
                          <Dialog className="max-h-[inherit] overflow-auto p-2">
                            <Calendar />
                          </Dialog>
                        </PopoverAria>
                      </DatePicker>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="citizenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizen ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your citizen ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Row */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address field - Full width */}
            <div className="mt-6">
              <FormField
                control={signupForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="mx-auto mt-8 max-w-4xl">
            <h3 className="mb-6 text-lg font-medium">Security Information</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="passwordConfirmed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mx-auto mt-8 flex max-w-4xl justify-between">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="submit" disabled={isSigningUp}>
          {isSigningUp ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </React.Fragment>
  )
}
