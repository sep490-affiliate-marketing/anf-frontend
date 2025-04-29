"use client"

import { useEffect, useState } from "react"

import { PRICE_MODAL } from "@/constant/campaign"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { addDays } from "date-fns"
import { Check, ChevronsUpDown, DollarSign, Trash2Icon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useFieldArray, UseFormReturn } from "react-hook-form"

import { cn, formatVNDCurrency } from "@/lib/utils"

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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Editor } from "@/components/editor"

import { DatePickerWithRange } from "../date-range-picker"

interface OfferListProps {
  form: UseFormReturn<ICreateCampaignForm>
  disabledBefore?: string
  disabledAfter?: string
  defaultDateRange?: DateRange
  isCountryLoading?: boolean
}

const OfferList = ({
  form,
  disabledBefore,
  disabledAfter,
  defaultDateRange,
}: OfferListProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offers",
  })

  const [isPriceModalOpen, setIsPriceModalOpen] = useState<
    Record<number, boolean>
  >({})

  const [showStepInfoPreview, setShowStepInfoPreview] = useState<
    Record<number, boolean>
  >({})
  const [showDescriptionPreview, setShowDescriptionPreview] = useState<
    Record<number, boolean>
  >({})

  // Get campaign start and end dates
  const campaignStartDate = form.watch("startDate")
  const campaignEndDate = form.watch("endDate")

  // Initialize date range state using campaign dates
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    // If defaultDateRange is provided, use it
    if (defaultDateRange?.from && defaultDateRange?.to) {
      return defaultDateRange
    }

    // Otherwise, try to use campaign start/end dates
    if (campaignStartDate && campaignEndDate) {
      return {
        from: new Date(campaignStartDate),
        to: new Date(campaignEndDate),
      }
    }

    // Fallback to empty state
    return {
      from: undefined,
      to: undefined,
    }
  })

  // Update offer dates whenever campaign dates or dateRange changes
  useEffect(() => {
    fields.forEach((field, index) => {
      if (dateRange.from && dateRange.to) {
        form.setValue(
          `offers.${index}.startDate`,
          dateRange.from.toISOString(),
          {
            shouldValidate: true,
          }
        )
        form.setValue(`offers.${index}.endDate`, dateRange.to.toISOString(), {
          shouldValidate: true,
        })
      } else if (campaignStartDate && campaignEndDate) {
        // If dateRange is not set but campaign dates are available, use those
        form.setValue(`offers.${index}.startDate`, campaignStartDate, {
          shouldValidate: true,
        })
        form.setValue(`offers.${index}.endDate`, campaignEndDate, {
          shouldValidate: true,
        })

        // Update dateRange to match campaign dates
        setDateRange({
          from: new Date(campaignStartDate),
          to: new Date(campaignEndDate),
        })
      }
    })
  }, [dateRange, form, fields, campaignStartDate, campaignEndDate])

  // Always ensure new offers get the campaign dates
  useEffect(() => {
    if (fields.length > 0 && campaignStartDate && campaignEndDate) {
      const latestIndex = fields.length - 1
      const hasStartDate = form.getValues(`offers.${latestIndex}.startDate`)

      if (!hasStartDate) {
        form.setValue(`offers.${latestIndex}.startDate`, campaignStartDate, {
          shouldValidate: true,
        })
        form.setValue(`offers.${latestIndex}.endDate`, campaignEndDate, {
          shouldValidate: true,
        })
      }
    }
  }, [fields.length, campaignStartDate, campaignEndDate, form])

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

  return (
    <div className="mt-16 space-y-8">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative space-y-8 rounded-xl border border-border p-6 shadow-sm transition-all md:p-8"
        >
          <div className="absolute -top-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
            Offer {index + 1}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`offers.${index}.pricingModel`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">Pricing Model</Label>
                  <Popover
                    open={isPriceModalOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsPriceModalOpen((prev) => ({
                        ...prev,
                        [index]: open,
                      }))
                    }
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
                                  form.setValue(
                                    `offers.${index}.pricingModel`,
                                    option.name,
                                    { shouldValidate: true }
                                  )
                                  setIsPriceModalOpen((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }))
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
              name={`offers.${index}.bid`}
              render={({ field: { onChange, value, onBlur, ...field } }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {form.watch(`offers.${index}.pricingModel`) === "CPS"
                      ? "Commission Rate (%)"
                      : "Bid Amount"}
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {form.watch(`offers.${index}.pricingModel`) === "CPS"
                          ? "%"
                          : "₫"}
                      </span>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder={
                          form.watch(`offers.${index}.pricingModel`) === "CPS"
                            ? "0.00"
                            : "0.00"
                        }
                        value={value ? formatCurrency(value.toString()) : ""}
                        className="pl-8 pr-3 font-medium"
                        onChange={(e) => {
                          const input = e.target
                          const numericValue = input.value.replace(
                            /[^\d.]/g,
                            ""
                          )
                          const parts = numericValue.split(".")

                          if (parts.length > 2) parts.splice(2)

                          const isCPS =
                            form.watch(`offers.${index}.pricingModel`) === "CPS"

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

                          const isCPS =
                            form.watch(`offers.${index}.pricingModel`) === "CPS"

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
              name={`offers.${index}.budget`}
              render={({ field: { onChange, value, onBlur, ...field } }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">Budget</Label>
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
                          const numericValue = input.value.replace(
                            /[^\d.]/g,
                            ""
                          ) // Remove non-numeric characters except "."
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
              <Label className="text-lg font-semibold">Offer Date Range</Label>
              <DatePickerWithRange
                className="w-full"
                onChange={(dates: {
                  startDate: string
                  endDate: string | null
                }) => {
                  if (dates.startDate) {
                    // Update date range state
                    setDateRange({
                      from: new Date(dates.startDate),
                      to: dates.endDate ? new Date(dates.endDate) : undefined,
                    })

                    // Update form values and force validation
                    form.setValue(
                      `offers.${index}.startDate`,
                      dates.startDate,
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                    )

                    if (dates.endDate) {
                      form.setValue(`offers.${index}.endDate`, dates.endDate, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }

                    // Trigger validation for these fields
                    form.trigger(`offers.${index}.startDate`)
                    form.trigger(`offers.${index}.endDate`)
                  }
                }}
                disabledBefore={
                  disabledBefore || addDays(new Date(), 1).toISOString()
                }
                disabledAfter={disabledAfter}
                defaultDateRange={
                  dateRange.from || dateRange.to
                    ? {
                        from: dateRange.from,
                        to: dateRange.to,
                      }
                    : undefined
                }
              />
              <div className="mt-2 text-sm font-medium text-destructive">
                {form.formState.errors.offers?.[index]?.startDate?.message ||
                  form.formState.errors.offers?.[index]?.endDate?.message ||
                  ""}
              </div>
            </div>

            <FormField
              control={form.control}
              name={`offers.${index}.stepInfo`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      Step Information
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowStepInfoPreview((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }}
                    >
                      {showStepInfoPreview[index]
                        ? "Edit Content"
                        : "Show Preview"}
                    </Button>
                  </div>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        // Trigger validation after value changes
                        form.trigger(`offers.${index}.stepInfo`)
                      }}
                      preview={showStepInfoPreview[index] || false}
                    />
                  </FormControl>
                  <FormMessage className="mt-2 block" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`offers.${index}.description`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-lg font-semibold">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDescriptionPreview((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }}
                    >
                      {showDescriptionPreview[index]
                        ? "Edit Content"
                        : "Show Preview"}
                    </Button>
                  </div>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        // Trigger validation after value changes
                        form.trigger(`offers.${index}.description`)
                      }}
                      preview={showDescriptionPreview[index] || false}
                    />
                  </FormControl>
                  <FormMessage className="mt-2 block" />
                </FormItem>
              )}
            />

            {form.watch(`offers.${index}.pricingModel`) === "CPS" && (
              <FormField
                control={form.control}
                name={`offers.${index}.orderReturnTime`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg font-semibold">
                      Order Return Time
                    </Label>
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

          {index > 0 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="mt-6 w-full transition-all hover:bg-red-600 sm:w-auto"
            >
              <Trash2Icon className="mr-2 size-4" />
              Remove Offer
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          append({
            description: "",
            bid: "0",
            startDate: "",
            endDate: "",
            budget: "",
            stepInfo: "",
            pricingModel: "",
          })
        }
        className="w-full"
      >
        Add New Offer
      </Button>
    </div>
  )
}

export default OfferList

