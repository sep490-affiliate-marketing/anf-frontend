import {
  authQueryKeys,
  campaignQueryKeys,
  transactionQueryKeys,
} from "@/constant/react-query"
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr"
import { QueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { toast } from "sonner"

import {
  CampaignCreatedNotification,
  CampaignStatusNotification,
  NotifyRequestToJoinOfferNotification,
  OfferStatusNotification,
  PublisherOfferStatusNotification,
  UserProfileNotification,
} from "@/types/notification.type"

class NotificationHub {
  private connection: HubConnection | null = null
  private readonly hubUrl: string
  private queryClient: QueryClient
  private userRole: string

  constructor(queryClient: QueryClient, userRole: string) {
    this.hubUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notiHub`
    this.queryClient = queryClient
    this.userRole = userRole
  }

  public async startConnection(): Promise<void> {
    try {
      const accessToken = Cookies.get("access_token")
      if (!accessToken) {
        console.error("No access token found")
        return
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: true,
          accessTokenFactory: () => accessToken,
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
          action: {
            label: "View Details",
            onClick: () => {
              window.location.href = `/publisher/campaigns/${message.campaignId}`
            },
          },
        })
        this.queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.publisher.details(message.campaignId),
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
          action: {
            label: "View Details",
            onClick: () => {
              window.location.href = `/advertiser/campaigns/${message.campaignId}`
            },
          },
        })

        this.queryClient.invalidateQueries({
          queryKey: campaignQueryKeys.advertiser.list(
            message?.userCode ?? "",
            1,
            10
          ),
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
          description: "Your wallet has been updated",
          duration: 5000,
          action: {
            label: "View Wallet",
            onClick: () => {
              window.location.href = `/${this.userRole === "Advertiser" ? "advertiser" : "publisher"}/transactions`
            },
          },
        })
        this.queryClient.invalidateQueries({
          queryKey: authQueryKeys.me(),
        })
        this.queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.walletHistory(
            message?.userCode ?? "",
            1,
            10
          ),
        })
      }
    )

    this.connection.on(
      "NotifyRequestToJoinOffer",
      (message: NotifyRequestToJoinOfferNotification) => {
        toast.info("Offer Request", {
          description: "A new offer request has been made",
          duration: 5000,
          action: {
            label: "View Details",
            onClick: () => {
              window.location.href = `/advertiser/campaigns/${message.campaignId}/offers/${message.offerId}#publishers`
            },
          },
        })
      }
    )

    this.connection.on(
      "CampaignCreated",
      (message: CampaignCreatedNotification) => {
        toast.info("Campaign Created", {
          description: "A new campaign has been created",
          duration: 5000,
          action: {
            label: "View Details",
            onClick: () => {
              window.location.href = `/admin/campaigns/${message.campaignId}`
            },
          },
        })
      }
    )
    // Handle connection closed
    this.connection.onclose((error) => {
      console.log("SignalR Connection Closed:", error)
      // toast.error("Notification connection lost", {
      //   description: "Attempting to reconnect...",
      // })
    })

    // Handle reconnecting
    this.connection.onreconnecting((error) => {
      console.log("SignalR Reconnecting:", error)
      // toast.loading("Reconnecting to notification service...", {
      //   duration: 0, // Show until manually dismissed
      // })
    })

    // Handle reconnected
    this.connection.onreconnected((connectionId) => {
      console.log("SignalR Reconnected:", connectionId)
      // toast.success("Reconnected to notification service", {
      //   description: "You will continue receiving real-time updates",
      // })
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

let notificationHubInstance: NotificationHub | null = null

export function initNotificationHub(
  queryClient: QueryClient,
  userRole: string
) {
  if (!notificationHubInstance) {
    notificationHubInstance = new NotificationHub(queryClient, userRole)
  }
  return notificationHubInstance
}
