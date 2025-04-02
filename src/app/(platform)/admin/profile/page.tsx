"use client"

import { useState } from "react"

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit2,
  Home,
  ImageIcon,
  InfoIcon,
  LogOut,
  Mail,
  Plus,
  Search,
  Shield,
  Terminal,
  User,
  Wallet,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserProfile {
  name: string
  email: string
  title: string
  position: string
  team: string
  salary: number
  joinDate: string
  completionPercentage?: number
  walletBalance: number
}

interface Transaction {
  id: string
  date: string
  type: "credit" | "debit"
  amount: number
  status: "completed" | "pending" | "failed"
  description: string
}

export default function Page() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const [user, setUser] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    title: "Staff",
    position: "Developer",
    team: "Engineering",
    salary: 20000000,
    joinDate: new Date().toLocaleDateString(),
    completionPercentage: 85,
    walletBalance: 5280.42,
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn_1NmKHq2eZvKYlo2CIWEfwCZ3",
      date: "2023-09-15",
      type: "credit",
      amount: 1500,
      status: "completed",
      description: "Deposit from Bank Transfer",
    },
    {
      id: "txn_1NmJpw2eZvKYlo2CbmnSZzjF",
      date: "2023-09-12",
      type: "debit",
      amount: 299.99,
      status: "completed",
      description: "Subscription Payment",
    },
    {
      id: "txn_1NmHvK2eZvKYlo2CQyzxGhJ8",
      date: "2023-09-05",
      type: "credit",
      amount: 4200,
      status: "completed",
      description: "Refund - Invoice #8812",
    },
    {
      id: "txn_1NmGbL2eZvKYlo2CwXrTFgHj",
      date: "2023-08-28",
      type: "debit",
      amount: 149.5,
      status: "completed",
      description: "Service Fee",
    },
    {
      id: "txn_1NmFpR2eZvKYlo2CzPqWxYkL",
      date: "2023-08-20",
      type: "credit",
      amount: 1000,
      status: "completed",
      description: "Deposit from Credit Card",
    },
    {
      id: "txn_1NmDsT2eZvKYlo2CHyTrWzMn",
      date: "2023-08-10",
      type: "debit",
      amount: 750,
      status: "failed",
      description: "Payment Failed - Insufficient Funds",
    },
    {
      id: "txn_1NmCvZ2eZvKYlo2CpKxFbLqR",
      date: "2023-08-05",
      type: "credit",
      amount: 3000,
      status: "completed",
      description: "Bonus Credit",
    },
  ])

  const [addCreditAmount, setAddCreditAmount] = useState<string>("")
  const [selectedBank, setSelectedBank] = useState<string>("")

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <div>
        {/* Breadcrumbs */}
        <div className="mb-4 flex items-center text-sm text-muted-foreground">
          <Home className="size-4" />
          <ChevronRight className="mx-2 size-4" />
          <span>Profile</span>
        </div>

        {/* Welcome Message */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Account Status</p>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
              </span>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-right">
              <p className="text-sm font-medium">Last Login</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar with profile summary and navigation */}
        <div className="space-y-6 lg:col-span-4">
          {/* Profile Summary Card with Work Information */}
          <div className="flex flex-col gap-4">
            <div className="group overflow-hidden border-none transition-all duration-300">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-primary/70 to-primary/90"></div>
                <div className="absolute inset-0 h-32 bg-[url('/profile-pattern.svg')] bg-center opacity-20"></div>
                <div className="absolute bottom-0 right-0 p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Cover Photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    <Avatar className="size-24 border-4 border-background shadow-md transition-all duration-300 group-hover:scale-105">
                      <AvatarFallback className="bg-primary text-3xl font-medium text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-7 rounded-full border-primary/20 bg-background shadow-sm hover:bg-primary/5"
                            >
                              <ImageIcon className="size-3.5 text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Update Avatar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="pb-5 pt-16">
                <div className="flex flex-col items-start">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/10 font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/15"
                    >
                      {user.title}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="size-3.5" />
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <Separator />
              {/* Work Information integrated into Profile Card */}
              <CardContent className="py-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Briefcase className="size-3.5" />
                  <span>Work Information</span>
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                        <Terminal className="size-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Position
                        </p>
                        <p className="mt-0.5 text-sm font-medium">
                          {user.position}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                        <Building className="size-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Team
                        </p>
                        <p className="mt-0.5 text-sm font-medium">
                          {user.team}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="size-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Join Date
                        </p>
                        <p className="mt-0.5 text-sm font-medium">
                          {user.joinDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10">
                        <DollarSign className="size-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Salary
                        </p>
                        <p className="mt-0.5 text-sm font-medium">
                          {formatCurrency(user.salary)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Quick Actions */}
            <Button variant="outline">
              <LogOut className="size-4" />
              <span>Log Out</span>
            </Button>
          </div>

          {/* Wallet Balance Card */}
          <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">
                Wallet Balance
              </h3>
              <Wallet className="size-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-3xl font-bold tracking-tight text-gray-900">
                {formatCurrency(user.walletBalance)}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">USD</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-primary/20 bg-primary/5 text-xs font-medium text-primary shadow-sm hover:bg-primary/10 hover:text-primary"
                onClick={() => setActiveTab("addCredit")}
              >
                <Plus className="mr-1 size-3" />
                Add Credit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-primary/20 text-xs font-medium shadow-sm"
                onClick={() => setActiveTab("walletHistory")}
              >
                <CreditCard className="mr-1 size-3" />
                View History
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Tabbed Interface */}
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
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6 grid w-full grid-cols-4 bg-muted/50 p-1">
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
                </TabsList>

                <div className="max-h-full overflow-visible">
                  <TabsContent value="profile" className="mt-0 space-y-6 pb-4">
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <h3 className="mb-4 font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Full Name
                            </Label>
                            <Input id="name" defaultValue={user.name} />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue={user.email}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notification preferences */}
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <h3 className="mb-4 font-medium">
                          Notification Preferences
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">
                                Email Notifications
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Receive notifications about your account
                                activity via email
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
                                Receive notifications about system updates and
                                maintenance
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
                                Receive notifications about new features and
                                updates
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="px-6 shadow-sm">Save Changes</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-0 space-y-6 pb-4">
                    <div className="space-y-6">
                      {/* Password form */}
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <h3 className="mb-4 font-medium">Change Password</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="current_password"
                              className="text-sm font-medium"
                            >
                              Current Password
                            </Label>
                            <Input id="current_password" type="password" />
                          </div>

                          <div className="border-t border-border/30 pt-2">
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="new_password"
                                  className="text-sm font-medium"
                                >
                                  New Password
                                </Label>
                                <Input id="new_password" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="confirm_password"
                                  className="text-sm font-medium"
                                >
                                  Confirm Password
                                </Label>
                                <Input id="confirm_password" type="password" />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button className="mt-2">Update Password</Button>
                          </div>
                        </div>
                      </div>

                      {/* Login security section */}
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <h3 className="mb-4 font-medium">Login Security</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">
                                Two-Factor Authentication
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">
                                New Device Login Alerts
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Get notified when your account is accessed from
                                a new device
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone - Styled for emphasis */}
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
                        <div className="flex items-start gap-3">
                          <XCircle className="mt-0.5 size-5 text-destructive" />
                          <div className="flex-1">
                            <h3 className="font-medium text-destructive">
                              Danger Zone
                            </h3>
                            <p className="mb-4 mt-1 text-sm text-muted-foreground">
                              Once you delete your account, there is no going
                              back. Please be certain.
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-destructive/90 hover:bg-destructive"
                            >
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Wallet History Tab */}
                  <TabsContent
                    value="walletHistory"
                    className="mt-0 space-y-6 pb-4"
                  >
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Transaction History
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              View your recent wallet activity
                            </p>
                          </div>
                          <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search transactions..."
                              className="w-full pl-9"
                            />
                          </div>
                        </div>

                        <div className="relative overflow-x-auto rounded-md border">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="w-[180px]">
                                  Date
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">
                                  Amount
                                </TableHead>
                                <TableHead className="text-right">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactions.map((transaction) => (
                                <TableRow
                                  key={transaction.id}
                                  className="group hover:bg-muted/40"
                                >
                                  <TableCell className="font-medium">
                                    {new Date(
                                      transaction.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    {transaction.description}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "border-0 px-2 py-0.5 font-medium",
                                        transaction.type === "credit"
                                          ? "bg-green-50 text-green-700"
                                          : "bg-blue-50 text-blue-700"
                                      )}
                                    >
                                      <span className="flex items-center gap-1">
                                        {transaction.type === "credit" ? (
                                          <ArrowDownToLine className="size-3" />
                                        ) : (
                                          <ArrowUpFromLine className="size-3" />
                                        )}
                                        {transaction.type === "credit"
                                          ? "Credit"
                                          : "Debit"}
                                      </span>
                                    </Badge>
                                  </TableCell>
                                  <TableCell
                                    className={cn(
                                      "text-right font-medium",
                                      transaction.type === "credit"
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    )}
                                  >
                                    {transaction.type === "credit" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "border-0 font-normal",
                                        transaction.status === "completed"
                                          ? "bg-green-50 text-green-700"
                                          : transaction.status === "pending"
                                            ? "bg-yellow-50 text-yellow-700"
                                            : "bg-red-50 text-red-700"
                                      )}
                                    >
                                      {transaction.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                          <p>Showing {transactions.length} transactions</p>
                          <Button variant="outline" size="sm" className="gap-1">
                            Download CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Add Credit Tab */}
                  <TabsContent
                    value="addCredit"
                    className="mt-0 space-y-6 pb-4"
                  >
                    <div className="space-y-6">
                      {/* Add Credit Form */}
                      <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                        <h3 className="mb-1 text-lg font-medium">
                          Add Credit to Your Account
                        </h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                          Add funds to your wallet balance for easy payments
                        </p>

                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <Label
                                htmlFor="payment-method"
                                className="text-sm font-medium"
                              >
                                Select Payment Method
                              </Label>
                              <Select
                                value={selectedBank}
                                onValueChange={setSelectedBank}
                              >
                                <SelectTrigger className="h-11 w-full">
                                  <SelectValue placeholder="Select your bank" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="chase">
                                    Chase Bank
                                  </SelectItem>
                                  <SelectItem value="bofa">
                                    Bank of America
                                  </SelectItem>
                                  <SelectItem value="wells">
                                    Wells Fargo
                                  </SelectItem>
                                  <SelectItem value="citi">Citibank</SelectItem>
                                  <SelectItem value="discover">
                                    Discover
                                  </SelectItem>
                                  <SelectItem value="other">
                                    Other Bank
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3">
                              <Label
                                htmlFor="amount"
                                className="text-sm font-medium"
                              >
                                Amount to Add
                              </Label>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <DollarSign className="size-4 text-gray-400" />
                                </div>
                                <Input
                                  id="amount"
                                  type="number"
                                  placeholder="0.00"
                                  className="h-11 pl-9"
                                  value={addCreditAmount}
                                  onChange={(e) =>
                                    setAddCreditAmount(e.target.value)
                                  }
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Minimum amount: $10.00
                              </p>
                            </div>

                            <div className="space-y-3 pt-3">
                              <Button
                                className="h-11 w-full bg-primary/90 text-sm font-medium shadow-sm transition-all hover:bg-primary"
                                disabled={
                                  !selectedBank ||
                                  !addCreditAmount ||
                                  parseFloat(addCreditAmount) < 10
                                }
                              >
                                Add Funds
                              </Button>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-muted/30 p-5">
                            <h4 className="flex items-center gap-1.5 font-medium">
                              <InfoIcon className="size-4 text-primary" />
                              Payment Information
                            </h4>
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                                <span className="text-sm text-muted-foreground">
                                  Current Balance
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(user.walletBalance)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                                <span className="text-sm text-muted-foreground">
                                  Amount to Add
                                </span>
                                <span className="font-medium">
                                  {addCreditAmount
                                    ? formatCurrency(
                                        parseFloat(addCreditAmount)
                                      )
                                    : "$0.00"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pb-1 pt-1">
                                <span className="text-sm font-medium">
                                  New Balance
                                </span>
                                <span className="font-medium text-primary">
                                  {formatCurrency(
                                    user.walletBalance +
                                      (addCreditAmount
                                        ? parseFloat(addCreditAmount)
                                        : 0)
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="mt-6 rounded-md bg-primary/5 p-3 text-xs text-muted-foreground">
                              <p className="flex items-start gap-1.5">
                                <InfoIcon className="mt-0.5 size-3 text-primary" />
                                <span>
                                  Funds will be available in your account
                                  immediately after the transaction is
                                  processed.
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
