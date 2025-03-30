"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { useAuth } from "@/providers/auth-provider"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { addDays } from "date-fns"
import { ImageIcon } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { DatePickerWithRange } from "./date-range-picker"
import OfferList from "./offer-list"
import TrackingUrlBuilder from "./tracking-url-builder"

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

  // Add type guard for File array
  const isFileArray = (value: any): value is File[] => {
    return Array.isArray(value) && value.every((item) => item instanceof File)
  }

  interface ImagePathObject {
    path: string
    relativePath?: string
  }

  const isImagePathObject = (value: any): value is ImagePathObject => {
    return typeof value === "object" && value !== null && "path" in value
  }

  const convertToFile = async (
    image: File | ImagePathObject
  ): Promise<File | null> => {
    if (image instanceof File) return image
    if (isImagePathObject(image)) {
      try {
        // Create a new File object from the image path
        const response = await fetch(image.relativePath || image.path)
        const blob = await response.blob()
        const filename =
          (image.relativePath || image.path).split("/").pop() || "image.jpg"
        return new File([blob], filename, { type: blob.type })
      } catch (error) {
        console.error("Error converting image path to file:", error)
        return null
      }
    }
    return null
  }

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
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        className="w-full space-y-12 p-8 backdrop-blur-sm transition-all duration-300 md:p-12"
        encType="multipart/form-data"
      >
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 md:text-3xl">
            Create New Campaign
          </h2>
          <div className="mt-3 flex justify-center">
            <div className="h-1 w-16 rounded-full bg-primary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          <div className="md:col-span-1">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">Campaign Name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label className="text-lg font-semibold">Campaign Date Range</Label>
            <DatePickerWithRange
              className="w-full"
              onChange={(dates: {
                startDate: string
                endDate: string | null
              }) =>
                setDateRange({
                  from: dates.startDate || "",
                  to: dates.endDate || "",
                })
              }
              disabledBefore={addDays(new Date(), 1).toISOString()}
              defaultDateRange={{
                from: addDays(new Date(), 1),
                to: addDays(new Date(), 21),
              }}
            />
            {(form.formState.errors.startDate ||
              form.formState.errors.endDate) && (
              <FormMessage>
                {form.formState.errors.startDate?.message ||
                  form.formState.errors.endDate?.message}
              </FormMessage>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    Campaign Description
                  </Label>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={control}
              name="images"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Campaign Images
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          onChange(files)
                        }}
                        {...field}
                      />
                      {value && Array.isArray(value) && value.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          {value.map((file, index) => (
                            <div
                              key={index}
                              className="relative aspect-square w-full overflow-hidden rounded-lg border"
                            >
                              {file instanceof File ? (
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-gray-100">
                                  <ImageIcon className="size-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <TrackingUrlBuilder form={form} />
          </div>

          {/* <div className="md:col-span-2">
            <PostbackUrl />
          </div> */}
        </div>
        <OfferList
          form={form}
          disabledBefore={campaignStartDate}
          disabledAfter={campaignEndDate}
          defaultDateRange={{
            from: campaignStartDate ? new Date(campaignStartDate) : new Date(),
            to: campaignEndDate
              ? new Date(campaignEndDate)
              : addDays(new Date(), 20),
          }}
        />

        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="w-full"
        >
          Create Campaign
        </Button>
      </form>
    </Form>
  )
}

export default CampaignForm
