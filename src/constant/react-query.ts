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

  global: {
    details: (campaignId: string) =>
      [...campaignQueryKeys.origin, "global", "details", campaignId] as const,
    listActive: (page: number, limit: number) =>
      [
        ...campaignQueryKeys.origin,
        "global",
        "active",
        { page, limit },
      ] as const,
  },

  admin: {
    list: (page: number, limit: number) =>
      [...campaignQueryKeys.origin, "admin", "list", { page, limit }] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "admin", "details", id] as const,
  },

  advertiser: {
    list: (advertiserCode: string, page: number, limit: number) =>
      [
        ...campaignQueryKeys.origin,
        "advertiser",
        advertiserCode,
        "list",
        { page, limit },
      ] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "advertiser", "details", id] as const,
    create: () =>
      [...campaignQueryKeys.origin, "advertiser", "create"] as const,
  },

  publisher: {
    listOwnedByPublisher: (publisherId: number, page: number, limit: number) =>
      [
        ...campaignQueryKeys.origin,
        "publisher",
        publisherId,
        "list",
        { page, limit },
      ] as const,
    details: (campaignId: number) =>
      [
        ...campaignQueryKeys.origin,
        "publisher",
        "details",
        campaignId,
      ] as const,
  },
}

export const offerQueryKeys = {
  origin: ["offers"] as const,

  global: {
    list: (page: number, limit: number) =>
      [...offerQueryKeys.origin, "global", "list", { page, limit }] as const,
    details: (offerId: number) =>
      [...offerQueryKeys.origin, "global", "details", offerId] as const,
    publisherInOffer: (offerId: number) =>
      [
        ...offerQueryKeys.origin,
        "global",
        "publisherInOffer",
        offerId,
      ] as const,
  },

  advertiser: {
    list: (advertiserId: number, page: number, limit: number) =>
      [
        ...offerQueryKeys.origin,
        "advertiser",
        advertiserId,
        "list",
        { page, limit },
      ] as const,
  },
}

export const bankQueryKeys = {
  origin: ["banks"] as const,
  list: () => [...bankQueryKeys.origin, "list"] as const,
  add: () => [...bankQueryKeys.origin, "add"] as const,
}

export const walletQueryKeys = {
  origin: ["wallets"] as const,
  walletHistory: (userCode: string, page: number, limit: number) =>
    [
      ...walletQueryKeys.origin,
      "walletHistory",
      userCode,
      { page, limit },
    ] as const,
  deposit: () => [...walletQueryKeys.origin, "deposit"] as const,
  withdraw: () => [...walletQueryKeys.origin, "withdraw"] as const,
}

export const statisticQueryKeys = {
  origin: ["statistics"] as const,

  advertiser: {
    offerById: (offerId: string) =>
      [...statisticQueryKeys.origin, "advertiser", "offer", offerId] as const,
    offerByCode: (advertiserCode: string) =>
      [
        ...statisticQueryKeys.origin,
        "advertiser",
        advertiserCode,
        "offer",
      ] as const,
  },

  publisher: {
    offerById: (publisherCode: string, offerId: string) =>
      [
        ...statisticQueryKeys.origin,
        "publisher",
        publisherCode,
        "offer",
        offerId,
      ] as const,
    offerByCode: (publisherCode: string) =>
      [
        ...statisticQueryKeys.origin,
        "publisher",
        publisherCode,
        "offer",
      ] as const,
  },
}
