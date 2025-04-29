interface CloudinarySignature {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
}

// Get signature from our secure API endpoint
const getSignature = async (): Promise<CloudinarySignature> => {
  const response = await fetch("/api/cloudinary")
  if (!response.ok) {
    throw new Error("Failed to get upload signature")
  }
  return response.json()
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Get the secure signature from backend
    const { signature, timestamp, apiKey, cloudName } = await getSignature()

    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

export default uploadToCloudinary
