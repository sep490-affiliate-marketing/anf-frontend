import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "cdn.banklookup.net",
      },
      {
        hostname: "www.shinhancard.com",
      },
    ],
  },
}

export default nextConfig
