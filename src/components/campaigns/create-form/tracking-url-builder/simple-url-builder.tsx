import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { UseFormReturn } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SimpleUrlBuilderProps = {
  form: UseFormReturn<ICreateCampaignForm>
}

export default function SimpleUrlBuilderForm({ form }: SimpleUrlBuilderProps) {
  return (
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <Label>{"Url"}</Label>
          <FormControl>
            <Input
              placeholder="e.g https://example.com?click_id={click_id}&pub_id={pub_id}"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
