"use client"

import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { useAuth } from "@/providers/auth-provider"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { addDays, format } from "date-fns"
import { vi } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { useFieldArray } from "react-hook-form"
import { toast } from "sonner"

import { formatVNDCurrency } from "@/lib/utils"

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
import ImageUpload from "./image-upload"
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
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
  } = form
  const campaignStartDate = watch("startDate")
  const campaignEndDate = watch("endDate")
  const offers = watch("offers")

  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({
    from: addDays(new Date(), 2).toISOString(),
    to: addDays(new Date(), 21).toISOString(),
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { fields } = useFieldArray({
    control: form.control,
    name: "offers",
  })

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

  // Clear preview when component unmounts
  useEffect(() => {
    // We only need to revoke object URLs we've created ourselves
    // Don't revoke URLs for existing images from the server
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // Helper function for tracking parameters
  const safeTrackingParams = () => {
    const params = watch("tracking_param")
    return Array.isArray(params) ? params : []
  }

  const onSubmit = async (data: ICreateCampaignForm) => {
    try {
      console.log("Form data before processing:", data)

      // Transform offers data
      const transformedOffers = data.offers.map((offer) => {
        if (offer.pricingModel === "CPS") {
          return {
            ...offer,
            commissionRate: offer.bid, // Use bid value as commissionRate
            bid: "300", // Remove bid field for CPS
          }
        }
        return offer
      })

      const campaignData = {
        ...data,
        trackingParams: JSON.stringify(data.tracking_param),
        advertiserCode: user?.userCode,
        images: data.images,
        offers: transformedOffers,
        productUrl: data.baseUrl,
      }

      console.log("Campaign data:", campaignData)

      await onCreateCampaign(campaignData)
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("Failed to create campaign")
    }
  }

  // Check for existing images when needed
  useEffect(() => {
    const formImages = form.getValues("images")

    // If we have images in the form but no preview image, set it up
    if (formImages?.length > 0 && !previewImage) {
      const lastImage = formImages[formImages.length - 1]

      // If it's a File object, create a preview URL
      if (lastImage instanceof File) {
        const previewUrl = URL.createObjectURL(lastImage)
        setPreviewImage(previewUrl)
      }
      // If it's a string URL, use it directly
      else if (typeof lastImage === "string") {
        setPreviewImage(lastImage)
      }
    }
  }, [form, previewImage])

  // Create a more robust image tracking system
  // This useEffect handles revocation of previous blob URLs when a new image is set
  const lastBlobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    // If we have a new preview image that's a blob URL
    if (previewImage && previewImage.startsWith("blob:")) {
      // If we had a previous blob URL that's different, revoke it
      if (lastBlobUrlRef.current && lastBlobUrlRef.current !== previewImage) {
        URL.revokeObjectURL(lastBlobUrlRef.current)
      }

      // Update our reference to the current blob URL
      lastBlobUrlRef.current = previewImage
    }

    // When component unmounts, clean up any blob URL
    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current)
      }
    }
  }, [previewImage])

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

  // Create a more general image sync effect that works across all steps
  useEffect(() => {
    // Sync image preview with form data whenever the step changes
    const formImages = form.getValues("images")

    if (formImages?.length > 0 && !previewImage) {
      const lastImage = formImages[formImages.length - 1]

      // If the image is a File object, create a preview URL
      if (lastImage instanceof File) {
        console.log(
          `Creating preview URL for File object in step ${currentStep}`
        )
        const previewUrl = URL.createObjectURL(lastImage)
        setPreviewImage(previewUrl)
      }
      // If it's a string URL, use it directly
      else if (typeof lastImage === "string") {
        console.log(`Using string URL for preview in step ${currentStep}`)
        setPreviewImage(lastImage)
      }
    }
  }, [currentStep, form, previewImage])

  // Validate step fields before proceeding to next step
  const validateStep = async (stepNumber: number): Promise<boolean> => {
    let isValid = false

    switch (stepNumber) {
      case 1:
        // Validate Campaign Information fields
        isValid = await trigger([
          "name",
          "description",
          "startDate",
          "endDate",
          "images",
        ] as const)
        if (!isValid) {
          toast.error(
            "Please fill in all required campaign information fields correctly"
          )
        }
        break
      case 2:
        // Validate Tracking URL fields
        isValid = await trigger(["baseUrl", "tracking_param"] as const)
        if (!isValid) {
          toast.error("Please provide a valid tracking URL")
        }
        break
      case 3:
        // Validate Offers fields
        const offerCount = fields.length
        if (offerCount === 0) {
          toast.error("Please add at least one offer")
          return false
        }

        // Validate each offer's required fields
        const offerFields: string[] = []
        for (let i = 0; i < offerCount; i++) {
          offerFields.push(
            `offers.${i}.pricingModel`,
            `offers.${i}.bid`,
            `offers.${i}.budget`,
            `offers.${i}.description`
          )
        }

        isValid = await trigger(offerFields as any)
        if (!isValid) {
          toast.error("Please complete all required offer fields")
        }
        break
      case 4:
        // Final review step, no validation needed to proceed
        isValid = true
        break
      default:
        isValid = false
    }

    return isValid
  }

  // Handler for moving to next step with validation
  const handleNextStep = async (nextStep: number) => {
    const isCurrentStepValid = await validateStep(currentStep)

    if (isCurrentStepValid) {
      setCurrentStep(nextStep)
    }
  }

  // Render the content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
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
                    disabledBefore={addDays(new Date(), 2).toISOString()}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <FormField
                control={control}
                name="images"
                render={() => (
                  <ImageUpload
                    form={form}
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                  />
                )}
              />
            </div>

            <div className="pt-4">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleNextStep(2)
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
                  handleNextStep(3)
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
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-2xl font-medium text-accent-foreground">
                  <span>Campaign Offers</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {fields.length}
                  </span>
                </h3>
              </div>
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
                  handleNextStep(4)
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
          startDate?: string
          endDate?: string
          targetUrl?: string
        }

        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/20 p-6">
                <h3 className="text-lg font-medium">Campaign Details</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-full">
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
                        ? format(new Date(campaignStartDate), "dd/MM/yyyy", {
                            locale: vi,
                          })
                        : "Not set"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">End Date</dt>
                    <dd className="text-sm font-medium">
                      {campaignEndDate
                        ? format(new Date(campaignEndDate), "dd/MM/yyyy", {
                            locale: vi,
                          })
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
                  {/* Show campaign image if available */}
                  <div className="col-span-full mt-4">
                    <dt className="mb-2 text-sm text-muted-foreground">
                      Campaign Image
                    </dt>
                    <dd className="text-sm font-medium">
                      {previewImage ? (
                        <div className="relative h-60 w-full max-w-xl overflow-hidden rounded-md border">
                          <Image
                            src={previewImage}
                            alt="Campaign preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50/50 p-4 text-center dark:border-gray-700 dark:bg-gray-900/50">
                          <p className="text-muted-foreground">
                            No image provided
                          </p>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border bg-muted/20 p-6">
                <h3 className="text-lg font-medium">Tracking Information</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-full">
                    <dt className="text-sm text-muted-foreground">Base URL</dt>
                    <dd className="mt-1 break-all rounded bg-muted/50 p-3 font-mono text-xs">
                      {watch("baseUrl") || "No tracking URL configured"}
                    </dd>
                  </div>

                  {safeTrackingParams().length > 0 && (
                    <div className="col-span-full">
                      <dt className="text-sm text-muted-foreground">
                        Tracking Parameters
                      </dt>
                      <dd className="mt-1">
                        <ul className="space-y-1 text-sm">
                          {safeTrackingParams().map(
                            (
                              param: {
                                param_name: string
                                param_value: string
                              },
                              index: number
                            ) => (
                              <li
                                key={index}
                                className="rounded bg-muted/50 px-3 py-1.5 font-mono text-xs"
                              >
                                {param.param_name}: {param.param_value}
                              </li>
                            )
                          )}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border bg-muted/20 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Campaign Offers</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {offers?.length || 0} offers
                  </span>
                </div>
                {offers && offers.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {offers.map((offerItem, index) => {
                      const offer: OfferDisplay = offerItem || {}
                      return (
                        <div
                          key={index}
                          className="rounded-md border bg-background p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {index + 1}
                              </span>
                              <h4 className="font-medium">Offer Details</h4>
                            </div>
                            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                              {offer.pricingModel}
                            </span>
                          </div>
                          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <dt className="text-xs font-medium text-muted-foreground">
                                {offer.pricingModel === "CPS"
                                  ? "Commission Rate"
                                  : "Bid Amount"}
                              </dt>
                              <dd className="mt-1 text-sm font-medium">
                                {offer.pricingModel === "CPS"
                                  ? `${Number(offer.bid ?? 0)}%`
                                  : formatVNDCurrency(Number(offer.bid ?? 0))}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-muted-foreground">
                                Budget
                              </dt>
                              <dd className="mt-1 text-sm font-medium">
                                {offer.budget
                                  ? formatVNDCurrency(Number(offer.budget))
                                  : "Unlimited"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-muted-foreground">
                                Start Date
                              </dt>
                              <dd className="mt-1 text-sm">
                                {offer.startDate
                                  ? format(
                                      new Date(offer.startDate),
                                      "dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      }
                                    )
                                  : format(
                                      new Date(campaignStartDate),
                                      "dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      }
                                    )}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs font-medium text-muted-foreground">
                                End Date
                              </dt>
                              <dd className="mt-1 text-sm">
                                {offer.endDate
                                  ? format(
                                      new Date(offer.endDate),
                                      "dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      }
                                    )
                                  : format(
                                      new Date(campaignEndDate),
                                      "dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      }
                                    )}
                              </dd>
                            </div>
                            {offer.description && (
                              <div className="col-span-full">
                                <dt className="text-xs font-medium text-muted-foreground">
                                  Description
                                </dt>
                                <dd className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                                  {offer.description}
                                </dd>
                              </div>
                            )}
                            {offer.targetUrl && (
                              <div className="col-span-full">
                                <dt className="text-xs font-medium text-muted-foreground">
                                  Target URL
                                </dt>
                                <dd className="mt-1 break-all rounded-md bg-muted p-3 font-mono text-xs">
                                  {offer.targetUrl}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-md border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No offers have been added to this campaign yet.
                    </p>
                  </div>
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
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 px-6"
                onClick={async (e) => {
                  // Validate all form fields before final submission
                  const isFormValid = await trigger()
                  if (!isFormValid) {
                    e.preventDefault()
                    toast.error(
                      "Please complete all required fields before submitting"
                    )
                    return false
                  }
                }}
              >
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
        <div className="border-b border-border pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create Campaign
              </h1>
              <p className="text-sm text-muted-foreground">
                Create a new campaign by providing the basic details below.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-12">
          {/* Stepper (Left Column) */}
          <div className="col-span-12 md:sticky md:top-24 md:col-span-4 md:h-fit md:self-start lg:col-span-3">
            <Stepper
              value={currentStep}
              onValueChange={(step) => {
                // When clicking on a step in the stepper, validate only if going forward
                if (step > currentStep) {
                  handleNextStep(step)
                } else {
                  // Allow going back without validation
                  setCurrentStep(step)
                }
              }}
              orientation="vertical"
              className="max-h-[calc(100vh-8rem)] overflow-y-auto pb-4"
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
