"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Spinner } from "@/components/spinner"

export default function LogoutDialog({ isOpen }: { isOpen: boolean }) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="flex w-72 flex-col items-center justify-center">
        <AlertDialogTitle className="sr-only">Logging Out</AlertDialogTitle>
        <Spinner noPadding />
        <p className="text-base text-muted-foreground">Signing out...</p>
      </AlertDialogContent>
    </AlertDialog>
  )
}
