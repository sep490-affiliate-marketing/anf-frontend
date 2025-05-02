"use client"

import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { CAMPAIGN_CATEGORIES } from "@/constant/campaign"
import { useAuth } from "@/providers/auth-provider"
import { IUpdateCampaignForm } from "@/validations/campaign.validation"
import { addDays, format, set } from "date-fns"
import { ca, vi } from "date-fns/locale"
import { AlertCircle, Check, ChevronsUpDown } from "lucide-react"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { useGetCampaignById, useUpdateCampaignForm } from "@/hooks/campaign"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

import { Editor } from "@/components/editor"
import { DatePickerWithRange } from "../create-form/date-range-picker"
import ImageUpload from "../update-form/image-upload"
import TrackingUrlBuilder from "../update-form/tracking-url-builder"
import { Spinner } from "@/components/spinner"

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
    title: "Review & Confirm",
    description: "Check and submit campaign",
  },
]

type Props = {
    campaignId: string
}

const EditCampaignForm = ({ campaignId }: Props) => {
  const { form, isPending, onUpdateCampaign } = useUpdateCampaignForm(Number(campaignId))

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

  // Add a safe date formatting function to handle any potential invalid dates
  const safeFormatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not set"

    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }
      return format(date, "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false)

  const {
    data: campaignResponse,
    isLoading,
    isFetching,
  } = useGetCampaignById(campaignId)

  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({from: addDays(new Date(), 2).toISOString(),
      to: addDays(new Date(), 21).toISOString(),})
  useEffect(() => {
      setValue('name', campaignResponse?.data?.name || '');
      setValue('description', campaignResponse?.data?.description || '');
      setValue('category', '');
      setValue('categoryId', campaignResponse?.data?.categoryId || 1);
      setValue('startDate', campaignResponse?.data?.startDate || '');
      setValue('endDate', campaignResponse?.data?.endDate || '');
      setValue('productUrl', campaignResponse?.data?.productUrl || '');
      setValue('images', campaignResponse?.data?.campImages || []);
      setValue('trackingParams', campaignResponse?.data?.trackingParams || '');
      setValue(
        'tracking_params',
        typeof campaignResponse?.data?.trackingParams === 'string'
          ? JSON.parse(campaignResponse.data.trackingParams)
          : campaignResponse?.data?.trackingParams || []
      );
      console.log("campaignResponse.data:", campaignResponse?.data);
      setDateRange({
        from: campaignResponse?.data?.startDate || new Date().toISOString(),
        to: campaignResponse?.data?.endDate || new Date().toISOString(),
      })
      setShowDescriptionPreview(true)
  }, [campaignResponse, setValue]);

    useEffect(() => {
      if (dateRange) {
        setValue("startDate", dateRange.from)
        setValue("endDate", dateRange.to)
      }
    }, [dateRange, setValue])

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
    const params = watch("tracking_params")
    return Array.isArray(params) ? params : []
  }

  const onSubmit = async (data: IUpdateCampaignForm) => {
    try {
      const campaignData = {
        ...data,
        trackingParams: JSON.stringify(data.trackingParams),
        advertiserCode: user?.userCode,
        productUrl: data.productUrl,
        categoryId: data.categoryId,
      }

      await onUpdateCampaign(campaignData)
    } catch (error) {
      console.error("Error update campaign:", error)
      toast.error("Failed to update campaign")
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

  const getDateRange = (): DateRange | undefined => {
    return {
      from: campaignResponse?.data?.startDate ? new Date(campaignResponse?.data?.startDate) : undefined,
      to: campaignResponse?.data?.endDate ? new Date(campaignResponse?.data?.endDate) : undefined,
    }
  }
  // Handle date picker changes
  const handleDateChange = (dates: {
    startDate: string
    endDate: string | null
  }) => {
    console.log("Selected dates:", dates)
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

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    )
  }

  if (!campaignResponse?.isSuccess || !campaignResponse.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Failed to load update campaign details</span>
        </div>
      </div>
    )
  }

  // Validate step fields before proceeding to next step
  const validateStep = async (stepNumber: number): Promise<boolean> => {
    let isValid = false

    switch (stepNumber) {
      case 1:
        // Validate Campaign Information fields
        isValid = await trigger([
          "name",
          "description",
          "category",
          "endDate",
          "images",
        ] as const)

        // Check if description is empty or just contains HTML tags without actual content
        const descriptionValue = watch("description")
        if (
          !descriptionValue ||
          descriptionValue.replace(/<[^>]*>/g, "").trim() === ""
        ) {
          form.setError("description", {
            type: "manual",
            message: "Campaign description is required",
          })
          isValid = false
        }

        // Check specifically for images validation
        const formImages = form.getValues("images")
        if (!formImages || formImages.length === 0) {
          form.setError("images", {
            type: "manual",
            message: "Campaign image is required",
          })
          toast.error("Campaign image is required", {
            description: "Please upload an image before proceeding",
            duration: 3000,
          })
          return false
        }

        if (!isValid) {
          toast.error(
            "Please fill in all required campaign information fields correctly"
          )
        }
        break
      case 2:
        // Validate Tracking URL fields
        isValid = await trigger(["productUrl", "tracking_params"] as const)
        if (!isValid) {
          toast.error("Please provide a valid tracking URL")
        }
        break
      case 3:
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
              {/* Campaign name in a full row */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel className="text-base font-medium">
                      Campaign name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and Category in one row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormLabel className="text-base font-medium">
                    Campaign date range
                  </FormLabel>
                  <div className="mt-2">
                    <DatePickerWithRange
                      defaultDateRange={getDateRange()}
                      onChange={(dates) => {
                        // Update date range state
                        handleDateChange(dates)

                        // Update form values with validation
                        if (dates.startDate) {
                          setValue("startDate", dates.startDate, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }

                        if (dates.endDate) {
                          setValue("endDate", dates.endDate, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }

                        // Explicitly trigger validation
                        trigger(["startDate", "endDate"])
                      }}
                      className="w-full"
                    />
                    <div className="mt-2 text-sm font-medium text-destructive">
                      {errors.startDate?.message ||
                        errors.endDate?.message ||
                        ""}
                    </div>
                  </div>
                </div>

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Campaign Category
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? CAMPAIGN_CATEGORIES.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : "Select category..."}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {CAMPAIGN_CATEGORIES.map((category) => (
                                  <CommandItem
                                    key={category.value}
                                    value={category.value}
                                    onSelect={() => {
                                      setValue("category", category.value, {
                                        shouldValidate: true,
                                      })
                                      setValue("categoryId", 1, {
                                        shouldValidate: true,
                                      })
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        category.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2 flex items-center justify-between">
                      <FormLabel className="text-base font-medium">
                        Campaign description
                      </FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowDescriptionPreview(!showDescriptionPreview)
                        }
                      >
                        {showDescriptionPreview
                          ? "Edit Content"
                          : "Show Preview"}
                      </Button>
                    </div>
                    <FormControl>
                      <Editor
                        value={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value)
                          // Trigger validation after value changes
                          trigger("description")
                        }}
                        preview={showDescriptionPreview}
                      />
                    </FormControl>
                    <FormMessage className="mt-2 block" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Campaign Image <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        form={form}
                        previewImage={previewImage}
                        setPreviewImage={setPreviewImage}
                      />
                    </FormControl>
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
                      {safeFormatDate(campaignStartDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">End Date</dt>
                    <dd className="text-sm font-medium">
                      {safeFormatDate(campaignEndDate)}
                    </dd>
                  </div>
                  <div className="col-span-full">
                    <dt className="text-sm text-muted-foreground">
                      Description
                    </dt>
                    <dd className="whitespace-pre-wrap text-sm font-medium">
                      {watch("description") ? (
                        <div
                          className="ql-editor preview"
                          dangerouslySetInnerHTML={{
                            __html: watch("description") || "",
                          }}
                        />
                      ) : (
                        "No description provided"
                      )}
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
                      {watch("productUrl") || "No tracking URL configured"}
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
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentStep(2  )
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
                {isPending ? "Updating..." : "Update Campaign"}
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
          if (currentStep !== 3) {
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
                Update Campaign
              </h1>
              <p className="text-sm text-muted-foreground">
                Update an campaign by providing the basic details below.
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

export default EditCampaignForm