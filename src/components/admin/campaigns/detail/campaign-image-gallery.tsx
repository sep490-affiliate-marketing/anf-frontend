"use client"

import { useState } from "react"

import Image from "next/image"

import Lightbox from "yet-another-react-lightbox"

import { ImagePlaceholder } from "@/components/global/image-placeholder"

export function CampaignGallery({
  thumbnail,
  images,
}: {
  thumbnail: string | null
  images: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const allImages = thumbnail ? [thumbnail, ...images] : images
  const slides = allImages.map((src) => ({ src }))

  // Determine which images to show
  const mainImage = thumbnail || (images.length > 0 ? images[0] : null)
  // If we have a thumbnail, we show up to 2 from images array, otherwise show 2nd and 3rd images
  const sideImages = thumbnail ? images.slice(0, 2) : images.slice(1, 3)
  // Calculate remaining images
  const totalVisibleImages = (mainImage ? 1 : 0) + sideImages.length
  const hasExtraImages = allImages.length > totalVisibleImages
  const remainingCount = allImages.length - totalVisibleImages

  return (
    <>
      <div className="flex gap-4" style={{ height: "420px" }}>
        {/* Main Image - Left Side */}
        <div className="w-[65%]">
          {mainImage ? (
            <div
              className="relative size-full overflow-hidden rounded-lg"
              onClick={() => {
                setPhotoIndex(0)
                setIsOpen(true)
              }}
            >
              <Image
                src={mainImage}
                alt="Campaign main image"
                className="size-full object-cover"
                fill
              />
            </div>
          ) : (
            <ImagePlaceholder className="size-full rounded-lg" />
          )}
        </div>

        {/* Side Images - Right Side */}
        <div className="flex w-[35%] flex-col gap-4">
          {/* First side image */}
          {sideImages.length > 0 ? (
            <div
              className="relative h-1/2 w-full overflow-hidden rounded-lg"
              onClick={() => {
                const index = thumbnail ? 1 : 1
                setPhotoIndex(index)
                setIsOpen(true)
              }}
            >
              <Image
                src={sideImages[0]}
                alt="Campaign additional image"
                className="size-full object-cover"
                fill
              />
            </div>
          ) : (
            <ImagePlaceholder className="h-1/2 rounded-lg" />
          )}

          {/* Second side image or placeholder with overlay */}
          {sideImages.length > 1 ? (
            <div
              className="relative h-1/2 w-full overflow-hidden rounded-lg"
              onClick={() => {
                const index = thumbnail ? 2 : 2
                setPhotoIndex(index)
                setIsOpen(true)
              }}
            >
              <Image
                src={sideImages[1]}
                alt="Campaign additional image"
                className="size-full object-cover"
                fill
              />

              {/* "+X more" overlay if needed */}
              {hasExtraImages && (
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 font-semibold text-white">
                  <span className="text-lg">+{remainingCount} more</span>
                </div>
              )}
            </div>
          ) : (
            <ImagePlaceholder className="h-1/2 rounded-lg" />
          )}
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  )
}
