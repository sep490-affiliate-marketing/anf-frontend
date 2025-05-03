"use client"

import { useState } from "react"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface TrafficSource {
  id: string
  platform: string
  url: string
}

export function TrafficSourcesSection() {
  const [sources, setSources] = useState<TrafficSource[]>([
    {
      id: "1",
      platform: "youtube",
      url: "https://www.youtube.com/@YourChannel",
    },
    { id: "2", platform: "website", url: "https://yourwebsite.com" },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSource, setNewSource] = useState({
    platform: "",
    url: "",
  })

  // Handle adding a new traffic source
  const handleAddSource = () => {
    if (newSource.platform && newSource.url) {
      setSources([
        ...sources,
        {
          id: Date.now().toString(),
          platform: newSource.platform,
          url: newSource.url,
        },
      ])
      setNewSource({ platform: "", url: "" })
      setIsAddDialogOpen(false)
    }
  }

  // Delete a traffic source
  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((source) => source.id !== id))
  }

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        )
      case "instagram":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
          </svg>
        )
      case "tiktok":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16.5 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
            <path d="m2.5 24 7.5-7.5-4-4-7.5 7.5L2.5 24z"></path>
            <path d="M14.5 8.5 19 3l2 2-4.5 4.5"></path>
            <path d="m22 12-4.5 4.5-2-2L20 10"></path>
            <path d="M9.5 13.5 13 17l-2 2-3.5-3.5"></path>
            <path d="m8 2 4 4-1.5 1.5L7 4"></path>
          </svg>
        )
      case "facebook":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        )
      case "twitter":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        )
      case "website":
      case "other":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        )
    }
  }

  // Get platform background color
  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "bg-red-600"
      case "instagram":
        return "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400"
      case "tiktok":
        return "bg-black"
      case "facebook":
        return "bg-blue-600"
      case "twitter":
        return "bg-black"
      case "website":
      case "other":
      default:
        return "bg-purple-600"
    }
  }

  // Get platform display name
  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "YouTube"
      case "instagram":
        return "Instagram"
      case "tiktok":
        return "TikTok"
      case "facebook":
        return "Facebook"
      case "twitter":
        return "X/Twitter"
      case "website":
        return "Website"
      case "other":
        return "Other"
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Traffic Sources</CardTitle>
        <CardDescription className="text-muted-foreground">
          Connect at least one platform where you plan to promote advertiser
          products. The more platforms you connect, the higher your chances of
          approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "tiktok", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-black">
                    {getPlatformIcon("tiktok")}
                  </div>
                  <span>TikTok</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>

              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "instagram", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400">
                    {getPlatformIcon("instagram")}
                  </div>
                  <span>Instagram</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>

              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "youtube", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-red-600">
                    {getPlatformIcon("youtube")}
                  </div>
                  <span>YouTube</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>

              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "facebook", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-blue-600">
                    {getPlatformIcon("facebook")}
                  </div>
                  <span>Facebook</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>

              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "twitter", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-black">
                    {getPlatformIcon("twitter")}
                  </div>
                  <span>X/Twitter</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>

              <div
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                onClick={() => {
                  setNewSource({ platform: "other", url: "" })
                  setIsAddDialogOpen(true)
                }}
              >
                <div className="flex items-center">
                  <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-purple-600">
                    {getPlatformIcon("other")}
                  </div>
                  <span>Other</span>
                </div>
                <button
                  type="button"
                  className="flex items-center text-primary"
                >
                  <Plus size={16} />
                  <span className="ml-1">Add</span>
                </button>
              </div>
            </div>

            {sources.length > 0 && (
              <div className="mt-8 rounded-lg border p-4">
                <p className="mb-2 font-medium">Connected accounts</p>
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-2 flex size-6 items-center justify-center rounded-full ${getPlatformBgColor(source.platform)}`}
                        >
                          {getPlatformIcon(source.platform)}
                        </div>
                        <span className="text-sm">{source.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSource(source.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add Traffic Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              URL for {getPlatformDisplayName(newSource.platform)}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm">Please enter your URL</p>
            <Input
              placeholder="Please enter your URL"
              value={newSource.url}
              onChange={(e) =>
                setNewSource({ ...newSource, url: e.target.value })
              }
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSource}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

