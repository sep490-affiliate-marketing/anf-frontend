"use client"

import { useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { format } from "date-fns"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportFiltersProps {
  onFilterChange?: (filters: any) => void
  filterOptions?: {
    campaigns?: { id: string; name: string }[]
    sources?: { id: string; name: string }[]
    statuses?: { id: string; name: string }[]
    countries?: { id: string; name: string }[]
  }
  showCampaignFilter?: boolean
  showSourceFilter?: boolean
  showStatusFilter?: boolean
  showCountryFilter?: boolean
}

export function ReportFilters({
  onFilterChange,
  filterOptions,
  showCampaignFilter = true,
  showSourceFilter = false,
  showStatusFilter = false,
  showCountryFilter = false,
}: ReportFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [campaign, setCampaign] = useState<string>("all")
  const [source, setSource] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [country, setCountry] = useState<string>("all")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")

    if (campaign && campaign !== "all") params.set("campaignId", campaign)
    else params.delete("campaignId")

    if (source && source !== "all") params.set("source", source)
    else params.delete("source")

    if (status && status !== "all") params.set("status", status)
    else params.delete("status")

    if (country && country !== "all") params.set("country", country)
    else params.delete("country")

    if (date?.from) params.set("from", date.from.toISOString().split("T")[0])
    else params.delete("from")

    if (date?.to) params.set("to", date.to.toISOString().split("T")[0])
    else params.delete("to")

    router.push(`?${params.toString()}`)

    if (onFilterChange) {
      onFilterChange({
        search: searchTerm,
        campaignId: campaign,
        source,
        status,
        country,
        dateRange: date,
      })
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setCampaign("all")
    setSource("all")
    setStatus("all")
    setCountry("all")
    setDate({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    })

    router.push(window.location.pathname)

    if (onFilterChange) {
      onFilterChange({
        search: "",
        campaignId: "all",
        source: "all",
        status: "all",
        country: "all",
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          to: new Date(),
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="peer pe-9 ps-9"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Search className="size-4" />
            </div>
          </div>
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left md:w-auto",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Campaign Filter */}
        {showCampaignFilter && (
          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {filterOptions?.campaigns?.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Source Filter */}
        {showSourceFilter && (
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {filterOptions?.sources?.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Status Filter */}
        {showStatusFilter && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {filterOptions?.statuses?.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Country Filter */}
        {showCountryFilter && (
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {filterOptions?.countries?.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2 md:ml-auto">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSearch} className="gap-2">
            <Filter className="size-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
