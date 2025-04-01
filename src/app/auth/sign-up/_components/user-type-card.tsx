"use client"

import { UserRoleEnum } from "@/enums/user-role"
import { Building2, User } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  value: UserRoleEnum
  title: string
  text: string
  userType: UserRoleEnum | undefined
  setUserType: (userType: UserRoleEnum) => void
}

function UserTypeCard({ setUserType, text, title, userType, value }: Props) {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          "mb-4 w-full cursor-pointer",
          userType === value && "border-primary"
        )}
        onClick={() => setUserType(value)}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                "flex justify-center p-3",
                userType === value && "border-primary"
              )}
            >
              {value === UserRoleEnum.PUBLISHER ? (
                <User
                  size={30}
                  className={cn(
                    userType === value ? "text-primary" : "text-gray-400"
                  )}
                />
              ) : (
                <Building2
                  size={30}
                  className={cn(
                    userType === value ? "text-primary" : "text-gray-400"
                  )}
                />
              )}
            </Card>
            <div>
              <CardDescription className="text-iridium">
                {title}
              </CardDescription>
              <CardDescription className="!font-normal text-gray-500">
                {text}
              </CardDescription>
            </div>
          </div>
          <div>
            <div
              className={cn(
                "size-4 rounded-full",
                userType === value ? "bg-primary" : "bg-transparent"
              )}
            >
              <Input
                value={value}
                id={value}
                className="hidden"
                type="radio"
                checked={userType === value}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  )
}

export default UserTypeCard
