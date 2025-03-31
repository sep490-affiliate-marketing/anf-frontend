import React, { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { ICreateCampaignForm } from "@/validations/campaign.validation"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface ImageUploadProps {
  form: UseFormReturn<ICreateCampaignForm>
  previewImage: string | null
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ImageUpload({
  form,
  previewImage,
  setPreviewImage,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [initialized, setInitialized] = useState(false)
  const mountedRef = useRef(false)

  // Function to handle image file processing
  const processImageFile = (file: File) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB limit", {
        description: "Please choose a smaller image or compress this one",
        duration: 4000,
      })
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file format", {
        description: "Please upload a JPG, PNG, or WebP image",
        duration: 4000,
      })
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviewImage(previewUrl)

    // Update form state - replace the entire images array to avoid duplicates
    form.setValue("images", [file], { shouldValidate: true })

    // Show success toast
    toast.success("Image uploaded successfully", {
      description: "Your campaign image has been added",
      duration: 3000,
    })
  }

  // Function to handle image upload from input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear input value to allow uploading the same file again if needed
    e.target.value = ""

    processImageFile(file)
  }

  // Drag and drop event handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  // Clear preview when component unmounts
  useEffect(() => {
    mountedRef.current = true

    // Only revoke blob URLs we've created ourselves when component unmounts
    return () => {
      mountedRef.current = false
      // We don't want to revoke here as it could affect other components
      // using the same preview image
    }
  }, [])

  // Initialize preview from form data on mount if needed
  useEffect(() => {
    // Skip if already initialized or we already have a preview image
    if (initialized || previewImage) return

    const formImages = form.getValues("images")

    // Only initialize if we have form images and no existing preview
    if (formImages?.length > 0) {
      const lastImage = formImages[formImages.length - 1]

      // Check if it's a File object
      if (lastImage instanceof File) {
        const previewUrl = URL.createObjectURL(lastImage)
        setPreviewImage(previewUrl)
      }
      // Check if it's a string URL
      else if (typeof lastImage === "string") {
        setPreviewImage(lastImage)
      }

      // Mark as initialized
      setInitialized(true)
    }
  }, [form, previewImage, setPreviewImage, initialized])

  // Reset initialization state when form changes
  useEffect(() => {
    if (form.formState.isDirty) {
      setInitialized(false)
    }
  }, [form.formState.isDirty])

  return (
    <FormItem className="space-y-4">
      <FormLabel className="text-base font-medium">Campaign image</FormLabel>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div
          className={`group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-dashed border-gray-300 bg-gray-50/50 hover:border-primary/50 hover:bg-gray-50/80"
          } transition-all dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-primary/50 dark:hover:bg-gray-900/60 sm:h-56 md:h-64`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewImage ? (
            <>
              <div className="relative size-full">
                <Image
                  src={previewImage}
                  alt="Campaign preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 rounded-full bg-white/90 px-3 text-xs backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Change
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="h-8 rounded-full px-3 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewImage(null)
                    form.setValue("images", [], {
                      shouldValidate: true,
                    })
                  }}
                >
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div>
                <p className="font-medium text-muted-foreground">
                  Drag and drop your image here
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  or click to browse files
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Recommended: 1920×1080px (16:9), max 5MB
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4">
            <h4 className="mb-2 font-medium">Image guidelines</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-primary">•</span>
                <span>
                  Use a high-quality image that clearly represents your campaign
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-primary">•</span>
                <span>
                  Ensure the image is relevant to your target audience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-primary">•</span>
                <span>
                  Avoid text-heavy images as they may not display well on all
                  devices
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-primary">•</span>
                <span>Supported formats: JPG, PNG, WebP</span>
              </li>
            </ul>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <FormMessage />
    </FormItem>
  )
}
