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

export const subscriptionQueryKeys = {
  origin: ["subscriptions"] as const,

  global: {
    details: (subscriptionId: string) =>
      [...subscriptionQueryKeys.origin, "global", "details", subscriptionId] as const,
    list: (page: number, limit: number) =>
      [...subscriptionQueryKeys.origin, "global", "list", { page, limit }] as const,
  },

  admin: {
    list: (page: number, limit: number) =>
      [...subscriptionQueryKeys.origin, "admin", "list", { page, limit }] as const,
    details: (id: string) =>
      [...subscriptionQueryKeys.origin, "admin", "details", id] as const,
    create: () =>
      [...subscriptionQueryKeys.origin, "admin", "create"] as const,
    update: (id: string) =>
      [...subscriptionQueryKeys.origin, "admin", "update", id] as const,
    delete: () =>
      [...subscriptionQueryKeys.origin, "admin", "delete"] as const,
  },

  advertiser: {
    list: (page: number, limit: number) =>
      [...subscriptionQueryKeys.origin, "advertiser", "list", { page, limit }] as const,
    details: (id: string) =>
      [...subscriptionQueryKeys.origin, "advertiser", "details", id] as const,
  },

  publisher: {
    list: (page: number, limit: number) =>
      [...subscriptionQueryKeys.origin, "publisher", "list", { page, limit }] as const,
    details: (id: number) =>
      [...subscriptionQueryKeys.origin, "publisher", "details", id] as const,
  },
}

export const policyQueryKeys = {
  origin: ["policies"] as const,

  global: {
    details: (policyId: string) =>
      [...policyQueryKeys.origin, "global", "details", policyId] as const,
    list: (page: number, limit: number) =>
      [...policyQueryKeys.origin, "global", "list", { page, limit }] as const,
  },

  admin: {
    list: (page: number, limit: number) =>
      [...policyQueryKeys.origin, "admin", "list", { page, limit }] as const,
    details: (id: string) =>
      [...policyQueryKeys.origin, "admin", "details", id] as const,
    create: () =>
      [...policyQueryKeys.origin, "admin", "create"] as const,
    update: (id: string) =>
      [...policyQueryKeys.origin, "admin", "update", id] as const,
    delete: () =>
      [...policyQueryKeys.origin, "admin", "delete"] as const,
  },

  advertiser: {
    list: (page: number, limit: number) =>
      [...policyQueryKeys.origin, "advertiser", "list", { page, limit }] as const,
    details: (id: string) =>
      [...policyQueryKeys.origin, "advertiser", "details", id] as const,
  },

  publisher: {
    list: (page: number, limit: number) =>
      [...policyQueryKeys.origin, "publisher", "list", { page, limit }] as const,
    details: (id: number) =>
      [...policyQueryKeys.origin, "publisher", "details", id] as const,
  },
}