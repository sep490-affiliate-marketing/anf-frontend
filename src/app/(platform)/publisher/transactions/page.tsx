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

      {/* Transaction Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="transactions"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <CreditCard className="size-4" />
            <span>Transaction History</span>
          </TabsTrigger>
          <TabsTrigger
            value="withdrawRequests"
            className="relative gap-2 rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <History className="size-4" />
            <span>Withdraw Requests</span>
          </TabsTrigger>
        </TabsList>

        <div className="max-h-full overflow-visible">
          <TabsContent value="transactions" className="mt-0">
            <section className="space-y-4">
              <Suspense fallback={<Spinner />}>
                <TransactionDataTable />
              </Suspense>
            </section>
          </TabsContent>

          <TabsContent value="withdrawRequests" className="mt-0">
            <section className="space-y-4">
              <Suspense fallback={<Spinner />}>
                <WithdrawRequestsTable />
              </Suspense>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
