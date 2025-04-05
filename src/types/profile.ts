export interface UserProfile {
  name: string
  email: string
  title: string
  position: string
  team: string
  salary: number
  joinDate: string
  completionPercentage?: number
  walletBalance: number
}

export interface Transaction {
  id: string
  date: string
  type: "credit" | "debit"
  amount: number
  status: "completed" | "pending" | "failed"
  description: string
}

export interface Bank {
  id: string
  name: string
  code: string
  bin: number
  short_name: string
  logo_url: string
  icon_url: string
  swift_code: string
  lookup_supported: number
}

export interface BankingInfo {
  id: string
  accountHolderName: string
  accountNumber: string
  bankName: string
}

export interface UserBankAccounts {
  accounts: BankingInfo[]
  primaryAccountId?: string
}
