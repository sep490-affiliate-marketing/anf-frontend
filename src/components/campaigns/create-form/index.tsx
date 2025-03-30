"use client"

import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { useAuth } from "@/providers/auth-provider"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { addDays, format } from "date-fns"
import { ImageIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { useCreateCampaignForm } from "@/hooks/campaign"

import { Button } from "@/components/ui/button"
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
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { Textarea } from "@/components/ui/textarea"

import { DatePickerWithRange } from "./date-range-picker"
import OfferList from "./offer-list"
import TrackingUrlBuilder from "./tracking-url-builder"

const steps = [
  {
    step: 1,
    title: "Campaign Information",
    description: "Basic campaign details",
  },
  {
    step: 2,
    title: "Tracking URL",
    description: "Configure tracking parameters",
  },
  {
    step: 3,
    title: "Create Offers",
    description: "Set up campaign offers",
  },
  {
    step: 4,
    title: "Review & Confirm",
    description: "Check and submit campaign",
  },
]

const CampaignForm = () => {
  const { form, isPending, onCreateCampaign } = useCreateCampaignForm()

  const { user } = useAuth()

  const {
    control,
    formState: {},
    handleSubmit,
    watch,
    setValue,
  } = form
  const campaignStartDate = watch("startDate")
  const campaignEndDate = watch("endDate")
  const offers = watch("offers")

  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({
    from: addDays(new Date(), 1).toISOString(),
    to: addDays(new Date(), 21).toISOString(),
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (dateRange) {
      setValue("startDate", dateRange.from)
      setValue("endDate", dateRange.to)
    }
  }, [dateRange, setValue])

  useEffect(() => {
    if (offers && (campaignStartDate || campaignEndDate)) {
      offers.forEach((_, index) => {
        if (campaignStartDate) {
          setValue(`offers.${index}.startDate`, "")
        }
        if (campaignEndDate) {
          setValue(`offers.${index}.endDate`, "")
        }
      })
    }
  }, [campaignStartDate, campaignEndDate, offers, setValue])

  const onSubmit = async (data: ICreateCampaignForm) => {
    try {
      console.log("Form data before processing:", data)
      const campaignData = {
        ...data,
        trackingParams: JSON.stringify(data.tracking_param),
        advertiserCode: user?.userCode,
        images: data.images,
        offers: data.offers,
        productUrl: data.baseUrl,
      }

      console.log("Campaign data:", campaignData)

      await onCreateCampaign(campaignData)
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("Failed to create campaign")
    }
  }

  // Convert string dates to DateRange for DatePicker
  const getDateRangeForPicker = (): DateRange | undefined => {
    if (!dateRange.from && !dateRange.to) return undefined

    return {
      from: dateRange.from ? new Date(dateRange.from) : undefined,
      to: dateRange.to ? new Date(dateRange.to) : undefined,
    }
  }

  // Handle date picker changes
  const handleDateChange = (dates: {
    startDate: string
    endDate: string | null
  }) => {
    setDateRange({
      from: dates.startDate,
      to: dates.endDate || dates.startDate,
    })
  }

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP formats are allowed")
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviewImage(previewUrl)

    // Update form state
    const currentImages = form.getValues("images") || []
    form.setValue("images", [...currentImages, file], { shouldValidate: true })
  }

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // Add this helper function near the top of the component:
  const safeTrackingParams = () => {
    const params = watch("tracking_param")
    return Array.isArray(params) ? params : []
  }

  // Render the content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-medium">Campaign Information</h2>
              <p className="mt-1 text-muted-foreground">
                Create a new campaign by providing the basic details below.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Campaign name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter campaign name"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Campaign description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your campaign"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-base font-medium">
                  Campaign date range
                </FormLabel>
                <div className="mt-1.5">
                  <DatePickerWithRange
                    defaultDateRange={getDateRangeForPicker()}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <FormField
                control={control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Campaign image
                    </FormLabel>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex size-24 items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {previewImage ? (
                          <div className="relative size-full">
                            <Image
                              src={previewImage}
                              alt="Campaign preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <ImageIcon className="size-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mb-2 h-11"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <p className="text-sm text-muted-foreground">
                          Recommended: 1024x1024px, max 5MB, JPG or PNG format
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(2)
                }}
                className="h-11 px-6"
              >
                Continue
              </Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-medium">Tracking URL</h2>
              <p className="mt-1 text-muted-foreground">
                Configure your tracking parameters to monitor campaign
                performance effectively.
              </p>
            </div>

            <TrackingUrlBuilder form={form} />

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(1)
                }}
                className="h-11"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(3)
                }}
                className="h-11 px-6"
              >
                Continue
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-medium">Create Offers</h2>
              <p className="mt-1 text-muted-foreground">
                Set up the offers for your campaign including pricing, budgets,
                and conditions.
              </p>
            </div>

            <OfferList form={form} />

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(2)
                }}
                className="h-11"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(4)
                }}
                className="h-11 px-6"
              >
                Continue
              </Button>
            </div>
          </div>
        )
      case 4:
        // Type definition to ensure TypeScript recognizes offer properties
        interface OfferDisplay {
          pricingModel?: string
          bid?: string
          budget?: string
          description?: string
        }

        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-medium">Review & Confirm</h2>
              <p className="mt-1 text-muted-foreground">
                Please review your campaign details before final submission.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/20 p-6">
                <h3 className="text-lg font-medium">Campaign Details</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Campaign Name
                    </dt>
                    <dd className="text-sm font-medium">
                      {watch("name") || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Start Date
                    </dt>
                    <dd className="text-sm font-medium">
                      {campaignStartDate
                        ? format(new Date(campaignStartDate), "PPP")
                        : "Not set"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">End Date</dt>
                    <dd className="text-sm font-medium">
                      {campaignEndDate
                        ? format(new Date(campaignEndDate), "PPP")
                        : "Not set"}
                    </dd>
                  </div>
                  <div className="col-span-full">
                    <dt className="text-sm text-muted-foreground">
                      Description
                    </dt>
                    <dd className="whitespace-pre-wrap text-sm font-medium">
                      {watch("description") || "No description provided"}
                    </dd>
                  </div>
                  {previewImage && (
                    <div className="col-span-full mt-2">
                      <dt className="mb-2 text-sm text-muted-foreground">
                        Campaign Image
                      </dt>
                      <dd className="text-sm font-medium">
                        <div className="relative size-40 overflow-hidden rounded-md border">
                          <Image
                            src={previewImage}
                            alt="Campaign preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border bg-muted/20 p-6">
                <h3 className="text-lg font-medium">Tracking Information</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-full">
                    <dt className="text-sm text-muted-foreground">
                      Tracking URL
                    </dt>
                    <dd className="mt-1 break-all rounded bg-muted/50 p-3 font-mono text-xs">
                      {watch("url") ||
                        watch("baseUrl") ||
                        "No tracking URL configured"}
                    </dd>
                  </div>

                  {safeTrackingParams().length > 0 && (
                    <div className="col-span-full">
                      <dt className="text-sm text-muted-foreground">
                        Parameters
                      </dt>
                      <dd className="mt-1">
                        <ul className="space-y-1 text-sm">
                          {safeTrackingParams().map((param, index) => (
                            <li
                              key={index}
                              className="rounded bg-muted/50 px-3 py-1.5 font-mono text-xs"
                            >
                              {param.param_name}: {param.param_value}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border bg-muted/20 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Offers</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {offers?.length || 0} offers
                  </span>
                </div>
                {offers && offers.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {offers.map((offerItem, index) => {
                      // Safely cast to our display interface
                      const offer: OfferDisplay = offerItem || {}
                      return (
                        <div key={index} className="rounded-md border p-4">
                          <div className="mb-2 text-sm font-medium">
                            Offer {index + 1}
                          </div>
                          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div>
                              <dt className="text-xs text-muted-foreground">
                                Pricing Model
                              </dt>
                              <dd className="text-sm">
                                {offer.pricingModel || "Not set"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-muted-foreground">
                                Bid
                              </dt>
                              <dd className="text-sm">
                                ${offer.bid || "0.00"}
                              </dd>
                            </div>
                            {offer.budget && (
                              <div>
                                <dt className="text-xs text-muted-foreground">
                                  Budget
                                </dt>
                                <dd className="text-sm">${offer.budget}</dd>
                              </div>
                            )}
                            {offer.description && (
                              <div className="col-span-full">
                                <dt className="text-xs text-muted-foreground">
                                  Description
                                </dt>
                                <dd className="text-sm">{offer.description}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No offers have been added to this campaign.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(3)
                }}
                className="h-11"
              >
                Back
              </Button>
              <Button type="submit" disabled={isPending} className="h-11 px-6">
                {isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          // Only allow form submission from the submit button in the final step
          if (currentStep !== 4) {
            e.preventDefault()
            return false
          }
          return handleSubmit(onSubmit)(e)
        }}
        className="space-y-10"
      >
        <div className="grid grid-cols-12 gap-12">
          {/* Stepper (Left Column) */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <Stepper
              value={currentStep}
              onValueChange={setCurrentStep}
              orientation="vertical"
              className="sticky top-8"
            >
              {steps.map(({ step, title, description }) => (
                <StepperItem
                  key={step}
                  step={step}
                  className="not-last:flex-1 relative items-start"
                >
                  <StepperTrigger
                    className="items-start rounded pb-12 last:pb-0"
                    onClick={(e) => {
                      // Prevent form submission when clicking on steps
                      e.preventDefault()
                    }}
                  >
                    <StepperIndicator />
                    <div className="mt-0.5 space-y-0.5 px-2 text-left">
                      <StepperTitle>{title}</StepperTitle>
                      <StepperDescription>{description}</StepperDescription>
                    </div>
                  </StepperTrigger>
                  {step < steps.length && (
                    <StepperSeparator className="absolute inset-y-0 left-3 top-[calc(1.5rem+0.125rem)] -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                  )}
                </StepperItem>
              ))}
            </Stepper>
          </div>

          {/* Step Content (Right Column) */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {renderStepContent()}
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CampaignForm
