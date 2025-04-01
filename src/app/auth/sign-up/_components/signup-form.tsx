"use client"

import React, { useState } from "react"

import { UserRoleEnum } from "@/enums/user-role"
import { useAuth } from "@/providers/auth-provider"
import { ISignUpForm } from "@/validations/auth.validation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

import UserTypeCard from "./user-type-card"

export default function SignupForm() {
  const [step, setStep] = useState<number>(1)
  const { signup, signupForm, isSigningUp } = useAuth()

  const onSubmit = (data: ISignUpForm) => {
    signup(data)
  }

  return (
    <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-8">
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
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {/* First column */}
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

          <FormField
            control={signupForm.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
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

        {/* Second column */}
        <div className="space-y-4">
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

          <FormField
            control={signupForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={signupForm.control}
            name="passwordConfirmed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
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
