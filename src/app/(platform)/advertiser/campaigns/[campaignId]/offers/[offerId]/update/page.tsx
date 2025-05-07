"use client"

import React from "react"

import EditOfferForm from "@/components/offers/update-form"

type Props = {
  params: Promise<{
    offerId: string
  }>
}

function UpdateOfferPage({ params: paramsPromise }: Props) {
  const params = React.use(paramsPromise)
  const { offerId } = params

  return <EditOfferForm offerId={offerId} />
}

export default UpdateOfferPage
