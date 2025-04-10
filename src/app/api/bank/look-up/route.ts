import { NextRequest, NextResponse } from "next/server"

interface BankLookupResponse {
  success: boolean
  message: string
  data: {
    accountName: string
    accountNumber: string
    bankCode: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bankCode, accountNumber } = body

    if (!bankCode || !accountNumber) {
      return NextResponse.json(
        { error: "Bank code and account number are required" },
        { status: 400 }
      )
    }

    // const response = await fetch(
    //   "https://api.banklookup.net/api/bank/id-lookup-prod",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": env.BANK_LOOKUP_API_KEY || "",
    //       "x-api-secret": env.BANK_LOOKUP_SECRET || "",
    //     },
    //     body: JSON.stringify({
    //       bank: bankCode,
    //       account: accountNumber,
    //     }),
    //   }
    // )

    // if (!response.ok) {
    //   if (response.status === 422) {
    //     return NextResponse.json(
    //       { error: "Account not found" },
    //       { status: 422 }
    //     )
    //   }
    //   if (response.status === 429) {
    //     return NextResponse.json(
    //       { error: "Too many requests" },
    //       { status: 429 }
    //     )
    //   }
    //   if (response.status === 402) {
    //     return NextResponse.json(
    //       { error: "API credit exhausted" },
    //       { status: 402 }
    //     )
    //   }

    //   return NextResponse.json(
    //     { error: "Failed to lookup account" },
    //     { status: response.status }
    //   )
    // }

    // const data: BankLookupResponse = await response.json()
    // TODO: remove this in real production
    const testDataRes = {
      ownerName: "VU MINH NHAT",
    }
    return NextResponse.json({ data: testDataRes }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
