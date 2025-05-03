"use client"

import { useState } from "react"
import { Suspense } from "react"

import { CreditCard, History, PlusCircle, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import TicketDataTable from "@/components/advertiser/tickets/data-table"
import { Spinner } from "@/components/spinner"

// Mock data for tickets
const mockTickets = [
  {
    id: "T-1001",
    publisherId: "P-5432",
    publisherName: "TopAffiliates",
    campaignId: "C-789",
    campaignName: "Summer Sale",
    issueType: "Click Fraud",
    description: "Detected unusual click patterns from this publisher",
    dateSubmitted: "2023-10-15",
    status: "open",
    lastUpdated: "2023-10-15",
  },
  {
    id: "T-1002",
    publisherId: "P-2187",
    publisherName: "MarketBoost",
    campaignId: "C-456",
    campaignName: "Holiday Promo",
    issueType: "Lead Quality",
    description: "Leads provided were all using fake contact information",
    dateSubmitted: "2023-09-28",
    status: "approved",
    lastUpdated: "2023-10-02",
  },
  {
    id: "T-1003",
    publisherId: "P-9075",
    publisherName: "AffiliatePro",
    campaignId: "C-123",
    campaignName: "Black Friday",
    issueType: "Conversion Manipulation",
    description: "Publisher seems to be manipulating conversion tracking",
    dateSubmitted: "2023-10-05",
    status: "rejected",
    lastUpdated: "2023-10-12",
  },
  {
    id: "T-1004",
    publisherId: "P-3421",
    publisherName: "GrowthPartners",
    campaignId: "C-789",
    campaignName: "Summer Sale",
    issueType: "Policy Violation",
    description: "Publisher using prohibited advertising methods",
    dateSubmitted: "2023-10-10",
    status: "rejected",
    lastUpdated: "2023-10-14",
  },
  {
    id: "T-1005",
    publisherId: "P-5432",
    publisherName: "TopAffiliates",
    campaignId: "C-456",
    campaignName: "Holiday Promo",
    issueType: "Click Fraud",
    description: "Abnormal click-to-conversion ratio detected",
    dateSubmitted: "2023-10-13",
    status: "approved",
    lastUpdated: "2023-10-13",
  },
]

// Map for status badge styling
const statusStyles = {
  open: { variant: "default", label: "Open", class: "bg-blue-500" },
  approved: {
    variant: "default",
    label: "Approved",
    class: "bg-green-500",
  },
  rejected: {
    variant: "outline",
    label: "Rejected",
    class: "border-red-500 text-red-500",
  },
}

// Mock campaigns for select dropdown
const mockCampaigns = [
  { id: "C-123", name: "Black Friday" },
  { id: "C-456", name: "Holiday Promo" },
  { id: "C-789", name: "Summer Sale" },
  { id: "none", name: "None" },
]

// Mock publishers for select dropdown
const mockPublishers = [
  { id: "P-5432", name: "TopAffiliates" },
  { id: "P-2187", name: "MarketBoost" },
  { id: "P-9075", name: "AffiliatePro" },
  { id: "P-3421", name: "GrowthPartners" },
  { id: "none", name: "None" },
]

// Issue types for select dropdown
const issueTypes = [
  "Click Fraud",
  "Lead Quality",
  "Conversion Manipulation",
  "Policy Violation",
  "Payment Issue",
  "Other",
]

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [selectedIssueType, setSelectedIssueType] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [selectedPublisher, setSelectedPublisher] = useState("")

  // Handle form reset
  const resetForm = () => {
    setSelectedIssueType("")
    setSelectedCampaign("")
    setSelectedPublisher("")
  }

  // Handle form submission - would connect to API in a real app
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Would handle actual submission here
    setIsDialogOpen(false)
    resetForm()
    // This would add the new ticket to the list in a real application
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Support Tickets
            </h1>
            <p className="text-sm text-muted-foreground">
              Report and track issues with publishers
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-1">
                <PlusCircle className="size-4" />
                <span>New Ticket</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Report issues with publishers or campaigns
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitTicket} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="issueType">
                    Issue Type
                  </label>
                  <Select
                    required
                    value={selectedIssueType}
                    onValueChange={setSelectedIssueType}
                  >
                    <SelectTrigger id="issueType">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="campaign">
                    Campaign
                  </label>
                  <Select
                    required
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                    disabled={!selectedIssueType}
                  >
                    <SelectTrigger id="campaign">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCampaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="publisher">
                    Publisher
                  </label>
                  <Select
                    required
                    value={selectedPublisher}
                    onValueChange={setSelectedPublisher}
                    disabled={!selectedCampaign}
                  >
                    <SelectTrigger id="publisher">
                      <SelectValue placeholder="Select publisher" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPublishers.map((publisher) => (
                        <SelectItem key={publisher.id} value={publisher.id}>
                          {publisher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the issue"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit Ticket</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <Ticket className="size-4" />
            <span>All Tickets</span>
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <CreditCard className="size-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <History className="size-4" />
            <span>Rejected</span>
          </TabsTrigger>
        </TabsList>

        <div className="max-h-full overflow-visible">
          <TabsContent value="all" className="mt-0">
            <section className="space-y-4">
              <Suspense fallback={<Spinner />}>
                <TicketDataTable status="all" />
              </Suspense>
            </section>
          </TabsContent>

          <TabsContent value="approved" className="mt-0">
            <section className="space-y-4">
              <Suspense fallback={<Spinner />}>
                <TicketDataTable status="approved" />
              </Suspense>
            </section>
          </TabsContent>

          <TabsContent value="rejected" className="mt-0">
            <section className="space-y-4">
              <Suspense fallback={<Spinner />}>
                <TicketDataTable status="rejected" />
              </Suspense>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
