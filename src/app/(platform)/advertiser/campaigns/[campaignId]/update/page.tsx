"use client"
import React from "react"

import EditCampaignForm from "@/components/campaigns/update-form"

type Props = {
    params: Promise<{
      campaignId: string
    }>
  }

function UpdateCampaignPage({ params: paramsPromise }: Props) {
  
  const params = React.use(paramsPromise)
  const { campaignId } = params;

  return <EditCampaignForm campaignId={campaignId} />
}

export default UpdateCampaignPage