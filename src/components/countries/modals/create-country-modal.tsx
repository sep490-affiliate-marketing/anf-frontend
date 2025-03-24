"use client"

import React, { useRef, useState } from "react"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateCountryModal() {
  const [hasReadToBottom, setHasReadToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const content = contentRef.current
    if (!content) return

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight)
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Add country
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Create new country
          </DialogTitle>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto"
          >
            <DialogDescription asChild>
              <div className="grid gap-4 px-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Country name</Label>
                  <Input
                    id="name"
                    placeholder="Enter country name"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Country code</Label>
                  <Input
                    id="code"
                    placeholder="Enter country code (e.g., US, GB)"
                    className="w-full uppercase"
                    maxLength={2}
                  />
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
