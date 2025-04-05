import { useState } from "react"

import {
  addCredit,
  fetchBanks,
  fetchTransactions,
  fetchUserProfile,
  lookupBankAccount,
  updateBankingInfo,
  updateUserProfile,
} from "@/api/profile"
import { errorMessage } from "@/constant/error-message"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

import {
  Bank,
  BankingInfo,
  UserBankAccounts,
  UserProfile,
} from "@/types/profile"

import apiClient from "@/lib/api/client"

interface AddBankAccountPayload {
  accountName: string
  bankingNo: string
  bankingCode: string
  bankingName: string
}

const defaultUser: UserProfile = {
  name: "",
  email: "",
  title: "",
  position: "",
  team: "",
  salary: 0,
  joinDate: new Date().toLocaleDateString(),
  completionPercentage: 0,
  walletBalance: 0,
}

const defaultBankAccounts: UserBankAccounts = {
  accounts: [],
  primaryAccountId: undefined,
}

export const useProfile = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("profile")
  const [addCreditAmount, setAddCreditAmount] = useState<string>("")
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [bankAccounts, setBankAccounts] =
    useState<UserBankAccounts>(defaultBankAccounts)

  // Fetch user profile
  const { data: user = defaultUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  })

  // Fetch transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  })

  // Fetch banks
  const {
    data: banks = [],
    isLoading: isLoadingBanks,
    error: banksError,
  } = useQuery({
    queryKey: ["banks"],
    queryFn: fetchBanks,
  })

  // Bank account lookup mutation
  const {
    mutate: lookupAccount,
    isPending: isLookingUpAccount,
    error: lookupError,
  } = useMutation({
    mutationFn: async (params: { bankName: string; accountNumber: string }) => {
      if (!params.bankName || !params.accountNumber) {
        throw new Error("Please select a bank and enter account number")
      }
      const response = await lookupBankAccount(
        params.bankName,
        params.accountNumber
      )
      return {
        ownerName: response.ownerName,
        bankName: params.bankName,
        accountNumber: params.accountNumber,
      }
    },
    onSuccess: (data) => {
      // Cache the bank account lookup result
      const cacheKey = ["bank-lookup", data.bankName, data.accountNumber]
      queryClient.setQueryData(cacheKey, data)
    },
  })

  // Helper function to check cached bank account info
  const getCachedBankAccount = (bankName: string, accountNumber: string) => {
    const cacheKey = ["bank-lookup", bankName, accountNumber]
    return queryClient.getQueryData<{ ownerName: string }>(cacheKey)
  }

  // Update user profile mutation
  const { mutate: updateUser } = useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data)
    },
  })

  // Update bank accounts mutation
  const { mutate: updateBankAccounts } = useMutation({
    mutationFn: async (data: UserBankAccounts) => {
      const response = await updateBankingInfo(data)
      return response as UserBankAccounts
    },
    onSuccess: (data) => {
      setBankAccounts(data)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })

  // Add bank account mutation
  const {
    mutate: addBankAccountMutation,
    isPending: isAddingBankAccount,
    error: addBankAccountError,
  } = useMutation({
    mutationFn: async (payload: AddBankAccountPayload) => {
      try {
        const response = await apiClient.post(
          "/api/affiliate-network/users/bank-accounts",
          [payload]
        )
        return response
      } catch (error) {
        const errRes = error instanceof AxiosError ? error.response?.data : null

        return {
          isSuccess: false,
          statusCode: errRes?.statusCode ?? 500,
          message: errRes?.message ?? errorMessage.unknown,
          details: errRes?.details ?? errorMessage.unknown,
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })

  const handleAddBankAccount = (account: BankingInfo) => {
    const selectedBank = banks.find(
      (bank: Bank) => bank.code === account.bankName
    )

    const payload: AddBankAccountPayload = {
      accountName: account.accountHolderName,
      bankingNo: account.accountNumber,
      bankingCode: account.bankName,
      bankingName: selectedBank?.name || "",
    }

    addBankAccountMutation(payload, {
      onSuccess: () => {
        const updatedAccounts = {
          accounts: [...bankAccounts.accounts, account],
          primaryAccountId: bankAccounts.primaryAccountId || account.id,
        }
        updateBankAccounts(updatedAccounts)
      },
    })
  }

  const handleSetPrimaryAccount = (accountId: string) => {
    const updatedAccounts = {
      ...bankAccounts,
      primaryAccountId: accountId,
    }
    updateBankAccounts(updatedAccounts)
  }

  const handleDeleteBankAccount = (accountId: string) => {
    const updatedAccounts = {
      accounts: bankAccounts.accounts.filter((acc) => acc.id !== accountId),
      primaryAccountId:
        bankAccounts.primaryAccountId === accountId
          ? bankAccounts.accounts[0]?.id
          : bankAccounts.primaryAccountId,
    }
    updateBankAccounts(updatedAccounts)
  }

  // Add credit mutation
  const { mutate: addCreditMutation } = useMutation({
    mutationFn: ({ amount, bankId }: { amount: number; bankId: string }) =>
      addCredit(amount, bankId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      setAddCreditAmount("")
      setSelectedBank("")
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return ""
    return name.charAt(0).toUpperCase()
  }

  return {
    user,
    updateUser,
    transactions,
    addCreditAmount,
    setAddCreditAmount,
    selectedBank,
    setSelectedBank,
    activeTab,
    setActiveTab,
    banks,
    isLoadingBanks,
    banksError,
    formatCurrency,
    getInitials,
    addCredit: addCreditMutation,
    bankAccounts,
    addBankAccount: handleAddBankAccount,
    isAddingBankAccount,
    addBankAccountError,
    setPrimaryAccount: handleSetPrimaryAccount,
    deleteBankAccount: handleDeleteBankAccount,
    lookupAccount,
    isLookingUpAccount,
    lookupError,
    getCachedBankAccount,
  }
}

export type UseProfileReturn = ReturnType<typeof useProfile>
