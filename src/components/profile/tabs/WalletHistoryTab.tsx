import { ArrowDownToLine, ArrowUpFromLine, Search } from "lucide-react"

import { cn } from "@/lib/utils"

import { UseProfileReturn } from "@/hooks/profile"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

interface WalletHistoryTabProps {
  profile: UseProfileReturn
}

export function WalletHistoryTab({ profile }: WalletHistoryTabProps) {
  const { transactions, formatCurrency } = profile

  return (
    <TabsContent value="walletHistory" className="mt-0 space-y-6 pb-4">
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium">Transaction History</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View your recent wallet activity
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full pl-9"
              />
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="group hover:bg-muted/40"
                  >
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0 px-2 py-0.5 font-medium",
                          transaction.type === "credit"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          {transaction.type === "credit" ? (
                            <ArrowDownToLine className="size-3" />
                          ) : (
                            <ArrowUpFromLine className="size-3" />
                          )}
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-blue-600"
                      )}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0 font-normal",
                          transaction.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : transaction.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        )}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <p>Showing {transactions.length} transactions</p>
            <Button variant="outline" size="sm" className="gap-1">
              Download CSV
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
