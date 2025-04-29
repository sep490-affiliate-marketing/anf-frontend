// This file should be used in a server action or API route
import { env } from "@/env"
import crypto from "crypto"

const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
}

export type CloudinarySignature = {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
}

export async function generateSignature(): Promise<CloudinarySignature> {
  const timestamp = Math.round(new Date().getTime() / 1000)

  // Create the string to sign
  const strToSign = `timestamp=${timestamp}${cloudinaryConfig.apiSecret}`

  // Generate signature
  const signature = crypto.createHash("sha1").update(strToSign).digest("hex")

  return {
    signature,
    timestamp,
    apiKey: cloudinaryConfig.apiKey,
    cloudName: cloudinaryConfig.cloudName,
  }
}
