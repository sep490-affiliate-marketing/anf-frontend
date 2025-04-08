import { NextResponse } from "next/server"

import axios from "axios"

import { IBankListResponse } from "@/types/bank.type"

export async function GET() {
  try {
    const { data } = await axios.get<IBankListResponse>(
      "https://api.banklookup.net/api/bank/list"
    )

    return NextResponse.json({
      data: data.data,
      isSuccess: data.success,
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error", isSuccess: false },
      { status: 500 }
    )
  }
}
