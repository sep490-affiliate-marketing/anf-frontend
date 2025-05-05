"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import dynamic from "next/dynamic"

import "react-quill-new/dist/quill.snow.css"

import { Preview } from "@/components/editor/preview"

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
  const [internalValue, setInternalValue] = useState(value)
  const [editorFocused, setEditorFocused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update internal value when external value changes, but only when not focused
  useEffect(() => {
    if (!editorFocused) {
      setInternalValue(value)
    }
  }, [value, editorFocused])

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
        const newValue = internalValue + imageHtml
        setInternalValue(newValue)

        // Notify parent without losing focus
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          onChange(newValue)
        }, 0)
      } catch (error) {
        console.error("Error uploading image:", error)
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        )
      } finally {
        setIsUploading(false)
      }
    }
  }, [onChange, internalValue])

  // Handle change with focus preservation
  const handleChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue)

      // Debounce the onChange to avoid focus loss and excessive validations
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue)
      }, 300)
    },
    [onChange]
  )

  // Handle focus events
  const handleFocus = useCallback(() => {
    setEditorFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    // When editor loses focus, sync final value with parent
    setEditorFocused(false)
    onChange(internalValue)
  }, [onChange, internalValue])

  if (preview) {
    return <Preview value={value} />
  }

  return (
    <div className="relative overflow-auto bg-white">
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
            type="button"
            className="ml-2 text-xs underline"
            onClick={() => setUploadError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <ReactQuill
        theme="snow"
        value={internalValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
