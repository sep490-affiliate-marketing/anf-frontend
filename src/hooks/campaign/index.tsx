import { useState } from "react"

import { useRouter } from "next/navigation"

import CampaignService from "@/services/campaign.service"
import {
  CreateCampaignFormSchema,
  ICreateCampaignForm,
} from "@/validations/campaign.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const useCreateCampaignForm = () => {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  // const t = useTranslations("CampaignForm");
  const router = useRouter()
  // const { data: countries, isCountryLoading } = useGetActiveCountries();
  const form = useForm<ICreateCampaignForm>({
    mode: "onChange",
    resolver: zodResolver(CreateCampaignFormSchema()),
    defaultValues: {
      url: "",
      images: [],
      offers: [
        {
          pricingModel: "",
          description: "",
          bid: "",
          stepInfo: "",
          startDate: "",
          endDate: "",
          budget: "",
        },
      ],
    },
  })

  const { mutateAsync: createCampaignMutation, isPending } = useMutation({
    mutationKey: ["createCampaign"],
    mutationFn: (formData: FormData) =>
      CampaignService.createCampaign(formData),
    onSuccess: async (resData) => {
      if (resData?.success === false) {
        const { type } = resData
        switch (type) {
          case "error_code_camp":
            toast.error("responseMessage.error.code_campaign.title", {
              description: "responseMessage.error.code_campaign.description",
            })
            break
          case "error_date_camp":
            toast.error("responseMessage.error.date_campaign.title", {
              description: "responseMessage.error.date_campaign.description",
            })
            break
          case "error_camp_not_exist":
            toast.error("responseMessage.error.campaign_not_exist.title", {
              description:
                "responseMessage.error.campaign_not_exist.description",
            })
            break
          case "error_date_offer":
            toast.error("responseMessage.error.date_offer.title", {
              description: "responseMessage.error.date_offer.description",
            })
            break
          case "validation_error":
            if (resData.errors) {
              Object.entries(resData.errors).forEach(([key, value]) => {
                toast.error(`responseMessage.error.${key}.${value[0]}.title`, {
                  description: `responseMessage.error.${key}.${value[0]}.description`,
                })
              })
            }
            break
          default:
            toast.error("responseMessage.error.create_campaign.title", {
              description: "responseMessage.error.create_campaign.description",
            })
        }
      } else {
        toast.success("responseMessage.success.create_campaign.title", {
          description: "responseMessage.success.create_campaign.description",
        })
        queryClient.invalidateQueries({ queryKey: ["advertiserCampaigns", 1] })
        router.push(`/advertiser/my-campaigns`)
      }
    },
  })

  const onCreateCampaign = async (formData: FormData) => {
    try {
      setErrorMessage("")
      setSuccessMessage("")
      await createCampaignMutation(formData)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      )
    }
  }

  return {
    form,
    isPending,
    onCreateCampaign,
    errorMessage,
    successMessage,
  }
}

// export const useGetTrackingParams = () => {
//   return useQuery({
//     queryKey: ["trackingParams"],
//     queryFn: () => CampaignService.getTrackingParams(),
//   })
// }

