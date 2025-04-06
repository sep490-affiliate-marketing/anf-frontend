import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.banklookup.net/api/bank/list")
    const data = await response.json()

    if (data.success) {
      return NextResponse.json({ data: data.data })
    }

    return NextResponse.json(
      { error: "Failed to fetch banks" },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
