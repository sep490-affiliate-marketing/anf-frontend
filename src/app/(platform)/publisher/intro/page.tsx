"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  affiliateSource: z.string().min(3, {
    message: "Affiliate source must be at least 3 characters.",
  }),
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      affiliateSource: "",
    },
  })

  const [connectedAccounts, setConnectedAccounts] = useState<
    Array<{ platform: string; url: string }>
  >([
    { platform: "youtube", url: "https://www.youtube.com/@YourChannel" },
    { platform: "other", url: "https://yourwebsite.com" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")

  function handleAddAccount(platform: string) {
    setCurrentPlatform(platform)
    setNewUrl("")
    setIsModalOpen(true)
  }

  function handleConfirmAddAccount() {
    if (newUrl.trim()) {
      setConnectedAccounts([
        ...connectedAccounts,
        { platform: currentPlatform, url: newUrl },
      ])
      setIsModalOpen(false)
    }
  }

  function handleRemoveAccount(index: number) {
    const newAccounts = [...connectedAccounts]
    newAccounts.splice(index, 1)
    setConnectedAccounts(newAccounts)
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>

        <Card className="overflow-hidden border-purple-100 shadow-lg">
          <CardHeader className="border-b border-purple-100 pb-6">
            <CardTitle className="text-center text-2xl font-bold text-purple-900">
              Join Our Affiliate Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-3">
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="font-medium text-purple-800">
                    Connect your traffic sources
                  </span>
                  <span className="ml-1 text-red-500">*</span>
                </div>

                <div>
                  <p className="mb-4 text-sm text-gray-600">
                    Connect{" "}
                    <span className="font-medium text-purple-600">
                      at least one platform
                    </span>{" "}
                    where you plan to promote our products. The more platforms
                    you connect, the higher your chances of approval.
                    <a
                      href="#"
                      className="ml-1 font-medium text-purple-600 hover:text-purple-800"
                    >
                      Learn more
                    </a>
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-black">
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
                        </div>
                        <span className="font-medium">TikTok</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("tiktok")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400">
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
                            <rect
                              width="20"
                              height="20"
                              x="2"
                              y="2"
                              rx="5"
                              ry="5"
                            ></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                        </div>
                        <span className="font-medium">Instagram</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("instagram")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-red-600">
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
                        </div>
                        <span className="font-medium">YouTube</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("youtube")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-blue-600">
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
                        </div>
                        <span className="font-medium">Facebook</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("facebook")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-black">
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
                        </div>
                        <span className="font-medium">X/Twitter</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("twitter")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-purple-100 p-3 transition-colors hover:bg-purple-50">
                      <div className="flex items-center">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-purple-600">
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
                        </div>
                        <span className="font-medium">Other</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAccount("other")}
                        className="flex items-center font-medium text-purple-600 hover:text-purple-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        <span className="ml-1">Add</span>
                      </button>
                    </div>
                  </div>

                  {connectedAccounts.length > 0 && (
                    <div className="mt-8 rounded-lg border border-purple-100 p-4">
                      <p className="mb-3 text-sm font-medium text-purple-900">
                        Connected accounts
                      </p>
                      <div className="space-y-3">
                        {connectedAccounts.map((account, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-purple-100 pb-3"
                          >
                            <div className="flex items-center">
                              <div
                                className={`mr-2 flex size-6 items-center justify-center rounded-full ${
                                  account.platform === "youtube"
                                    ? "bg-red-600"
                                    : account.platform === "instagram"
                                      ? "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400"
                                      : account.platform === "tiktok"
                                        ? "bg-black"
                                        : account.platform === "facebook"
                                          ? "bg-blue-600"
                                          : account.platform === "twitter"
                                            ? "bg-black"
                                            : "bg-purple-600"
                                }`}
                              >
                                {account.platform === "youtube" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
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
                                )}
                                {account.platform === "other" && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
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
                                )}
                              </div>
                              <span className="text-sm text-gray-800">
                                {account.url}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAccount(index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm font-medium text-green-600">
                        Your platforms have been successfully connected!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  className="mr-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I confirm that the information provided is accurate and I
                  agree to the
                  <span className="font-semibold text-primary">
                    {" "}
                    Terms of Service & Privacy Policy
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-purple-600 to-purple-700 py-3 font-medium text-white shadow-sm hover:from-purple-700 hover:to-purple-800"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Social Media URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Please enter your {currentPlatform} URL
              </p>
              <Input
                type="text"
                className="w-full border-purple-200 focus-visible:border-purple-500 focus-visible:ring-purple-500/50"
                placeholder="https://"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddAccount}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

