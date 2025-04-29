"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import dynamic from "next/dynamic"

import "react-quill-new/dist/quill.snow.css"

import "./editor.css"
import uploadToCloudinary from "./upload"

interface EditorProps {
  onChange: (value: string) => void
  value: string
  preview?: boolean
}

export const Editor = ({ onChange, value, preview = false }: EditorProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  )

  // This function handles image upload
  const imageHandler = useCallback(() => {
    // Create file input
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      setIsUploading(true)
      setUploadError(null)

      try {
        // Upload image to Cloudinary
        const imageUrl = await uploadToCloudinary(file)

        // Insert the uploaded image directly into the editor content
        // Generate image HTML
        const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" />`

        // Insert at cursor position by appending to current content
        // This is a simplified approach that works reliably
        onChange(value + imageHtml)
      } catch (error) {
        console.error("Error uploading image:", error)
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        )
      } finally {
        setIsUploading(false)
      }
    }
  }, [onChange, value])

  if (preview) {
    return (
      <div
        className="ql-editor preview rounded bg-white p-4"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  return (
    <div className="relative bg-white">
      {isUploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
          <div className="rounded bg-white p-4 shadow-lg">
            <p className="text-blue-600">Uploading image to Cloudinary...</p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-2 rounded border border-red-200 bg-red-50 p-2 text-red-600">
          Upload error: {uploadError}
          <button
            className="ml-2 text-xs underline"
            onClick={() => setUploadError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "indent",
          "link",
          "image",
          "video",
          "code-block",
        ]}
      />
    </div>
  )
}

