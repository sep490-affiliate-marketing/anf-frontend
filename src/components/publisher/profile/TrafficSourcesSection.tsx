"use client"

import { useState } from "react"

import * as z from "zod"
import { AFFILIATE_SOURCE } from "@/constant/campaign"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  TrafficSource,
  useAddTrafficSource,
  useDeleteTrafficSource,
  useGetPublisherTrafficSources,
} from "@/hooks/traffic-source"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

// Array of supported platforms for quick access
const SUPPORTED_PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    bgColor: "bg-black",
  },
  {
    id: "instagram",
    name: "Instagram",
    bgColor: "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400",
  },
  {
    id: "youtube",
    name: "YouTube",
    bgColor: "bg-red-600",
  },
  {
    id: "facebook",
    name: "Facebook",
    bgColor: "bg-blue-600",
  },
  {
    id: "twitter",
    name: "X/Twitter",
    bgColor: "bg-black",
  },
  {
    id: "other",
    name: "Other",
    bgColor: "bg-purple-600",
  },
]

const formSchema = z.object({
  provider: z.string().optional(),
  sourceUrl: z.string().url("Must be a valid URL"),
  type: z.string().optional(),
})

export function TrafficSourcesSection() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingSourceUrl, setDeletingSourceUrl] = useState("")

  // Fetch traffic sources
  const {
    data: trafficSources = [],
    isLoading,
    refetch,
    isError,
  } = useGetPublisherTrafficSources()

  // Add traffic source mutation
  const { mutate: addTrafficSource, isPending: isAddingSource } =
    useAddTrafficSource()

  // Delete traffic source mutation
  const { mutate: deleteTrafficSource } = useDeleteTrafficSource()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      sourceUrl: "",
      type: "",
    },
  })

  // Open dialog for adding traffic source
  const openAddDialog = (platform: string) => {
    setCurrentPlatform(platform)
    form.reset({
      provider: platform === "other" ? "" : platform,
      sourceUrl: "",
      type: "",
    })
    setIsAddDialogOpen(true)
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // For non-"other" platforms, we already know the provider and type is not needed
    if (currentPlatform !== "other") {
      addTrafficSource(
        [
          {
            provider: currentPlatform,
            sourceUrl: values.sourceUrl,
            type: currentPlatform,
          },
        ],
        {
          onSuccess: () => {
            setIsAddDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      // For "other" platforms, we need the provider and type from the form
      if (!values.provider) {
        form.setError("provider", {
          message: "Provider name is required for 'Other' sources",
        })
        return
      }

      if (!values.type) {
        form.setError("type", {
          message: "Source type is required for 'Other' sources",
        })
        return
      }

      addTrafficSource(
        [
          {
            provider: values.provider,
            sourceUrl: values.sourceUrl,
            type: values.type,
          },
        ],
        {
          onSuccess: () => {
            setIsAddDialogOpen(false)
            form.reset()
          },
        }
      )
    }
  }

  // Open delete confirmation dialog
  const confirmDelete = (source: TrafficSource) => {
    setSourceToDelete(String(source.id))
    setDeletingSourceUrl(source.sourceUrl)
    setIsDeleteDialogOpen(true)
  }

  // Delete a traffic source
  const handleDeleteSource = () => {
    if (!sourceToDelete) return

    setIsDeleting(sourceToDelete)
    deleteTrafficSource(sourceToDelete, {
      onSuccess: () => {
        setIsDeleting(null)
        setSourceToDelete(null)
        setIsDeleteDialogOpen(false)
      },
      onError: () => {
        setIsDeleting(null)
        setSourceToDelete(null)
        setIsDeleteDialogOpen(false)
      },
    })
  }

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
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
    switch (platform.toLowerCase()) {
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

  // Get platform type from source type
  const getPlatformFromType = (type: string) => {
    if (
      [
        "youtube",
        "instagram",
        "tiktok",
        "facebook",
        "twitter",
        "website",
      ].includes(type.toLowerCase())
    ) {
      return type.toLowerCase()
    }
    return "other"
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="flex cursor-pointer items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
                  onClick={() => openAddDialog(platform.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-2 flex size-8 items-center justify-center rounded-full ${platform.bgColor}`}
                    >
                      {getPlatformIcon(platform.id)}
                    </div>
                    <span>{platform.name}</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center text-primary"
                  >
                    <Plus size={16} />
                    <span className="ml-1">Add</span>
                  </button>
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="mt-8 rounded-lg border p-4">
                <p className="mb-4 font-medium">Connected accounts</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center">
                        <Skeleton className="mr-2 size-6 rounded-full" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <Skeleton className="size-4" />
                    </div>
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="mt-8 rounded-lg border p-4 text-center">
                <p className="text-red-500">
                  Error loading your traffic sources. Please try again.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => refetch()}
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            ) : trafficSources.length > 0 ? (
              <div className="mt-8 rounded-lg border p-4">
                <p className="mb-2 font-medium">Connected accounts</p>
                <div className="space-y-2">
                  {trafficSources.map((source) => {
                    const platform = getPlatformFromType(source.type || "")
                    return (
                      <div
                        key={source.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-2 flex size-6 items-center justify-center rounded-full ${getPlatformBgColor(platform)}`}
                          >
                            {getPlatformIcon(platform)}
                          </div>
                          <span className="text-sm">{source.sourceUrl}</span>
                        </div>
                        <button
                          type="button"
                          disabled={isDeleting === String(source.id)}
                          onClick={() => confirmDelete(source)}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          aria-label="Delete traffic source"
                        >
                          {isDeleting === String(source.id) ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed p-4 text-center">
                <p className="text-muted-foreground">
                  No traffic sources connected yet. Add at least one to improve
                  your approval chances.
                </p>
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
              {currentPlatform === "other"
                ? "Add Other Traffic Source"
                : `Add ${SUPPORTED_PLATFORMS.find((p) => p.id === currentPlatform)?.name || ""} URL`}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              {currentPlatform === "other" && (
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter provider name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          currentPlatform === "other"
                            ? "https://example.com"
                            : `https://${currentPlatform}.com/your-profile`
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentPlatform === "other" && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Source Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select traffic source type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AFFILIATE_SOURCE.map((source) => (
                            <SelectItem key={source.id} value={source.name}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isAddingSource}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingSource}>
                  {isAddingSource ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Source"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the traffic source{" "}
              <span className="font-medium">{deletingSourceUrl}</span> from your
              account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSourceToDelete(null)
                setDeletingSourceUrl("")
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!!isDeleting}
              onClick={handleDeleteSource}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

