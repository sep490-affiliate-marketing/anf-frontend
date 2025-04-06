"use client"

import { CreditCard, Landmark, Shield, User } from "lucide-react"

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"

import { BankingInfoTab } from "@/components/profile/tabs/BankingInfoTab"
import { PersonalInfoTab } from "@/components/profile/tabs/PersonalInfoTab"
import { SecurityTab } from "@/components/profile/tabs/SecurityTab"
import { WalletHistoryTab } from "@/components/profile/tabs/WalletHistoryTab"

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
        <div className="lg:col-span-8">
          {/* Section 1: Profile Settings */}
          <div>
            <CardHeader className="p-0 pb-5">
              <CardTitle className="text-xl font-semibold">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your personal information and security
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
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
          </div>

          {/* Section 2: Wallet */}
          <div>
            <CardHeader className="px-0 pb-5">
              <CardTitle className="text-xl font-semibold">Wallet</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your banking information and view transaction history
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Tabs defaultValue="walletHistory" className="w-full">
                <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="walletHistory"
                    className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                  >
                    <CreditCard className="size-4" />
                    <span>Wallet History</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bankingInfo"
                    className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                  >
                    <Landmark className="size-4" />
                    <span>Banking Info</span>
                  </TabsTrigger>
                </TabsList>

                <div className="max-h-full overflow-visible">
                 <WalletHistoryTab  /> 
                  <BankingInfoTab />
                </div>
              </Tabs>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
