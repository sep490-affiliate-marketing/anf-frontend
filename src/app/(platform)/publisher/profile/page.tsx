"use client"

import { CreditCard, Landmark, Plus, Shield, User } from "lucide-react"

import { cn } from "@/lib/utils"

import { useProfile } from "@/hooks/profile"

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { AddCreditTab } from "@/components/profile/tabs/AddCreditTab"
import { BankingInfoTab } from "@/components/profile/tabs/BankingInfoTab"
import { PersonalInfoTab } from "@/components/profile/tabs/PersonalInfoTab"
import { SecurityTab } from "@/components/profile/tabs/SecurityTab"
import { WalletHistoryTab } from "@/components/profile/tabs/WalletHistoryTab"

export default function Page() {
  const profile = useProfile()
  const { activeTab, setActiveTab } = profile

  return (
    <div className="space-y-8 pb-10">
      <ProfileHeader userName={profile.user.name} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <ProfileSidebar profile={profile} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="border-none">
            <CardHeader className="pb-2">
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs
                defaultValue="profile"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6 grid w-full grid-cols-5 bg-muted/50 p-1">
                  <TabsTrigger
                    value="profile"
                    className={cn(
                      "gap-2 rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === "profile"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <User className="size-4" />
                    <span>Personal Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className={cn(
                      "gap-2 rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === "security"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <Shield className="size-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="walletHistory"
                    className={cn(
                      "gap-2 rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === "walletHistory"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <CreditCard className="size-4" />
                    <span>Wallet History</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="addCredit"
                    className={cn(
                      "gap-2 rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === "addCredit"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <Plus className="size-4" />
                    <span>Add Credit</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bankingInfo"
                    className={cn(
                      "gap-2 rounded-md transition-all data-[state=active]:shadow-sm",
                      activeTab === "bankingInfo"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    <Landmark className="size-4" />
                    <span>Banking Info</span>
                  </TabsTrigger>
                </TabsList>

                <div className="max-h-full overflow-visible">
                  <PersonalInfoTab profile={profile} />
                  <SecurityTab />
                  <WalletHistoryTab profile={profile} />
                  <AddCreditTab profile={profile} />
                  <BankingInfoTab profile={profile} />
                </div>
              </Tabs>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
