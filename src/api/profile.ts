import {
  BankingInfo,
  Transaction,
  UserBankAccounts,
  UserProfile,
} from "@/types/profile"

interface BankLookupResponse {
  code: number
  success: boolean
  data: {
    ownerName: string
  }
  msg: string
}

export async function fetchUserProfile(): Promise<UserProfile> {
  // TODO: Replace with actual API call
  return {
    name: "John Doe",
    email: "john@example.com",
    title: "Staff",
    position: "Developer",
    team: "Engineering",
    salary: 20000000,
    joinDate: new Date().toLocaleDateString(),
    completionPercentage: 85,
    walletBalance: 5280.42,
  }
}

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  // TODO: Replace with actual API call
  return {
    ...(await fetchUserProfile()),
    ...data,
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: "txn_1NmKHq2eZvKYlo2CIWEfwCZ3",
      date: "2023-09-15",
      type: "credit",
      amount: 1500,
      status: "completed",
      description: "Deposit from Bank Transfer",
    },
  ]
}

export async function fetchBanks() {
  const response = await fetch("https://api.banklookup.net/api/bank/list")
  const data = await response.json()
  if (data.success) {
    return data.data
  }
  throw new Error("Failed to fetch banks")
}

export async function lookupBankAccount(
  bankCode: string,
  accountNumber: string
) {
  const response = await fetch(
    "https://api.banklookup.net/api/bank/id-lookup-prod",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BANK_LOOKUP_API_KEY || "",
        "x-api-secret": process.env.NEXT_PUBLIC_BANK_LOOKUP_SECRET || "",
      },
      body: JSON.stringify({
        bank: bankCode,
        account: accountNumber,
      }),
    }
  )

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("Account not found")
    }
    if (response.status === 429) {
      throw new Error("Too many requests")
    }
    if (response.status === 402) {
      throw new Error("API credit exhausted")
    }
    throw new Error("Failed to lookup account")
  }

  const data: BankLookupResponse = await response.json()
  return data.data
}

export async function updateBankingInfo(
  data: UserBankAccounts
): Promise<UserBankAccounts> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 1000)
  })
}

export async function addCredit(amount: number, bankId: string): Promise<void> {
  // TODO: Replace with actual API call
  console.log("Adding credit:", { amount, bankId })
}
