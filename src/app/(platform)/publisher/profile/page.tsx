"use client"

import { Shield, User } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { PersonalInfoTab } from "@/components/profile/tabs/PersonalInfoTab"
import { SecurityTab } from "@/components/profile/tabs/SecurityTab"
import { TrafficSourcesSection } from "@/components/publisher/profile/TrafficSourcesSection"

export default function Page() {
  return (
    <div className="space-y-8 pb-10">
      <ProfileHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="space-y-8 lg:col-span-8">
          {/* Section 1: Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your personal information and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="profile"
                    className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                  >
                    <User className="size-4" />
                    <span>Personal Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                  >
                    <Shield className="size-4" />
                    <span>Security</span>
                  </TabsTrigger>
                </TabsList>

                <div className="max-h-full overflow-visible">
                  <PersonalInfoTab />
                  <SecurityTab />
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Section 2: Traffic Sources */}
          <TrafficSourcesSection />
        </div>
      </div>
    </div>
  )
}
