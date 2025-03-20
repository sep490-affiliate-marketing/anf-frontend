"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { AFFILIATE_SOURCE, NETWORK, PRICE_MODAL } from "@/constant/campaign"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import {
  Check,
  ChevronsUpDown,
  DollarSign,
  ImageIcon,
  Monitor,
  Phone,
  Trash2Icon,
  Users,
  Wifi,
} from "lucide-react"
import { DateRange } from "react-day-picker"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

  const [dateRange, setDateRange] = useState<DateRange>(
    defaultDateRange || {
      from: undefined,
      to: undefined,
    }
  )

  useEffect(() => {
    fields.forEach((field, index) => {
      if (dateRange.from && dateRange.to) {
        form.setValue(`offers.${index}.startDate`, dateRange.from.toISOString())
        form.setValue(`offers.${index}.endDate`, dateRange.to.toISOString())
      }
    })
  }, [dateRange, form, fields])

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
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-accent-foreground">
          <span>{"offersLabel"}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {fields.length}
          </span>
        </h3>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative space-y-8 rounded-xl border border-border p-6 shadow-sm transition-all md:p-8"
        >
          <div className="absolute -top-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
            {"offer"} {index + 1}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`offers.${index}.pricingModel`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"pricingModelLabel"}
                  </Label>
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
                            {field.value || "priceModalPlaceholder"}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchPriceModal"} />
                        <CommandList>
                          <CommandEmpty>{"noPriceModalFound"}</CommandEmpty>
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
                  <Label className="text-lg font-semibold">{"bidLabel"}</Label>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={value ? formatCurrency(value.toString()) : ""}
                        onChange={(e) => {
                          const input = e.target
                          const numericValue = input.value.replace(
                            /[^\d.]/g,
                            ""
                          ) // Remove non-numeric characters except "."
                          const parts = numericValue.split(".")
                          if (parts.length > 3) parts.splice(3) // Remove extra dots
                          if (parts[0].length > 6)
                            parts[0] = parts[0].slice(0, 6) // Max 6 digits before decimal
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
                          if (parts[0].length > 6)
                            parts[0] = parts[0].slice(0, 6) // Max 6 digits before decimal
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

            <FormField
              control={form.control}
              name={`offers.${index}.budget`}
              render={({ field: { onChange, value, onBlur, ...field } }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">{"bidLabel"}</Label>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={value ? formatCurrency(value.toString()) : ""}
                        onChange={(e) => {
                          const input = e.target
                          const numericValue = input.value.replace(
                            /[^\d.]/g,
                            ""
                          ) // Remove non-numeric characters except "."
                          const parts = numericValue.split(".")
                          if (parts.length > 3) parts.splice(3) // Remove extra dots
                          if (parts[0].length > 6)
                            parts[0] = parts[0].slice(0, 6) // Max 6 digits before decimal
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
                          if (parts[0].length > 6)
                            parts[0] = parts[0].slice(0, 6) // Max 6 digits before decimal
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

            <FormField
              control={form.control}
              name={`offers.${index}.stepInfo`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"stepInfoLabel"}
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`offers.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"descriptionLabel"}
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 md:col-span-1">
              <Label className="text-lg font-semibold">
                {"offerDateRangeLabel"}
              </Label>
              <DatePickerWithRange
                className="w-full"
                onChange={(dates: {
                  startDate: string
                  endDate: string | null
                }) =>
                  setDateRange({
                    from: new Date(dates.startDate),
                    to: dates.endDate ? new Date(dates.endDate) : undefined,
                  })
                }
                disabledBefore={disabledBefore}
                disabledAfter={disabledAfter}
              />
              {(form.formState.errors.offers?.[index]?.startDate?.message ||
                form.formState.errors.offers?.[index]?.endDate?.message) && (
                <FormMessage>
                  {form.formState.errors.offers?.[index]?.startDate?.message ||
                    form.formState.errors.offers?.[index]?.endDate?.message}
                </FormMessage>
              )}
            </div>
          </div>

          {index > 0 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="mt-6 w-full transition-all hover:bg-red-600 sm:w-auto"
            >
              <Trash2Icon className="mr-2 size-4" />
              {"removeOffer"}
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
        {"addOffer"}
      </Button>
    </div>
  )
}

export default OfferList

