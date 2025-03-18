"use client"

import { useState } from "react"

import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Country = {
  id: string
  name: string
  code: string
  status: "active" | "inactive"
}

export default function CreateCarrierModal() {
  const [countries, setCountries] = useState<Country[]>([
    // Sample data - replace with actual API call
    {
      id: "1",
      name: "Vietnam",
      code: "VN",
      status: "active",
    },
    {
      id: "2",
      name: "Denmark",
      code: "DK",
      status: "active",
    },
  ])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add carrier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create new carrier</DialogTitle>
          <DialogDescription>
            Add a new carrier to the selected country
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Select>
                <SelectTrigger id="countryCode">
                  <SelectValue placeholder="Select country code" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .filter((country) => country.status === "active")
                    .map((country) => (
                      <SelectItem key={country.id} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carrierName">Carrier Name</Label>
              <Input
                id="carrierName"
                placeholder="Enter carrier name"
                className="w-full"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mcc">Mobile Country Code (MCC)</Label>
              <Input
                id="mcc"
                placeholder="Enter MCC"
                className="w-full"
                maxLength={3}
                pattern="[0-9]{3}"
                title="MCC must be a 3-digit number"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mnc">Mobile Network Code (MNC)</Label>
              <Input
                id="mnc"
                placeholder="Enter MNC"
                className="w-full"
                maxLength={2}
                pattern="[0-9]{2}"
                title="MNC must be a 2-digit number"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogTrigger>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
