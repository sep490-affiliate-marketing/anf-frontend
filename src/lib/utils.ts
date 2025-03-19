import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformTrackingParameters(
  parameters: string[] | null | undefined
) {
  if (!Array.isArray(parameters)) {
    return []
  }

  // Transform each parameter
  return parameters.map((param) => ({
    param_name: param,
    param_value: param,
    label: formatParameterLabel(param),
  }))
}

function formatParameterLabel(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
export const encodeUrlSafely = (inputUrl: string): string => {
  if (!inputUrl) return ""

  try {
    // Split the URL into protocol, rest of the URL
    const [protocol, rest] = inputUrl.split("://")

    if (!rest) {
      // If no protocol found, treat the entire input as the rest
      return encodeURI(inputUrl)
    }

    // Split the rest into path and query/hash
    const [pathAndHost, queryAndHash = ""] = rest.split("?")

    // Encode query parameters separately
    const [queryPart, hashPart = ""] = queryAndHash.split("#")

    // Encode query parameters
    const encodedQueryParams = queryPart
      .split("&")
      .map((param) => {
        // Handle cases where param might not have a value
        const [name, value] = param.split("=")
        return name
          ? `${encodeURIComponent(name)}${
              value !== undefined ? `=${encodeURIComponent(value)}` : ""
            }`
          : ""
      })
      .filter(Boolean) // Remove empty params
      .join("&")

    // Reconstruct the URL
    const encodedUrl = `${protocol}://${pathAndHost}${
      encodedQueryParams ? `?${encodedQueryParams}` : ""
    }${hashPart ? `#${encodeURIComponent(hashPart)}` : ""}`

    return encodedUrl
  } catch (error) {
    console.error("URL encoding error:", error)
    return ""
  }
}
