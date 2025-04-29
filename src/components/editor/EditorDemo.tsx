"use client"

import { useState } from "react"

import { Button } from "../ui/button"
import { Editor } from "./index"

export const EditorDemo = () => {
  const [content, setContent] = useState(
    "<p>Start writing your content here...</p>"
  )
  const [showPreview, setShowPreview] = useState(false)

  const handleContentChange = (value: string) => {
    setContent(value)
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-bold">Rich Text Editor</h2>
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit Content" : "Show Preview"}
        </Button>
      </div>

      {showPreview ? (
        <Editor value={content} onChange={handleContentChange} preview={true} />
      ) : (
        <Editor value={content} onChange={handleContentChange} />
      )}
    </div>
  )
}

export default EditorDemo
