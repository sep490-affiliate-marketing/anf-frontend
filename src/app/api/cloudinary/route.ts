import { NextResponse } from "next/server"

import { generateSignature } from "@/lib/cloudinary"

export async function GET() {
  try {
    const signature = await generateSignature()
    return NextResponse.json(signature)
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error)
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    )
  }
}
