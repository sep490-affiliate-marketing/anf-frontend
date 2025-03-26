export const authQueryKeys = {
  origin: ["auth"] as const,
  me: () => [...authQueryKeys.origin, "me"] as const,
  login: () => [...authQueryKeys.origin, "login"] as const,
  register: () => [...authQueryKeys.origin, "register"] as const,
  forgotPassword: () => [...authQueryKeys.origin, "forgot-password"] as const,
  resetPassword: () => [...authQueryKeys.origin, "reset-password"] as const,
  logout: () => [...authQueryKeys.origin, "logout"] as const,
}

export const campaignQueryKeys = {
  origin: ["campaigns"] as const,

  admin: {
    list: (page: number, limit: number) =>
      [...campaignQueryKeys.origin, "admin", "list", { page, limit }] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "admin", "details", id] as const,
  },

  advertiser: {
    list: (advertiserId: string, page: number, limit: number) =>
      [
        ...campaignQueryKeys.origin,
        "advertiser",
        advertiserId,
        "list",
        { page, limit },
      ] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "advertiser", "details", id] as const,
  },

  publisher: {
    list: (publisherId: number, page: number, limit: number) =>
      [
        ...campaignQueryKeys.origin,
        "publisher",
        publisherId,
        "list",
        { page, limit },
      ] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "publisher", "details", id] as const,
  },
}
