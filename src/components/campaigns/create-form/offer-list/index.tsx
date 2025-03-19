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
  const [previewImages, setPreviewImages] = useState<Record<number, string>>({})

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offers",
  })

  //   const [selectedCountries, setSelectedCountries] = useState<
  //     Record<number, string>
  //   >({})

  const [isPriceModalOpen, setIsPriceModalOpen] = useState<
    Record<number, boolean>
  >({})
  //   const [isCountryOpen, setIsCountryOpen] = useState<Record<number, boolean>>(
  //     {}
  //   )
  //   const [isCarrierOpen, setIsCarrierOpen] = useState<Record<number, boolean>>(
  //     {}
  //   )
  const [isOSOpen, setIsOSOpen] = useState<Record<number, boolean>>({})
  const [isOfferTypeOpen, setIsOfferTypeOpen] = useState<
    Record<number, boolean>
  >({})
  const [isNetworkOpen, setIsNetworkOpen] = useState<Record<number, boolean>>(
    {}
  )
  const [isTrafficSourceOpen, setIsTrafficSourceOpen] = useState<
    Record<number, boolean>
  >({})

  const [dateRange, setDateRange] = useState<DateRange>(
    defaultDateRange || {
      from: undefined,
      to: undefined,
    }
  )

  //   const [loadingCarriers, setLoadingCarriers] = useState<
  //     Record<string, boolean>
  //   >({})

  useEffect(() => {
    fields.forEach((field, index) => {
      if (dateRange.from && dateRange.to) {
        form.setValue(
          `offers.${index}.start_date`,
          dateRange.from.toISOString()
        )
        form.setValue(`offers.${index}.end_date`, dateRange.to.toISOString())
      }
    })
  }, [dateRange, form, fields])

  useEffect(() => {
    return () => {
      Object.values(previewImages).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error("invalidImageType")
        event.target.value = ""
        return
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error("imageTooLarge")
        event.target.value = ""
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setPreviewImages((prev) => ({
        ...prev,
        [index]: previewUrl,
      }))

      // setValue(`offers.${index}.thumbnail`, Image);
    }
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
              name={`offers.${index}.price_modal`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"priceModalLabel"}
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
                                    `offers.${index}.price_modal`,
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
              name={`offers.${index}.payout_money`}
              render={({ field: { onChange, value, onBlur, ...field } }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"payoutMoneyLabel"}
                  </Label>
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

            {/* <FormField
              control={form.control}
              name={`offers.${index}.country`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"locationLabel"}
                  </Label>
                  <Popover
                    open={isCountryOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsCountryOpen((prev) => ({ ...prev, [index]: open }))
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
                            <Globe className="size-4" />
                            {isCountryLoading ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                {"loadingCountries"}
                              </>
                            ) : field.value ? (
                              countries?.find(
                                (country) => country.name === field.value
                              )?.name
                            ) : (
                              "locationPlaceholder"
                            )}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchCountry"} />
                        <CommandList>
                          <CommandEmpty>
                            {isCountryLoading ? (
                              <div className="flex items-center gap-2 p-2">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-full animate-pulse" />
                              </div>
                            ) : (
                              "noCountryFound"
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {countries?.map((country) => (
                              <CommandItem
                                key={country.id}
                                value={country.name}
                                onSelect={() => {
                                  form.setValue(
                                    `offers.${index}.country`,
                                    country.name,
                                    { shouldValidate: true }
                                  );
                                  form.setValue(`offers.${index}.carrier`, "");
                                  setSelectedCountries((prev) => ({
                                    ...prev,
                                    [index]: country.code,
                                  }));
                                  setIsCountryOpen((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    country.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {country.name}
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
              name={`offers.${index}.carrier`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"carrierLabel"}
                  </Label>
                  <Popover
                    open={isCarrierOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsCarrierOpen((prev) => ({ ...prev, [index]: open }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!form.watch(`offers.${index}.country`)}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                            !form.watch(`offers.${index}.country`) &&
                              "cursor-not-allowed opacity-50"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {loadingCarriers[selectedCountries[index]] ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                {"loadingCarriers"}
                              </>
                            ) : field.value ? (
                              carriersMap[selectedCountries[index]]?.find(
                                (carrier) =>
                                  carrier.name +
                                    "_" +
                                    carrier.mcc +
                                    carrier.mnc ===
                                  field.value
                              )?.name
                            ) : !form.watch(`offers.${index}.country`) ? (
                              "selectCountryFirst"
                            ) : (
                              "carrierPlaceholder"
                            )}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchCarrier"} />
                        <CommandList>
                          <CommandEmpty>
                            {loadingCarriers[selectedCountries[index]] ? (
                              <div className="flex items-center gap-2 p-2">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-full animate-pulse" />
                              </div>
                            ) : (
                              "noCarrierFound"
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {(() => {
                              const selectedCountry = countries?.find(
                                (c) =>
                                  c.name ===
                                  form.watch(`offers.${index}.country`)
                              );
                              const countryCode = selectedCountry?.code;
                              return carriersMap[countryCode || ""]?.map(
                                (carrier) => (
                                  <CommandItem
                                    key={carrier.id}
                                    value={carrier.name}
                                    onSelect={() => {
                                      form.setValue(
                                        `offers.${index}.carrier`,
                                        carrier.name +
                                          "_" +
                                          carrier.mcc +
                                          carrier.mnc,
                                        { shouldValidate: true }
                                      );
                                      setIsCarrierOpen((prev) => ({
                                        ...prev,
                                        [index]: false,
                                      }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        carrier.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {`${carrier.name} (${carrier.mnc})`}
                                  </CommandItem>
                                )
                              );
                            })()}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name={`offers.${index}.os`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">{"osLabel"}</Label>
                  <Popover
                    open={isOSOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsOSOpen((prev) => ({ ...prev, [index]: open }))
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
                            <Monitor className="size-4" />
                            {field.value || "osPlaceholder"}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchOS"} />
                        <CommandList>
                          <CommandEmpty>{"noOSFound"}</CommandEmpty>
                          <CommandGroup>
                            {["Android", "iOS", "Windows"].map((os) => (
                              <CommandItem
                                key={os}
                                value={os}
                                onSelect={() => {
                                  form.setValue(`offers.${index}.os`, os, {
                                    shouldValidate: true,
                                  })
                                  setIsOSOpen((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    os === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {os}
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
              name={`offers.${index}.offer_type`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">{"typeLabel"}</Label>
                  <Popover
                    open={isOfferTypeOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsOfferTypeOpen((prev) => ({ ...prev, [index]: open }))
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
                            <Users className="size-4" />
                            {field.value === "1"
                              ? "singlePublisher"
                              : field.value === "0"
                                ? "manyPublishers"
                                : "typePlaceholder"}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem
                              value="1"
                              onSelect={() => {
                                form.setValue(
                                  `offers.${index}.offer_type`,
                                  "1",
                                  { shouldValidate: true }
                                )
                                setIsOfferTypeOpen((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  field.value === "1"
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {"singlePublisher"}
                            </CommandItem>
                            <CommandItem
                              value="0"
                              onSelect={() => {
                                form.setValue(
                                  `offers.${index}.offer_type`,
                                  "0",
                                  { shouldValidate: true }
                                )
                                setIsOfferTypeOpen((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  field.value === "0"
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {"manyPublishers"}
                            </CommandItem>
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
              name={`offers.${index}.network`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"networkLabel"}
                  </Label>
                  <Popover
                    open={isNetworkOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsNetworkOpen((prev) => ({ ...prev, [index]: open }))
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
                            <Wifi className="size-4" />
                            {field.value
                              ? `network.${field.value}`
                              : "networkPlaceholder"}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchNetwork"} />
                        <CommandList>
                          <CommandEmpty>{"noNetworkFound"}</CommandEmpty>
                          <CommandGroup>
                            {NETWORK.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.name}
                                onSelect={() => {
                                  form.setValue(
                                    `offers.${index}.network`,
                                    item.name,
                                    { shouldValidate: true }
                                  )
                                  setIsNetworkOpen((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    item.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`network.${item.name}`}
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
              {(form.formState.errors.offers?.[index]?.start_date?.message ||
                form.formState.errors.offers?.[index]?.end_date?.message) && (
                <FormMessage>
                  {form.formState.errors.offers?.[index]?.start_date?.message ||
                    form.formState.errors.offers?.[index]?.end_date?.message}
                </FormMessage>
              )}
            </div>

            <FormField
              control={form.control}
              name={`offers.${index}.required_traffic_source`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {"trafficSourceLabel"}
                  </Label>
                  <Popover
                    open={isTrafficSourceOpen[index] || false}
                    onOpenChange={(open) =>
                      setIsTrafficSourceOpen((prev) => ({
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
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Users className="size-4" />
                            {field.value?.length
                              ? `${field.value.length} selected`
                              : "trafficSourcePlaceholder"}
                          </span>
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={"searchTrafficSource"} />
                        <CommandList>
                          <CommandEmpty>{"noTrafficSourceFound"}</CommandEmpty>
                          <CommandGroup>
                            {AFFILIATE_SOURCE.map((source) => (
                              <CommandItem
                                key={source.id}
                                value={source.name}
                                onSelect={() => {
                                  const currentValue = field.value || []
                                  const newValue = currentValue.includes(
                                    source.name
                                  )
                                    ? currentValue.filter(
                                        (item) => item !== source.name
                                      )
                                    : [...currentValue, source.name]

                                  form.setValue(
                                    `offers.${index}.required_traffic_source`,
                                    newValue,
                                    { shouldValidate: true }
                                  )
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4",
                                    field.value?.includes(source.name)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {source.name}
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
            control={form.control}
            name={`offers.${index}.thumbnail`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold">
                  {"thumbnailTitle"}
                </FormLabel>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative size-40 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    {previewImages[index] ? (
                      <Image
                        src={previewImages[index]}
                        alt="Thumbnail preview"
                        className="size-full object-cover transition-all duration-300 hover:scale-105"
                        width={160}
                        height={160}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        <ImageIcon className="size-12" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          handleImageUpload(e, index)
                          onChange(e.target.files?.[0])
                        }}
                        className="h-12 w-full cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-primary dark:hover:file:bg-primary/30"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {"thumbnailHelperText"}
                    </p>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
            price_modal: "",
            payout_money: "0",
            start_date: "",
            end_date: "",
            offer_type: "",
            country: "",
            carrier: "",
            os: "",
            network: "",
            required_traffic_source: [],
            thumbnail: new File([], "placeholder"),
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
