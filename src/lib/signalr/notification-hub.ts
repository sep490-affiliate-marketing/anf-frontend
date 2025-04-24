import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr"
import { toast } from "sonner"

import {
  CampaignStatusNotification,
  OfferStatusNotification,
  PublisherOfferStatusNotification,
  UserProfileNotification,
} from "@/types/notification.type"

class NotificationHub {
  private connection: HubConnection | null = null
  private readonly hubUrl: string

  constructor() {
    // Replace with your actual SignalR hub URL
    this.hubUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notiHub`
  }

  public async startConnection(): Promise<void> {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: true,
          accessTokenFactory: () =>
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmltYXJ5c2lkIjoiNTE4MDExMDM1MyIsIm5hbWVpZCI6IkMxOTM0NUJCMEEiLCJlbWFpbCI6ImFkdmVydGlzZXJAZ21haWwuY29tIiwicm9sZSI6IkFkdmVydGlzZXIiLCJuYmYiOjE3NDU0Njk1MTQsImV4cCI6MTc0NTQ3MzExNCwiaWF0IjoxNzQ1NDY5NTE0LCJpc3MiOiJiZS5sM29uLmlkLnZuIiwiYXVkIjoiZGV2Lmwzb24uaWQudm4ifQ.rLNj8faMpfd8RqV0D1T4Rorg3s4seqRsVXgCXXF4Zmw",
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()

      // Set up handlers before starting the connection
      this.setupHandlers()

      await this.connection.start()
      console.log("SignalR Connected")
    } catch (error) {
      console.error("SignalR Connection Error:", error)
    }
  }

  private setupHandlers(): void {
    if (!this.connection) return

    // Handle publisher offer status updates
    this.connection.on(
      "PublisherOfferStatusUpdated",
      (message: PublisherOfferStatusNotification) => {
        const description = message.rejectReason
          ? `Offer status: ${message.status}. Reason: ${message.rejectReason}`
          : `Offer status: ${message.status}`

        toast.info("Publisher Offer Update", {
          description,
          duration: 5000,
        })
      }
    )

    // Handle campaign status updates
    this.connection.on(
      "CampaignStatusUpdated",
      (message: CampaignStatusNotification) => {
        const description = message.rejectReason
          ? `Campaign status: ${message.status}. Reason: ${message.rejectReason}`
          : `Campaign status: ${message.status}`

        toast.info("Campaign Update", {
          description,
          duration: 5000,
        })
      }
    )

    // Handle offer status updates
    this.connection.on(
      "OfferStatusUpdated",
      (message: OfferStatusNotification) => {
        const description = message.rejectReason
          ? `Offer status: ${message.status}. Reason: ${message.rejectReason}`
          : `Offer status: ${message.status}`

        toast.info("Offer Update", {
          description,
          duration: 5000,
        })
      }
    )

    // Handle user profile updates
    this.connection.on(
      "UserProfileUpdated",
      (message: UserProfileNotification) => {
        toast.info("Profile Updated", {
          description: "Your profile information has been updated",
          duration: 5000,
        })
      }
    )

    // Handle connection closed
    this.connection.onclose((error) => {
      console.log("SignalR Connection Closed:", error)
      toast.error("Notification connection lost", {
        description: "Attempting to reconnect...",
      })
    })

    // Handle reconnecting
    this.connection.onreconnecting((error) => {
      console.log("SignalR Reconnecting:", error)
      toast.loading("Reconnecting to notification service...", {
        duration: 0, // Show until manually dismissed
      })
    })

    // Handle reconnected
    this.connection.onreconnected((connectionId) => {
      console.log("SignalR Reconnected:", connectionId)
      toast.success("Reconnected to notification service", {
        description: "You will continue receiving real-time updates",
      })
    })
  }

  public async stopConnection(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.stop()
        console.log("SignalR Disconnected")
      }
    } catch (error) {
      console.error("SignalR Disconnection Error:", error)
    }
  }
}

// Export a singleton instance
export const notificationHub = new NotificationHub()
