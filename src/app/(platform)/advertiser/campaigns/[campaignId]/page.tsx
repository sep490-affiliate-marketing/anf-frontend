import React from "react"

type PageProps = {
  params: Promise<{ campaignId: string }>
}
export default async function Page({ params }: PageProps) {
  const { campaignId } = await params

  return <div>Page</div>
}
