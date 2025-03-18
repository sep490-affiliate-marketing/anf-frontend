import { Metadata } from "next"

export function constructMetadata({
  title = {
    default: "Affiliate Network",
    template: "%s | Affiliate Network",
  },
  description = "",
  image = "/assets/backgrounds/bg-1.png",
  icons = "/favicon.ico",
}: {
  title?: {
    default: string
    template: string
  }
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: title.default,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: title.default,
      description,
      images: [image],
      creator: "@SEP490_affiliate_network",
    },
    icons,
    metadataBase: new URL("http://localhost:3000/"),
  }
}
