"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

export default function SelectCountryModal() {
  const [open, setOpen] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const router = useRouter()
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
    // Add more countries as needed
  ])

  const handleContinue = () => {
    if (selectedCountry) {
      // Here you can handle the selected country
      // For example, store it in state management or make an API call
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Country</DialogTitle>
          <DialogDescription>
            Please select a country to continue managing carriers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries
                  .filter((country) => country.status === "active")
                  .map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleContinue} disabled={!selectedCountry}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
