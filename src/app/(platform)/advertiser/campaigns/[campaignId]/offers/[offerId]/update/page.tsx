"use client"
import EditOfferForm from "@/components/offers/update-form"
import React from "react"

type Props = {
    params: Promise<{
      offerId: string
    }>
  }


function UpdateOfferPage({ params: paramsPromise }: Props) {
  
  const params = React.use(paramsPromise)
  const { offerId } = params;

  return <EditOfferForm offerId={offerId} />
}

export default UpdateOfferPage
