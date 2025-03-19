"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { ImageIcon, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { FormControl, FormMessage } from "./form"

export interface ImageDropzoneProps {
  value?: File[]
  onChange: (files: File[]) => void
  label?: string
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedFileTypes?: string[]
  className?: string
  previewClassName?: string
  placeholder?: string
  errorMessage?: string
}

export const ImageDropzone = ({
  value = [],
  onChange,
  label,
  maxFiles = 4,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
  previewClassName,
  placeholder = "Drop images here or click to upload",
  errorMessage,
}: ImageDropzoneProps) => {
  const [previews, setPreviews] = useState<string[]>([])

  // Generate preview URLs whenever the values change
  useEffect(() => {
    // Clear old previews
    previews.forEach((url) => URL.revokeObjectURL(url))

    // Create new previews
    const newPreviews = value.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Cleanup function to revoke URLs when component unmounts or values change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [value])

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle file rejections
    rejectedFiles.forEach((rejection) => {
      const { file, errors } = rejection

      errors.forEach((error: any) => {
        if (error.code === "file-too-large") {
          toast.error(
            `${file.name}: File too large (max ${maxSize / (1024 * 1024)}MB)`
          )
        } else if (error.code === "file-invalid-type") {
          toast.error(`${file.name}: Invalid file type`)
        } else {
          toast.error(`${file.name}: ${error.message}`)
        }
      })
    })

    // If we already have maxFiles, we don't add more
    if (value.length >= maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`)
      return
    }

    // Limit the number of files to maxFiles
    const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles)
    onChange(newFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  })

  return (
    <div className="space-y-4">
      {label && <div className="text-lg font-semibold">{label}</div>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {/* Preview images */}
        {previews.map((previewUrl, index) => (
          <div
            key={index}
            className={cn(
              "relative size-40 shrink-0 overflow-hidden rounded-2xl border-2 border-gray-300 dark:border-gray-600",
              previewClassName
            )}
          >
            <Image
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              className="size-full object-cover transition-all duration-300 hover:scale-105"
              width={160}
              height={160}
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Dropzone */}
        {value.length < maxFiles && (
          <div
            {...getRootProps()}
            className={cn(
              "relative size-40 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 transition-colors dark:border-gray-600",
              isDragActive && "border-primary bg-primary/10",
              className
            )}
          >
            <div className="flex size-full flex-col items-center justify-center gap-2 bg-gray-100 p-4 text-center text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              <ImageIcon className="size-12" />
              <p className="text-xs">{placeholder}</p>
            </div>
            <FormControl>
              <input {...getInputProps()} />
            </FormControl>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload up to {maxFiles} images (max {maxSize / (1024 * 1024)}MB each,{" "}
        {acceptedFileTypes
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")}
        )
      </p>

      {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
    </div>
  )
}

export default ImageDropzone

