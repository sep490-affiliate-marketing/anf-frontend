"use client"

import { useEffect, useState } from "react"

import { COUNTRIES } from "@/constant/campaign"
import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { addDays } from "date-fns"

import { useCreateCampaignForm } from "@/hooks/campaign"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import { DatePickerWithRange } from "./date-range-picker"
import OfferList from "./offer-list"
// import PostbackUrl from "./postback-instruction"
import TrackingUrlBuilder from "./tracking-url-builder"

const CampaignForm = () => {
  const { form, isPending, onCreateCampaign } = useCreateCampaignForm()
  const {
    control,
    formState: {},
    handleSubmit,
    watch,
    setValue,
  } = form

  const campaignStartDate = watch("start_date")
  const campaignEndDate = watch("end_date")
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
      setValue("start_date", dateRange.from)
      setValue("end_date", dateRange.to)
    }
  }, [dateRange, setValue])

  useEffect(() => {
    if (offers && (campaignStartDate || campaignEndDate)) {
      offers.forEach((_, index) => {
        if (campaignStartDate) {
          setValue(`offers.${index}.start_date`, "")
        }
        if (campaignEndDate) {
          setValue(`offers.${index}.end_date`, "")
        }
      })
    }
  }, [campaignStartDate, campaignEndDate, offers, setValue])

  const onSubmit = async (data: ICreateCampaignForm) => {
    try {
      // const campaignCode = generateCode(data);
      // const encryptedCode = encryptCode(campaignCode);

      const campaignData = {
        ...data,
        // code: encryptedCode,
        offers: data.offers.map((offer) => ({
          ...offer,
          // code: encryptCode(generateOfferCode(offer)),
          payout_money: offer.payout_money?.replace(/,/g, "") || "0",
          type: offer.offer_type,
        })),
        url: data.url || data.baseUrl,
      }
      delete campaignData.baseUrl
      await onCreateCampaign(campaignData)
    } catch (error) {
      console.error("Error creating campaign:", error)
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
            {"title"}
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
                  <Label className="text-lg font-semibold">{"nameLabel"}</Label>
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
            <Label className="text-lg font-semibold">
              {"campaignDateRangeLabel"}
            </Label>
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
            {(form.formState.errors.start_date ||
              form.formState.errors.end_date) && (
              <FormMessage>
                {form.formState.errors.start_date?.message ||
                  form.formState.errors.end_date?.message}
              </FormMessage>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">{"noteLabel"}</Label>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
          {"submitting"}
        </Button>
      </form>
    </Form>
  )
}

export default CampaignForm
