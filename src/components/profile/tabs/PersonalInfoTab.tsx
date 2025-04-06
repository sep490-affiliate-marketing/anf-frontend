"use client"

import { useState } from "react"

import { useAuth } from "@/providers/auth-provider"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"

export function PersonalInfoTab() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = () => {
    // In a real app, this would call an API to update the user's profile
    console.log("Saving changes:", formData)
  }

  return (
    <TabsContent value="profile" className="mt-0 space-y-6 pb-4">
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={user?.phoneNumber || ""}
                placeholder="Enter your phone number"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-medium">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications about your account activity via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  System Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications about system updates and maintenance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Update Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications about new features and updates
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="px-6 shadow-sm" onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>
    </TabsContent>
  )
}
