import React, { useEffect, useRef } from "react"

import { TRACKING_PARAMS } from "@/constant/campaign"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { X } from "lucide-react"
import { useFieldArray, UseFormReturn } from "react-hook-form"

import { transformTrackingParameters } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

type AdvancedUrlBuilderProps = {
  form: UseFormReturn<ICreateCampaignForm>
}

export default function AdvancedUrlBuilderForm({
  form,
}: AdvancedUrlBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tracking_param",
  })
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      const requiredParams = [
        { param_name: "click_id", param_value: "click_id" },
        { param_name: "offer_code", param_value: "offer_code" },
        { param_name: "traffic_type", param_value: "traffic_type" },
        { param_name: "country", param_value: "country" },
        { param_name: "city", param_value: "city" },
        { param_name: "device_name", param_value: "device_name" },
      ]
      requiredParams.forEach((param) => append(param))
      initialized.current = true
    }
  }, [append, fields.length])

  // if (isLoading) return <AdvancedUrlBuilderFormSkeleton />

  // if (!tracking_param || isError)
  //   return <p className="text-sm text-gray-500">{"noTrackingParamsFound"}</p>

  const formattedTrackingParams = transformTrackingParameters(
    TRACKING_PARAMS?.map((param) => param.name) ?? []
  )

  // Get selected parameter values
  const selectedValues = fields.map((field) => field.param_value)

  // Filter out already selected parameters
  const availableParams = formattedTrackingParams.filter(
    (param) => !selectedValues.includes(`${param.param_value}`)
  )

  return (
    <div className="space-y-6">
      {/* Base URL */}
      <FormField
        control={form.control}
        name="baseUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{"baseUrl"}</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Available Parameters */}
      <div className="space-y-4">
        <FormLabel>{"availableParams"}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {availableParams.map((param) => (
            <Button
              type="button"
              key={param.param_value}
              size="sm"
              variant="outline"
              className="first-letter:uppercase"
              onClick={() =>
                append({
                  param_value: param.param_value,
                  param_name: param.param_name,
                })
              }
            >
              {param.label}
            </Button>
          ))}
          {availableParams.length === 0 && (
            <p className="text-sm text-gray-500">
              {"allTrackingParamsSelected"}
            </p>
          )}
        </div>
      </div>

      {/* Selected Parameters */}
      {fields.map((field, index) => {
        const isRequired = [
          "click_id",
          "offer_code",
          "traffic_type",
          "country",
          "city",
          "device_name",
        ].includes(field.param_value)

        return (
          <div className="grid grid-cols-[1fr_1fr_40px] gap-4" key={field.id}>
            <FormField
              control={form.control}
              name={`tracking_param.${index}.param_name`}
              render={({ field }) => (
                <FormItem>
                  <Label>{"paramName"}</Label>
                  <FormControl>
                    <Input {...field} placeholder="Parameter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`tracking_param.${index}.param_value`}
              render={({ field }) => (
                <FormItem>
                  <Label>{"paramValue"}</Label>
                  <FormControl>
                    <Input {...field} placeholder="Parameter value" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8">
              {!isRequired ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label="Remove parameter"
                >
                  <X className="size-4" />
                </Button>
              ) : (
                <div className="size-9" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AdvancedUrlBuilderFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-20" />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="grid grid-cols-2 gap-4" key={index}>
            <Skeleton className="h-7 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="size-7" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
