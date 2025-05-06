"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { PRICE_MODAL } from "@/constant/campaign"
import { IOfferForm } from "@/validations/offer.validation"
import { addDays, format } from "date-fns"
import { vi } from "date-fns/locale"
import { AlertCircle, Check, ChevronsUpDown, DollarSign } from "lucide-react"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { cn, formatVNDCurrency } from "@/lib/utils"

import { useGetCampaignById } from "@/hooks/campaign"
import { useGetOfferById, useUpdateOfferForm } from "@/hooks/offer"

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

import { Editor } from "@/components/editor"
import { Spinner } from "@/components/spinner"

import { DatePickerWithRange } from "./date-range-picker"

type Props = {
  offerId: string
}

const EditOfferForm = ({ offerId }: Props) => {
  const router = useRouter()
  const {
    data: offerResponse,
    isLoading,
    isFetching,
  } = useGetOfferById(offerId)
  const { form, isPending, onUpdateOffer } = useUpdateOfferForm(
    Number(offerId),
    offerResponse?.data?.campaignId || 0
  )
  const { data: CampaignResponse } = useGetCampaignById(
    offerResponse?.data?.campaignId.toString() || ""
  )
  const disabledBefore = CampaignResponse?.data?.startDate || undefined
  const disabledAfter = CampaignResponse?.data?.endDate || undefined
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
  } = form
  const StartDate = watch("startDate")
  const EndDate = watch("endDate")

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
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false)
  const [showStepInfoPreview, setShowStepInfoPreview] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)

  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({
    from: addDays(new Date(), 2).toISOString(),
    to: addDays(new Date(), 21).toISOString(),
  })
  useEffect(() => {
    setValue("pricingModel", offerResponse?.data?.pricingModel || "")
    setValue("bid", offerResponse?.data?.bid.toString() || "")
    setValue("budget", offerResponse?.data?.budget.toString() || "")
    setValue("description", offerResponse?.data?.description || "")
    setValue("stepInfo", offerResponse?.data?.stepInfo || "")
    setValue(
      "orderReturnTime",
      offerResponse?.data?.orderReturnTime?.toString().split(" ")[0] || ""
    )
    setValue("startDate", offerResponse?.data?.startDate || "")
    setValue("endDate", offerResponse?.data?.endDate || "")
    setValue(
      "commissionRate",
      offerResponse?.data?.commissionRate?.toString() || ""
    )

    setShowStepInfoPreview(true)
    setShowDescriptionPreview(true)
    setDateRange({
      from: offerResponse?.data?.startDate || new Date().toISOString(),
      to: offerResponse?.data?.endDate || new Date().toISOString(),
    })
  }, [offerResponse, setValue])

  useEffect(() => {
    if (dateRange) {
      setValue("startDate", dateRange.from)
      setValue("endDate", dateRange.to)
    }
  }, [dateRange, setValue])

  const onSubmit = async (data: IOfferForm) => {
    try {
      const offerData = {
        ...data,
      }

      await onUpdateOffer(offerData)
    } catch (error) {
      console.error("Error update campaign:", error)
      toast.error("Failed to update campaign")
    }
  }

  const getDateRange = (): DateRange | undefined => {
    return {
      from: offerResponse?.data?.startDate
        ? new Date(offerResponse?.data?.startDate)
        : undefined,
      to: offerResponse?.data?.endDate
        ? new Date(offerResponse?.data?.endDate)
        : undefined,
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

  const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const formatCurrency = (inputValue: string, blur?: boolean) => {
    if (inputValue === "") return ""

    if (inputValue.indexOf(".") >= 0) {
      const [leftSide, originalRightSide] = inputValue.split(".")
      const formattedLeftSide = formatNumber(leftSide)
      let rightSide = formatNumber(originalRightSide)

      if (blur) {
        rightSide += "000"
      }

      rightSide = rightSide.substring(0, 3)
      return `${formattedLeftSide}.${rightSide}`
    } else {
      const formattedNumber = formatNumber(inputValue)
      if (blur) {
        return `${formattedNumber}.000`
      }
      return formattedNumber
    }
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    )
  }

  if (!offerResponse?.isSuccess || !offerResponse.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Failed to load update campaign details</span>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          return handleSubmit(onSubmit)(e)
        }}
        className="space-y-10"
      >
        <div className="border-b border-border pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Update offer
              </h1>
              <p className="text-sm text-muted-foreground">
                Update an offer by providing the basic details below.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name={"pricingModel"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Pricing Model
                </FormLabel>
                <Popover
                  open={isPriceModalOpen}
                  onOpenChange={(open) => setIsPriceModalOpen(open)}
                >
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
                        <span className="flex items-center gap-2">
                          <DollarSign className="size-4" />
                          {field.value || "Select pricing model"}
                        </span>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search pricing model" />
                      <CommandList>
                        <CommandEmpty>No pricing model found</CommandEmpty>
                        <CommandGroup>
                          {PRICE_MODAL.map((option) => (
                            <CommandItem
                              key={option.id}
                              value={option.name}
                              onSelect={() => {
                                form.setValue(`pricingModel`, option.name, {
                                  shouldValidate: true,
                                })
                                setIsPriceModalOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  option.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.name}
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

          <FormField
            control={form.control}
            name={
              form.watch(`pricingModel`) === "CPS" ? "bid" : "commissionRate"
            }
            render={({ field: { onChange, value, onBlur, ...field } }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  {form.watch(`pricingModel`) === "CPS"
                    ? "Commission Rate (%)"
                    : "Bid Amount"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {form.watch(`pricingModel`) === "CPS" ? "%" : "₫"}
                    </span>
                    <Input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder={
                        form.watch(`pricingModel`) === "CPS" ? "0.00" : "0.00"
                      }
                      value={value ? formatCurrency(value.toString()) : ""}
                      className="pl-8 pr-3 font-medium"
                      onChange={(e) => {
                        const input = e.target
                        const numericValue = input.value.replace(/[^\d.]/g, "")
                        const parts = numericValue.split(".")

                        if (parts.length > 2) parts.splice(2)

                        const isCPS = form.watch(`pricingModel`) === "CPS"

                        // Handle integer part
                        if (parts[0]) {
                          if (isCPS) {
                            // For CPS: limit to 3 digits and max 100
                            if (parts[0].length > 3) {
                              parts[0] = parts[0].slice(0, 3)
                            }
                            const numValue = parseInt(parts[0])
                            if (numValue > 100) {
                              parts[0] = "100"
                            }
                          } else {
                            // For other pricing models: limit to 10 digits and min 300
                            if (parts[0].length > 10) {
                              parts[0] = parts[0].slice(0, 10)
                            }
                            const numValue = parseInt(parts[0])
                            if (numValue < 300 && parts[0].length >= 3) {
                              parts[0] = "300"
                            }
                          }
                        }

                        // Handle decimal part
                        if (parts[1]) {
                          parts[1] = parts[1].slice(0, 2)
                        }

                        const finalValue = parts.join(".")
                        onChange(finalValue)
                      }}
                      onBlur={(e) => {
                        const input = e.target
                        const numericValue = input.value
                          .replace(/,/g, "")
                          .replace(/[^\d.]/g, "")
                        const parts = numericValue.split(".")

                        if (parts.length > 2) parts.splice(2)

                        const isCPS = form.watch(`pricingModel`) === "CPS"

                        // Handle integer part
                        if (parts[0]) {
                          if (isCPS) {
                            // For CPS: limit to 3 digits and max 100
                            if (parts[0].length > 3) {
                              parts[0] = parts[0].slice(0, 3)
                            }
                            const numValue = parseInt(parts[0])
                            if (numValue > 100) {
                              parts[0] = "100"
                            }
                          } else {
                            // For other pricing models: limit to 10 digits and min 300
                            if (parts[0].length > 10) {
                              parts[0] = parts[0].slice(0, 10)
                            }
                            const numValue = parseInt(parts[0])
                            if (numValue < 300) {
                              parts[0] = "300"
                            }
                          }
                        }

                        // Handle decimal part
                        if (parts[1]) {
                          parts[1] = parts[1].slice(0, 2)
                        }

                        const finalValue = parts.join(".")
                        onChange(finalValue)
                        onBlur()
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`budget`}
            render={({ field: { onChange, value, onBlur, ...field } }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₫
                    </span>
                    <Input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder={formatVNDCurrency(0)}
                      value={value ? formatCurrency(value.toString()) : ""}
                      onChange={(e) => {
                        const input = e.target
                        const numericValue = input.value.replace(/[^\d.]/g, "") // Remove non-numeric characters except "."
                        const parts = numericValue.split(".")
                        if (parts.length > 3) parts.splice(3) // Remove extra dots
                        if (parts[0].length > 10)
                          parts[0] = parts[0].slice(0, 10) // Max 10 digits before decimal
                        if (parts[1]) parts[1] = parts[1].slice(0, 3) // Max 3 digits after decimal

                        const finalValue = parts.join(".")
                        onChange(finalValue)
                      }}
                      onBlur={(e) => {
                        const input = e.target
                        const numericValue = input.value
                          .replace(/,/g, "")
                          .replace(/[^\d.]/g, "")
                        const parts = numericValue.split(".")
                        if (parts.length > 3) parts.splice(3) // Remove extra dots
                        if (parts[0].length > 10)
                          parts[0] = parts[0].slice(0, 10) // Max 10 digits before decimal
                        if (parts[1]) parts[1] = parts[1].slice(0, 3) // Max 3 digits after decimal

                        const finalValue = parts.join(".")
                        onChange(finalValue)
                        onBlur()
                      }}
                      className="w-full pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2 md:col-span-1">
            <FormLabel className="text-lg font-semibold">
              Offer Date Range
            </FormLabel>
            <DatePickerWithRange
              className="w-full"
              defaultDateRange={getDateRange()}
              onChange={(dates: {
                startDate: string
                endDate: string | null
              }) => {
                if (dates.startDate) {
                  // Update date range state
                  setDateRange({
                    from: new Date(dates.startDate).toISOString(),
                    to: dates.endDate
                      ? new Date(dates.endDate).toISOString()
                      : "",
                  })

                  // Update form values and force validation
                  form.setValue(`startDate`, dates.startDate, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })

                  if (dates.endDate) {
                    form.setValue(`endDate`, dates.endDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }

                  // Trigger validation for these fields
                  form.trigger(`startDate`)
                  form.trigger(`endDate`)
                }
              }}
              disabledBefore={
                disabledBefore || addDays(new Date(), 1).toISOString()
              }
              disabledAfter={disabledAfter}
            />
            <div className="mt-2 text-sm font-medium text-destructive">
              {form.formState.errors.startDate?.message ||
                form.formState.errors.endDate?.message ||
                ""}
            </div>
          </div>

          <FormField
            control={form.control}
            name={`stepInfo`}
            render={({ field }) => (
              <FormItem className="col-span-2 mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel className="text-lg font-semibold">
                    Step Information
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowStepInfoPreview(!showStepInfoPreview)
                    }}
                  >
                    {showStepInfoPreview ? "Edit Content" : "Show Preview"}
                  </Button>
                </div>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      // Trigger validation after value changes
                      form.trigger(`stepInfo`)
                    }}
                    preview={showStepInfoPreview || false}
                  />
                </FormControl>
                <FormMessage className="mt-2 block" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`description`}
            render={({ field }) => (
              <FormItem className="col-span-2 mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel className="text-lg font-semibold">
                    Description
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDescriptionPreview(!showDescriptionPreview)
                    }}
                  >
                    {showDescriptionPreview ? "Edit Content" : "Show Preview"}
                  </Button>
                </div>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      // Trigger validation after value changes
                      form.trigger(`description`)
                    }}
                    preview={showDescriptionPreview || false}
                  />
                </FormControl>
                <FormMessage className="mt-2 block" />
              </FormItem>
            )}
          />

          {form.watch(`pricingModel`) === "CPS" && (
            <FormField
              control={form.control}
              name={`orderReturnTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Order Return Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter return time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push(
                `/advertiser/campaigns/${offerResponse?.data?.campaignId}/offers/${offerId}`
              )
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
            {isPending ? "Updating..." : "Update Offer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditOfferForm
