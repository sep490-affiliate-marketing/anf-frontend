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
    listActive: (page: number, pageSize: number) =>
      [
        ...campaignQueryKeys.origin,
        "global",
        "active",
        { page, pageSize },
      ] as const,
  },

  admin: {
    list: (page: number, pageSize: number) =>
      [
        ...campaignQueryKeys.origin,
        "admin",
        "list",
        { page, pageSize },
      ] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "admin", "details", id] as const,
  },

  advertiser: {
    list: (advertiserCode: string, page: number, pageSize: number) =>
      [
        ...campaignQueryKeys.origin,
        "advertiser",
        advertiserCode,
        "list",
        { page, pageSize },
      ] as const,
    details: (id: string) =>
      [...campaignQueryKeys.origin, "advertiser", "details", id] as const,
    create: () =>
      [...campaignQueryKeys.origin, "advertiser", "create"] as const,
    update: (id: string) =>
      [...campaignQueryKeys.origin, "advertiser", "update", id] as const,
  },

  publisher: {
    listOwnedByPublisher: (
      publisherId: number,
      page: number,
      pageSize: number
    ) =>
      [
        ...campaignQueryKeys.origin,
        "publisher",
        publisherId,
        "list",
        { page, pageSize },
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
    list: (page: number, pageSize: number) =>
      [...offerQueryKeys.origin, "global", "list", { page, pageSize }] as const,
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
    list: (advertiserId: number, page: number, pageSize: number) =>
      [
        ...offerQueryKeys.origin,
        "advertiser",
        advertiserId,
        "list",
        { page, pageSize },
      ] as const,
    update: (id: string) =>
      [...offerQueryKeys.origin, "advertiser", "update", id] as const,
    details: (offerId: string) =>
      [...offerQueryKeys.origin, "advertiser", "details", offerId] as const,
  },
}

export const bankQueryKeys = {
  origin: ["banks"] as const,
  list: () => [...bankQueryKeys.origin, "list"] as const,
  add: () => [...bankQueryKeys.origin, "add"] as const,
}

export const transactionQueryKeys = {
  origin: ["transactions"] as const,
  walletHistory: (userCode: string, page: number, pageSize: number) =>
    [
      ...transactionQueryKeys.origin,
      "walletHistory",
      userCode,
      { page, pageSize },
    ] as const,
  deposit: () => [...transactionQueryKeys.origin, "deposit"] as const,
  withdraw: () => [...transactionQueryKeys.origin, "withdraw"] as const,
  detail: (transactionId: string) =>
    [...transactionQueryKeys.origin, "detail", transactionId] as const,
  batchPaymentData: (
    page: number,
    pageSize: number,
    fromDate: string,
    toDate: string
  ) =>
    [
      ...transactionQueryKeys.origin,
      "batchPaymentData",
      { page, pageSize, fromDate, toDate },
    ] as const,
  exportBatchPaymentData: () =>
    [...transactionQueryKeys.origin, "exportBatchPaymentData"] as const,
  admin: {
    withdrawRequestList: (
      page: number,
      pageSize: number,
      startDate: string,
      endDate: string
    ) =>
      [
        ...transactionQueryKeys.origin,
        "admin",
        "withdrawRequestList",
        { page, pageSize, startDate, endDate },
      ] as const,
    updateWithdrawalStatus: () =>
      [
        ...transactionQueryKeys.origin,
        "admin",
        "updateWithdrawalStatus",
      ] as const,
  },
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
    revenue: (from: string, to: string) =>
      [
        ...statisticQueryKeys.origin,
        "publisher",
        "revenue",
        { from, to },
      ] as const,
    campaignRevenueById: (id: number, from: string, to: string) =>
      [
        ...statisticQueryKeys.origin,
        "publisher",
        "campaign",
        id,
        "revenue",
        { from, to },
      ] as const,
  },
}
