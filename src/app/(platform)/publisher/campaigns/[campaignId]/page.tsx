import { CampaignDetails } from "@/components/publisher/campaigns/campaign-details"

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ campaignId: number }>
}) {
  const { campaignId } = await params

  return <CampaignDetails campaignId={campaignId} />
}
