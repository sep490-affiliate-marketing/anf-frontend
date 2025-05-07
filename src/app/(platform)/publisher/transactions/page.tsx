import { Suspense } from "react"

import { CreditCard, History } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import TransactionDataTable from "@/components/publisher/transactions/data-table"
import { WithdrawDialog } from "@/components/publisher/transactions/withdraw-dialog"
import WithdrawRequestsTable from "@/components/publisher/transactions/withdraw-requests-table"
import { Spinner } from "@/components/spinner"

export default function TransactionsPage() {
  return (
    <div className="space-y-8 px-4 py-8">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Transaction History
            </h1>
            <p className="text-sm text-muted-foreground">
              View your transaction history and manage withdrawals
            </p>
          </div>
          <WithdrawDialog />
        </div>
      </div>

      <Suspense fallback={<Spinner />}>
        <TransactionDataTable />
      </Suspense>
    </div>
  )
}
